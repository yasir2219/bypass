# 🪟 Windows Setup Guide for UID BYPASS System

## 🚀 Quick Start (Windows)

### 1️⃣ Project চালু করুন:

```bash
# Simple dev server (recommended)
bun run dev

# অথবা log সহ dev server
bun run dev:log
```

### 2️⃣ MongoDB Install (Windows):

#### Option A: MongoDB Community Server
1. https://www.mongodb.com/try/download/community থেকে download করুন
2. MSI installer run করুন
3. "Complete" installation নির্বাচন করুন
4. Install MongoDB as Service চেক করুন
5. MongoDB Compass (optional) install করুন

#### Option B: MongoDB Atlas (Cloud)
1. https://www.mongodb.com/atlas এ যান
2. Free account তৈরি করুন
3. New cluster তৈরি করুন (M0 Sandbox)
4. Database user তৈরি করুন
5. Network Access এ IP add করুন (0.0.0.0/0)
6. Connection string copy করুন

### 3️⃣ Environment Setup:

`.env` ফাইলে MongoDB URL set করুন:

```env
# Local MongoDB (যদি local install করেন)
DATABASE_URL="mongodb://localhost:27017/uidbypass"

# MongoDB Atlas (যদি cloud use করেন)
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/uidbypass"
```

### 4️⃣ MongoDB Service Start (Local):

```powershell
# PowerShell এর জন্য
Start-Service MongoDB

# অথবা Command Prompt এর জন্য
net start MongoDB
```

### 5️⃣ Database Initialize:

1. Browser এ http://localhost:3000 খুলুন
2. "Initialize Database" বাটনে ক্লিক করুন
3. Success message দেখুন

## 🔧 Windows Commands:

### Development:
```bash
# Start development server
bun run dev

# Start with logging
bun run dev:log

# Check logs
type dev.log

# Lint code
bun run lint
```

### MongoDB Management:
```bash
# MongoDB shell খুলুন
mongosh

# Database দেখুন
show dbs

# uidbypass database এ যান
use uidbypass

# Collections দেখুন
show collections

# Admin users দেখুন
db.admins.find().pretty()

# Licenses দেখুন
db.licenses.find().pretty()
```

## 🔐 Login Credentials:

**Admin Panel:**
- Username: `yasir22193150`
- Password: `TYer2219@#`

## 📁 Project Structure (Windows):

```
uid-bypass-mang/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   └── page.tsx      # Main page
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── AdminDashboard.tsx
│   │   └── UserDashboard.tsx
│   └── lib/
│       ├── mongodb.ts     # MongoDB connection
│       └── utils.ts      # Utility functions
├── .env                 # Environment variables
├── package.json          # Dependencies & scripts
└── MONGODB_SETUP.md     # Setup guide
```

## 🛠️ Troubleshooting (Windows):

### Issue: "bun: command not found: tee"
**Solution:** `bun run dev` use করুন (tee Windows এ নাই)

### Issue: "MongoDB connection failed"
**Solutions:**
1. MongoDB service running কিনা check করুন
2. Firewall এ port 27017 open করুন
3. .env ফাইলে URL correct কিনা check করুন

### Issue: "Port 3000 already in use"
**Solution:** 
```bash
# Port kill করুন
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# অথবা different port use করুন
bun run dev -- -p 3001
```

### Issue: "Module not found"
**Solution:**
```bash
# Dependencies reinstall করুন
rm -rf node_modules
bun install
```

## 🎯 Quick Verification:

1. **Project start:** `bun run dev`
2. **Browser open:** http://localhost:3000
3. **MongoDB check:** `mongosh` এ `show dbs`
4. **Login test:** Admin panel login দিন
5. **Database seed:** "Initialize Database" বাটনে ক্লিক

## 🚀 Production Deploy (Windows):

```bash
# Build project
bun run build

# Start production server
bun run start
```

## 📱 Features Working:

✅ **Dark UI with Neon Effects**  
✅ **Admin Dashboard (6 tabs)**  
✅ **User Dashboard (4 tabs)**  
✅ **MongoDB Database Integration**  
✅ **License Management System**  
✅ **UID Activation & Control**  
✅ **Real-time Statistics**  
✅ **Toast Notifications**  
✅ **Responsive Design**  

## 🎊 Ready to Go!

আপনার UID BYPASS Management System Windows এ **fully functional**! 🎉

**Next Steps:**
1. MongoDB install/start করুন
2. `bun run dev` run করুন
3. http://localhost:3000 এ যান
4. System enjoy করুন! 🚀