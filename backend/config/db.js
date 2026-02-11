import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      // Railway MongoDB template exposes this by default
      process.env.MONGO_URL;

    if (!uri) {
      console.error(
        "❌ MongoDB connection string is not defined. Please set one of MONGO_URI, MONGODB_URI, DATABASE_URL, or MONGO_URL in your environment variables."
      );
      process.exit(1);
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
