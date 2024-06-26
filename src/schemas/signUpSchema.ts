import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, { message: "username must be 2 characters" })
  .max(20, { message: "username must be no more than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "username must not contain special characters",
  });

export const signUpValidation = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 character" }),
});
