import { z } from "zod";

export const acceptMessageValidation = z.object({
  acceptMessages: z.boolean(),
});
