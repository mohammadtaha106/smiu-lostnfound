"use server";

import { db } from "@/lib/db";

/**
 * Get real-time statistics for the dashboard
 */
export async function getStats() {
    try {
        // Get total posts count
        const totalPosts = await db.post.count();

        // Get resolved (returned) items count
        const resolvedItems = await db.post.count({
            where: { status: "RESOLVED" }
        });

        // Get active (open) listings count
        const activeListings = await db.post.count({
            where: { status: "OPEN" }
        });

        // Get total users count
        const totalUsers = await db.user.count();

        return {
            success: true,
            data: {
                itemsReturned: resolvedItems,
                activeListings: activeListings,
                communityMembers: totalUsers,
                totalPosts: totalPosts,
            }
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return {
            success: false,
            data: {
                itemsReturned: 0,
                activeListings: 0,
                communityMembers: 0,
                totalPosts: 0,
            }
        };
    }
}
