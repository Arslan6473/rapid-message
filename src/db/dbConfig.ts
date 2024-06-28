import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

export const connectDB = async () => {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL!);
  

    connection.isConnected = connectionInstance.connections[0].readyState;
    console.log("MongoDB is connected successfully");
  } catch (error) {
    console.log("MongoDB connection faild " + error);
    process.exit(1);
  }
};
