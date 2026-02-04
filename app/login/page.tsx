"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // app/login/page.tsx
    const handleGoogleLogin = async () => {
        console.log("🔐 [Login] Starting Google OAuth...");
        console.log("🌐 [Login] Environment:", {
            authUrl: process.env.NEXT_PUBLIC_APP_URL,
        });

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/onboarding", // Redirect to onboarding after login
            });
            console.log("✅ [Login] Google OAuth initiated");
        } catch (error) {
            console.error("❌ [Login] OAuth error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">

            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-smiu-navy transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="text-center space-y-4 pb-8">
                        {/* Logo */}
                        <div className="flex justify-center mb-2">
                            <img
                                src="https://www.smiu.edu.pk/themes/smiu/images/13254460_710745915734761_8157428650049174152_n.png"
                                alt="SMIU Logo"
                                className="h-16 w-auto object-contain"
                            />
                        </div>

                        <div>
                            <CardTitle className="text-2xl font-bold text-smiu-navy">
                                Welcome to SMIU Lost & Found
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Sign in with your Google account to report or claim items
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Google Sign In Button */}
                        <Button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 font-semibold text-base shadow-sm"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <GoogleIcon className="mr-3 h-5 w-5" />
                                    Continue with Google
                                </>
                            )}
                        </Button>

                        {/* Info Text */}
                        <p className="text-xs text-center text-slate-500 pt-4">
                            By continuing, you agree to use your SMIU email address for authentication
                        </p>
                    </CardContent>
                </Card>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Need help? Contact{" "}
                        <a href="mailto:info@smiu.edu.pk" className="text-smiu-navy font-medium hover:underline">
                            info@smiu.edu.pk
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
