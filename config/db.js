import mongoose from "mongoose";

let gfsBucket = null;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.once("open", () => {
      gfsBucket = new mongoose.mongo.GridFSBucket(
        mongoose.connection.db,
        {
          bucketName: "uploads",
        }
      );

      console.log("GridFS Bucket Initialized");
    });

    return conn.connection;
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export const getGridFSBucket = () => {
  if (!gfsBucket) {
    throw new Error("GridFS Bucket is not initialized");
  }

  return gfsBucket;
};

export default connectDB;