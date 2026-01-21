"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, User, Mail, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Item } from "@/lib/data";

interface ItemDetailDialogProps {
    item: Item | null;
    open: boolean;
    onClose: () => void;
}

export function ItemDetailDialog({ item, open, onClose }: ItemDetailDialogProps) {
    if (!item) return null;

    const isLost = item.type === "lost";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white">
                <div className="grid md:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative h-64 md:h-full min-h-[300px] bg-secondary">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                            <Badge
                                className={`${isLost
                                        ? "bg-smiu-burgundy hover:bg-smiu-burgundy/90"
                                        : "bg-emerald-600 hover:bg-emerald-600/90"
                                    } text-white font-medium text-sm px-3 py-1`}
                            >
                                {isLost ? "Lost Item" : "Found Item"}
                            </Badge>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 flex flex-col">
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-xl font-bold text-smiu-navy pr-8">
                                {item.title}
                            </DialogTitle>
                        </DialogHeader>

                        {/* Category */}
                        <Badge
                            variant="outline"
                            className="w-fit mb-4 border-smiu-navy/20 text-smiu-navy bg-smiu-navy/5"
                        >
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace("-", " ")}
                        </Badge>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                            {item.description}
                        </p>

                        {/* Meta Info */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 text-smiu-navy" />
                                <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 text-smiu-navy" />
                                <span>
                                    {new Date(item.date).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Reporter Info */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary mb-4">
                            <Avatar className="h-10 w-10 border-2 border-smiu-gold">
                                <AvatarImage src={item.reporterAvatar} />
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-smiu-navy text-sm">
                                    Reported by {item.reporterName}
                                </p>
                                <p className="text-xs text-muted-foreground">SMIU Community Member</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <Button
                                className={`w-full ${isLost
                                        ? "bg-smiu-navy hover:bg-smiu-navy/90"
                                        : "bg-emerald-600 hover:bg-emerald-600/90"
                                    } text-white gap-2`}
                            >
                                <Mail className="h-4 w-4" />
                                {isLost ? "I Found This!" : "Claim This Item"}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
