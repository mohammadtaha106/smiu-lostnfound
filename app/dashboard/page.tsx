"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import {
    Package,
    CheckCircle2,
    Clock,
    Trash2,
    MapPin,
    Calendar,
    Plus,
    Loader2,
    Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Sample data structure - Replace with real API call
interface DashboardItem {
    id: string;
    title: string;
    type: "LOST" | "FOUND";
    status: "OPEN" | "RESOLVED";
    category: string;
    location: string;
    date: string;
    imageUrl: string | null;
}

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [activeFilter, setActiveFilter] = useState<"all" | "lost" | "found">("all");
    const [items, setItems] = useState<DashboardItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Protected route check
    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    // Fetch user's items
    useEffect(() => {
        if (session) {
            // TODO: Replace with actual API call
            // fetchMyItems(session.user.id).then(setItems);

            // Mock data for now
            setTimeout(() => {
                setItems([
                    {
                        id: "1",
                        title: "Black Leather Wallet",
                        type: "LOST",
                        status: "OPEN",
                        category: "Wallet",
                        location: "Library",
                        date: "2026-01-20",
                        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
                    },
                    {
                        id: "2",
                        title: "Student ID Card - Ali Ahmed",
                        type: "FOUND",
                        status: "RESOLVED",
                        category: "ID Cards",
                        location: "Cafeteria",
                        date: "2026-01-18",
                        imageUrl: null,
                    },
                ]);
                setLoading(false);
            }, 1000);
        }
    }, [session]);

    // Loading state
    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-smiu-navy" />
            </div>
        );
    }

    if (!session) return null;

    // Filter items
    const filteredItems = items.filter((item) => {
        if (activeFilter === "all") return true;
        return item.type.toLowerCase() === activeFilter;
    });

    // Calculate stats
    const totalItems = items.length;
    const activeItems = items.filter((i) => i.status === "OPEN").length;
    const resolvedItems = items.filter((i) => i.status === "RESOLVED").length;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-smiu-navy mb-2">
                        Welcome back, {session.user.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-slate-600">
                        Manage your reported items and track their status
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard
                        icon={Package}
                        label="Total Reported"
                        value={totalItems}
                        color="blue"
                        delay={0.1}
                    />
                    <StatCard
                        icon={Clock}
                        label="Active Listings"
                        value={activeItems}
                        color="amber"
                        delay={0.2}
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Resolved"
                        value={resolvedItems}
                        color="green"
                        delay={0.3}
                    />
                </div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* Section Header with Filter */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-smiu-navy">My Listings</h2>

                        <Link href="/report">
                            <Button className="bg-smiu-navy hover:bg-smiu-navy/90 gap-2">
                                <Plus className="h-4 w-4" />
                                Report New Item
                            </Button>
                        </Link>
                    </div>

                    {/* Filter Tabs */}
                    <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)} className="mb-6">
                        <TabsList className="bg-white border border-slate-200">
                            <TabsTrigger value="all" className="data-[state=active]:bg-smiu-navy data-[state=active]:text-white">
                                All Items
                            </TabsTrigger>
                            <TabsTrigger value="lost" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                                Lost
                            </TabsTrigger>
                            <TabsTrigger value="found" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                                Found
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Items Grid */}
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item, index) => (
                                <DashboardItemCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    onDelete={(id) => {
                                        // TODO: Implement delete
                                        console.log("Delete:", id);
                                    }}
                                    onResolve={(id) => {
                                        // TODO: Implement resolve
                                        console.log("Resolve:", id);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState filter={activeFilter} />
                    )}
                </motion.div>
            </main>
        </div>
    );
}

// Stats Card Component
function StatCard({
    icon: Icon,
    label,
    value,
    color,
    delay
}: {
    icon: any;
    label: string;
    value: number;
    color: "blue" | "amber" | "green";
    delay: number;
}) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-amber-600",
        green: "bg-green-50 text-green-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">{label}</p>
                            <p className="text-3xl font-bold text-smiu-navy">{value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                            <Icon className="h-6 w-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// Dashboard Item Card
function DashboardItemCard({
    item,
    index,
    onDelete,
    onResolve
}: {
    item: DashboardItem;
    index: number;
    onDelete: (id: string) => void;
    onResolve: (id: string) => void;
}) {
    const isLost = item.type === "LOST";
    const isResolved = item.status === "RESOLVED";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="overflow-hidden hover:shadow-lg transition-all border-slate-200 group">
                {/* Image */}
                <div className="relative aspect-video bg-slate-200">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-slate-400" />
                        </div>
                    )}

                    {/* Type Badge */}
                    <Badge
                        className={`absolute top-2 left-2 ${isLost
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            } text-white`}
                    >
                        {item.type}
                    </Badge>

                    {/* Status Badge */}
                    <Badge
                        variant={isResolved ? "default" : "secondary"}
                        className={`absolute top-2 right-2 ${isResolved ? "bg-green-100 text-green-700 border-green-200" : ""
                            }`}
                    >
                        {item.status}
                    </Badge>
                </div>

                <CardContent className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-smiu-navy mb-2 truncate">
                        {item.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {!isResolved && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                                onClick={() => onResolve(item.id)}
                            >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Resolved
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onDelete(item.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// Empty State Component
function EmptyState({ filter }: { filter: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
        >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-smiu-navy mb-2">
                No {filter !== "all" ? filter : ""} items found
            </h3>
            <p className="text-slate-600 mb-6">
                {filter === "all"
                    ? "You haven't reported any items yet"
                    : `You haven't reported any ${filter} items`}
            </p>
            <Link href="/report">
                <Button className="bg-smiu-navy hover:bg-smiu-navy/90 gap-2">
                    <Plus className="h-4 w-4" />
                    Report Your First Item
                </Button>
            </Link>
        </motion.div>
    );
}
