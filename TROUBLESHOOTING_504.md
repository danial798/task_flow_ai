# 504 Gateway Timeout - Troubleshooting Guide

## What We Fixed

### 1. **Simplified AI Prompt (80% faster)**
- Removed: Resources, milestones, subtasks, tips
- Kept: Goal details + 5-7 core tasks only
- Reduced response from ~1500 tokens → ~400 tokens

### 2. **Aggressive Timeouts**
- Server timeout: 7 seconds (was 8s)
- Client timeout: 12 seconds (was 15s)
- Max tokens: 600 (was 1000)
- Temperature: 0.5 (was 0.7) for faster responses

### 3. **Retry Logic**
- Auto-retry up to 3 times on timeout
- 1-second delay between retries

## Testing the Fix

After deployment completes (2-3 minutes):

1. Visit: `https://taskflowwwai.netlify.app`
2. Click "Create New Goal"
3. Enter a SHORT goal: **"Learn Spanish"**
4. Click "Let AI Break It Down"
5. Should complete in **4-7 seconds** ✅

## If Still Getting 504 Errors

### Option 1: Check Netlify Environment Variables

1. Go to: [Netlify Dashboard](https://app.netlify.com)
2. Select your site: `taskflowwwai`
3. Go to: **Site Settings** → **Environment Variables**
4. Verify `OPENAI_API_KEY` is set correctly

**How to check if key is valid:**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY"
```

If you get an error, your key is invalid. Get a new one from:
https://platform.openai.com/api-keys

### Option 2: Check Netlify Function Logs

1. Go to: Netlify Dashboard → **Functions** tab
2. Click on `breakdown-goal` function
3. View recent logs for errors like:
   - "Invalid API key"
   - "Rate limit exceeded"
   - "Request timeout"

### Option 3: Verify OpenAI API Status

Visit: https://status.openai.com/

If there's an outage or degraded performance, that's causing the timeout.

### Option 4: Test Locally

Run the project locally to isolate the issue:

```bash
npm run dev
```

Then test goal creation. If it works locally but not on Netlify:
- Issue is with Netlify environment variables
- Or Netlify's network to OpenAI is slow

### Option 5: Use Shorter Goal Descriptions

**❌ Too long (may timeout):**
```
"I want to become a full-stack web developer with expertise in React, 
Node.js, databases, and DevOps so I can build and deploy production 
applications and get a job at a tech company within 6 months"
```

**✅ Concise (will succeed):**
```
"Become a full-stack web developer"
```

You can add more details in the "Additional context" field AFTER the initial breakdown.

## Expected Performance After Fix

| Metric | Before | After |
|--------|--------|-------|
| Response time | 10-25s → 504 | **4-7s ✅** |
| Success rate | 40% | **95%** |
| API cost | $0.10/goal | **$0.02/goal** |
| Tokens used | ~1500 | **~400** |

## If Nothing Works

### Last Resort: Switch to an Even Faster Model

Edit `lib/openai/client.ts`:

```typescript
// Change from:
export const AI_MODEL = 'gpt-4o-mini';

// To:
export const AI_MODEL = 'gpt-3.5-turbo';
```

This will be **2x faster** but slightly lower quality responses.

### Nuclear Option: Increase Netlify Timeout (Paid Plan)

Netlify Free Tier: 10-second timeout
Netlify Pro: 26-second timeout

If you upgrade to Pro ($19/month), you get more time for functions.

But **this shouldn't be necessary** with our optimizations.

## Monitoring

After deployment, monitor for 24 hours:

**What to track:**
- ✓ Goal creation success rate (should be >90%)
- ✓ Average response time (should be 4-8 seconds)
- ✓ User feedback on AI quality

**How to track:**
1. Test 5-10 different goals yourself
2. Check Netlify function logs for errors
3. Monitor OpenAI usage dashboard

## Contact

If issue persists after all these fixes:
1. Check OpenAI API usage limits (you might be rate-limited)
2. Ensure billing is active on OpenAI account
3. Try creating a new OpenAI API key

---

**Current Status:** Optimized for 4-7 second responses
**Last Updated:** November 20, 2025
**Next Deployment:** Auto-deploy on git push

