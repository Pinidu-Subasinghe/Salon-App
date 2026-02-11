import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL;

    if (!uri) {
      console.error(
        "❌ MongoDB connection string is not defined. Please set MONGO_URI (or MONGODB_URI / DATABASE_URL) in your environment variables."
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
