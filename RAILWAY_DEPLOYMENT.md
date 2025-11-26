# Railway Deployment - Email Service Setup

## ✅ Code Pushed to GitHub

All changes have been committed and pushed to GitHub. Railway will automatically deploy the new version.

---

## 🔧 **IMPORTANT: Add Environment Variable to Railway**

Railway needs the Resend API key to send emails. Here's how to add it:

### **Step 1: Go to Railway Dashboard**
1. Open: https://railway.app
2. Select your **StreamVault** project
3. Click on your **service/deployment**

### **Step 2: Add Environment Variable**
1. Click: **"Variables"** tab
2. Click: **"New Variable"** or **"+ Add Variable"**
3. Add:
   ```
   Name: RESEND_API_KEY
   Value: re_CyexRH3b_BTbT8bzMA6mNrYPP31xwQma1
   ```
4. Click: **"Add"** or **"Save"**

### **Step 3: Redeploy (if needed)**
Railway should automatically redeploy after adding the variable. If not:
1. Click: **"Deployments"** tab
2. Click: **"Deploy"** or **"Redeploy"**

---

## 📧 **What This Enables**

Once deployed with the RESEND_API_KEY:

✅ **Content Request Emails** - Sent when users request new shows/movies
✅ **Issue Report Emails** - Sent when users report problems
✅ **Admin Panel** - View all requests and reports at `/admin`
✅ **Email Notifications** - Sent to yawaraquil121@gmail.com (until domain is verified)

---

## 🌐 **After Domain Verification**

Once the SPF/MX records are verified in Resend:

1. Update `server/email-service.ts` line 8:
   ```typescript
   const DOMAIN_FULLY_VERIFIED = true;
   ```
2. Commit and push to GitHub
3. Railway will auto-deploy
4. Emails will then be sent to: contact@streamvault.live
5. From: noreply@streamvault.live

---

## 🔍 **Check Deployment Status**

1. Go to Railway dashboard
2. Click: **"Deployments"** tab
3. Wait for status: **"Success"** (green checkmark)
4. Click: **"View Logs"** to see:
   ```
   ✅ Email notifications enabled (Resend)
   ```

---

## 🧪 **Test After Deployment**

Visit your live site and test:
1. **Request Content Form** - Submit a request
2. **Report Issue Form** - Submit a report
3. **Admin Panel** - Login at https://streamvault.live/admin
   - Username: admin
   - Password: streamvault2024
4. **Check Email** - yawaraquil121@gmail.com should receive notifications

---

## 📝 **Current Status**

- ✅ Code pushed to GitHub
- ⏳ Railway deploying...
- ⚠️ Need to add RESEND_API_KEY to Railway
- ⏳ Waiting for DNS records to verify

---

## 🆘 **If Emails Don't Work**

Check Railway logs for:
- `✅ Email notifications enabled (Resend)` - Good!
- `📧 Email notifications: Console only` - RESEND_API_KEY not set

If you see the second message, the environment variable wasn't added correctly.
