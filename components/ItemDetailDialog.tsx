"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, User, Mail } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// 👇 Import type from ItemCard (taake DB structure match kare)
import type { Item } from "./ItemCard";

interface ItemDetailDialogProps {
    item: Item | null;
    open: boolean;
    onClose: () => void;
}

export function ItemDetailDialog({ item, open, onClose }: ItemDetailDialogProps) {
    if (!item) return null;

    // Type check (Case insensitive)
    const isLost = item.type.toUpperCase() === "LOST";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white gap-0">
                <div className="grid md:grid-cols-2 h-full">

                    {/* Image Section */}
                    <div className="relative h-64 md:h-full min-h-[300px] bg-gray-100">
                        {/* 👇 FIX: image ki jagah imageUrl */}
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                            <Badge
                                className={`${isLost
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-emerald-600 hover:bg-emerald-700"
                                    } text-white font-medium text-sm px-3 py-1 border-0`}
                            >
                                {isLost ? "Lost Item" : "Found Item"}
                            </Badge>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-6 flex flex-col h-full">
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-xl font-bold text-smiu-navy pr-8">
                                {item.title}
                            </DialogTitle>
                        </DialogHeader>

                        {/* Category */}
                        <Badge
                            variant="outline"
                            className="w-fit mb-4 border-gray-200 text-gray-700 bg-gray-50"
                        >
                            {item.category}
                        </Badge>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                            {item.description}
                        </p>

                        {/* Meta Info */}
                        <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-amber-500" />
                                <span className="font-semibold">Location:</span> {item.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 text-amber-500" />
                                <span className="font-semibold">Date:</span>
                                {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                            </div>

                            {/* 👇 Hybrid Fields (Name/RollNo) - Sirf agar mojood hon */}
                            {item.studentName && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="h-4 w-4 text-amber-500" />
                                    <span className="font-semibold">Owner:</span> {item.studentName}
                                </div>
                            )}
                        </div>

                        {/* Reporter Info */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={item.reporterAvatar ?? undefined} />
                                <AvatarFallback className="bg-smiu-navy text-white">
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">
                                    {item.reporterName || "Anonymous Student"}
                                </p>
                                <p className="text-xs text-gray-500">SMIU Community Member</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                            <Button
                                className={`w-full ${isLost
                                    ? "bg-smiu-navy hover:bg-slate-800"
                                    : "bg-emerald-600 hover:bg-emerald-700"
                                    } text-white gap-2`}
                            >
                                <Mail className="h-4 w-4" />
                                Contact Reporter
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}