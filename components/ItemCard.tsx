"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Item } from "@/lib/data";

interface ItemCardProps {
    item: Item;
    onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
    const isLost = item.type === "lost";

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="cursor-pointer"
            onClick={onClick}
        >
            <Card className="overflow-hidden h-full bg-white hover:shadow-lg transition-shadow duration-300 border-border">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-secondary">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge
                            className={`${isLost
                                    ? "bg-smiu-burgundy hover:bg-smiu-burgundy/90"
                                    : "bg-emerald-600 hover:bg-emerald-600/90"
                                } text-white font-medium`}
                        >
                            {isLost ? "Lost" : "Found"}
                        </Badge>
                    </div>
                    {/* Status indicator for claimed/resolved */}
                    {item.status !== "active" && (
                        <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-white/90 text-smiu-navy">
                                {item.status === "claimed" ? "Claimed" : "Resolved"}
                            </Badge>
                        </div>
                    )}
                </div>

                <CardContent className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-smiu-navy text-lg leading-tight line-clamp-1 mb-2">
                        {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {item.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        {/* Location */}
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[120px]">{item.location}</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                {new Date(item.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mt-3">
                        <Badge
                            variant="outline"
                            className="border-smiu-navy/20 text-smiu-navy bg-smiu-navy/5"
                        >
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace("-", " ")}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
