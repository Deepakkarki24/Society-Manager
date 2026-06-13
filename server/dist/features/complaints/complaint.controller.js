"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComplaintHistory = exports.addComment = exports.reopenComplaint = exports.updateComplaintStatus = exports.assignComplaint = exports.getComplaint = exports.getComplaints = exports.createComplaint = void 0;
const pagination_1 = require("../../utils/pagination");
const audit_service_1 = require("../../services/audit.service");
const notification_service_1 = require("../../services/notification.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const runner_1 = require("../../runner");
const Complaint_1 = require("../../models/Complaint");
const User_1 = require("../../models/User");
const Chat_1 = require("../../models/chat/Chat");
const ChatSession_1 = require("../../models/chat/ChatSession");
const buildComplaintFilter = (req) => {
    const filter = {};
    if (req.user.role === "super_admin" && req.query.societyId) {
        filter.society = req.query.societyId;
    }
    else if (req.user.role !== "super_admin") {
        filter.society = req.user.society;
    }
    if (req.user.role === "resident") {
        filter.createdBy = req.user._id;
    }
    else if (req.user.role === "maintenance_staff") {
        filter.assignedTo = req.user._id;
    }
    if (req.query.status)
        filter.status = req.query.status;
    if (req.query.category)
        filter.category = req.query.category;
    if (req.query.priority)
        filter.priority = req.query.priority;
    if (req.query.search) {
        filter.$or = [
            { title: { $regex: req.query.search, $options: "i" } },
            { description: { $regex: req.query.search, $options: "i" } },
        ];
    }
    return filter;
};
const createComplaint = async (req, res) => {
    try {
        const image = req.file;
        const { message, sessionId } = req.body;
        const societyId = req.user?.society;
        console.log("sessionId", sessionId);
        console.log("message", message);
        console.log("image", image);
        if (!societyId)
            return (0, ApiResponse_1.errorResponse)(res, 400, "Resident must belong to a society");
        const modelResponse = await (0, runner_1.generateModelResponse)(message);
        console.log("got model response");
        if (!modelResponse)
            return (0, ApiResponse_1.errorResponse)(res, 503, "AI service is temporarily busy. Please try again.");
        console.log("modelResponse", modelResponse.data);
        const { error, isComplaint } = modelResponse.data;
        if (error)
            return (0, ApiResponse_1.errorResponse)(res, 400, error, { isComplaint });
        const { title, description, priority, category } = modelResponse.data;
        console.log("modelResponse", modelResponse);
        let imageBase64;
        if (image) {
            imageBase64 = `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;
            console.log("image convetred in base64");
        }
        const complaint = await Complaint_1.Complaint.create({
            title,
            description,
            category,
            priority,
            society: societyId,
            createdBy: req.user._id,
            image: imageBase64
        });
        console.log("complaint created!");
        await Chat_1.Chat.create({
            sessionId,
            userId: req.user?._id,
            type: "complaint-card",
            role: "user",
            complaint: complaint._id,
            // complaint: {
            //   title,
            //   description,
            //   category,
            //   priority,
            //   status: "pending",
            //   image: imageBase64,
            //   createdAt: complaint.createdAt
            // }
        });
        console.log("chat created!");
        await ChatSession_1.ChatSession.findOneAndUpdate({
            _id: sessionId,
            title: "New Chat", // only update if current title is still "New Chat"
        }, {
            $set: { title },
        }, {
            new: true,
        });
        console.log("chat session updated!");
        const populated = await Complaint_1.Complaint.findById(complaint._id)
            .populate("createdBy", "name email flatNumber")
            .populate("society", "name");
        const admins = await User_1.User.find({
            society: societyId,
            role: "society_admin",
            isActive: true,
        });
        await Promise.all(admins.map((admin) => (0, notification_service_1.createNotification)({
            recipientId: admin._id.toString(),
            title: "New Complaint",
            message: `New complaint: ${complaint.title}`,
            type: "complaint",
            link: `/complaints/${complaint._id}`,
        })));
        await (0, audit_service_1.createAuditLog)(req, "create", "Complaint", complaint._id.toString());
        return (0, ApiResponse_1.successResponse)(res, 201, "Complaint generated!", { data: populated });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 503, err);
    }
};
exports.createComplaint = createComplaint;
const getComplaints = async (req, res) => {
    try {
        const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
        const filter = buildComplaintFilter(req);
        const [complaints, total] = await Promise.all([
            Complaint_1.Complaint.find(filter)
                .populate("createdBy", "name email flatNumber block")
                .populate("assignedTo", "name email phone")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Complaint_1.Complaint.countDocuments(filter),
        ]);
        return (0, ApiResponse_1.successResponse)(res, 200, "Fetched paginated compalints", { ...(0, pagination_1.paginatedResponse)(complaints, total, page, limit) });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getComplaints = getComplaints;
const getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint_1.Complaint.findById(req.params.id)
            .populate("createdBy", "name email flatNumber block phone")
            .populate("assignedTo", "name email phone")
            .populate("comments.user", "name role avatar");
        if (!complaint)
            return (0, ApiResponse_1.errorResponse)(res, 404, "Complaint not found");
        if (req.user.role === "resident" &&
            complaint.createdBy._id.toString() !== req.user._id) {
            return (0, ApiResponse_1.errorResponse)(res, 403, "Access denied");
        }
        return (0, ApiResponse_1.successResponse)(res, 200, "Fetched complaints!", { data: complaint });
    }
    catch (err) {
        console.log(err.message);
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getComplaint = getComplaint;
const assignComplaint = async (req, res) => {
    try {
        const { assignedTo, note } = req.body;
        const complaint = await Complaint_1.Complaint.findById(req.params.id);
        if (!complaint)
            return (0, ApiResponse_1.errorResponse)(res, 404, "Complaint not found");
        complaint.assignedTo = assignedTo;
        complaint.status = "assigned";
        await complaint.save();
        await (0, notification_service_1.createNotification)({
            recipientId: assignedTo,
            title: "Complaint Assigned",
            message: `You have been assigned: ${complaint.title}`,
            type: "complaint",
            link: `/complaints/${complaint._id}`,
        });
        await (0, audit_service_1.createAuditLog)(req, "assign", "Complaint", complaint._id.toString());
        return (0, ApiResponse_1.successResponse)(res, 200, "Assigned complaint!", { data: complaint });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.assignComplaint = assignComplaint;
const updateComplaintStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const complaint = await Complaint_1.Complaint.findById(req.params.id);
        if (!complaint)
            return (0, ApiResponse_1.errorResponse)(res, 404, "Complaint not found");
        if (req.user.role === "maintenance_staff" &&
            complaint.assignedTo?.toString() !== req.user._id) {
            return (0, ApiResponse_1.errorResponse)(res, 403, "Not assigned to this complaint");
        }
        complaint.status = status;
        // if (status === "resolved") {
        //   complaint.resolvedAt = new Date();
        //   const file
        //   if (proof.length) complaint.completionProof.push(...proof);
        // }
        await complaint.save();
        await (0, notification_service_1.createNotification)({
            recipientId: complaint.createdBy.toString(),
            title: "Complaint Updated",
            message: `Your complaint "${complaint.title}" is now ${status}`,
            type: "complaint",
            link: `/complaints/${complaint._id}`,
        });
        return (0, ApiResponse_1.successResponse)(res, 200, "Updated complaint status!", { data: complaint });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.updateComplaintStatus = updateComplaintStatus;
const reopenComplaint = async (req, res) => {
    try {
        const complaint = await Complaint_1.Complaint.findById(req.params.id);
        if (!complaint)
            return (0, ApiResponse_1.errorResponse)(res, 404, "Complaint not found");
        if (complaint.createdBy.toString() !== req.user._id) {
            return (0, ApiResponse_1.errorResponse)(res, 403, "Only the creator can reopen");
        }
        complaint.status = "reopened";
        complaint.resolvedAt = undefined;
        await complaint.save();
        return (0, ApiResponse_1.successResponse)(res, 200, "Reopend complaint!", { data: complaint });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.reopenComplaint = reopenComplaint;
const addComment = async (req, res) => {
    try {
        const complaint = await Complaint_1.Complaint.findById(req.params.id);
        if (!complaint) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "Complaint not found");
        }
        complaint.comments.push({
            user: req.user._id,
            text: req.body.text,
            createdAt: new Date(),
        });
        await complaint.save();
        const updatedComplaint = await Complaint_1.Complaint.findById(complaint._id).populate("comments.user", "name role avatar");
        return (0, ApiResponse_1.successResponse)(res, 200, "Comment added successfully", { data: updatedComplaint });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message || "Failed to add comment");
    }
};
exports.addComment = addComment;
const getComplaintHistory = async (req, res) => {
    try {
        const filter = {
            createdBy: req.user._id,
            status: { $in: ["resolved", "reopened"] },
        };
        if (req.user.society) {
            filter.society = req.user.society;
        }
        const complaints = await Complaint_1.Complaint.find(filter)
            .sort({ updatedAt: -1 })
            .limit(50);
        return (0, ApiResponse_1.successResponse)(res, 200, "Complaint history fetched successfully", { data: complaints });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message || "Failed to fetch complaint history");
    }
};
exports.getComplaintHistory = getComplaintHistory;
//# sourceMappingURL=complaint.controller.js.map