# 🔗 UID BYPASS API Documentation - Complete Working Version

## 🚀 **All API Routes Working with MongoDB!**

### 📋 **Base URL:**
```
http://localhost:3000/api
```

### 🔐 **Authentication Routes**

#### **POST /admin/login**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "yasir22193150",
    "password": "TYer2219@#"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "base64-token",
  "admin": {
    "id": "admin-id",
    "username": "yasir22193150",
    "role": "ADMIN"
  }
}
```

#### **POST /admin/login-fallback** (If MongoDB not available)
```bash
curl -X POST http://localhost:3000/api/admin/login-fallback \
  -H "Content-Type: application/json" \
  -d '{
    "username": "yasir22193150",
    "password": "TYer2219@#"
  }'
```

### 📊 **Database Management**

#### **POST /seed**
```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Database seeded successfully!",
  "admin": {
    "username": "yasir22193150",
    "password": "TYer2219@#"
  }
}
```

#### **POST /seed-fallback**
```bash
curl -X POST http://localhost:3000/api/seed-fallback \
  -H "Content-Type: application/json"
```

### 📈 **Dashboard Statistics**

#### **GET /dashboard**
```bash
curl -X GET http://localhost:3000/api/dashboard
```

**Response:**
```json
{
  "stats": {
    "totalUsers": 156,
    "totalLicenses": 89,
    "activeLicenses": 67,
    "expiredLicenses": 22,
    "bannedUids": 8,
    "pausedUids": 5
  },
  "recentActivity": [
    {
      "id": "1",
      "user": {
        "username": "Player1",
        "discordId": "123456"
      },
      "gameUID": "123456789",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### 🔑 **License Management**

#### **GET /licenses**
```bash
curl -X GET http://localhost:3000/api/licenses
```

**Response:**
```json
{
  "licenses": [
    {
      "id": "1",
      "licenseKey": "YASIR-hHYE-YArGE-HSas-GasO",
      "expireDate": "2024-12-31",
      "maxUsage": 100,
      "usedCount": 45,
      "status": "ACTIVE",
      "licenseType": "STANDARD",
      "maxUsers": 5
    }
  ]
}
```

#### **POST /licenses** (Create New License)
```bash
curl -X POST http://localhost:3000/api/licenses \
  -H "Content-Type: application/json" \
  -d '{
    "expireDate": "2024-12-31",
    "maxUsage": "100",
    "licenseType": "STANDARD",
    "maxUsers": "5"
  }'
```

**Response:**
```json
{
  "success": true,
  "license": {
    "id": "new-license-id",
    "licenseKey": "GENERATED-KEY-XXXX-XXXX-XXXX",
    "expireDate": "2024-12-31",
    "maxUsage": 100,
    "usedCount": 0,
    "status": "ACTIVE"
  }
}
```

#### **PUT /licenses** (Update License)
```bash
curl -X PUT http://localhost:3000/api/licenses \
  -H "Content-Type: application/json" \
  -d '{
    "licenseId": "1",
    "status": "EXPIRED"
  }'
```

#### **DELETE /licenses?licenseId=1**
```bash
curl -X DELETE "http://localhost:3000/api/licenses?licenseId=1"
```

### 👥 **User Management**

#### **GET /users**
```bash
curl -X GET http://localhost:3000/api/users
```

**Response:**
```json
{
  "users": [
    {
      "id": "1",
      "discordId": "123456789",
      "username": "Player1",
      "role": "USER",
      "createdAt": "2024-01-01",
      "uids": [
        {
          "id": "1",
          "gameUID": "123456789",
          "licenseKey": "YASIR-hHYE-YArGE-HSas-GasO",
          "status": "ACTIVE"
        }
      ]
    }
  ]
}
```

#### **POST /users** (Create UID)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1",
    "gameUID": "123456789",
    "licenseKey": "YASIR-hHYE-YArGE-HSas-GasO"
  }'
```

#### **POST /users/activate-uid** (User UID Activation)
```bash
curl -X POST http://localhost:3000/api/users/activate-uid \
  -H "Content-Type: application/json" \
  -d '{
    "gameUID": "123456789",
    "licenseKey": "YASIR-hHYE-YArGE-HSas-GasO"
  }'
```

**Response:**
```json
{
  "success": true,
  "uid": {
    "id": "activated-uid-id",
    "gameUID": "123456789",
    "licenseKey": "YASIR-hHYE-YArGE-HSas-GasO",
    "status": "ACTIVE",
    "licenseType": "STANDARD",
    "expireDate": "2024-12-31"
  },
  "message": "UID activated successfully!"
}
```

### 🎮 **UID Management**

#### **GET /uids**
```bash
curl -X GET http://localhost:3000/api/uids
```

**Response:**
```json
{
  "uids": [
    {
      "id": "1",
      "userId": "1",
      "gameUID": "123456789",
      "licenseKey": "YASIR-hHYE-YArGE-HSas-GasO",
      "status": "ACTIVE",
      "user": {
        "id": "1",
        "username": "Player1",
        "discordId": "123456"
      },
      "license": {
        "id": "1",
        "licenseKey": "YASIR-hHYE-YArGE-HSas-GasO",
        "maxUsage": 100,
        "usedCount": 5
      }
    }
  ]
}
```

#### **PUT /uids** (Update UID Status)
```bash
curl -X PUT http://localhost:3000/api/uids \
  -H "Content-Type: application/json" \
  -d '{
    "uidId": "1",
    "status": "BANNED"
  }'
```

**Response:**
```json
{
  "success": true,
  "uid": {
    "id": "1",
    "status": "BANNED"
  }
}
```

#### **DELETE /uids?uidId=1**
```bash
curl -X DELETE "http://localhost:3000/api/uids?uidId=1"
```

**Response:**
```json
{
  "success": true,
  "message": "UID deleted successfully!"
}
```

### 📥 **Download Management**

#### **GET /downloads**
```bash
curl -X GET http://localhost:3000/api/downloads
```

**Response:**
```json
{
  "downloads": [
    {
      "id": "1",
      "fileName": "UID_Bypass_v2.1.rar",
      "description": "Latest version with enhanced features",
      "version": "2.1",
      "fileSize": "15.2 MB",
      "downloadLink": "https://example.com/download/file.rar",
      "createdAt": "2024-01-01"
    }
  ]
}
```

#### **POST /downloads** (Create Download)
```bash
curl -X POST http://localhost:3000/api/downloads \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "UID_Bypass_v2.2.rar",
    "description": "Bug fixes and performance improvements",
    "version": "2.2",
    "fileSize": "16.5 MB",
    "downloadLink": "https://example.com/download/uidbypass-v2.2.rar"
  }'
```

#### **PUT /downloads** (Update Download)
```bash
curl -X PUT http://localhost:3000/api/downloads \
  -H "Content-Type: application/json" \
  -d '{
    "downloadId": "1",
    "fileName": "Updated_File.rar",
    "description": "Updated description",
    "version": "2.3",
    "fileSize": "17.0 MB",
    "downloadLink": "https://example.com/download/updated.rar"
  }'
```

#### **DELETE /downloads?downloadId=1**
```bash
curl -X DELETE "http://localhost:3000/api/downloads?downloadId=1"
```

### 📺 **Tutorial Management**

#### **GET /tutorials**
```bash
curl -X GET http://localhost:3000/api/tutorials
```

**Response:**
```json
{
  "tutorials": [
    {
      "id": "1",
      "title": "How to Activate UID Bypass",
      "description": "Complete step by step guide",
      "youtubeLink": "https://youtube.com/watch?v=example",
      "thumbnail": "/thumbnail1.jpg",
      "createdAt": "2024-01-01"
    }
  ]
}
```

#### **POST /tutorials** (Create Tutorial)
```bash
curl -X POST http://localhost:3000/api/tutorials \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced UID Features",
    "description": "Learn about advanced features",
    "youtubeLink": "https://youtube.com/watch?v=example2",
    "thumbnail": "/thumbnail2.jpg"
  }'
```

#### **PUT /tutorials** (Update Tutorial)
```bash
curl -X PUT http://localhost:3000/api/tutorials \
  -H "Content-Type: application/json" \
  -d '{
    "tutorialId": "1",
    "title": "Updated Tutorial Title",
    "description": "Updated description",
    "youtubeLink": "https://youtube.com/watch?v=updated",
    "thumbnail": "/updated-thumbnail.jpg"
  }'
```

#### **DELETE /tutorials?tutorialId=1**
```bash
curl -X DELETE "http://localhost:3000/api/tutorials?tutorialId=1"
```

### ⚙️ **Settings Management**

#### **GET /settings**
```bash
curl -X GET http://localhost:3000/api/settings
```

**Response:**
```json
{
  "settings": {
    "id": "1",
    "discordServerLink": "https://discord.gg/uidbypass"
  }
}
```

#### **PUT /settings** (Update Settings)
```bash
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "discordServerLink": "https://discord.gg/newserver"
  }'
```

#### **PUT /settings** (Update Admin Password)
```bash
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "TYer2219@#",
    "newPassword": "newSecurePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Admin password updated successfully!"
}
```

## 🎯 **Testing Guide**

### **1. Start Server:**
```bash
bun run dev
```

### **2. Initialize Database:**
```bash
curl -X POST http://localhost:3000/api/seed
```

### **3. Test Admin Login:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "yasir22193150", "password": "TYer2219@#"}'
```

### **4. Test License Creation:**
```bash
curl -X POST http://localhost:3000/api/licenses \
  -H "Content-Type: application/json" \
  -d '{"expireDate": "2024-12-31", "maxUsage": "100", "licenseType": "STANDARD", "maxUsers": "5"}'
```

### **5. Test UID Activation:**
```bash
curl -X POST http://localhost:3000/api/users/activate-uid \
  -H "Content-Type: application/json" \
  -d '{"gameUID": "123456789", "licenseKey": "YASIR-hHYE-YArGE-HSas-GasO"}'
```

## 🎊 **All Features Working!**

✅ **MongoDB Integration** - Full CRUD operations  
✅ **License Management** - Create, Read, Update, Delete  
✅ **User Management** - UID activation, status control  
✅ **Download Management** - File management system  
✅ **Tutorial Management** - YouTube video integration  
✅ **Settings Management** - Discord link, password change  
✅ **Dashboard Statistics** - Real-time data  
✅ **Authentication** - Admin login with fallback  
✅ **Error Handling** - Proper error responses  
✅ **Data Validation** - Input validation everywhere  

**এখন Postman দিয়ে সব API routes test করতে পারবেন!** 🚀