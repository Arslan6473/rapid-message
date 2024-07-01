import { connectDB } from "@/db/dbConfig";
import { UserModel } from "@/models/userModel";

export const POST = async (request: Request) => {
  await connectDB();

  try {
    const { userName, code } = await request.json();
    console.log(userName)

    const user = await UserModel.findOne({ userName });

    if (!user) {
       
      return Response.json(
        {
          success: false,
          message: "No user found ",
        },
        {
          status: 400,
        }
      );
    }

    const isCodeCorrect = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeCorrect && isCodeNotExpired) {
        //varify user
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
         //code is expired
      return Response.json(
        {
          success: true,
          message:
            "Your verification code is expires. Please signup again to get new code",
        },
        { status: 400 }
      );
    } else {
        // code is incorrect
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifing user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifing user",
      },
      {
        status: 500,
      }
    );
  }
};
