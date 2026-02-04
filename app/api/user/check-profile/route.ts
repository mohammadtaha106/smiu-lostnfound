import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
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

        // Check if user has completed onboarding (has roll number)
        const hasCompletedOnboarding = !!(user?.rollNumber && user.rollNumber.trim());

        return NextResponse.json({
            success: true,
            hasCompletedOnboarding,
            rollNumber: user?.rollNumber || null,
            phone: user?.phone || null,
        });
    } catch (error) {
        console.error("Profile check error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to check profile" },
            { status: 500 }
        );
    }
}
