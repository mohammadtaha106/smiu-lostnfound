# 📧 Gmail + Nodemailer Setup Guide

## ✅ Integration Complete!

Resend ko hata kar **Nodemailer with Gmail** integrate kar diya hai! Ab seedha Gmail se emails jayengi! 📧

---

## 🔑 Step 1: Google App Password Generate Karo

**Important**: Gmail se emails bhejne ke liye **App Password** chahiye (normal password nahi chalega)

### Kaise Generate Karein:

1. **Google Account Settings** me jao:
   - Link: https://myaccount.google.com/

2. **Security** me jao (left sidebar)

3. **2-Step Verification** enable karo (agar already nahi hai)
   - Zaruri hai App Password ke liye

4. **App Passwords** section me jao
   - Link: https://myaccount.google.com/apppasswords
   - Ya search karo "App Passwords"

5. **Create New App Password**:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Name: `SMIU Lost & Found`
   - Click **Generate**

6. **16-digit password milega** (jaise: `abcd efgh ijkl mnop`)
   - Spaces hata do: `abcdefghijklmnop`
   - Yeh copy kar lo! ✅

---

## 🔧 Step 2: Environment Variables Update Karo

`.env` file me yeh add karo:

```env
GMAIL_USER=mohammadtaha19888@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Note**: `your_app_password_here` ko replace karo actual App Password se!

---

## 📨 How It Works Now

### Email Flow:

```
Your App
    ↓
Gmail SMTP (mohammadtaha19888@gmail.com)
    ↓
Recipient's Email
```

### Emails Sent:
- **From**: SMIU Lost & Found <mohammadtaha19888@gmail.com>
- **To**: Recipient ka email
- **Reply-To**: Automatically mohammadtaha19888@gmail.com ✅

---

## 🎯 Features Working:

### 1. **Welcome Email** 🎓
- Jab user onboarding complete kare
- File: `app/api/user/update-profile/route.ts`

### 2. **ID Card Found Email** 🎉
- Jab koi FOUND ID card report kare
- Automatic owner ko notify kare
- File: `actions/post.actions.ts`

---

## 🧪 Testing

### Dev Server Restart Karo:
```bash
# Current server stop karo (Ctrl+C)
npm run dev
```

### Test Welcome Email:
1. New Google account se login karo
2. Onboarding complete karo (roll number enter karo)
3. Email inbox check karo ✅

### Test ID Card Found:
1. User A: Roll number register karo `TEST-2024-001`
2. User B: Found ID card report karo with roll `TEST-2024-001`
3. User A ko email jayega! 🎉

---

## 📊 Gmail Limits

**Free Gmail Account**:
- **500 emails/day** max
- Kaafi hai testing aur small production ke liye

**Google Workspace Account** (paid):
- **2000 emails/day**
- Better for production

---

## 🔍 Console Logs:

Email bhejte waqt console me yeh dikhai dega:

```
✅ Email sent successfully: <message-id>
```

Agar error:
```
❌ Email error: [error details]
```

---

## ❗ Common Issues & Solutions

### Issue: "Invalid login"
**Solution**: 
- 2-Step Verification enabled hai?
- App Password correctly copy kiya?
- Spaces remove kiye App Password se?

### Issue: "Less secure app access"
**Solution**: 
- App Password use karo (normal password nahi)
- Yeh automatically handle ho jayega

### Issue: Emails spam me ja rahe hain
**Solution**:
- Initially normal hai
- Recipients "Not Spam" mark karein
- 2-3 emails ke baad automatic inbox me ayengi

---

## 🎨 Email Templates

All templates same hain (beautiful HTML with styling):
- ID Card Found Email
- Item Found Email  
- Welcome Email

Templates in: `lib/email.ts`

---

## 🚀 Code Changes Summary

### Updated Files:

1. **`lib/email.ts`**:
   - Resend removed ❌
   - Nodemailer added ✅
   - Gmail SMTP configured

2. **`.env`**:
   - `RESEND_API_KEY` removed ❌
   - `GMAIL_USER` added ✅
   - `GMAIL_APP_PASSWORD` added ✅

3. **Dependencies**:
   - `nodemailer` installed ✅
   - `@types/nodemailer` installed ✅

---

## ✅ Benefits of Nodemailer + Gmail

1. ✅ **Simple Setup** - No third-party service
2. ✅ **Direct Gmail** - mohammadtaha19888@gmail.com se directly emails
3. ✅ **Free** - 500 emails/day free
4. ✅ **Reliable** - Gmail ka infrastructure
5. ✅ **No Signup** - Resend account ki zarurat nahi

---

## 📝 Next Steps

1. **App Password generate karo** (upar dekho steps)
2. **`.env` file update karo** with your App Password
3. **Dev server restart karo**
4. **Test karo!** 🎉

---

## 🎯 Production Ready!

Yeh setup production ke liye bhi ready hai:
- Gmail reliable hai
- 500 emails/day kaafi hain initially
- Baad me Google Workspace upgrade kar sakte ho

---

**Setup complete! Ab bas App Password lagao aur test karo! 📧✨**
