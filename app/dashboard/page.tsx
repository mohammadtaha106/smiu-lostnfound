"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    Mail,
    Phone,
    User,
    AlertCircle,
    Eye
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardItem {
    id: string;
    title: string;
    description: string;
    type: "LOST" | "FOUND";
    status: "OPEN" | "RESOLVED";
    category: string;
    location: string;
    date: string;
    imageUrl: string | null;
    email: string | null;
    phone: string | null;
    studentName: string | null;
    rollNumber: string | null;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [activeFilter, setActiveFilter] = useState<"all" | "lost" | "found">("all");
    const [items, setItems] = useState<DashboardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Protected route check
    useEffect(() => {
        console.log("🔐 [Dashboard] Session check...");
        console.log("📊 [Dashboard] Session:", session);
        console.log("🔄 [Dashboard] isPending:", isPending);

        if (!isPending && !session) {
            console.log("❌ [Dashboard] No session, redirecting to /login");
            router.push("/login");
        } else if (session) {
            console.log("✅ [Dashboard] Session valid, user:", {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
            });
        }
    }, [session, isPending, router]);

    // Fetch user's items
    useEffect(() => {
        const fetchMyItems = async () => {
            console.log("📦 [Dashboard] Fetching user items...");

            if (!session?.user) {
                console.log("⚠️ [Dashboard] No session.user, skipping fetch");
                return;
            }

            console.log("🌐 [Dashboard] Calling /api/user/my-posts...");

            try {
                const response = await fetch("/api/user/my-posts");
                const result = await response.json();

                console.log("📦 [Dashboard] API Response:", result);

                if (result.success) {
                    console.log("✅ [Dashboard] Items fetched:", result.data.length, "items");
                    setItems(result.data);
                } else {
                    console.error("❌ [Dashboard] Failed to fetch:", result.error);
                    toast.error("Failed to fetch your items");
                }
            } catch (error) {
                console.error("❌ [Dashboard] Fetch error:", error);
                toast.error("Failed to connect to server");
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            console.log("✅ [Dashboard] Session exists, fetching items...");
            fetchMyItems();
        } else {
            console.log("⚠️ [Dashboard] No session, not fetching items");
        }
    }, [session]);

    const handleDelete = async (postId: string) => {
        toast.promise(
            new Promise(async (resolve, reject) => {
                setActionLoading(postId);
                try {
                    const response = await fetch("/api/user/delete-post", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ postId }),
                    });

                    const result = await response.json();

                    if (result.success) {
                        setItems(items.filter((item) => item.id !== postId));
                        resolve(result);
                    } else {
                        reject(new Error(result.error || "Failed to delete"));
                    }
                } catch (error) {
                    console.error("Delete error:", error);
                    reject(error);
                } finally {
                    setActionLoading(null);
                }
            }),
            {
                loading: "Deleting post...",
                success: "Post deleted successfully! 🗑️",
                error: "Failed to delete post",
            }
        );
    };

    const handleResolve = async (postId: string) => {
        toast.promise(
            new Promise(async (resolve, reject) => {
                setActionLoading(postId);
                try {
                    const response = await fetch("/api/user/resolve-post", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ postId }),
                    });

                    const result = await response.json();

                    if (result.success) {
                        setItems(
                            items.map((item) =>
                                item.id === postId ? { ...item, status: "RESOLVED" } : item
                            )
                        );
                        resolve(result);
                    } else {
                        reject(new Error(result.error || "Failed to resolve"));
                    }
                } catch (error) {
                    console.error("Resolve error:", error);
                    reject(error);
                } finally {
                    setActionLoading(null);
                }
            }),
            {
                loading: "Marking as resolved...",
                success: "Item marked as resolved! ✅",
                error: "Failed to mark as resolved",
            }
        );
    };

    // Loading state
    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-smiu-navy mx-auto mb-4" />
                    <p className="text-slate-600">Loading your dashboard...</p>
                </div>
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
    const lostItems = items.filter((i) => i.type === "LOST").length;
    const foundItems = items.filter((i) => i.type === "FOUND").length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <Navbar />

            <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-smiu-navy mb-2">
                                Welcome back, {session.user.name?.split(" ")[0]}! 👋
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Manage your reported items and track their status
                            </p>
                        </div>
                        <Link href="/report">
                            <Button className="bg-smiu-navy hover:bg-smiu-navy/90 gap-2 h-12 px-6 shadow-lg shadow-smiu-navy/20">
                                <Plus className="h-5 w-5" />
                                Report New Item
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                    <StatCard
                        icon={Package}
                        label="Lost / Found"
                        value={`${lostItems} / ${foundItems}`}
                        color="purple"
                        delay={0.4}
                    />
                </div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)}>
                            <TabsList className="bg-white border border-slate-200 shadow-sm">
                                <TabsTrigger
                                    value="all"
                                    className="data-[state=active]:bg-smiu-navy data-[state=active]:text-white"
                                >
                                    All Items ({totalItems})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="lost"
                                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                                >
                                    Lost ({lostItems})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="found"
                                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                                >
                                    Found ({foundItems})
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Items Grid */}
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map((item, index) => (
                                    <DashboardItemCard
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        onDelete={handleDelete}
                                        onResolve={handleResolve}
                                        isLoading={actionLoading === item.id}
                                    />
                                ))}
                            </AnimatePresence>
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
    delay,
}: {
    icon: any;
    label: string;
    value: number | string;
    color: "blue" | "amber" | "green" | "purple";
    delay: number;
}) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        green: "bg-green-50 text-green-600 border-green-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 mb-1 font-medium">{label}</p>
                            <p className="text-3xl font-bold text-smiu-navy">{value}</p>
                        </div>
                        <div className={`p-4 rounded-xl border-2 ${colorClasses[color]}`}>
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
    onResolve,
    isLoading,
}: {
    item: DashboardItem;
    index: number;
    onDelete: (id: string) => void;
    onResolve: (id: string) => void;
    isLoading: boolean;
}) {
    const isLost = item.type === "LOST";
    const isResolved = item.status === "RESOLVED";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-16 w-16 text-slate-300" />
                        </div>
                    )}

                    {/* Type Badge */}
                    <Badge
                        className={`absolute top-3 left-3 ${isLost
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                            } text-white shadow-lg`}
                    >
                        {item.type}
                    </Badge>

                    {/* Status Badge */}
                    {isResolved && (
                        <Badge className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 border-emerald-200 shadow-lg">
                            ✓ RESOLVED
                        </Badge>
                    )}
                </div>

                <CardContent className="p-5">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-smiu-navy mb-2 line-clamp-1">
                        {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {item.description}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-amber-500" />
                            <span className="font-medium">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Calendar className="h-3.5 w-3.5 text-blue-500" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        {item.rollNumber && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <User className="h-3.5 w-3.5 text-purple-500" />
                                <span>Roll: {item.rollNumber}</span>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    {(item.email || item.phone) && (
                        <div className="bg-slate-50 rounded-lg p-3 mb-4 space-y-1.5">
                            {item.email && (
                                <div className="flex items-center gap-2 text-xs text-slate-700">
                                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                                    <span className="truncate">{item.email}</span>
                                </div>
                            )}
                            {item.phone && (
                                <div className="flex items-center gap-2 text-xs text-slate-700">
                                    <Phone className="h-3.5 w-3.5 text-green-500" />
                                    <span>{item.phone}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Link href={`/items/${item.id}`} className="flex-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-slate-300 hover:bg-slate-50"
                            >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                            </Button>
                        </Link>
                        {!isResolved && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                                onClick={() => onResolve(item.id)}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Resolve
                                    </>
                                )}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onDelete(item.id)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
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
            className="text-center py-20"
        >
            <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-16 w-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-smiu-navy mb-2">
                No {filter !== "all" ? filter : ""} items found
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {filter === "all"
                    ? "You haven't reported any items yet. Start by reporting a lost or found item."
                    : `You haven't reported any ${filter} items yet.`}
            </p>
            <Link href="/report">
                <Button className="bg-smiu-navy hover:bg-smiu-navy/90 gap-2 h-12 px-6 shadow-lg shadow-smiu-navy/20">
                    <Plus className="h-5 w-5" />
                    Report Your First Item
                </Button>
            </Link>
        </motion.div>
    );
}
