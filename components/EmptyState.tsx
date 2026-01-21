"use client";

import { motion } from "framer-motion";
import { PackageSearch, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
    title?: string;
    description?: string;
    showAction?: boolean;
}

export function EmptyState({
    title = "No items found",
    description = "There are no items to display at the moment.",
    showAction = true,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >
            {/* Illustration */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mb-6"
            >
                <div className="w-24 h-24 rounded-full bg-smiu-navy/10 flex items-center justify-center">
                    <PackageSearch className="h-12 w-12 text-smiu-navy/50" />
                </div>
            </motion.div>

            {/* Text */}
            <h3 className="text-xl font-semibold text-smiu-navy mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-md mb-6">{description}</p>

            {/* Action */}
            {showAction && (
                <Link href="/report">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="bg-smiu-navy hover:bg-smiu-navy/90 text-white gap-2">
                            Report an Item
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </motion.div>
                </Link>
            )}
        </motion.div>
    );
}
