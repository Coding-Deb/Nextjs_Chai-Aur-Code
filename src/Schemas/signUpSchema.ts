import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username Must be Atleast 2 Character")
  .max(20, "Not More Than 20 Characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Not Valid");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(8, { message: "Password Must be Atleast 8 Character" }),
});
