# Quick Setup Guide

## 🚀 Fast Setup (5 minutes)

### Step 1: Install Everything
```bash
npm run install-all
```

### Step 2: Configure MongoDB
Choose one option:

**Option A: Use Local MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

**Option B: Use MongoDB Atlas**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Edit `server/.env` and update MONGODB_URI

### Step 3: Start the App
```bash
npm run dev
```

That's it! 🎉

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📝 Manual Setup (if auto-install fails)

### Install Server
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB connection
npm start
```

### Install Client (in new terminal)
```bash
cd client
npm install
npm run dev
```

---

## 🐛 Common Issues

### "Can't find mongod"
Install MongoDB:
```bash
# macOS
brew install mongodb-community

# Linux
sudo apt-get install mongodb

# Windows
Download from: https://www.mongodb.com/try/download/community
```

### "Port 5000 already in use"
Edit `server/.env`:
```
PORT=5001
```

Then update `client/vite.config.js` proxy target.

### "Cannot find module"
```bash
# Clear node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm run install-all
```

---

## ✅ Testing the App

1. Open http://localhost:3000
2. Click "Create one"
3. Enter test@example.com and password123
4. Click "Start Creating"
5. You should see success message
6. Use the same credentials to login

---

## 📚 Directory Structure

```
mern-login-app/
├── server/          # Backend (Express, Node, MongoDB)
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/          # Frontend (React, Vite)
│   ├── src/
│   ├── vite.config.js
│   └── package.json
├── README.md        # Full documentation
└── package.json     # Root config
```

---

## 🎯 What's Next?

After getting it working:
- Modify the UI in `client/src/styles/AuthForm.css`
- Add more endpoints in `server/server.js`
- Create a dashboard page
- Add more features!

---

Enjoy! 🚀
