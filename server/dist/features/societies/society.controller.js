"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocietyStats = exports.assignSocietyAdmin = exports.deleteSociety = exports.updateSociety = exports.getSociety = exports.getSocieties = exports.createSociety = void 0;
const pagination_1 = require("../../utils/pagination");
const audit_service_1 = require("../../services/audit.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const Society_1 = require("../../models/Society");
const User_1 = require("../../models/User");
const createSociety = async (req, res) => {
    try {
        const society = await Society_1.Society.create(req.body);
        await (0, audit_service_1.createAuditLog)(req, "create", "Society", society._id.toString());
        return (0, ApiResponse_1.successResponse)(res, 201, "Society created successfully", society);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.createSociety = createSociety;
const getSocieties = async (req, res) => {
    try {
        const { page, limit, skip } = (0, pagination_1.getPagination)(req.query.page, req.query.limit);
        const search = req.query.search || "";
        const filter = {};
        if (search) {
            filter.$text = { $search: search };
        }
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === "true";
        }
        const [societies, total] = await Promise.all([
            Society_1.Society.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Society_1.Society.countDocuments(filter),
        ]);
        return (0, ApiResponse_1.successResponse)(res, 200, "Societies fetched successfully", (0, pagination_1.paginatedResponse)(societies, total, page, limit));
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getSocieties = getSocieties;
const getSociety = async (req, res) => {
    try {
        const society = await Society_1.Society.findById(req.params.id);
        if (!society) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "Society not found");
        }
        return (0, ApiResponse_1.successResponse)(res, 200, "Society fetched successfully", society);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getSociety = getSociety;
const updateSociety = async (req, res) => {
    try {
        const society = await Society_1.Society.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!society) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "Society not found");
        }
        await (0, audit_service_1.createAuditLog)(req, "update", "Society", society._id.toString());
        return (0, ApiResponse_1.successResponse)(res, 200, "Society updated successfully", society);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.updateSociety = updateSociety;
const deleteSociety = async (req, res) => {
    try {
        const society = await Society_1.Society.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!society) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "Society not found");
        }
        await (0, audit_service_1.createAuditLog)(req, "deactivate", "Society", society._id.toString());
        return (0, ApiResponse_1.successResponse)(res, 200, "Society deactivated successfully");
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.deleteSociety = deleteSociety;
const assignSocietyAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        const societyId = req.params.id;
        const user = await User_1.User.findByIdAndUpdate(userId, {
            role: "society_admin",
            society: societyId,
        }, {
            new: true,
        }).select("-password");
        if (!user) {
            return (0, ApiResponse_1.errorResponse)(res, 404, "User not found");
        }
        await (0, audit_service_1.createAuditLog)(req, "assign_admin", "User", userId, { societyId });
        return (0, ApiResponse_1.successResponse)(res, 200, "Society admin assigned successfully", user);
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.assignSocietyAdmin = assignSocietyAdmin;
const getSocietyStats = async (req, res) => {
    try {
        const societyId = req.params.id;
        const [residents, staff, admins] = await Promise.all([
            User_1.User.countDocuments({
                society: societyId,
                role: "resident",
                isActive: true,
            }),
            User_1.User.countDocuments({
                society: societyId,
                role: "maintenance_staff",
                isActive: true,
            }),
            User_1.User.countDocuments({
                society: societyId,
                role: "society_admin",
                isActive: true,
            }),
        ]);
        return (0, ApiResponse_1.successResponse)(res, 200, "Society statistics fetched successfully", {
            residents,
            maintenanceStaff: staff,
            admins,
        });
    }
    catch (err) {
        return (0, ApiResponse_1.errorResponse)(res, 500, err.message);
    }
};
exports.getSocietyStats = getSocietyStats;
//# sourceMappingURL=society.controller.js.map