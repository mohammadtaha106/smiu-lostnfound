import { db } from "../lib/db";
import { normalizeRollNumber } from "../lib/roll-number-utils";

/**
 * Migration Script: Populate normalizedRollNumber for existing records
 * 
 * This script updates existing users and posts to add the normalized
 * roll number field for case-insensitive matching.
 * 
 * Run with: npx tsx scripts/migrate-roll-numbers.ts
 */

async function migrateRollNumbers() {
    console.log("🔄 Starting roll number migration...\n");

    try {
        // ===== MIGRATE USERS =====
        console.log("👥 Migrating users...");

        const users = await db.user.findMany({
            where: {
                rollNumber: { not: null },
            },
        });

        console.log(`   Found ${users.length} users with roll numbers`);

        let updatedUsers = 0;
        for (const user of users) {
            if (user.rollNumber) {
                const normalized = normalizeRollNumber(user.rollNumber);

                await db.user.update({
                    where: { id: user.id },
                    data: {
                        normalizedRollNumber: normalized,
                    } as any,
                });

                updatedUsers++;
                console.log(`   ✓ Updated user: ${user.rollNumber} → ${normalized}`);
            }
        }

        console.log(`✅ Updated ${updatedUsers} users\n`);

        // ===== MIGRATE POSTS =====
        console.log("📝 Migrating posts...");

        const posts = await db.post.findMany({
            where: {
                rollNumber: { not: null },
            },
        });

        console.log(`   Found ${posts.length} posts with roll numbers`);

        let updatedPosts = 0;
        for (const post of posts) {
            if (post.rollNumber) {
                const normalized = normalizeRollNumber(post.rollNumber);

                await db.post.update({
                    where: { id: post.id },
                    data: {
                        normalizedRollNumber: normalized,
                    } as any,
                });

                updatedPosts++;
                console.log(`   ✓ Updated post: ${post.rollNumber} → ${normalized}`);
            }
        }

        console.log(`✅ Updated ${updatedPosts} posts\n`);

        // ===== SUMMARY =====
        console.log("🎉 Migration completed successfully!");
        console.log(`   Total users updated: ${updatedUsers}`);
        console.log(`   Total posts updated: ${updatedPosts}`);

    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        await db.$disconnect();
    }
}

// Run the migration
migrateRollNumbers()
    .then(() => {
        console.log("\n✨ All done! Your database is now using normalized roll numbers.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Migration error:", error);
        process.exit(1);
    });
