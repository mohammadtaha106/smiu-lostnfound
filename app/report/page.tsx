"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ImageUpload } from "@/components/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories, locations } from "@/lib/data";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
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

export default function ReportPage() {
    const [activeTab, setActiveTab] = useState<"lost" | "found">("lost");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-secondary/30">
                <Navbar />
                <main className="pt-24 pb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-lg mx-auto text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-emerald-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-smiu-navy mb-2">
                            Report Submitted!
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Thank you for helping the SMIU community. Your{" "}
                            {activeTab === "lost" ? "lost item report" : "found item"} has been
                            submitted successfully.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Home
                                </Button>
                            </Link>
                            <Button
                                onClick={() => setSubmitted(false)}
                                className="bg-smiu-navy hover:bg-smiu-navy/90 text-white"
                            >
                                Report Another Item
                            </Button>
                        </div>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/30">
            <Navbar />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6"
                    >
                        <Link href="/">
                            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-smiu-navy">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="bg-white shadow-lg border-0">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl font-bold text-smiu-navy">
                                    Report an Item
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Help the SMIU community by reporting a lost or found item.
                                </p>
                            </CardHeader>

                            <CardContent>
                                <Tabs
                                    value={activeTab}
                                    onValueChange={(v) => setActiveTab(v as "lost" | "found")}
                                >
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger
                                            value="lost"
                                            className="data-[state=active]:bg-smiu-burgundy data-[state=active]:text-white"
                                        >
                                            I Lost Something
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="found"
                                            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                                        >
                                            I Found Something
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="lost">
                                        <ReportForm
                                            type="lost"
                                            onSubmit={handleSubmit}
                                            isSubmitting={isSubmitting}
                                        />
                                    </TabsContent>

                                    <TabsContent value="found">
                                        <ReportForm
                                            type="found"
                                            onSubmit={handleSubmit}
                                            isSubmitting={isSubmitting}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

interface ReportFormProps {
    type: "lost" | "found";
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
}

function ReportForm({ type, onSubmit, isSubmitting }: ReportFormProps) {
    const isLost = type === "lost";

    return (
        <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={onSubmit}
            className="space-y-6"
        >
            {/* Title */}
            <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="title" className="text-smiu-navy">
                    Item Title *
                </Label>
                <Input
                    id="title"
                    placeholder={isLost ? "e.g., Black Leather Wallet" : "e.g., Student ID Card"}
                    required
                    className="border-border focus-visible:ring-smiu-navy"
                />
            </motion.div>

            {/* Category & Location Row */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                <div className="space-y-2">
                    <Label className="text-smiu-navy">Category *</Label>
                    <Select required>
                        <SelectTrigger className="border-border focus:ring-smiu-navy">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    <span className="mr-2">{cat.icon}</span>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-smiu-navy">Location *</Label>
                    <Select required>
                        <SelectTrigger className="border-border focus:ring-smiu-navy">
                            <SelectValue placeholder="Where was it?" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((loc) => (
                                <SelectItem key={loc.id} value={loc.id}>
                                    {loc.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            {/* Date & Time */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                <div className="space-y-2">
                    <Label htmlFor="date" className="text-smiu-navy">
                        Date *
                    </Label>
                    <Input
                        id="date"
                        type="date"
                        required
                        className="border-border focus-visible:ring-smiu-navy"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="time" className="text-smiu-navy">
                        Approximate Time
                    </Label>
                    <Input
                        id="time"
                        type="time"
                        className="border-border focus-visible:ring-smiu-navy"
                    />
                </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="description" className="text-smiu-navy">
                    Description *
                </Label>
                <Textarea
                    id="description"
                    placeholder={
                        isLost
                            ? "Describe your lost item in detail (color, brand, distinguishing features)..."
                            : "Describe what you found in detail (color, brand, distinguishing features)..."
                    }
                    required
                    rows={4}
                    className="border-border focus-visible:ring-smiu-navy resize-none"
                />
            </motion.div>

            {/* Image Upload */}
            <motion.div variants={itemVariants}>
                <ImageUpload />
            </motion.div>

            {/* Contact Email */}
            <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="text-smiu-navy">
                    Contact Email *
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="your.email@smiu.edu.pk"
                    required
                    className="border-border focus-visible:ring-smiu-navy"
                />
                <p className="text-xs text-muted-foreground">
                    We&apos;ll use this to notify you when someone responds.
                </p>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full ${isLost
                            ? "bg-smiu-burgundy hover:bg-smiu-burgundy/90"
                            : "bg-emerald-600 hover:bg-emerald-600/90"
                            } text-white py-6 text-lg`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-5 w-5" />
                                {isLost ? "Report Lost Item" : "Report Found Item"}
                            </>
                        )}
                    </Button>
                </motion.div>
            </motion.div>
        </motion.form>
    );
}
