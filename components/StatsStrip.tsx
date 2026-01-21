"use client";

import { motion, type Variants } from "framer-motion";
import { TrendingUp, Package, Users } from "lucide-react";
import { stats } from "@/lib/data";

const statItems = [
    {
        label: "Items Returned",
        value: stats.itemsReturned,
        icon: TrendingUp,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
    },
    {
        label: "Active Listings",
        value: stats.activeListings,
        icon: Package,
        color: "text-smiu-gold",
        bgColor: "bg-amber-100",
    },
    {
        label: "Community Members",
        value: stats.communityMembers,
        icon: Users,
        color: "text-smiu-navy",
        bgColor: "bg-blue-100",
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
};

export function StatsStrip() {
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="py-8 px-4 bg-white border-y border-border"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statItems.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                variants={itemVariants}
                                className="flex items-center gap-4 p-6 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                            >
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <motion.p
                                        className="text-3xl font-bold text-smiu-navy"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        {stat.value.toLocaleString()}
                                        {stat.label === "Community Members" && "+"}
                                    </motion.p>
                                    <p className="text-muted-foreground font-medium">{stat.label}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
