# 🛠️ Windows Troubleshooting Guide

## ⚡ Quick Fix for Current Issues:

### 1️⃣ Module Resolution Error (bcryptjs)

**Problem:** `Module not found: Can't resolve 'bcryptjs'`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm -rf .next
bun install

# Restart dev server
bun run dev
```

### 2️⃣ MongoDB Connection Issues

**Problem:** MongoDB সাথে connect করতে পারছে না

**Solution Options:**

#### Option A: Use Fallback System (Recommended)
System এখন **automatic fallback** সহ:
- MongoDB fail করলে fallback system activate হবে
- "Initialize Database" বাটনে ক্লিক করুন
- System automatically fallback ব্যবহার করবে

#### Option B: Install MongoDB Local
```powershell
# PowerShell এর জন্য
# 1. MongoDB download করুন
# https://www.mongodb.com/try/download/community

# 2. Install করুন এবং service start করুন
Start-Service MongoDB

# 3. Verify MongoDB running
mongosh
```

#### Option C: Use MongoDB Atlas
```env
# .env ফাইলে update করুন
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/uidbypass"
```

### 3️⃣ File Watcher Errors

**Problem:** `Watchpack Error: EINVAL: invalid argument`

**Solution:** Windows file watching এর জন্য:
```bash
# .env.local ফাইলে add করুন
echo "WATCHPACK_POLLING=true" >> .env.local

# Restart dev server
bun run dev
```

### 4️⃣ Port Already in Use

**Problem:** Port 3000 already in use

**Solution:**
```powershell
# Port kill করুন
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# অথবা different port use করুন
bun run dev -- -p 3001
```

## 🚀 Immediate Working Solution:

### Step 1: Clean Install
```bash
# Project folder এ
rm -rf node_modules
rm -rf .next
bun install
```

### Step 2: Start with Fallback
```bash
# Dev server start করুন
bun run dev
```

### Step 3: Initialize Database
1. Browser এ http://localhost:3000 খুলুন
2. "Initialize Database" বাটনে ক্লিক করুন
3. **Fallback mode** এ success message দেখুন

### Step 4: Login
- Username: `yasir22193150`
- Password: `TYer2219@#`

## 🔧 Environment Variables Check:

`.env` ফাইল verify করুন:

```env
# MongoDB URL (optional for fallback)
DATABASE_URL="mongodb://localhost:27017/uidbypass"

# Discord (future use)
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"
DISCORD_REDIRECT_URI="http://localhost:3000/api/auth/discord/callback"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
```

## 🎯 What Works Right Now:

✅ **Fallback Authentication System**  
✅ **Admin Dashboard**  
✅ **User Dashboard**  
✅ **License Management**  
✅ **UI/UX with Neon Effects**  
✅ **All Core Features**  

## 🔄 How Fallback System Works:

1. **MongoDB চেষ্টা করে** connect করতে
2. **Fail করলে** fallback system activate হয়
3. **In-memory storage** ব্যবহার করে
4. **Full functionality** ঠিক থাকে

## 📊 System Status:

🟢 **Working:** Frontend UI  
🟢 **Working:** Admin Authentication (Fallback)  
🟢 **Working:** User Dashboard  
🟢 **Working:** License Management  
🟡 **Optional:** MongoDB (if available)  

## 🎮 Start Using Now:

1. `bun run dev` run করুন
2. http://localhost:3000 খুলুন  
3. "Initialize Database" বাটনে ক্লিক করুন
4. Login করুন: `yasir22193150` / `TYer2219@#`
5. System enjoy করুন! 🚀

**Fallback system আপনাকে MongoDB ছাড়াও full functionality দিবে!** 🎊