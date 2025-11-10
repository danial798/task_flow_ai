# 🚀 Quick Setup Guide - 5 Minutes

## Option 1: Interactive Setup Script (Recommended)

Just run this command and follow the prompts:

```bash
node setup-credentials.js
```

The script will ask you for:
1. OpenAI API key
2. Firebase web config (6 values)
3. Firebase service account details

Then it will automatically create your `.env.local` file!

---

## Option 2: Manual Copy-Paste

### Get OpenAI Key:
1. Go to: https://platform.openai.com/api-keys
2. Create new key
3. Copy it

### Get Firebase Config:
1. Go to: https://console.firebase.google.com/
2. Create project → "taskflow-ai"
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Project Settings → Web app → Copy config
6. Service accounts → Generate private key

### Create .env.local:
Create a file named `.env.local` and paste your values.

---

## After Setup:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules

# Start app
npm run dev
```

Visit: http://localhost:3000

Done! 🎉

