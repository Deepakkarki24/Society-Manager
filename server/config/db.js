import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("Db is connected!");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
