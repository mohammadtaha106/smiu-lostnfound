// app/page.tsx

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsStrip } from "@/components/StatsStrip";
import { ItemFeed } from "@/components/ItemFeed";
import { getPosts } from "@/actions/post.actions";

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

  const posts = response.data || [];
  const metadata = response.metadata || { total: 0, page: 1, limit: 12, hasMore: false };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <StatsStrip />

        <ItemFeed
          initialItems={posts}
          metadata={metadata}
        />

      </main>
      <footer className="bg-smiu-navy text-white py-12">

      </footer>
    </div>
  );
}