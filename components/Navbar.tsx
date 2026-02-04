"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Plus, User, LogOut, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { data: session, isPending } = authClient.useSession();

    console.log(session);

    // ✅ Debounced Search - 500ms delay
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const currentQuery = searchParams.get("q") || "";

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
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
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
                    <div className="hidden md:flex items-center gap-3">
                        {/* Dashboard Button - Only for logged-in users */}
                        {session && (
                            <Link href="/dashboard">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="outline"
                                        className="border-smiu-navy text-smiu-navy hover:bg-smiu-navy hover:text-white gap-2"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </motion.div>
                            </Link>
                        )}

                        {/* Report Item Button */}
                        <Link href="/report">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button className="bg-smiu-gold hover:bg-smiu-gold/90 text-smiu-navy gap-2 font-semibold shadow-md">
                                    <Plus className="h-4 w-4" />
                                    Report Item
                                </Button>
                            </motion.div>
                        </Link>

                        {/* User Avatar or Login */}
                        {session ? (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-smiu-navy/10 hover:ring-smiu-navy/30 transition-all">
                                            <Avatar className="h-10 w-10">
                                                {session.user.image && <AvatarImage src={session.user.image} />}
                                                <AvatarFallback className="bg-smiu-navy text-white font-semibold">
                                                    {session.user.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64" align="end">
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex items-center gap-3 p-2">
                                                <Avatar className="h-12 w-12">
                                                    {session.user.image && <AvatarImage src={session.user.image} />}
                                                    <AvatarFallback className="bg-smiu-navy text-white font-semibold text-lg">
                                                        {session.user.name?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-semibold leading-none">
                                                        {session.user.name}
                                                    </p>
                                                    <p className="text-xs leading-none text-muted-foreground">
                                                        {session.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>My Dashboard</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push("/report")}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            <span>Report New Item</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={async () => {
                                                await authClient.signOut();
                                                router.push("/");
                                            }}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>


                        ) : (
                            <Link href="/login">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button variant="outline" className="border-smiu-navy text-smiu-navy hover:bg-smiu-navy hover:text-white gap-2">
                                        <User className="h-4 w-4" />
                                        Login
                                    </Button>
                                </motion.div>
                            </Link>
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
                            {session ? (
                                <>
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Avatar className="h-10 w-10">
                                            {session.user.image && <AvatarImage src={session.user.image} />}
                                            <AvatarFallback className="bg-smiu-navy text-white font-semibold">
                                                {session.user.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{session.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </div>

                                    {/* Dashboard Button */}
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <Button
                                            variant="outline"
                                            className="w-full border-smiu-navy text-smiu-navy hover:bg-smiu-navy hover:text-white gap-2"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            My Dashboard
                                        </Button>
                                    </Link>

                                    {/* Report Item Button */}
                                    <Link href="/report" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full bg-smiu-gold hover:bg-smiu-gold/90 text-smiu-navy gap-2 font-semibold">
                                            <Plus className="h-4 w-4" />
                                            Report Item
                                        </Button>
                                    </Link>

                                    {/* Logout Button */}
                                    <Button
                                        variant="outline"
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
                                        onClick={async () => {
                                            await authClient.signOut();
                                            setIsMenuOpen(false);
                                            router.push("/");
                                        }}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/report" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full bg-smiu-gold hover:bg-smiu-gold/90 text-smiu-navy gap-2 font-semibold">
                                            <Plus className="h-4 w-4" />
                                            Report Item
                                        </Button>
                                    </Link>

                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-smiu-navy text-smiu-navy hover:bg-smiu-navy hover:text-white gap-2">
                                            <User className="h-4 w-4" />
                                            Login
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
