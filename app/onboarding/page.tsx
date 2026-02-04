"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, UserCircle, Phone, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);
    const [formData, setFormData] = useState({
        rollNumber: "",
        phone: "",
    });
    const [errors, setErrors] = useState({
        rollNumber: "",
        phone: "",
    });

    // Check if user has already completed onboarding
    useEffect(() => {
        const checkProfile = async () => {
            if (!session?.user) {
                if (!isPending) {
                    router.push("/login");
                }
                return;
            }

            try {
                // Fetch fresh user data from database
                const response = await fetch("/api/user/check-profile");
                const result = await response.json();

                if (result.success && result.hasCompletedOnboarding) {
                    // User already has roll number, redirect to home
                    router.push("/");
                } else {
                    // User needs to complete onboarding
                    setIsCheckingProfile(false);
                }
            } catch (error) {
                console.error("Error checking profile:", error);
                setIsCheckingProfile(false);
            }
        };

        checkProfile();
    }, [session, isPending, router]);

    const validateForm = () => {
        const newErrors = { rollNumber: "", phone: "" };
        let isValid = true;

        // Roll Number validation
        if (!formData.rollNumber.trim()) {
            newErrors.rollNumber = "Roll number is required";
            isValid = false;
        } else if (formData.rollNumber.length < 5) {
            newErrors.rollNumber = "Roll number must be at least 5 characters";
            isValid = false;
        }

        // Phone validation (optional but if provided, must be valid)
        if (formData.phone && !/^(\+92|0)?[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number (e.g., 03001234567)";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Call API to update user profile
            const response = await fetch("/api/user/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rollNumber: formData.rollNumber,
                    phone: formData.phone || undefined,
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Redirect to home after successful update
                router.push("/");
            } else {
                alert("Error: " + (result.error || "Failed to update profile"));
            }
        } catch (error) {
            console.error("Profile update error:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending || isCheckingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-smiu-navy" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="text-center space-y-4 pb-6">
                        <div className="w-20 h-20 bg-smiu-navy/10 rounded-full flex items-center justify-center mx-auto">
                            <UserCircle className="h-10 w-10 text-smiu-navy" />
                        </div>

                        <div>
                            <CardTitle className="text-2xl font-bold text-smiu-navy">
                                Complete Your Profile
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Welcome, {session.user.name}! Please provide your details to continue.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Roll Number Field */}
                            <div className="space-y-2">
                                <Label htmlFor="rollNumber" className="text-smiu-navy font-semibold">
                                    Roll Number / CMS ID *
                                </Label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="rollNumber"
                                        type="text"
                                        value={formData.rollNumber}
                                        onChange={(e) => {
                                            setFormData({ ...formData, rollNumber: e.target.value });
                                            setErrors({ ...errors, rollNumber: "" });
                                        }}
                                        placeholder="e.g., CSC-2024-123"
                                        className={`pl-10 ${errors.rollNumber ? "border-red-500" : ""}`}
                                    />
                                </div>
                                {errors.rollNumber && (
                                    <p className="text-red-500 text-xs">{errors.rollNumber}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    🎓 This helps us match found ID cards with your account
                                </p>
                            </div>

                            {/* Phone Number Field */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-smiu-navy font-semibold">
                                    Contact Number (Optional)
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData({ ...formData, phone: e.target.value });
                                            setErrors({ ...errors, phone: "" });
                                        }}
                                        placeholder="03001234567"
                                        className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-red-500 text-xs">{errors.phone}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    📞 For direct contact when items are found
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-smiu-navy hover:bg-smiu-navy/90 text-white font-semibold text-base"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Complete Setup"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        Your information is secure and will only be used for the Lost & Found system
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
