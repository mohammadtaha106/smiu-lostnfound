# 🔐 Complete Login Flow Implementation Guide

## 📋 Overview
Is guide mein tumhe step-by-step sikhaya jayega kaise authentication implement karna hai Next.js mein.

---

## 🎯 What You'll Learn
1. Google OAuth setup using Better Auth
2. Session management
3. Protected routes
4. User data storage in database

---

## 📦 Step 1: Install Better Auth

```bash
npm install better-auth
```

**Kya hai Better Auth?**
- Modern authentication library for Next.js
- Built-in Google/GitHub OAuth support
- TypeScript support
- Prisma integration

---

## 🔧 Step 2: Server-Side Auth Setup

### Create `lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db"; // Your Prisma client

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "mongodb", // Ya "postgresql" agar PostgreSQL use kar rahe ho
  }),
  
  // Social providers configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  
  // Optional: Email/password bhi enable kar sakte ho
  emailAndPassword: {
    enabled: false, // Abhi sirf Google use kar rahe hain
  },
});
```

**Explanation:**
- `prismaAdapter` - Database ke saath connection
- `socialProviders` - OAuth providers (Google, GitHub, etc.)
- `emailAndPassword` - Manual email/password login (optional)

---

## 🌐 Step 3: API Route Setup

### Create `app/api/auth/[...all]/route.ts`

```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth automatically handles all auth routes:
// - /api/auth/signin/google
// - /api/auth/callback/google
// - /api/auth/signout
// - /api/auth/session

export const { GET, POST } = toNextJsHandler(auth);
```

**Ye kya karta hai?**
- `GET /api/auth/session` → Current user ka session return karta hai
- `POST /api/auth/signout` → User ko logout karta hai
- `GET /api/auth/signin/google` → Google login redirect karta hai
- `GET /api/auth/callback/google` → Google se wapis aane ke baad handle karta hai

---

## 💻 Step 4: Client-Side Auth Setup

### Create `lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Ye client tumhe provide karega:
// - authClient.useSession() - Current user data
// - authClient.signIn.social() - OAuth login
// - authClient.signOut() - Logout
```

---

## 🔑 Step 5: Google OAuth Credentials Setup

### A. Google Cloud Console mein jao
1. https://console.cloud.google.com
2. New Project banao ya existing select karo
3. **APIs & Services** → **Credentials** pe jao

### B. OAuth Consent Screen Configure karo
1. **OAuth consent screen** tab pe click karo
2. **External** select karo (ya Internal agar organization hai)
3. App details fill karo:
   - App name: "SMIU Lost & Found"
   - User support email: Your email
   - Developer contact: Same email

### C. OAuth 2.0 Client ID banao
1. **Credentials** tab pe jao
2. **Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: "Lost & Found Web"
5. **Authorized redirect URIs** add karo:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
6. **Create** pe click karo
7. Client ID aur Secret copy karo

### D. .env file mein add karo

```env
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret-here"
BETTER_AUTH_SECRET="generate-random-32-char-string"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Random Secret Generate karne ka tarika:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎨 Step 6: Login Page Implementation

### Update `app/login/page.tsx`

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    // Google OAuth login trigger karo
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", // Login ke baad kahaan redirect ho
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
    </div>
  );
}
```

**Flow kya hota hai?**
1. User button click karta hai
2. Google login page pe redirect hota hai
3. User apna Google account select karta hai
4. `/api/auth/callback/google` pe wapis aata hai
5. Better Auth session create karta hai
6. User homepage (`/`) pe redirect hota hai

---

## 🔐 Step 7: Session Management (Navbar)

### Update `components/Navbar.tsx`

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  
  // Current user ka session fetch karo
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <nav>
      {isPending ? (
        // Loading state
        <div>Loading...</div>
      ) : session ? (
        // Logged in user
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={session.user.image} />
            <AvatarFallback>
              {session.user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>{session.user.name}</span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        // Guest user
        <Button onClick={() => router.push("/login")}>
          Login
        </Button>
      )}
    </nav>
  );
}
```

**Session Object Structure:**
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    image: string; // Google profile picture
  }
}
```

---

## 🛡️ Step 8: Protected Routes (Server Actions)

### Example: Post Create karne se pehle auth check

```typescript
// app/actions/post.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createPost(formData: FormData) {
  // Session validate karo
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Please login first" };
  }

  // Ab post create karo with user ID
  const post = await db.post.create({
    data: {
      title: formData.get("title"),
      description: formData.get("description"),
      userId: session.user.id, // Current user ki ID
      // ... other fields
    },
  });

  return { success: true, data: post };
}
```

---

## 🎯 Step 9: Client-Side Protected Pages

### Example: My Posts page (client component)

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPostsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Agar logged in nahi hai to login pe redirect karo
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Redirect ho raha hai
  }

  return (
    <div>
      <h1>My Posts</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}
```

---

## 📊 Database Schema (Already done in your Prisma)

```prisma
model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
  posts    Post[]
}

model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  // ... more fields
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## ✅ Testing Checklist

### 1. Development Testing
```bash
npm run dev
```

1. ✅ `/login` page pe jao
2. ✅ "Continue with Google" click karo
3. ✅ Google account select karo
4. ✅ Homepage pe redirect ho
5. ✅ Navbar mein apna naam/avatar dikhe
6. ✅ Logout button click karo
7. ✅ Login button wapis dikhe

### 2. Database Check
```bash
# MongoDB Atlas mein jao ya local MongoDB
# Check karo:
# - User collection mein entry hai?
# - Session collection mein session hai?
# - Account collection mein Google account linked hai?
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Redirect URI Mismatch"
**Solution:** Google Console mein redirect URI exact match honi chahiye:
```
http://localhost:3000/api/auth/callback/google
```

### Issue 2: Session null aata hai
**Solution:** 
- Check `.env` variables properly set hain
- Server restart karo: `Ctrl+C` then `npm run dev`

### Issue 3: CORS Error
**Solution:** `BETTER_AUTH_URL` correct hai check karo

---

## 🚀 Production Deployment

### 1. Vercel/Netlify pe deploy karte waqt

```env
# Production .env
GOOGLE_CLIENT_ID="your-prod-client-id"
GOOGLE_CLIENT_SECRET="your-prod-secret"
BETTER_AUTH_SECRET="your-random-32-char-string"
BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 2. Google Console mein production redirect URI add karo
```
https://yourdomain.com/api/auth/callback/google
```

---

## 📚 Advanced Features (Optional)

### 1. Email/Password Login
```typescript
// lib/auth.ts
export const auth = betterAuth({
  // ...
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
});
```

### 2. Profile Update
```typescript
await authClient.user.update({
  name: "New Name",
  image: "new-image-url",
});
```

### 3. Session Refresh
```typescript
const { data: session } = await authClient.getSession();
```

---

## 🎓 Learning Resources

1. **Better Auth Docs:** https://www.better-auth.com/docs
2 **Google OAuth Guide:** https://developers.google.com/identity/protocols/oauth2
3. **Next.js Auth Patterns:** https://nextjs.org/docs/app/building-your-application/authentication

---

## 🤝 Need Help?

- Better Auth Discord: https://discord.gg/better-auth
- Stack Overflow tag: `better-auth`
- GitHub Issues: https://github.com/better-auth/better-auth

---

**Good luck! 🚀 Koi question ho to poocho!**
