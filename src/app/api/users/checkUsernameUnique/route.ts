import { connectDB } from "@/db/dbConfig";
import { UserModel } from "@/models/userModel";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const userNameQuerySchema = z.object({
  userName: userNameValidation,
});

export const POST = async (request: Request) => {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = { userName: searchParams.get("userName") };

    const result = userNameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const userNameErrors = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors.length > 0
              ? userNameErrors.join(",")
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }

    const { userName } = result.data;

    const user = await UserModel.findOne({ userName });

    if (user) {
      return Response.json(
        {
          success: false,
          message: "Username already taken by someone",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error checking username unique",
      },
      {
        status: 500,
      }
    );
  }
};
