# 🚀 Deploy TaskFlow to Netlify

Complete guide to deploy your TaskFlow application to Netlify.

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Netlify account (free at [netlify.com](https://netlify.com))
- ✅ Firebase project configured
- ✅ OpenAI API key
- ✅ All environment variables ready

---

## 🎯 Step-by-Step Deployment

### **Step 1: Push to GitHub** (Already Done ✅)

Your code is already on GitHub at: `https://github.com/danial798/TaskFlow.git`

---

### **Step 2: Sign Up / Log In to Netlify**

1. Go to [netlify.com](https://netlify.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Sign up with GitHub"** (easiest option)
4. Authorize Netlify to access your GitHub account

---

### **Step 3: Import Your Project**

1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Search for your repository: **"TaskFlow"** or **"danial798/TaskFlow"**
4. Click on the repository to select it

---

### **Step 4: Configure Build Settings**

Netlify should auto-detect Next.js. Verify these settings:

```
Base directory: (leave empty)
Build command: npm run build
Publish directory: .next
```

**Important:** Click **"Show advanced"** and set:
- **Node version:** 18 or higher

---

### **Step 5: Add Environment Variables**

Click **"Add environment variables"** and add ALL of these:

#### **Firebase Client Variables (NEXT_PUBLIC_)**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### **Firebase Admin Variables (Server-side)**
```
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----
```

⚠️ **Important:** For `FIREBASE_ADMIN_PRIVATE_KEY`, paste the ENTIRE key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`, with `\n` for newlines.

#### **OpenAI Variable**
```
OPENAI_API_KEY=sk-proj-your_openai_api_key
```

---

### **Step 6: Deploy**

1. Click **"Deploy [your-site-name]"**
2. Wait 2-5 minutes for the build to complete
3. You'll get a URL like: `https://random-name-123.netlify.app`

---

### **Step 7: Configure Custom Domain (Optional)**

1. In Netlify dashboard, go to **"Site settings"** → **"Domain management"**
2. Click **"Add custom domain"**
3. Follow instructions to connect your domain

---

### **Step 8: Update Firebase Configuration**

Your app is now live! But you need to tell Firebase about the new domain:

#### **8.1: Add Authorized Domain in Firebase**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add your Netlify URL: `your-site-name.netlify.app`
6. Click **"Add"**

#### **8.2: Deploy Firestore Rules**

```bash
firebase deploy --only firestore:rules
```

#### **8.3: Deploy Firestore Indexes**

```bash
firebase deploy --only firestore:indexes
```

---

## 🎉 Success!

Your TaskFlow app should now be live at your Netlify URL!

Visit: `https://your-site-name.netlify.app`

---

## 🔧 Troubleshooting

### **Build Failed**

**Error:** `Module not found` or dependency errors
**Fix:** Make sure all dependencies are in `package.json` and committed to GitHub

**Error:** `Environment variable not found`
**Fix:** Double-check all environment variables are added in Netlify dashboard

### **Firebase Auth Not Working**

**Error:** `auth/unauthorized-domain`
**Fix:** Add your Netlify domain to Firebase authorized domains (Step 8.1)

### **API Routes Returning 500**

**Error:** API routes fail
**Fix:** Verify Firebase Admin credentials are correctly set in environment variables

### **OpenAI Features Not Working**

**Error:** AI breakdown fails
**Fix:** Verify `OPENAI_API_KEY` is set correctly in Netlify environment variables

---

## 📝 Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Sign up / Login works
- [ ] Can create goals
- [ ] AI breakdown works
- [ ] Tasks can be created and completed
- [ ] Real-time updates work
- [ ] Analytics dashboard loads
- [ ] AI Coach responds

---

## 🔄 Continuous Deployment

Netlify automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Your site will automatically rebuild and deploy!

---

## 📊 Monitoring

- **Build logs:** Netlify dashboard → "Deploys"
- **Function logs:** Netlify dashboard → "Functions" (if using Netlify Functions)
- **Analytics:** Netlify dashboard → "Analytics"

---

## 🆘 Need Help?

- [Netlify Documentation](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- Check your build logs in Netlify dashboard

---

**Happy Deploying! 🚀**

