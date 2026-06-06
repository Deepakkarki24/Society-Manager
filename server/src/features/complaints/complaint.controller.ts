import { Response } from "express";
import { Complaint, User } from "../../models";
import { AuthRequest } from "../../middleware/auth";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { createAuditLog } from "../../services/audit.service";
import { createNotification } from "../../services/notification.service";
import { errorResponse, successResponse } from "../../utils/ApiResponse";
import { generateModelResponse } from "../../runner";

const buildComplaintFilter = (req: AuthRequest): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (req.user!.role === "super_admin" && req.query.societyId) {
    filter.society = req.query.societyId;
  } else if (req.user!.role !== "super_admin") {
    filter.society = req.user!.society;
  }

  if (req.user!.role === "resident") {
    filter.createdBy = req.user!._id;
  } else if (req.user!.role === "maintenance_staff") {
    filter.assignedTo = req.user!._id;
  }

  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  return filter;
};

export const createComplaint = async (req: AuthRequest, res: Response) => {
  try {

    const image = req.file
    const { message } = req.body
    const societyId = req.user?.society;

    if (!societyId) return errorResponse(res, 400, "Resident must belong to a society");

    const modelResponse = await generateModelResponse(message)

    const { title, description, priority, category } = modelResponse.data

    let imageBase64
    if (image) {
      imageBase64 = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      society: societyId,
      createdBy: req.user!._id,
      image: imageBase64
    });

    const populated = await Complaint.findById(complaint._id)
      .populate("createdBy", "name email flatNumber")
      .populate("society", "name");

    const admins = await User.find({
      society: societyId,
      role: "society_admin",
      isActive: true,
    });

    await Promise.all(
      admins.map((admin) =>
        createNotification({
          recipientId: admin._id.toString(),
          title: "New Complaint",
          message: `New complaint: ${complaint.title}`,
          type: "complaint",
          link: `/complaints/${complaint._id}`,
        }),
      ),
    );

    await createAuditLog(req, "create", "Complaint", complaint._id.toString());

    return successResponse(res, 201, "Complaint generated!", { data: populated });
  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};

export const getComplaints = async (req: AuthRequest, res: Response) => {
  try {

    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const filter = buildComplaintFilter(req);

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("createdBy", "name email flatNumber block")
        .populate("assignedTo", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Complaint.countDocuments(filter),
    ])

    return successResponse(res, 200, "Fetched paginated compalints", { ...paginatedResponse(complaints, total, page, limit) });

  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};

export const getComplaint = async (req: AuthRequest, res: Response) => {
  try {

    const complaint = await Complaint.findById(req.params.id)
      .populate("createdBy", "name email flatNumber block phone")
      .populate("assignedTo", "name email phone")
      .populate("comments.user", "name role avatar")

    if (!complaint) return errorResponse(res, 404, "Complaint not found");

    if (
      req.user!.role === "resident" &&
      complaint.createdBy._id.toString() !== req.user!._id
    ) {
      return errorResponse(res, 403, "Access denied");
    }

    return successResponse(res, 200, "Fetched complaints!", { data: complaint });

  } catch (err: any) {
    console.log(err.message)
    return errorResponse(res, 500, err.message)
  }
};

export const assignComplaint = async (req: AuthRequest, res: Response) => {
  try {

    const { assignedTo, note } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return errorResponse(res, 404, "Complaint not found");

    complaint.assignedTo = assignedTo;
    complaint.status = "assigned";
    await complaint.save();

    await createNotification({
      recipientId: assignedTo,
      title: "Complaint Assigned",
      message: `You have been assigned: ${complaint.title}`,
      type: "complaint",
      link: `/complaints/${complaint._id}`,
    });

    await createAuditLog(req, "assign", "Complaint", complaint._id.toString());

    return successResponse(res, 200, "Assigned complaint!", { data: complaint });

  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response,) => {
  try {

    const { status, note } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return errorResponse(res, 404, "Complaint not found");

    if (
      req.user!.role === "maintenance_staff" &&
      complaint.assignedTo?.toString() !== req.user!._id
    ) {
      return errorResponse(res, 403, "Not assigned to this complaint");
    }

    complaint.status = status;

    // if (status === "resolved") {
    //   complaint.resolvedAt = new Date();
    //   const file
    //   if (proof.length) complaint.completionProof.push(...proof);
    // }

    await complaint.save();

    await createNotification({
      recipientId: complaint.createdBy.toString(),
      title: "Complaint Updated",
      message: `Your complaint "${complaint.title}" is now ${status}`,
      type: "complaint",
      link: `/complaints/${complaint._id}`,
    });

    return successResponse(res, 200, "Updated complaint status!", { data: complaint });

  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};

export const reopenComplaint = async (req: AuthRequest, res: Response) => {
  try {

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return errorResponse(res, 404, "Complaint not found");

    if (complaint.createdBy.toString() !== req.user!._id) {
      return errorResponse(res, 403, "Only the creator can reopen");
    }

    complaint.status = "reopened";
    complaint.resolvedAt = undefined;

    await complaint.save();

    return successResponse(res, 200, "Reopend complaint!", { data: complaint });

  } catch (err: any) {
    return errorResponse(res, 500, err.message)
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return errorResponse(res, 404, "Complaint not found");
    }

    complaint.comments.push({
      user: req.user!._id as unknown as import("mongoose").Types.ObjectId,
      text: req.body.text,
      createdAt: new Date(),
    });

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id).populate(
      "comments.user",
      "name role avatar",
    );

    return successResponse(res, 200, "Comment added successfully", { data: updatedComplaint });

  } catch (err: any) {
    return errorResponse(res, 500, err.message || "Failed to add comment"
    );
  }
};

export const getComplaintHistory = async (req: AuthRequest, res: Response) => {
  try {
    const filter: Record<string, unknown> = {
      createdBy: req.user!._id,
      status: { $in: ["resolved", "reopened"] },
    };

    if (req.user!.society) {
      filter.society = req.user!.society;
    }

    const complaints = await Complaint.find(filter)
      .sort({ updatedAt: -1 })
      .limit(50);

    return successResponse(res, 200, "Complaint history fetched successfully", { data: complaints });

  } catch (err: any) {
    return errorResponse(res, 500, err.message || "Failed to fetch complaint history");
  }
};
