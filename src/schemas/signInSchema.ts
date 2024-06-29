import { z } from "zod";

export const signInValidation = z.object({
  email: z.string(),
  password: z.string(),
});
