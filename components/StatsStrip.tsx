"use client";

import { motion, type Variants } from "framer-motion";
import { TrendingUp, Package, Users } from "lucide-react";

interface StatsStripProps {
    stats: {
        itemsReturned: number;
        activeListings: number;
        communityMembers: number;
    };
}

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

export function StatsStrip({ stats }: StatsStripProps) {
    const statItems = [
        {
            label: "Items Returned",
            value: stats.itemsReturned,
            icon: TrendingUp,
            color: "text-emerald-700",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
        },
        {
            label: "Active Listings",
            value: stats.activeListings,
            icon: Package,
            color: "text-blue-700",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
        },
        {
            label: "Community Members",
            value: stats.communityMembers,
            icon: Users,
            color: "text-slate-700",
            bgColor: "bg-slate-50",
            borderColor: "border-slate-200",
        },
    ];

    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="py-8 px-4 bg-slate-50"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statItems.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                variants={itemVariants}
                                className={`flex items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-white via-white to-blue-50/20 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300`}
                            >
                                <div className={`p-3 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <motion.p
                                        className="text-3xl font-semibold text-slate-900 tracking-tight"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        {stat.value.toLocaleString()}
                                        {stat.label === "Community Members" && "+"}
                                    </motion.p>
                                    <p className="text-slate-600 leading-relaxed text-sm font-medium">{stat.label}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
