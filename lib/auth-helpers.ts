import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Check if user has completed onboarding (has rollNumber)
 * If not, redirect to onboarding page
 */
export async function requireOnboarding() {
    const session = await auth.api.getSession({
        headers: await import("next/headers").then(m => m.headers()),
    });

    if (!session?.user) {
        redirect("/login");
    }

    // Check if user has completed onboarding
    // Note: This will work after Prisma regeneration
    // @ts-ignore - rollNumber will be available after Prisma update
    if (!session.user.rollNumber) {
        redirect("/onboarding");
    }

    return session;
}

/**
 * Check if user is authenticated
 * If not, redirect to login page
 */
export async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await import("next/headers").then(m => m.headers()),
    });

    if (!session?.user) {
        redirect("/login");
    }

    return session;
}
