# MongoDB Setup Guide for UID BYPASS System

## 📋 যা যা লাগবে:

1. **MongoDB Server** (Local অথবা Cloud)
2. **MongoDB Connection String**

## 🗄️ MongoDB সেটআপ অপশন:

### Option 1: Local MongoDB Installation

#### Windows:
```bash
# MongoDB Community Server ডাউনলোড করুন
https://www.mongodb.com/try/download/community

# Installation এর পর MongoDB service start করুন
net start MongoDB
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Mac:
```bash
# Homebrew দিয়ে install করুন
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

### Option 2: MongoDB Atlas (Cloud)

1. https://www.mongodb.com/atlas এ যান
2. Free account তৈরি করুন
3. New cluster তৈরি করুন (Free tier)
4. Database user তৈরি করুন
5. Network access এ IP address add করুন (0.0.0.0/0)
6. Connection string কপি করুন

## 🔧 .env ফাইল কনফিগারেশন:

### Local MongoDB:
```env
DATABASE_URL="mongodb://localhost:27017/uidbypass"
```

### MongoDB Atlas:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/uidbypass"
```

### MongoDB with Authentication:
```env
DATABASE_URL="mongodb://username:password@localhost:27017/uidbypass"
```

## 🚀 স্টার্ট করার ধাপ:

1. **MongoDB ইনস্টল করুন** (উপরের নির্দেশনা অনুযায়ী)
2. **MongoDB service start করুন**
3. **.env ফাইলে DATABASE_URL update করুন**
4. **Database seed করুন** (ওয়েবসাইটে "Initialize Database" বাটনে ক্লিক করুন)

## 🎯 Default Credentials:

**Admin Login:**
- Username: `yasir22193150`
- Password: `TYer2219@#`

## 📝 Example .env:

```env
# MongoDB Database Connection
DATABASE_URL="mongodb://localhost:27017/uidbypass"

# Discord OAuth Configuration
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"
DISCORD_REDIRECT_URI="http://localhost:3000/api/auth/discord/callback"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
```

## 🔍 Verification:

MongoDB properly connected কিনা চেক করতে:

```bash
# MongoDB shell খুলুন
mongosh

# Database list দেখুন
show dbs

# uidbypass database এ যান
use uidbypass

# Collections দেখুন
show collections
```

## ⚠️ Important Notes:

- Local MongoDB ব্যবহার করলে port 27017 open থাকতে হবে
- MongoDB Atlas ব্যবহার করলে network access ঠিক করে নিন
- Password এ special characters থাকলে URL encode করতে হতে পারে
- Production এ সবসময় authentication ব্যবহার করুন

## 🆘 Troubleshooting:

**Error: "Connection refused"**
- MongoDB service running কিনা চেক করুন
- Port number correct কিনা দেখুন

**Error: "Authentication failed"**
- Username/password correct কিনা চেক করুন
- User has proper permissions কিনা দেখুন

**Error: "Database not found"**
- Database name correct কিনা চেক করুন
- Database create হয়েছে কিনা verify করুন