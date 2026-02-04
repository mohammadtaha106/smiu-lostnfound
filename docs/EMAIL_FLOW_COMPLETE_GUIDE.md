# 📧 Complete Email Flow Explanation

## 🎯 Email System Overview

Tumhare app me **2 types** ke emails automatically send hote hain:

1. **Welcome Email** - Jab user onboarding complete kare
2. **ID Card Found Email** - Jab kisi ka ID card mila aur match ho gaya

---

## 📨 Flow 1: Welcome Email

### Step-by-Step Flow:

```
User Action                    Backend Process                  Email Sent
━━━━━━━━━━                    ━━━━━━━━━━━━━━━                  ━━━━━━━━━━

1. User login kare            →  Google OAuth
   (with Google)                  ↓
                                 Session create

2. Onboarding page pe          →  Form fill kare
   redirect                        ↓
                                  Roll Number enter
                                  Phone (optional)

3. "Complete" button           →  POST /api/user/update-profile
   click kare                      ↓
                                  Validate data
                                  ↓
                                  Database update
                                  ↓
                                  ✅ sendEmail() call
                                  ↓
                               Gmail SMTP
                                  ↓
                               📧 Email delivered!
```

### Code Flow (Welcome Email):

**File: `app/api/user/update-profile/route.ts`**

```typescript
// Step 1: User ka data update karo database me
await db.user.update({
    where: { id: session.user.id },
    data: {
        rollNumber: rollNumber.trim(),
        phone: phone?.trim() || null,
    }
});

// Step 2: Welcome email bhejo (line 58-62)
sendEmail({
    to: session.user.email,              // ← User ka email
    subject: "Welcome to SMIU Lost & Found! 🎓",
    html: emailTemplates.welcomeEmail(
        session.user.name,                // ← User ka name
        rollNumber.trim()                 // ← User ka roll number
    ),
}).catch(err => console.error("Failed to send welcome email:", err));
```

### Real Example:

**User**: Ali Ahmed
**Email**: ali@gmail.com
**Roll Number**: CSC-2024-123

**Email Sent**:
- **From**: SMIU Lost & Found <mohammadtaha19888@gmail.com>
- **To**: ali@gmail.com
- **Subject**: Welcome to SMIU Lost & Found! 🎓
- **Content**: HTML template with Ali's name and roll number

---

## 🎉 Flow 2: ID Card Found Email

### Complete Flow Diagram:

```
Finder (Sara)                  System Process                   Owner (Ali)
━━━━━━━━━━━━                  ━━━━━━━━━━━━━━                   ━━━━━━━━━━

1. Found ID card              →  Form open kare
   library me                     (Report Found Item)
                                  ↓
2. Form fill kare:            →  Data enter:
   • Type: FOUND                  • Category: ID Cards
   • Location: Library            • Roll Number: CSC-2024-123
   • Upload photo                 • Student Name: Ali Ahmed
   
3. Submit button              →  POST to createPost()
   click kare                     ↓
                              Save to database
                                  ↓
                              Check conditions:
                              ✓ Type = FOUND?
                              ✓ Category = id-cards?
                              ✓ Roll Number exists?
                                  ↓
                              Search database:
                              WHERE rollNumber = "CSC-2024-123"
                                  ↓
                              Owner found! ✅
                              (Ali's record in database)
                                  ↓
                              sendEmail() call
                                  ↓
                              Gmail SMTP
                                  ↓
                                                              → 📧 Email received!
                                                                 "Your ID card found!"
```

### Code Flow (ID Card Found):

**File: `actions/post.actions.ts`** (Lines 88-123)

```typescript
// Step 1: Post save karo database me
const newPost = await db.post.create({
    data: {
        ...validated.data,
        status: "OPEN",
        userId: session?.user.id,
    }
});

// Step 2: Check karo - is it a FOUND ID card?
if (
    validated.data.type === "FOUND" &&                    // ← FOUND item?
    (validated.data.category === "id-cards" ||            // ← ID card or document?
     validated.data.category === "documents") &&
    validated.data.rollNumber                             // ← Roll number entered?
) {
    console.log("🔍 Checking if owner is registered...");

    // Step 3: Database me owner ko search karo
    const owner = await db.user.findFirst({
        where: {
            rollNumber: validated.data.rollNumber.trim(), // ← Match by roll number
        }
    });

    // Step 4: Agar owner mila, email bhejo!
    if (owner) {
        console.log("✅ Owner found! Sending email notification...");

        // Import email functions
        const { sendEmail, emailTemplates } = await import("@/lib/email");
        
        // Email send karo
        sendEmail({
            to: owner.email,                              // ← Owner ka email
            subject: "🎉 Your ID Card Has Been Found!",
            html: emailTemplates.idCardFound(
                owner.name,                               // ← Owner ka name
                validated.data.rollNumber,                // ← Roll number
                validated.data.location,                  // ← Kaha mila
                validated.data.email || session.user.email // ← Finder ka email
            ),
        });

        console.log("📧 Email notification sent to:", owner.email);
    } else {
        console.log("ℹ️ No registered user found with this roll number");
    }
}
```

### Real Example:

**Scenario**:
- **Owner**: Ali Ahmed (already registered with roll: CSC-2024-123)
- **Finder**: Sara Khan (found Ali's ID card in library)

**Step 1**: Sara reports FOUND ID card
```javascript
{
    type: "FOUND",
    category: "id-cards",
    location: "Main Library, 2nd Floor",
    rollNumber: "CSC-2024-123",    // ← Ali's roll number
    studentName: "Ali Ahmed",
    email: "sara@gmail.com"         // ← Sara's contact
}
```

**Step 2**: System database me search kare
```sql
SELECT * FROM users WHERE rollNumber = "CSC-2024-123"
```

**Step 3**: Ali ka record mila!
```javascript
{
    id: "user_123",
    name: "Ali Ahmed",
    email: "ali@gmail.com",
    rollNumber: "CSC-2024-123"
}
```

**Step 4**: Ali ko email jayega
- **From**: SMIU Lost & Found <mohammadtaha19888@gmail.com>
- **To**: ali@gmail.com
- **Subject**: 🎉 Your ID Card Has Been Found!
- **Content**:
  ```
  Dear Ali Ahmed,
  
  Great news! Someone has found your ID card.
  
  📍 Details:
  Roll Number: CSC-2024-123
  Found At: Main Library, 2nd Floor
  Reported By: sara@gmail.com
  
  Contact the finder to collect your ID card!
  ```

---

## 🔧 Technical Email Sending Process

### File: `lib/email.ts`

```typescript
// Step 1: Nodemailer transporter configure hai
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,          // mohammadtaha19888@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD,  // App password
    },
});

// Step 2: sendEmail function
export async function sendEmail({ to, subject, html }: SendEmailParams) {
    try {
        // Gmail SMTP se email bhejo
        const info = await transporter.sendMail({
            from: `"SMIU Lost & Found" <${process.env.GMAIL_USER}>`,
            to: to,           // ← Recipient ka email
            subject: subject, // ← Email subject
            html: html,       // ← Beautiful HTML template
        });

        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
```

### Gmail SMTP Connection:

```
Your App (Next.js)
      ↓
  Nodemailer
      ↓
Gmail SMTP Server (smtp.gmail.com)
    • Port: 587 (TLS)
    • Authentication: App Password
      ↓
Email Delivered to Recipient
```

---

## 📋 All Possible Email Scenarios

### Scenario 1: New User Onboarding ✅
```
User registers → Fills roll number → Email sent → Welcome!
```

### Scenario 2: Someone Finds ID Card ✅
```
Finder reports FOUND →
Roll number enters →
Owner in database? →
✅ YES → Email to owner
❌ NO  → No email (owner not registered)
```

### Scenario 3: Found Item (Not ID Card)
```
Finder reports FOUND →
Category: Books/Phone/etc →
❌ No automatic email
(Only ID cards/documents trigger emails)
```

---

## 🎨 Email Template Structure

### Template Location: `lib/email.ts` (Lines 34-172)

All templates have:
- **Beautiful HTML** with inline CSS
- **SMIU branding** (blue & amber colors)
- **Responsive design**
- **Call-to-action buttons**
- **Professional styling**

---

## 🔍 How to Track Emails

### Console Logs to Check:

**When email is triggered**:
```
🔍 Checking if owner is registered...
✅ Owner found! Sending email notification...
📧 Email notification sent to: ali@gmail.com
✅ Email sent successfully: <message-id>
```

**When email fails**:
```
❌ Email error: [error details]
❌ Failed to send ID card notification: [error]
```

**When owner not found**:
```
ℹ️ No registered user found with this roll number
```

---

## 🚀 Email Delivery Process

### Complete Journey:

```
1. User Action
   └─> Form Submit

2. Backend Processing
   └─> Data validation
   └─> Database save
   └─> Check conditions

3. Email Trigger
   └─> sendEmail() called
   └─> Email template populated with data

4. Nodemailer
   └─> Connects to Gmail SMTP
   └─> Authenticates with App Password

5. Gmail Server
   └─> Validates sender
   └─> Processes email
   └─> Delivers to recipient

6. Recipient
   └─> Email appears in inbox
   └─> Can read and reply
```

**Time**: Usually 1-5 seconds from trigger to delivery! ⚡

---

## 🎯 Current Configuration

### Environment Variables (`.env`):
```env
GMAIL_USER=mohammadtaha19888@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
```

### All Emails Sent From:
**Name**: SMIU Lost & Found  
**Email**: mohammadtaha19888@gmail.com

### Daily Limit:
**500 emails/day** (Gmail free tier)

---

## ✅ Summary

**2 Automatic Email Triggers**:

1. **Onboarding Complete** → Welcome Email
2. **Found ID Card** (with roll number match) → Owner Notification

**Email Sent Via**:
- Nodemailer
- Gmail SMTP
- From: mohammadtaha19888@gmail.com

**Requirements**:
- ✅ Gmail App Password set in `.env`
- ✅ Owner must be registered in database (for ID card emails)
- ✅ Roll number must match exactly

---

**Poori flow samajh me aa gayi? Koi specific part detail me chahiye? 😊**
