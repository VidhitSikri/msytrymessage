import { z } from 'zod';

export const  messqueSchema = z.object({
    content: z.string().min(10, 'Message content must be at least 10 characters long').max(1000, 'Message content must not exceed 1000 characters'),
})