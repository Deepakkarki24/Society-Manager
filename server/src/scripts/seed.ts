import mongoose from "mongoose";
import { MONGODB_PASSWORD, MONGODB_URI, MONGODB_USERNAME, NODE_ENV } from "../config/env";
import { Society } from "../models/Society";
import { User } from "../models/User";
import { Complaint } from "../models/Complaint";
// import { User } from "../models/User";

const seed = async () => {

  if (NODE_ENV === "development") {
    await mongoose.connect(MONGODB_URI!);

  } else {
    const username = encodeURIComponent(MONGODB_USERNAME || "");
    const password = encodeURIComponent(MONGODB_PASSWORD || "");

    const uri = `mongodb+srv://${username}:${password}@cluster0.ugyic8h.mongodb.net/simp`;

    await mongoose.connect(uri);
  }


  console.log("Seeding database...");

  // await User.deleteMany({});
  // await Society.deleteMany({});
  await Complaint.deleteMany({});

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

  // await User.create({
  //   name: "Deepak karki",
  //   email: "deepak@simp.com",
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
  console.log("Login credentials (password: admin123):");
  console.log("  Super Admin: superadmin@simp.com");
  console.log("  Society Admin: admin@greenvalley.com");
  console.log("  Resident: resident@simp.com");
  console.log("  Staff: staff@simp.com");

  await mongoose.disconnect();
};

seed().catch(console.error);
