import { z } from "zod";
export const CreateUserSchema = z.object({
    email: z.string().min(3).max(30), // email
    password: z.string(), // password
    name: z.string() // name
});
export const SigninSchema = z.object({
    email: z.string().min(3).max(30), // eamil
    password: z.string() // password
});
export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20), // slug name
});
