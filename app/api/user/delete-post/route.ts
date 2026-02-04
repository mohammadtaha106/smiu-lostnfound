import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { postId } = await req.json();

        if (!postId) {
            return NextResponse.json(
                { success: false, error: "Post ID is required" },
                { status: 400 }
            );
        }

        // Verify that the post belongs to the user
        const post = await db.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json(
                { success: false, error: "Post not found" },
                { status: 404 }
            );
        }

        if (post.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized to delete this post" },
                { status: 403 }
            );
        }

        // Delete the post
        await db.post.delete({
            where: { id: postId },
        });

        // Revalidate pages
        revalidatePath("/");
        revalidatePath("/dashboard");

        return NextResponse.json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Delete post error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete post" },
            { status: 500 }
        );
    }
}
