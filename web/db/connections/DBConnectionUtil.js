import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const url = process.env.MONGO_DB_CLOUD_URL;
console.log(url);
async function connectDB() {
  try {
    await mongoose
      .connect(process.env.MONGO_DB_CLOUD_URL, {
        dbName: process.env.DATABASE_NAME,
      })
      .then((response) => {
        if (response) {
          console.log("Connected to MongoDB");
        }
      })
      .catch((error) => {
        console.error("couldn't connect ", error);
      });

    // Your Mongoose models and other code here
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default connectDB;
