"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const Society_1 = require("../models/Society");
const User_1 = require("../models/User");
// import { User } from "../models/User";
const seed = async () => {
    if (env_1.NODE_ENV === "development") {
        await mongoose_1.default.connect(env_1.MONGODB_URI);
    }
    else {
        const username = encodeURIComponent(env_1.MONGODB_USERNAME || "");
        const password = encodeURIComponent(env_1.MONGODB_PASSWORD || "");
        const uri = `mongodb+srv://${username}:${password}@cluster0.ugyic8h.mongodb.net/simp`;
        await mongoose_1.default.connect(uri);
    }
    console.log("Seeding database...");
    // await User.deleteMany({});
    // await Society.deleteMany({});
    const society = await Society_1.Society.create({
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
    // const society = await Society.create({
    //   name: "Stark tower",
    //   address: "200 Park Avenue",
    //   city: "New york city",
    //   state: "Manhattan",
    //   pincode: "3000",
    //   totalFlats: 220,
    //   maintenanceAmount: 650000,
    //   contactEmail: "admin@starktower.com",
    //   contactPhone: "+11432123000",
    // });
    // await User.create({
    //   name: "Super Admin",
    //   email: "superadmin@simp.com",
    //   password: "admin123",
    //   role: "super_admin",
    // });
    // await User.create({
    //   name: "Society Admin",
    //   email: "admin@starktower.com",
    //   password: "admin123",
    //   role: "society_admin",
    //   society: society._id,
    //   phone: "+919876543211",
    // });
    await User_1.User.create({
        name: "Deepak karki",
        email: "deepak@simp.com",
        password: "admin123",
        role: "resident",
        society: society._id,
        flatNumber: "A-101",
        block: "A",
        phone: "+919876543212",
    });
    // await User.create({
    //   name: "Mike Maintenance",
    //   email: "staff@simp.com",
    //   password: "admin123",
    //   role: "maintenance_staff",
    //   society: society._id,
    //   phone: "+919876543213",
    // });
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