"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


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
    studentName: string | null;
    reporterName?: string | null;
    reporterAvatar?: string | null;
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
            <Card className="group overflow-hidden h-full bg-gradient-to-br from-white via-white to-blue-50/30 border border-slate-200 hover:border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">

                {/* Image Section */}
                <div className="relative h-36 overflow-hidden bg-slate-100">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <span className="text-xs text-slate-400 font-medium">No Image</span>
                        </div>
                    )}

                    {/* Status Badge - Professional Colors */}
                    <div className="absolute top-2 right-2">
                        <Badge
                            className={`${isLost
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-emerald-100 text-emerald-700 border-emerald-200"
                                } text-xs font-semibold px-2.5 py-0.5 border shadow-sm`}
                        >
                            {isLost ? "LOST" : "FOUND"}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-3">

                    {/* Category Badge with Icon */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <Tag className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.5} />
                        <Badge variant="outline" className="text-[10px] font-medium text-slate-600 border-slate-200 bg-slate-50/50 px-2 py-0">
                            {item.category}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1 mb-1.5 tracking-tight">
                        {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-xs line-clamp-1 mb-3 leading-relaxed">
                        {item.description}
                    </p>

                    {/* Meta Info - Icons with Text */}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.5} />
                            <span className="truncate max-w-[100px]">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.5} />
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