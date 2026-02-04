import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        console.log("🔍 [Debug] Session check endpoint called");

        const session = await auth.api.getSession({
            headers: req.headers,
        });

        console.log("📊 [Debug] Session result:", {
            hasSession: !!session,
            userId: session?.user?.id,
        });

        const cookies = req.cookies.getAll();
        console.log("🍪 [Debug] Cookies:", cookies);

        return NextResponse.json({
            success: true,
            hasSession: !!session,
            session: session ? {
                userId: session.user.id,
                email: session.user.email,
                name: session.user.name,
                expiresAt: session.session.expiresAt,
                createdAt: session.session.createdAt,
            } : null,
            cookies: cookies.map(c => ({
                name: c.name,
                value: c.value.substring(0, 20) + "...", // Don't expose full value
            })),
            environment: {
                nodeEnv: process.env.NODE_ENV,
                authUrl: process.env.BETTER_AUTH_URL,
                appUrl: process.env.NEXT_PUBLIC_APP_URL,
            }
        });
    } catch (error) {
        console.error("❌ [Debug] Session check error:", error);
        return NextResponse.json({
            success: false,
            error: String(error),
            cookies: req.cookies.getAll().map(c => c.name),
        }, { status: 500 });
    }
}
