import { z } from "zod";

export const varifyCodeValidation = z.object({
  code: z.string().length(6, { message: "varification code must be 6 digit" }),
});
