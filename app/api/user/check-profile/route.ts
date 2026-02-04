import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        console.log("🔍 [API] /api/user/check-profile - Request received");
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        console.log("📊 [API] Session check result:", {
            hasSession: !!session,
            hasUser: !!session?.user,
            userId: session?.user?.id,
            email: session?.user?.email,
        });

        if (!session?.user) {
            console.log("❌ [API] No session found - returning 401");
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        console.log("🗄️ [API] Querying database for user:", session.user.id);

        // Fetch fresh user data from database
        const user = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                rollNumber: true,
                phone: true,
            } as any, // Type assertion for new fields
        }) as any;

        console.log("📦 [API] User data from DB:", user);

        // Check if user has completed onboarding (has roll number)
        const hasCompletedOnboarding = !!(user?.rollNumber && user.rollNumber.trim());

        console.log("✅ [API] Onboarding status:", {
            hasCompletedOnboarding,
            rollNumber: user?.rollNumber || "NOT SET",
            phone: user?.phone || "NOT SET",
        });

        return NextResponse.json({
            success: true,
            hasCompletedOnboarding,
            rollNumber: user?.rollNumber || null,
            phone: user?.phone || null,
        });
    } catch (error) {
        console.error("❌ [API] Profile check error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to check profile" },
            { status: 500 }
        );
    }
}
