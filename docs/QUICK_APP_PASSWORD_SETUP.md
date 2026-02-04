# ⚡ Quick Setup - Gmail App Password

## 🔑 Generate App Password (2 Minutes)

### Step-by-Step:

1. **Open**: https://myaccount.google.com/apppasswords
   
2. **Login** with: mohammadtaha19888@gmail.com

3. **If "2-Step Verification" not enabled**:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification" first
   - Then come back to App Passwords

4. **Create App Password**:
   - Select app: **Mail**
   - Select device: **Other**
   - Name it: `SMIU Lost & Found`
   - Click **Generate**

5. **Copy the 16-digit password**:
   Example: `abcd efgh ijkl mnop`
   
   Remove spaces: `abcdefghijklmnop`

6. **Update `.env` file**:
   ```env
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```

7. **Restart dev server**:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

---

## ✅ Done! Test karo:

1. Login karo app me
2. Onboarding complete karo
3. Email check karo! 📧

---

**Important**: App Password kabhi share mat karna! 🔒
