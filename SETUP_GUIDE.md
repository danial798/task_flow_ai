# TaskFlow AI - Complete Setup Guide

This guide will walk you through setting up TaskFlow AI from scratch.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- npm or yarn package manager
- A Firebase account
- An OpenAI API account

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `taskflow-ai` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. Enable **Google** provider (optional but recommended)
5. Add your authorized domains

### 1.3 Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click "Create database"
3. Choose **Production mode**
4. Select your preferred location
5. Click "Enable"

### 1.4 Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>) to add a web app
4. Register app name: "TaskFlow AI Web"
5. Copy the config object - you'll need this for `.env.local`

### 1.5 Generate Service Account Key

1. Go to **Project Settings → Service accounts**
2. Click "Generate new private key"
3. Save the JSON file securely
4. You'll extract values from this for `.env.local`

## Step 2: OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click "Create new secret key"
5. Copy the key (you won't see it again!)
6. Add billing information if not already done

## Step 3: Project Installation

### 3.1 Clone and Install

```bash
git clone <your-repo-url>
cd TaskFlow
npm install
```

### 3.2 Create Environment File

Create `.env.local` in the root directory:

```env
# OpenAI
OPENAI_API_KEY=sk-proj-...

# Firebase Client Config (from step 1.4)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=taskflow-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=taskflow-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=taskflow-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (from step 1.5 JSON file)
FIREBASE_ADMIN_PROJECT_ID=taskflow-ai
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@taskflow-ai.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** 
- Keep the quotes around `FIREBASE_ADMIN_PRIVATE_KEY`
- The private key should include `\n` characters

## Step 4: Firebase Configuration

### 4.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 4.2 Login to Firebase

```bash
firebase login
```

### 4.3 Initialize Firebase

```bash
firebase init
```

Select:
- Firestore
- Functions
- Hosting

Follow prompts:
- Select your existing project
- Use default Firestore rules file: `firestore.rules`
- Use default Firestore indexes file: `firestore.indexes.json`
- Functions language: **TypeScript**
- Use ESLint: **Yes**
- Install dependencies: **Yes**
- Public directory: `out`

### 4.4 Update Firebase Config

Edit `.firebaserc` to add your project ID:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 4.5 Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore
```

### 4.6 Build and Deploy Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

## Step 5: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Application

### 6.1 Create an Account

1. Click "Get Started" or "Sign Up"
2. Enter your email and password
3. Click "Create Account"
4. You should be redirected to the dashboard

### 6.2 Create Your First Goal

1. Click "New Goal"
2. Enter a goal like "Learn Spanish"
3. Add context (optional)
4. Click "Generate AI Roadmap"
5. Review the AI-generated plan
6. Click "Save & Start Goal"

### 6.3 Test AI Coach

1. Navigate to "AI Coach" from the sidebar
2. Ask a question like "How do I stay motivated?"
3. Verify you get an AI response

## Step 7: Production Deployment

### 7.1 Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables in Vercel dashboard.

### 7.2 Update Firebase Hosting (Optional)

```bash
npm run build
firebase deploy --only hosting
```

## Troubleshooting

### Error: "Firebase config not found"

- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set in `.env.local`
- Restart development server after adding env variables

### Error: "OpenAI API key not found"

- Verify `OPENAI_API_KEY` is set in `.env.local`
- Check that the key starts with `sk-`

### Error: "Permission denied" in Firestore

- Deploy Firestore rules: `firebase deploy --only firestore:rules`
- Check that you're logged in with the correct Firebase user

### Functions not working

- Ensure you've deployed functions: `firebase deploy --only functions`
- Check Firebase Functions logs: `firebase functions:log`

### Build errors

- Delete `node_modules` and `.next`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Next Steps

1. Customize the app for your needs
2. Add your branding and colors
3. Set up analytics
4. Configure error tracking (Sentry, etc.)
5. Set up CI/CD pipeline

## Support

If you encounter issues:
1. Check the main README.md
2. Search existing GitHub issues
3. Open a new issue with details

Happy building! 🚀

