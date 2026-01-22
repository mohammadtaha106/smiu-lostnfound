"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ✅ Database-matched Type
export interface Item {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    type: string;
    status: string;
    imageUrl: string | null;
    date: string | null;
    studentName: string;
    reporterName?: string;
    reporterAvatar?: string;
}

interface ItemCardProps {
    item: Item;
    onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
    const isLost = item.type.toUpperCase() === "LOST";

    return (
        <motion.div
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer h-full"
            onClick={onClick}
        >
            <Card className="group overflow-hidden h-full bg-white border border-slate-200/80 hover:border-slate-300 transition-all duration-200">

                {/* Compact Image - 140px instead of 192px */}
                <div className="relative h-36 overflow-hidden bg-slate-50">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                            <span className="text-xs text-slate-400 font-medium">No Image</span>
                        </div>
                    )}

                    {/* Compact Status Badge */}
                    <div className="absolute top-2 right-2">
                        <Badge
                            className={`${isLost
                                    ? "bg-rose-500 hover:bg-rose-600"
                                    : "bg-emerald-500 hover:bg-emerald-600"
                                } text-white text-xs font-semibold px-2 py-0.5 border-0 shadow-sm`}
                        >
                            {isLost ? "LOST" : "FOUND"}
                        </Badge>
                    </div>
                </div>

                {/* Compact Content */}
                <div className="p-3">

                    {/* Category Badge - Subtle */}
                    <Badge variant="outline" className="mb-2 text-[10px] font-medium text-slate-600 border-slate-200 bg-slate-50/50 px-2 py-0">
                        {item.category}
                    </Badge>

                    {/* Title - Compact */}
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1 mb-1.5">
                        {item.title}
                    </h3>

                    {/* Description - Single Line */}
                    <p className="text-slate-500 text-xs line-clamp-1 mb-3 leading-relaxed">
                        {item.description}
                    </p>

                    {/* Meta Info - Horizontal & Compact */}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span className="truncate max-w-[100px]">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span className="whitespace-nowrap">
                                {item.date
                                    ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                    : "N/A"
                                }
                            </span>
                        </div>
                    </div>
                </div>

            </Card>
        </motion.div>
    );
}