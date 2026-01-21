"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ItemCard } from "./ItemCard";
import { ItemDetailDialog } from "./ItemDetailDialog";
import { EmptyState } from "./EmptyState";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockItems, type Item } from "@/lib/data";

type FilterType = "all" | "lost" | "found";

interface ItemFeedProps {
    searchQuery?: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
};

export function ItemFeed({ searchQuery = "" }: ItemFeedProps) {
    const [filter, setFilter] = useState<FilterType>("all");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const filteredItems = useMemo(() => {
        let items = mockItems.filter((item) => item.status === "active");

        // Apply type filter
        if (filter !== "all") {
            items = items.filter((item) => item.type === filter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter(
                (item) =>
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.location.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query)
            );
        }

        return items;
    }, [filter, searchQuery]);

    return (
        <section id="feed" className="py-12 px-4 bg-secondary/30">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-smiu-navy mb-2">
                            Recent Listings
                        </h2>
                        <p className="text-muted-foreground">
                            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <Tabs
                        value={filter}
                        onValueChange={(value) => setFilter(value as FilterType)}
                        className="w-full sm:w-auto"
                    >
                        <TabsList className="grid w-full grid-cols-3 sm:w-auto bg-white">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:bg-smiu-navy data-[state=active]:text-white"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="lost"
                                className="data-[state=active]:bg-smiu-burgundy data-[state=active]:text-white"
                            >
                                Lost
                            </TabsTrigger>
                            <TabsTrigger
                                value="found"
                                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                            >
                                Found
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Items Grid */}
                <AnimatePresence mode="wait">
                    {filteredItems.length > 0 ? (
                        <motion.div
                            key={`${filter}-${searchQuery}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredItems.map((item) => (
                                <motion.div key={item.id} variants={cardVariants}>
                                    <ItemCard item={item} onClick={() => setSelectedItem(item)} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <EmptyState
                                title="No items found"
                                description={
                                    searchQuery
                                        ? `No items match "${searchQuery}". Try a different search term.`
                                        : "No items in this category yet. Check back later!"
                                }
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Item Detail Dialog */}
                <ItemDetailDialog
                    item={selectedItem}
                    open={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            </div>
        </section>
    );
}
