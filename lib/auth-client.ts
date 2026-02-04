import { createAuthClient } from "better-auth/react";

// Production me Better Auth __Secure- prefix add karta hai
// Client ko bhi wohi cookies find karni hain
const cookiePrefix = process.env.NODE_ENV === "production"
    ? "__Secure-better-auth"
    : "better-auth";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    // ✅ Production me __Secure- prefix use karo
    cookiePrefix: cookiePrefix,
});
