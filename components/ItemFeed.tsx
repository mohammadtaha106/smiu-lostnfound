"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemCard, type Item } from "./ItemCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ItemFeedProps {
    initialItems: Item[];
    metadata: {
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    };
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
};

export function ItemFeed({ initialItems, metadata }: ItemFeedProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get("type") || "all";
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") params.delete("type");
        else params.set("type", value);
        params.delete("page"); // Reset to page 1 on filter change

        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(metadata.page + 1));
        router.push(`/?${params.toString()}`);
    };

    return (
        <section id="feed" className="py-12 px-4 bg-slate-50/50">
            <div className="max-w-7xl mx-auto">

                {/* Header & Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-smiu-navy mb-2">
                            Recent Listings
                        </h2>
                        <p className="text-slate-600 text-sm">
                            Showing {initialItems.length} of {metadata.total} item{metadata.total !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <Tabs value={currentFilter} onValueChange={handleTabChange} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-3 sm:w-auto bg-white shadow-sm">
                            <TabsTrigger value="all" className="data-[state=active]:bg-slate-100">All</TabsTrigger>
                            <TabsTrigger value="lost" className="data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Lost</TabsTrigger>
                            <TabsTrigger value="found" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">Found</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Items Grid */}
                <AnimatePresence mode="wait">
                    {initialItems.length > 0 ? (
                        <>
                            <motion.div
                                key={currentFilter}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
                            >
                                {initialItems.map((item) => (
                                    <motion.div key={item.id} variants={cardVariants}>
                                        <Link href={`/items/${item.id}`}>
                                            <ItemCard item={item} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Load More Button */}
                            {metadata.hasMore && (
                                <div className="flex justify-center mt-8">
                                    <Button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className="bg-smiu-navy hover:bg-slate-800 text-white px-8 py-6 text-base"
                                        size="lg"
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            `Load More (${metadata.total - initialItems.length} remaining)`
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center bg-white rounded-xl border border-dashed border-slate-200"
                        >
                            <p className="text-lg text-slate-500">No items found matching criteria.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}