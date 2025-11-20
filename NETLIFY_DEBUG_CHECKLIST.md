# Netlify Deployment Debug Checklist

## Current Issues Detected:
1. ❌ **500 Internal Server Error** on `/api/ai/breakdown-goal`
2. ❌ **400 Bad Request** from Firestore real-time listeners

---

## Fix #1: OpenAI API Configuration

### Step 1: Verify OpenAI API Key in Netlify
1. Go to: **Netlify Dashboard** → **Your Site** → **Site settings** → **Environment variables**
2. Check that `OPENAI_API_KEY` exists and:
   - ✅ Starts with `sk-proj-` or `sk-`
   - ✅ Has no extra quotes or spaces
   - ✅ Is the correct key from OpenAI dashboard

### Step 2: Add/Update the Key
If missing or wrong:
```bash
Key: OPENAI_API_KEY
Value: sk-your-actual-key-here
```

### Step 3: Redeploy
After updating env vars, **you MUST redeploy**:
- Go to **Deploys** tab
- Click **Trigger deploy** → **Clear cache and deploy site**

---

## Fix #2: Firebase Configuration

### Step 1: Verify ALL Firebase Environment Variables in Netlify
Make sure these are set in Netlify (Site settings → Environment variables):

#### Client-Side (NEXT_PUBLIC_*):
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=taskflow-ai-24524.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=taskflow-ai-24524
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=taskflow-ai-24524.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### Server-Side:
```
FIREBASE_ADMIN_PROJECT_ID=taskflow-ai-24524
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@taskflow-ai-24524.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...your key...=\n-----END PRIVATE KEY-----\n"
```

**IMPORTANT for FIREBASE_ADMIN_PRIVATE_KEY:**
- Include the quotes `"`
- Keep all `\n` characters (don't replace with actual newlines)
- Should start with `"-----BEGIN PRIVATE KEY-----\n`
- Should end with `\n-----END PRIVATE KEY-----\n"`

### Step 2: Check Firestore Database Location
The 400 error might mean your Firestore database is in a different location:

1. Go to **Firebase Console** → **Firestore Database**
2. Check the database location (e.g., `us-central`, `europe-west`, etc.)
3. If it's not the default `(default)`, you may need to update the database reference

### Step 3: Verify Firestore Security Rules
Make sure your Firestore rules allow authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Fix #3: Check Netlify Function Logs

### How to View Real-Time Logs:
1. Go to **Netlify Dashboard** → **Your Site** → **Functions**
2. Click on the function (e.g., `api/ai/breakdown-goal`)
3. Click **View logs**
4. Try the "Generate AI Roadmap" button again
5. **Look for the log messages** with emojis:
   - ✅ Success indicators
   - ❌ Error indicators
   - 🔑 API key issues
   - ⏱️ Timeout issues

### Expected Success Log:
```
✅ Starting AI goal breakdown request...
Goal: Learn Python...
Model: gpt-4o-mini
API Key present: Yes (starts with sk-proj)
✅ AI response received, parsing...
```

### Common Error Logs:
```
❌ OPENAI_API_KEY is not configured or is placeholder
→ Fix: Set OPENAI_API_KEY in Netlify env vars

🔑 Invalid OpenAI API key
→ Fix: Check key is correct and active

⏱️ Request timed out
→ Fix: Try shorter goal description
```

---

## Fix #4: Network/CORS Issues

If you see CORS errors in browser console:
1. Check if `netlify.toml` has correct configuration
2. Verify the site is fully deployed (not in preview mode)
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## Quick Test Checklist

After deploying with fixes, test these:

### 1. Firebase Authentication
- [ ] Can you sign up with email/password?
- [ ] Can you log in?
- [ ] Does the dashboard load?

### 2. Firestore Real-Time Updates
- [ ] Open browser console (F12)
- [ ] Look for Firestore errors (should see none)
- [ ] Create a manual goal (without AI)
- [ ] Does it appear immediately?

### 3. OpenAI API
- [ ] Click "Generate AI Roadmap"
- [ ] Check Netlify Function logs (see above)
- [ ] Should see success in 5-10 seconds

---

## Still Having Issues?

### Get the Exact Error:
1. Open **Netlify Functions** logs (see Fix #3 above)
2. Copy the **FULL error message** including:
   - The emoji indicators (✅ ❌ 🔑 ⏱️)
   - Stack trace
   - Any API error codes
3. Share the logs so we can diagnose precisely

### Common Fixes:
- **After changing env vars**: Always trigger a new deploy
- **Firebase errors**: Double-check ALL 9 Firebase env vars are set
- **OpenAI errors**: Verify API key works at platform.openai.com
- **Build errors**: Check the build logs, not runtime logs

---

## Environment Variables Summary

You should have **10 total** environment variables in Netlify:

1. `OPENAI_API_KEY`
2. `NEXT_PUBLIC_FIREBASE_API_KEY`
3. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
4. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
5. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
6. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
7. `NEXT_PUBLIC_FIREBASE_APP_ID`
8. `FIREBASE_ADMIN_PROJECT_ID`
9. `FIREBASE_ADMIN_CLIENT_EMAIL`
10. `FIREBASE_ADMIN_PRIVATE_KEY`

**Next Step**: Go through this checklist and verify each item. The most likely issues are:
- Missing or incorrect `OPENAI_API_KEY`
- Missing or incorrectly formatted `FIREBASE_ADMIN_PRIVATE_KEY`
- Not redeploying after changing environment variables

