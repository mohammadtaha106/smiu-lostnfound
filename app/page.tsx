// app/page.tsx

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsStrip } from "@/components/StatsStrip";
import { ItemFeed } from "@/components/ItemFeed";
import { getPosts } from "@/actions/post.actions";
import { getStats } from "@/actions/stats.actions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || "";
  const filterType = resolvedParams?.type || "all";
  const page = parseInt(resolvedParams?.page || "1");

  // Database Call with Pagination
  const response = await getPosts(query, filterType, page, 12);

  // Fetch real stats
  const statsResponse = await getStats();

  

  const posts = response.data || [];
  const metadata = response.metadata || { total: 0, page: 1, limit: 12, hasMore: false };
  const stats = statsResponse.data || { itemsReturned: 0, activeListings: 0, communityMembers: 0 };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <HeroSection />
        <StatsStrip stats={stats} />

        <ItemFeed
          initialItems={posts}
          metadata={metadata}
        />

      </main>
      <footer className="bg-smiu-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-white/80">
          <p>&copy; 2026 SMIU Lost & Found. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}