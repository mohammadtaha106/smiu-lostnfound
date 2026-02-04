# 🔧 307 Redirect Issue - Session Cookie Problem

## ❌ Problem
When accessing `/dashboard` on Vercel, getting **307 Temporary Redirect** to `/login`.

**Vercel Logs Show**:
```
GET /dashboard → 307 → /login
```

---

## 🎯 Root Cause

Dashboard checks for session and redirects if not found:

```typescript
// app/dashboard/page.tsx
useEffect(() => {
    if (!isPending && !session) {
        router.push("/login"); // ← This causes 307 redirect
    }
}, [session, isPending, router]);
```

**Why session is null**:
- Session cookie not being set after Google OAuth
- Cookie not persisting from login → onboarding → dashboard

---

## ✅ Solution Steps

### Step 1: Update Better Auth Configuration

The issue is that Better Auth needs explicit configuration for production cookies.

**File**: `lib/auth.ts`

Update to:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "mongodb",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
    trustedOrigins: [
        process.env.BETTER_AUTH_URL || "http://localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ],
    // ✅ Add session configuration
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    // ✅ Add advanced configuration for production
    advanced: {
        generateId: () => {
            return crypto.randomUUID();
        },
        crossSubDomainCookies: {
            enabled: false,
        },
        useSecureCookies: process.env.NODE_ENV === "production",
    },
});
```

---

### Step 2: Verify Environment Variables on Vercel

Go to Vercel Dashboard → Settings → Environment Variables

**CRITICAL - These MUST match your actual Vercel URL**:

```bash
BETTER_AUTH_URL=https://smiu-lostnfound.vercel.app
NEXT_PUBLIC_APP_URL=https://smiu-lostnfound.vercel.app
```

**NOT**:
```bash
❌ BETTER_AUTH_URL=http://localhost:3000
❌ NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Step 3: Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Click your OAuth Client ID
4. Under **Authorized redirect URIs**, make sure you have:

```
https://smiu-lostnfound.vercel.app/api/auth/callback/google
```

**Not just**:
```
http://localhost:3000/api/auth/callback/google
```

**Both should be there**!

---

### Step 4: Check MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your cluster
3. Go to **Network Access**
4. Make sure you have:

```
0.0.0.0/0  (Allow access from anywhere)
```

Or add Vercel's IP ranges (harder to maintain).

---

### Step 5: Add Better Auth Secret

In Vercel Environment Variables, make sure:

```bash
BETTER_AUTH_SECRET=better_secret_change_this_in_production_123456
```

**Important**: Use a strong random string in production!

Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔍 Debugging with Console Logs

Your logs should show:

### ✅ Working Flow:
```
🔐 [Login] Starting Google OAuth...
// After OAuth callback
🔍 [Onboarding] Session: { user: { id: "...", email: "..." } } ✅
🌐 [Onboarding] Fetching /api/user/check-profile...
🔍 [API] Session check result: { hasSession: true } ✅
```

### ❌ Broken Flow (Current Issue):
```
🔐 [Login] Starting Google OAuth...
// After OAuth callback
🔍 [Onboarding] Session: null ❌
❌ [Onboarding] No session found, redirecting to /login
// 307 Redirect loop
```

---

## 🧪 Testing Steps

After making changes:

1. **Commit and push**:
   ```bash
   git add .
   git commit -m "Fix session cookie configuration"
   git push origin main
   ```

2. **Wait for Vercel deployment** (2-3 min)

3. **Clear ALL browser data** for your site:
   - Chrome: F12 → Application → Clear Storage → Clear site data
   - Or use Incognito window

4. **Test login flow**:
   - Go to https://smiu-lostnfound.vercel.app
   - Open Console (F12)
   - Click Login
   - Complete Google OAuth
   - **Watch console logs**

5. **Expected behavior**:
   ```
   Login → OAuth → Onboarding (with session) → 
   Fill form → Submit → Homepage → Dashboard ✅
   ```

---

## 🔧 Alternative Fix: Add Session Debug Endpoint

Create a test endpoint to check session:

**File**: `app/api/debug/session/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        return NextResponse.json({
            success: true,
            hasSession: !!session,
            session: session ? {
                userId: session.user.id,
                email: session.user.email,
                expiresAt: session.session.expiresAt,
            } : null,
            cookies: req.cookies.getAll(),
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error),
        });
    }
}
```

Then test:
```
https://smiu-lostnfound.vercel.app/api/debug/session
```

This will show if cookies are being sent and if session is valid.

---

## 📊 Common Cookie Issues

### Issue 1: SameSite Attribute

**Problem**: Browser blocks cookies due to `SameSite=Strict`

**Fix**: Better Auth should handle this automatically, but you can verify:

```typescript
// In auth.ts, add:
advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
}
```

### Issue 2: Secure Flag

**Problem**: Cookies require `Secure` flag on HTTPS

**Fix**: Better Auth sets this automatically when `useSecureCookies: true`

### Issue 3: Domain Mismatch

**Problem**: Cookie domain doesn't match request domain

**Fix**: Ensure `baseURL` exactly matches your Vercel URL (with https://)

---

## 🎯 Quick Fix Checklist

Apply these in order:

- [ ] Update `lib/auth.ts` with session configuration
- [ ] Verify `BETTER_AUTH_URL` in Vercel is `https://smiu-lostnfound.vercel.app`
- [ ] Verify `NEXT_PUBLIC_APP_URL` in Vercel is `https://smiu-lostnfound.vercel.app`
- [ ] Add production Vercel URL to Google OAuth redirect URIs
- [ ] Generate strong `BETTER_AUTH_SECRET` for production
- [ ] Deploy changes to Vercel
- [ ] Clear browser cache / use Incognito
- [ ] Test login flow with console open
- [ ] Check `/api/debug/session` endpoint

---

## 🚨 If Still Not Working

Share these details:

1. **Vercel Logs**: Full request/response logs for `/dashboard`
2. **Console Logs**: All logs from browser console during login flow
3. **Network Tab**: 
   - F12 → Network
   - Filter: "Fetch/XHR"
   - Show request to `/api/auth/callback/google`
   - Check if `Set-Cookie` headers are present
4. **Session Debug**: Response from `/api/debug/session`

---

**Main issue is session cookie not being set after OAuth. The configuration updates should fix this! 🎯**
