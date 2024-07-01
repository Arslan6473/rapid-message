import { connectDB } from "@/db/dbConfig";
import { UserModel } from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { sendVerificationCode } from "@/utils/sendVerificationEmail";

export const POST = async (request: Request) => {
  await connectDB();
  try {
    const { userName, email, password } = await request.json();

    const existedVerifiedUser = await UserModel.findOne({
      userName,
      isVerified: true,
    });

    if (existedVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username already exist",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verifyCode = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    const verifyCodeExpiry = new Date(Date.now() + 3600000);

    const existedUserwithEmail = await UserModel.findOne({ email });
    if (existedUserwithEmail) {
      if (existedUserwithEmail?.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          {
            status: 500,
          }
        );
      } else {
        existedUserwithEmail.password = hashedPassword;
        existedUserwithEmail.verifyCode = verifyCode;
        existedUserwithEmail.verifyCodeExpiry = verifyCodeExpiry;

        await existedUserwithEmail.save();
      }
    } else {
      const newUser = await UserModel.create({
        userName,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        message: [],
      });

      if (!newUser)
        return Response.json(
          {
            success: false,
            message: "Error registering user",
          },
          {
            status: 500,
          }
        );
    }

    //send varification code
    const emailResponse = await sendVerificationCode(
      email,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user registered successfully. check email to varify ",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
};
