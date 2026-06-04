"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const env_1 = require("../config/env");
const seed = async () => {
    await mongoose_1.default.connect(env_1.MONGODB_URI);
    console.log("Seeding database...");
    await models_1.User.deleteMany({});
    await models_1.Society.deleteMany({});
    const society = await models_1.Society.create({
        name: "Green Valley Residency",
        address: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        totalFlats: 120,
        maintenanceAmount: 3500,
        contactEmail: "admin@greenvalley.com",
        contactPhone: "+919876543210",
    });
    await models_1.User.create({
        name: "Super Admin",
        email: "superadmin@simp.com",
        password: "admin123",
        role: "super_admin",
    });
    await models_1.User.create({
        name: "Society Admin",
        email: "admin@greenvalley.com",
        password: "admin123",
        role: "society_admin",
        society: society._id,
        phone: "+919876543211",
    });
    await models_1.User.create({
        name: "John Resident",
        email: "resident@simp.com",
        password: "admin123",
        role: "resident",
        society: society._id,
        flatNumber: "A-101",
        block: "A",
        phone: "+919876543212",
    });
    await models_1.User.create({
        name: "Mike Maintenance",
        email: "staff@simp.com",
        password: "admin123",
        role: "maintenance_staff",
        society: society._id,
        phone: "+919876543213",
    });
    console.log("Seed completed!");
    console.log("Login credentials (password: admin123):");
    console.log("  Super Admin: superadmin@simp.com");
    console.log("  Society Admin: admin@greenvalley.com");
    console.log("  Resident: resident@simp.com");
    console.log("  Staff: staff@simp.com");
    await mongoose_1.default.disconnect();
};
seed().catch(console.error);
//# sourceMappingURL=seed.js.map