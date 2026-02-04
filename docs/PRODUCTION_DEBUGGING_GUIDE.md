# 🔍 Production Debugging - Comprehensive Logs Added

## 📝 Overview
Detailed logging has been added throughout the application to track session validation and redirect behavior in production.

---

## 🎯 Where Logs Are Added

### 1. **Login Page** (`/app/login/page.tsx`)
```
🔐 [Login] Starting Google OAuth...
🌐 [Login] Environment: {...}
✅ [Login] Google OAuth initiated
❌ [Login] OAuth error: {...}
```

**What to check**:
- Does OAuth initiate successfully?
- Any errors during OAuth call?

---

### 2. **Onboarding Page** (`/app/onboarding/page.tsx`)
```
🔍 [Onboarding] Starting profile check...
📊 [Onboarding] Session: {...}
🔄 [Onboarding] isPending: true/false
✅ [Onboarding] Session found
🌐 [Onboarding] Fetching /api/user/check-profile...
📦 [Onboarding] API Response: {...}
✅ [Onboarding] User has completed onboarding, redirecting to /
⚠️ [Onboarding] User needs to complete onboarding
❌ [Onboarding] No session found, redirecting to /login
```

**What to check**:
- Does session exist when landing on onboarding?
- What does `/api/user/check-profile` return?
- Is redirect happening?

---

### 3. **Dashboard Page** (`/app/dashboard/page.tsx`)
```
🔐 [Dashboard] Session check...
📊 [Dashboard] Session: {...}
🔄 [Dashboard] isPending: true/false
✅ [Dashboard] Session valid, user: {...}
❌ [Dashboard] No session, redirecting to /login
📦 [Dashboard] Fetching user items...
🌐 [Dashboard] Calling /api/user/my-posts...
📦 [Dashboard] API Response: {...}
✅ [Dashboard] Items fetched: X items
❌ [Dashboard] Failed to fetch: {...}
```

**What to check**:
- Does dashboard receive session?
- Can it fetch user's posts?
- Any API errors?

---

### 4. **Check Profile API** (`/app/api/user/check-profile/route.ts`)
```
🔍 [API] /api/user/check-profile - Request received
📊 [API] Session check result: {...}
❌ [API] No session found - returning 401
🗄️ [API] Querying database for user: userId
📦 [API] User data from DB: {...}
✅ [API] Onboarding status: {...}
❌ [API] Profile check error: {...}
```

**What to check**:
- Does API receive session from headers?
- Does DB query return user data?
- Is `rollNumber` present in user data?

---

## 🧪 How to Debug Production Issue

### Step 1: Open Browser Console on Vercel

1. Visit: https://smiu-lostnfound.vercel.app
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Clear console (🗑️ icon)

---

### Step 2: Attempt Login Flow

1. Click **"Login"**
2. Watch console for logs:
   ```
   🔐 [Login] Starting Google OAuth...
   ```

3. Complete Google sign-in

4. Watch for redirect and check logs:
   ```
   🔍 [Onboarding] Starting profile check...
   📊 [Onboarding] Session: {...}
   ```

---

### Step 3: Analyze Logs

#### ❌ **Issue 1: Session Not Found on Onboarding**

**Logs show**:
```
🔍 [Onboarding] Starting profile check...
📊 [Onboarding] Session: null
❌ [Onboarding] No session found, redirecting to /login
```

**Cause**: Session not being created during OAuth callback

**Fix**:
- Check `BETTER_AUTH_URL` in Vercel env vars
- Verify Google OAuth redirect URI matches Vercel URL
- Check Better Auth `baseURL` configuration

---

#### ❌ **Issue 2: Profile Check Fails**

**Logs show**:
```
🌐 [Onboarding] Fetching /api/user/check-profile...
🔍 [API] /api/user/check-profile - Request received
❌ [API] No session found - returning 401
```

**Cause**: Session not being passed to API

**Fix**:
- Cookies not being set correctly
- CORS issue
- `SameSite` cookie attribute problem

---

#### ❌ **Issue 3: Stuck in Redirect Loop**

**Logs show**:
```
🔍 [Onboarding] Starting profile check...
✅ [Onboarding] Session found
🌐 [Onboarding] Fetching /api/user/check-profile...
📦 [Onboarding] API Response: { success: true, hasCompletedOnboarding: false }
⚠️ [Onboarding] User needs to complete onboarding
// But then redirects somewhere else
```

**Cause**: Redirect logic incorrect

**Fix**:
- Check if `callbackURL` is overriding onboarding flow
- Verify no middleware is blocking the route

---

#### ❌ **Issue 4: Dashboard Not Accessible**

**Logs show**:
```
🔐 [Dashboard] Session check...
📊 [Dashboard] Session: null
❌ [Dashboard] No session, redirecting to /login
```

**Cause**: Session lost between pages

**Fix**:
- Session cookie not persistent
- Cookie domain mismatch
- Session expiry issue

---

## 📊 Expected Flow (Correct Behavior)

### First Time Login:

1. **Click Login** →
   ```
   🔐 [Login] Starting Google OAuth...
   ✅ [Login] Google OAuth initiated
   ```

2. **Google Callback** → Redirects to `/onboarding`

3. **Onboarding Page** →
   ```
   🔍 [Onboarding] Starting profile check...
   📊 [Onboarding] Session: { user: {...} }
   ✅ [Onboarding] Session found
   🌐 [Onboarding] Fetching /api/user/check-profile...
   ```

4. **API Call** →
   ```
   🔍 [API] /api/user/check-profile - Request received
   📊 [API] Session check result: { hasSession: true, userId: "..." }
   🗄️ [API] Querying database for user: userId
   📦 [API] User data from DB: { rollNumber: null, phone: null }
   ✅ [API] Onboarding status: { hasCompletedOnboarding: false }
   ```

5. **Back to Onboarding** →
   ```
   📦 [Onboarding] API Response: { success: true, hasCompletedOnboarding: false }
   ⚠️ [Onboarding] User needs to complete onboarding
   // Shows onboarding form
   ```

6. **User Fills Form** → Submits

7. **After Submit** →
   ```
   ✅ [Onboarding] User has completed onboarding, redirecting to /
   ```

8. **Homepage** → User can now navigate to Dashboard

---

### Subsequent Logins (Already Onboarded):

1. **Login** → `/onboarding`

2. **Onboarding Check** →
   ```
   🔍 [API] /api/user/check-profile - Request received
   📦 [API] User data from DB: { rollNumber: "2021-CS-123", phone: "..." }
   ✅ [API] Onboarding status: { hasCompletedOnboarding: true }
   ```

3. **Redirect to Homepage** →
   ```
   ✅ [Onboarding] User has completed onboarding, redirecting to /
   ```

4. **Can Access Dashboard** →
   ```
   🔐 [Dashboard] Session check...
   ✅ [Dashboard] Session valid, user: {...}
   📦 [Dashboard] Fetching user items...
   ```

---

## 🔧 Common Issues & Log Patterns

### Issue: "Session Exists But API Returns 401"

**Logs**:
```
📊 [Onboarding] Session: { user: {...} }  ← Session exists in browser
🔍 [API] /api/user/check-profile - Request received
❌ [API] No session found - returning 401  ← But API can't find it!
```

**Cause**: Cookie not being sent with API request

**Possible Reasons**:
1. CORS issue
2. `SameSite=strict` cookie attribute
3. HTTPS/HTTP mismatch
4. Cookie domain mismatch

**Fix**:
Check Better Auth configuration for cookie settings:
```typescript
export const auth = betterAuth({
    // ...
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.BETTER_AUTH_URL],
});
```

---

### Issue: "Redirect Loop"

**Logs**:
```
🔍 [Onboarding] Starting profile check...
❌ [Onboarding] No session found, redirecting to /login
// Redirects to /login

🔐 [Login] Starting Google OAuth...
// After OAuth callback, back to /onboarding

🔍 [Onboarding] Starting profile check...
❌ [Onboarding] No session found, redirecting to /login
// Loop continues...
```

**Cause**: Session not being created after OAuth

**Fix**:
1. Check `BETTER_AUTH_URL` matches Vercel URL
2. Verify Google OAuth redirect URI
3. Check if cookies are being set

---

### Issue: "Session Lost Between Pages"

**Logs**:
```
// On /onboarding
📊 [Onboarding] Session: { user: {...} }  ← Has session

// Navigate to /dashboard
🔐 [Dashboard] Session check...
📊 [Dashboard] Session: null  ← Session lost!
```

**Cause**: Cookie not persisting

**Fix**:
1. Check session cookie settings
2. Verify cookie `maxAge` is set
3. Check if cookie domain is correct

---

## 📝 How to Share Logs for Help

If you need help debugging, capture these logs:

1. **Open Console** (F12)
2. **Clear Console**
3. **Perform full login flow**
4. **Copy ALL console logs**
5. **Share in order**:
   - Login logs
   - Onboarding logs
   - API logs
   - Dashboard logs (if you get there)

---

## 🎯 Quick Checklist

When analyzing production logs, check:

- [ ] Session exists after Google OAuth callback
- [ ] Session persists when navigating to `/onboarding`
- [ ] API `/api/user/check-profile` receives session
- [ ] Database returns user data
- [ ] `rollNumber` check works correctly
- [ ] Redirect logic executes properly
- [ ] Session persists to dashboard

---

## 🚀 Next Steps

1. **Deploy these changes** to Vercel
2. **Clear browser cache** (or use Incognito)
3. **Attempt login flow**
4. **Watch console logs**
5. **Share logs** if issue persists

---

**With these detailed logs, we can pinpoint exactly where the flow breaks! 🎯**
