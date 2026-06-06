import mongoose from "mongoose";
import { User, Society } from "../models";
import { MONGODB_URI } from "../config/env";

const seed = async () => {
  await mongoose.connect(MONGODB_URI!);
  console.log("Seeding database...");

  const society = await Society.create({
    name: "Stark tower",
    address: "200 Park Avenue",
    city: "New york city",
    state: "Manhattan",
    pincode: "3000",
    totalFlats: 220,
    maintenanceAmount: 650000,
    contactEmail: "admin@starktower.com",
    contactPhone: "+11432123000",
  });

  // await User.deleteMany({});
  // await Society.deleteMany({});

  // const society = await Society.create({
  //   name: "Green Valley Residency",
  //   address: "123 Main Street",
  //   city: "Mumbai",
  //   state: "Maharashtra",
  //   pincode: "400001",
  //   totalFlats: 120,
  //   maintenanceAmount: 3500,
  //   contactEmail: "admin@greenvalley.com",
  //   contactPhone: "+919876543210",
  // });

  // await User.create({
  //   name: "Super Admin",
  //   email: "superadmin@simp.com",
  //   password: "admin123",
  //   role: "super_admin",
  // });

  // await User.create({
  //   name: "Society Admin",
  //   email: "admin@greenvalley.com",
  //   password: "admin123",
  //   role: "society_admin",
  //   society: society._id,
  //   phone: "+919876543211",
  // });

  // await User.create({
  //   name: "John Resident",
  //   email: "resident@simp.com",
  //   password: "admin123",
  //   role: "resident",
  //   society: society._id,
  //   flatNumber: "A-101",
  //   block: "A",
  //   phone: "+919876543212",
  // });

  // await User.create({
  //   name: "Mike Maintenance",
  //   email: "staff@simp.com",
  //   password: "admin123",
  //   role: "maintenance_staff",
  //   society: society._id,
  //   phone: "+919876543213",
  // });

  console.log("Seed completed!");
  // console.log("Login credentials (password: admin123):");
  // console.log("  Super Admin: superadmin@simp.com");
  // console.log("  Society Admin: admin@greenvalley.com");
  // console.log("  Resident: resident@simp.com");
  // console.log("  Staff: staff@simp.com");

  await mongoose.disconnect();
};

seed().catch(console.error);
