# Ollama Cloud API Key Setup Guide

## Overview

To use **web search features** in PersonalAI Dashboard (including Telegram bot search and chat web search), you need a free API key from **Ollama Cloud**.

**What you get with the API key:**
- 🔍 Web search integration in chat
- 🔍 `/search` command in Telegram bot
- 🔍 Intelligence report web research
- 🔍 Real-time information retrieval

**Cost:** FREE (Generous free tier included)

---

## Step-by-Step Setup

### Step 1: Create an Ollama Account

1. Go to: **https://ollama.com**
2. Click **"Sign Up"** in the top right corner
3. Enter your email and create a password
4. Verify your email address (check your inbox)

### Step 2: Get Your API Key

1. After logging in, go to: **https://ollama.com/settings/keys**
2. Click the **"Create API Key"** button
3. Give it a name (e.g., "PersonalAI Dashboard" or "My AI Assistant")
4. Click **"Create"**
5. **COPY THE KEY IMMEDIATELY** (it looks like: `ollama_abc123xyz...`)

⚠️ **Important:** The key is only shown once! If you lose it, you'll need to create a new one.

### Step 3: Add API Key to PersonalAI Dashboard

**Method A: Via .env.local file (Recommended)**

1. Create a file named `.env.local` in your project root directory (`C:\ai_dashboard`)
2. Add this line:
   ```
   OLLAMA_API_KEY=your-ollama-api-key-here
   ```
3. Replace `your-ollama-api-key-here` with your actual key
4. Save the file
5. Restart your server: `npm run dev`

**Method B: Via Settings UI**

1. Open PersonalAI Dashboard in your browser
2. Go to **Settings** (gear icon)
3. Click **API Keys** tab
4. Find **Ollama** in the list
5. Paste your API key
6. Click **Save**

---

## Testing Your Setup

### Test 1: Web Search in Chat
1. Go to the main chat page
2. Type: `"What is the latest news about AI?"`
3. The AI should search the web and provide current information

### Test 2: Telegram Bot Search
1. Send `/search artificial intelligence` to your Telegram bot
2. It should return web search results

### Test 3: Intelligence Reports
1. Go to **Intelligence** page
2. Create a new report with web search enabled
3. It should gather information from the web

---

## Troubleshooting

### Issue: "API key not found" error
**Solution:** 
- Make sure `.env.local` file exists in your project root
- Verify the key is spelled correctly: `OLLAMA_API_KEY=your-key`
- Restart the server after adding the key

### Issue: Search not working but key is set
**Solution:**
- Check if your Ollama account is verified (check email)
- Verify the key hasn't expired (check at https://ollama.com/settings/keys)
- Check server console for specific error messages

### Issue: "Rate limit exceeded"
**Solution:**
- Ollama free tier has limits
- Wait a few minutes and try again
- Consider upgrading if you need higher limits

### Issue: Key was deleted/lost
**Solution:**
- Go back to https://ollama.com/settings/keys
- Delete the old key
- Create a new one
- Update your `.env.local` file

---

## Alternative: No API Key Required

If you don't want to use Ollama Cloud, you can use **DuckDuckGo** for basic search:

**Pros:**
- No account needed
- Completely free
- No rate limits

**Cons:**
- Less comprehensive results
- No real-time news
- Best for facts and definitions only

**How it works:**
- The system automatically falls back to DuckDuckGo if no API key is configured
- You'll get simpler search results
- Commands like `/search` will still work but with limited results

---

## Security Best Practices

🔒 **Keep your API key secure:**
- Never commit `.env.local` to Git (it's in `.gitignore` by default)
- Don't share your key with others
- Rotate keys periodically (every 6 months)
- Delete unused keys from your Ollama account

---

## FAQ

**Q: Is this really free?**  
A: Yes! Ollama Cloud has a generous free tier that's sufficient for personal use.

**Q: What if I exceed the free tier?**  
A: You'll need to wait for the rate limit to reset, or upgrade to a paid plan on Ollama's website.

**Q: Do I need this for local AI models to work?**  
A: No! Local models (via Ollama desktop) work without any API key. You only need this for web search features.

**Q: Can I use a different search provider?**  
A: Yes! You can also set up Tavily or Brave Search API keys. See `.env.example` for details.

---

## Next Steps

Once you have your API key configured:
1. Test web search in chat
2. Try the Telegram bot `/search` command
3. Set up intelligence reports with web research
4. Enjoy real-time AI-powered information retrieval!

---

**Need Help?**  
If you're having trouble:
1. Check the Ollama documentation: https://ollama.com/docs
2. Visit Ollama Discord community
3. Open an issue on GitHub: https://github.com/norhtecmbarnes-dot/PersonalAI-Dashboard/issues

---

**You're all set!** Your PersonalAI Dashboard now has full web search capabilities. 🚀
