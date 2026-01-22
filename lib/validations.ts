import { z } from "zod";

export const itemSchema = z.object({
    title: z
        .string()
        .min(5, { message: "Title must be at least 5 characters." })
        .max(100, { message: "Title must not exceed 100 characters." }),
    category: z.string().min(1, {
        message: "Please select a category.",
    }),
    location: z.string().min(1, {
        message: "Please select a location.",
    }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Please enter a valid date.",
    }),
    time: z.string().optional(),
    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters." })
        .max(1000, { message: "Description must not exceed 1000 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    // Optional fields for documents/ID cards (hybrid data entry)
    studentName: z.string().optional(),
    rollNumber: z.string().optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;
