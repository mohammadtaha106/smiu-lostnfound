"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Plus, User, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ Better Auth Session
    const { data: session, isPending } = authClient.useSession();

    // ✅ Debounced Search - 500ms delay
    useEffect(() => {
        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const currentQuery = searchParams.get("q") || "";

            // ⚠️ Only update if search query actually changed
            if (searchQuery.trim() !== currentQuery) {
                const params = new URLSearchParams(searchParams.toString());

                if (searchQuery.trim()) {
                    params.set("q", searchQuery.trim());
                } else {
                    params.delete("q");
                }

                router.push(`/?${params.toString()}`, { scroll: false });
            }
        }, 500);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery]); // 🔥 Only depend on searchQuery

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2"
                        >
                            <img
                                src="https://www.smiu.edu.pk/themes/smiu/images/13254460_710745915734761_8157428650049174152_n.png"
                                alt="SMIU Logo"
                                className="h-12 w-auto object-contain"
                            />
                            <div className="hidden sm:block">
                                <span className="font-bold text-smiu-navy text-lg">SMIU</span>
                                <span className="text-smiu-gold text-lg font-medium ml-1">
                                    Lost & Found
                                </span>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search lost or found items..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-10 bg-secondary border-none focus-visible:ring-smiu-navy"
                            />
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/report">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button className="bg-smiu-navy hover:bg-smiu-navy/90 text-white gap-2">
                                    <Plus className="h-4 w-4" />
                                    Report Item
                                </Button>
                            </motion.div>
                        </Link>

                        {/* Auth Section */}
                        {!isPending && (
                            session ? (
                                // Logged In User - Dropdown Menu
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Avatar className="h-9 w-9 border-2 border-smiu-gold cursor-pointer">
                                                <AvatarImage src={session.user.image || undefined} />
                                                <AvatarFallback className="bg-smiu-navy text-white">
                                                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </motion.div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium text-smiu-navy">{session.user.name}</p>
                                                <p className="text-xs text-slate-500">{session.user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">
                                            <FileText className="mr-2 h-4 w-4" />
                                            My Posts
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600 focus:text-red-600"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                // Guest User - Login Button
                                <Link href="/login">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button variant="outline" className="border-smiu-navy text-smiu-navy hover:bg-smiu-navy hover:text-white">
                                            <User className="mr-2 h-4 w-4" />
                                            Login
                                        </Button>
                                    </motion.div>
                                </Link>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="md:hidden p-2 rounded-lg hover:bg-secondary"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-smiu-navy" />
                        ) : (
                            <Menu className="h-6 w-6 text-smiu-navy" />
                        )}
                    </motion.button>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-3">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 bg-secondary border-none focus-visible:ring-smiu-navy"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-border"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <Link href="/report" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full bg-smiu-navy hover:bg-smiu-navy/90 text-white gap-2">
                                    <Plus className="h-4 w-4" />
                                    Report Item
                                </Button>
                            </Link>

                            {/* Mobile Auth Section */}
                            {!isPending && (
                                session ? (
                                    // Logged In User
                                    <>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                                            <Avatar className="h-10 w-10 border-2 border-smiu-gold">
                                                <AvatarImage src={session.user.image || undefined} />
                                                <AvatarFallback className="bg-smiu-navy text-white">
                                                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-medium text-smiu-navy text-sm">{session.user.name}</p>
                                                <p className="text-xs text-slate-500">{session.user.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    // Guest User
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-smiu-navy text-smiu-navy hover:bg-smiu-navy hover:text-white">
                                            <User className="mr-2 h-4 w-4" />
                                            Login
                                        </Button>
                                    </Link>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
