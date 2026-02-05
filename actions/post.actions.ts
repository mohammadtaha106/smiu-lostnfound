"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { normalizeRollNumber } from "@/lib/roll-number-utils";


// 1. Zod Schema (Validation)
const PostSchema = z.object({
    title: z.string().min(3, "Title too short"),
    description: z.string().min(10, "Thora aur explain karein"),
    type: z.enum(["LOST", "FOUND"]),
    category: z.string(),
    location: z.string(),
    imageUrl: z.string(),
    // Hybrid Data Entry Fields
    studentName: z.string().optional(),
    rollNumber: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().min(10, "Valid phone number required"), // ✅ Now required
    date: z.string().optional(),
    time: z.string().optional(),
});

// 2. The Create Function
export async function createPost(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(), // ✅ Pass headers
    });

    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }
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

    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        category: formData.get("category"),
        location: formData.get("location"),
        imageUrl: imageUrl,
        aiTags: [], // Empty array - no AI tags
        // Hybrid Data Entry Fields
        studentName: formData.get("studentName") || undefined,
        rollNumber: formData.get("rollNumber") || undefined,
        email: formData.get("email") || undefined,
        phone: formData.get("phone") || undefined,
        date: formData.get("date") || undefined,
        time: formData.get("time") || undefined,
    };

    // Validate Data
    const validated = PostSchema.safeParse(rawData);

    if (!validated.success) {
        console.log("Validation failed:", validated.error.flatten().fieldErrors);
        return { success: false, error: validated.error.flatten().fieldErrors };
    }

    try {
        console.log("Data received on Server:", validated.data);

        // Normalize roll number if provided
        const normalizedRollNum = validated.data.rollNumber
            ? normalizeRollNumber(validated.data.rollNumber)
            : undefined;

        // Save to Database with normalized roll number
        const newPost = await db.post.create({
            data: {
                ...validated.data,
                normalizedRollNumber: normalizedRollNum,
                status: "OPEN",
                userId: session?.user.id,
            }
        });

        // 🎯 AUTO-NOTIFICATION: If this is a FOUND ID card with roll number
        if (
            validated.data.type === "FOUND" &&
            (validated.data.category === "id-cards" || validated.data.category === "documents") &&
            normalizedRollNum
        ) {
            console.log("🔍 Checking if owner is registered...");

            // Find the owner by normalized roll number (case-insensitive)
            const owner = await db.user.findFirst({
                where: {
                    normalizedRollNumber: normalizedRollNum,
                } as any,
            }) as any;

            if (owner) {
                console.log("✅ Owner found! Sending email notification...");

                // Send email notification to owner
                const { sendEmail, emailTemplates } = await import("@/lib/email");
                sendEmail({
                    to: owner.email,
                    subject: "🎉 Your ID Card Has Been Found!",
                    html: emailTemplates.idCardFound(
                        owner.name,
                        validated.data.rollNumber || "",
                        validated.data.location,
                        validated.data.email || session.user.email,
                        validated.data.phone // ✅ Phone number added
                    ),
                }).catch(err => console.error("Failed to send ID card notification:", err));

                console.log("📧 Email notification sent to:", owner.email);
            } else {
                console.log("ℹ️ No registered user found with this roll number");
            }
        }

        revalidatePath("/");

        return { success: true, message: "Post Created Successfully!", data: validated.data };

    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Something went wrong" };
    }
}

export async function getPosts(
    searchQuery: string,
    filterType: string,
    page: number = 1,
    limit: number = 12
) {
    try {
        const skip = (page - 1) * limit;

        const whereClause = {
            // ✅ ONLY SHOW ACTIVE ITEMS (hide resolved ones from homepage)
            status: "OPEN",  // "OPEN" = Active items still need help
            ...(filterType !== "all" && { type: filterType.toUpperCase() }),
            ...(searchQuery && {
                OR: [
                    { title: { contains: searchQuery, mode: "insensitive" as const } },
                    { description: { contains: searchQuery, mode: "insensitive" as const } },
                    { studentName: { contains: searchQuery, mode: "insensitive" as const } },
                    { rollNumber: { contains: searchQuery, mode: "insensitive" as const } },
                    { normalizedRollNumber: { contains: normalizeRollNumber(searchQuery) } },
                    { aiTags: { has: searchQuery } }
                ]
            })
        };

        // Get total count for pagination metadata
        const total = await db.post.count({ where: whereClause });

        const posts = await db.post.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        return {
            success: true,
            data: posts,
            metadata: {
                total,
                page,
                limit,
                hasMore: skip + posts.length < total
            }
        };

    } catch (error) {
        console.error("Error fetching posts:", error);
        return { success: false, error: "Failed to fetch posts" };
    }
}



export async function getPostById(id: string) {
    try {

        const post = await db.post.findUnique({
            where: {
                id: id,
            }
        })
        return { success: true, data: post };

    } catch (error) {
        console.error("Error fetching single post:", error);
        return { success: false, error: "Item not found" };
    }
}

export async function deletePost(postId: string, userId: string) {
    try {
        await db.post.delete({
            where: {
                id: postId,
                userId: userId,
            }
        })
        revalidatePath("/dashboard")
        return { success: true, message: "Post deleted successfully" };
    } catch (error) {
        console.error("Error deleting post:", error);
        return { success: false, error: "Failed to delete post" };
    }
}
export async function markAsResolved(postId: string, userId: string) {
    try {
        await db.post.update({
            where: {
                id: postId,
                userId: userId,
            },
            data: {
                status: "RESOLVED",
            }
        })
        revalidatePath("/dashboard")
        return { success: true, message: "Post marked as resolved successfully" };
    } catch (error) {
        console.error("Error marking post as resolved:", error);
        return { success: false, error: "Failed to mark post as resolved" };
    }
}