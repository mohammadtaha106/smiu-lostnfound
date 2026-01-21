"use server";

// import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { generateKeywords } from "@/lib/gemini";


// 1. Zod Schema (Validation)
const PostSchema = z.object({
    title: z.string().min(3, "Title too short"),
    description: z.string().min(10, "Thora aur explain karein"),
    type: z.enum(["LOST", "FOUND"]),
    category: z.string(),
    location: z.string(),
    imageUrl: z.string(),
});

// 2. The Create Function
export async function createPost(formData: FormData) {
    const imageFile = formData.get("image") as File;
    let imageUrl = "";

    try {
        if (imageFile && imageFile.size > 0) {
            console.log("☁️ Uploading image to Cloudinary...");
            const url = await uploadToCloudinary(imageFile);
            if (typeof url === "string") {
                imageUrl = url;
                console.log("✅ Image Uploaded:", imageUrl);
            }
        }
    } catch (error) {
        console.error("❌ Image Upload Error:", error);
        return { success: false, error: "Image upload failed" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    console.log("🤖 AI Analyzing text...");
    const aiTags = await generateKeywords(`${title} ${description}`);

    console.log("✨ AI Generated Tags:", aiTags);

    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        category: formData.get("category"),
        location: formData.get("location"),
        imageUrl: imageUrl,
        aiTags: aiTags,
    };

    // Validate Data
    const validated = PostSchema.safeParse(rawData);

    if (!validated.success) {
        console.log("❌ Validation failed:", validated.error.flatten().fieldErrors);
        return { success: false, error: validated.error.flatten().fieldErrors };
    }

    try {
        console.log("🔥 Data received on Server:", validated.data);

        // Mock implementation
        /*
        await db.post.create({
          data: {
            ...validated.data,
            images: [validated.data.imageUrl],
            userId: "dummy-user-id-for-now",
          }
        });
        
        revalidatePath("/");
        */

        return { success: true, message: "Post Created (Mock Mode)", data: validated.data };

    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Something went wrong" };
    }
}