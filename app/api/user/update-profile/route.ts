import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail, emailTemplates } from "@/lib/email";
import { normalizeRollNumber } from "@/lib/roll-number-utils";

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

        const { rollNumber, phone } = await req.json();

        // Validate roll number
        if (!rollNumber || rollNumber.trim().length < 5) {
            return NextResponse.json(
                { success: false, error: "Invalid roll number" },
                { status: 400 }
            );
        }

        // Normalize the roll number for comparison
        const normalizedRollNum = normalizeRollNumber(rollNumber);

        // Check if normalized roll number already exists for another user
        const existingUser = await db.user.findFirst({
            where: {
                normalizedRollNumber: normalizedRollNum,
                NOT: {
                    id: session.user.id,
                },
            } as any, // Type assertion for new fields
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "This roll number is already registered" },
                { status: 400 }
            );
        }

        // Update user profile with both original and normalized roll number
        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                rollNumber: rollNumber.trim(),
                normalizedRollNumber: normalizedRollNum,
                phone: phone?.trim() || null,
            } as any, // Type assertion for new fields
        });

        // Send welcome email (async, don't wait for it)
        sendEmail({
            to: session.user.email,
            subject: "Welcome to SMIU Lost & Found! 🎓",
            html: emailTemplates.welcomeEmail(session.user.name, rollNumber.trim()),
        }).catch(err => console.error("Failed to send welcome email:", err));

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
