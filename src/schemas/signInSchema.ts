import { z } from 'zod'

export const signInSchema = z.object({
  //identifier is email or username
  identifier: z.string(),
  password: z.string(),
});
