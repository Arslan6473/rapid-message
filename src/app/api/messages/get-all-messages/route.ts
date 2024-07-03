import { connectDB } from "@/db/dbConfig";
import { UserModel } from "@/models/userModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = async (request: Request) => {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized request",
      },
      {
        status: 401,
      }
    );
  }
  const user = session?.user;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },

     
    ]).exec();

 

    if (!user || user.length === 0) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }
    
  
    return Response.json(
      { 
        success:true,
        messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error getting all messages", error);
    return Response.json(
      {
        success: false,
        message: "Error getting all messages",
      },
      {
        status: 500,
      }
    );
  }
};
