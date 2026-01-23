"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
};

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-smiu-navy via-smiu-navy to-smiu-navy/90 pt-24 pb-16 md:pt-32 md:pb-24">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-smiu-gold/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-smiu-gold/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-smiu-gold animate-pulse" />
                            Official SMIU Platform
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                    >
                        Reuniting Students
                        <br />
                        with their{" "}
                        <span className="text-smiu-gold">Belongings</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
                    >
                        A trusted platform for the Sindh Madressatul Islam University community
                        to report lost items and help reunite found belongings with their owners.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/report">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    size="lg"
                                    className="bg-smiu-gold hover:bg-smiu-gold/90 text-smiu-navy font-semibold px-8 py-6 text-lg gap-2"
                                >
                                    Report an Item
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        </Link>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 text-smiu-navy hover:bg-white/10 px-8 py-6 text-lg gap-2"
                                onClick={() => {
                                    document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                <Search className="h-5 w-5" />
                                Browse Items
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-smiu-gold" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Verified Community</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-smiu-gold" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>Secure & Private</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <svg className="w-5 h-5 text-smiu-gold" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            <span>SMIU Students Only</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Wave decoration at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path
                        d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                        className="fill-white"
                    />
                </svg>
            </div>
        </section>
    );
}
