# 🔄 Database Schema Update Required

## Changes Made:

### 1. **User Schema Updated** ✅
- Added `rollNumber` field (unique, optional) - for student identification
- Added `phone` field (optional) - for direct contact

### 2. **Post Schema Updated** ✅
- Added `phone` field (optional) - contact number for each post

### 3. **New Features Added** ✅
- **Onboarding Page** (`/onboarding`) - Collects roll number & phone after Google login
- **Profile Update API** (`/api/user/update-profile`) - Updates user profile
- **Phone Field in Report Form** - Users can now add contact number when reporting items

---

## 🚀 Next Steps (IMPORTANT):

### Step 1: Stop the Development Server
Press `Ctrl + C` in the terminal where `npm run dev` is running.

### Step 2: Update Prisma Client
Run the following command:
```bash
npx prisma generate
```

### Step 3: Push Schema to Database
```bash
npx prisma db push
```

### Step 4: Restart Development Server
```bash
npm run dev
```

---

## 🎯 How It Works Now:

### Login Flow:
1. User clicks "Sign in with Google"
2. After successful login → Redirects to `/onboarding`
3. User enters:
   - **Roll Number** (Required) - e.g., CSC-2024-123
   - **Phone Number** (Optional) - e.g., 03001234567
4. After completing onboarding → Redirects to home page

### Benefits:
- **ID Card Matching**: When someone finds an ID card and reports it, the system can automatically match the roll number with registered users and notify them via email
- **Direct Contact**: Users can provide phone numbers for faster communication
- **Better User Experience**: All contact info in one place

---

## 📝 Form Updates:

### Report Form Now Includes:
- Email (Required)
- **Phone Number (Optional)** ← NEW!
- Student Name (Optional - for documents/ID cards)
- Roll Number (Optional - for documents/ID cards)

---

## 🔍 Future Enhancement Ideas:

1. **Auto-Notification System**: When an ID card is found with a roll number that matches a registered user, automatically send them an email
2. **Phone Verification**: Add OTP verification for phone numbers
3. **Profile Page**: Let users update their roll number and phone later

---

## ⚠️ Important Notes:

- Roll numbers are **unique** - two users cannot have the same roll number
- Phone validation accepts Pakistani format: `03001234567` or `+923001234567`
- Existing users will need to complete onboarding when they next login
- All new fields are optional in the database to maintain backward compatibility

---

## 🐛 Troubleshooting:

If you see TypeScript errors about `rollNumber` or `phone`:
1. Make sure you've run `npx prisma generate`
2. Restart your IDE/editor
3. Clear Next.js cache: `rm -rf .next` (or delete `.next` folder manually)

---

**Created by:** Antigravity AI Assistant  
**Date:** 2026-02-03
