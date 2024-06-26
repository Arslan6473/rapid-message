import { connectDB } from "@/db/dbConfig";
import { User } from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { sendVarificationCode } from "@/utils/sendVarificationEmail";

export const POST = async (request: Request) => {
  await connectDB();
  try {
    const { userName, email, password } = await request.json();

    const existedVarifiedUser = await User.findOne({
      userName,
      isVarified: true,
    });

    if (existedVarifiedUser) {
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
    const varifyCode = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    const varifyCodeExpiry = new Date(Date.now() + 3600000);

    const existedUserwithEmail = await User.findOne({ email });
    if (existedUserwithEmail) {
      if (existedUserwithEmail?.isVarified) {
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
        existedUserwithEmail.varifyCode = varifyCode;
        existedUserwithEmail.varifyCodeExpiry = varifyCodeExpiry;

        await existedUserwithEmail.save();
      }
    } else {
      const newUser = await User.create({
        userName,
        email,
        password: hashedPassword,
        varifyCode,
        varifyCodeExpiry,
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
    const emailResponse = await sendVarificationCode(
      email,
      userName,
      varifyCode
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
