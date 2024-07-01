import { connectDB } from "@/db/dbConfig";
import { Message, UserModel } from "@/models/userModel";

export const POST = async (request: Request) => {
  await connectDB();
  try {
    const { userName, content } = await request.json();

    console.log({ userName, content })

    const user = await UserModel.findOne({ userName });

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    //check if user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: "User not accepting messages", success: false },
        { status: 404 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error sending message", error);
    return Response.json(
      {
        success: false,
        message: "Error sending message",
      },
      {
        status: 500,
      }
    );
  }
};
