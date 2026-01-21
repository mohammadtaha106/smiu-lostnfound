"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
    onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        onSearch?.(e.target.value);
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
                                onChange={handleSearch}
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
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Avatar className="h-9 w-9 border-2 border-smiu-gold cursor-pointer">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>
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
                            onChange={handleSearch}
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
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                                <Avatar className="h-10 w-10 border-2 border-smiu-gold">
                                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                                    <AvatarFallback>
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-smiu-navy">Guest User</p>
                                    <p className="text-sm text-muted-foreground">Sign in to report items</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
