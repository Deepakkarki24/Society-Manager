"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaintenanceStaff = exports.removeFamilyMember = exports.addFamilyMember = exports.deactivateUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const pagination_1 = require("../../utils/pagination");
const audit_service_1 = require("../../services/audit.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const User_1 = require("../../models/User");
const getSocietyFilter = (req) => {
    if (req.user.role === "super_admin") {
        return req.query.societyId ? { society: req.query.societyId } : {};
    }
    return { society: req.user.society };
};
const createUser = async (req, res) => {
    try {
        const societyId = req.user.role === "super_admin"
            ? req.body.society
            : req.user.society;
        const user = await User_1.User.create({
            ...req.body,
            society: societyId,
        });
        await (0, audit_service_1.createAuditLog)(req, "create", "User", user._id.toString());
        const safeUser = await User_1.User.findById(user._id).select("-password");
        return (0, ApiResponse_1.successResponse)(res, 201, "User created successfully", safeUser);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    try {
        const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
        const filter = {
            ...getSocietyFilter(req),
            isActive: true,
        };
        if (req.query.role) {
            filter.role = req.query.role;
        }
        if (req.query.search) {
            filter.$or = [
                {
                    name: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    flatNumber: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
            ];
        }
        const [users, total] = await Promise.all([
            User_1.User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User_1.User.countDocuments(filter),
        ]);
        return (0, ApiResponse_1.successResponse)(res, 200, "Users fetched successfully", (0, pagination_1.paginatedResponse)(users, total, page, limit));
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id).select("-password");
        if (!user) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "User not found");
        }
        return (0, ApiResponse_1.successResponse)(res, 200, "User fetched successfully", user);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    try {
        const user = await User_1.User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!user) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "User not found");
        }
        await (0, audit_service_1.createAuditLog)(req, "update", "User", user._id.toString());
        return (0, ApiResponse_1.successResponse)(res, 200, "User updated successfully", user);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.updateUser = updateUser;
const deactivateUser = async (req, res) => {
    try {
        const user = await User_1.User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-password");
        if (!user) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "User not found");
        }
        await (0, audit_service_1.createAuditLog)(req, "deactivate", "User", user._id.toString());
        return (0, ApiResponse_1.successResponse)(res, 200, "User deactivated successfully");
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.deactivateUser = deactivateUser;
const addFamilyMember = async (req, res) => {
    try {
        const userId = req.user.role === "resident"
            ? req.user._id
            : req.params.id;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "User not found");
        }
        user.familyMembers.push(req.body);
        await user.save();
        return (0, ApiResponse_1.successResponse)(res, 200, "Family member added successfully", user.familyMembers);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.addFamilyMember = addFamilyMember;
const removeFamilyMember = async (req, res) => {
    try {
        const userId = req.user.role === "resident"
            ? req.user._id
            : req.params.id;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "User not found");
        }
        user.familyMembers = user.familyMembers.filter((m) => String(m._id) !== req.params.memberId);
        await user.save();
        return (0, ApiResponse_1.successResponse)(res, 200, "Family member removed successfully", user.familyMembers);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.removeFamilyMember = removeFamilyMember;
const getMaintenanceStaff = async (req, res) => {
    try {
        const societyId = req.user.society ||
            req.query.societyId;
        const staff = await User_1.User.find({
            society: societyId,
            role: "maintenance_staff",
            isActive: true,
        }).select("-password");
        return (0, ApiResponse_1.successResponse)(res, 200, "Maintenance staff fetched successfully", staff);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getMaintenanceStaff = getMaintenanceStaff;
//# sourceMappingURL=user.controller.js.map