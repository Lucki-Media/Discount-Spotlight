import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.MONGO_DB_CLOUD_URL;
console.log(url);
async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");

    // Your Mongoose models and other code here
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectDB;
