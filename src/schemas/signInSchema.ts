import { z } from 'zod';

export const  signInSchema = z.object({
    identifier: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
})