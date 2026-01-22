# 🔐 Authentication Guide - Registration & Login

**Status:** ✅ **FULLY CONNECTED**

---

## 📊 How It Works

### **Registration Flow:**

```
User fills form
    ↓
Click Register
    ↓
Frontend validates (passwords match, 6+ chars)
    ↓
Sends to: POST /api/auth/register
    ↓
Backend validates input
    ↓
Check if email already exists
    ↓
Hash password (⚠️ currently plain - upgrade needed)
    ↓
Save to MongoDB
    ↓
Return success & redirect to login
```

### **Login Flow:**

```
User enters email & password
    ↓
Click Login
    ↓
Frontend validates (both fields filled)
    ↓
Sends to: POST /api/auth/login
    ↓
Backend finds user by email
    ↓
Compares password with database
    ↓
If match → return user data
    ↓
Frontend stores in localStorage
    ↓
Redirect to Home page
```

---

## 🎯 What Was Updated

### **Frontend - Register.jsx**
✅ Added:
- State management for form fields
- Validation (name, email, password match)
- Backend API call: `authAPI.register()`
- Error/success messages
- Loading state during submission
- Auto-redirect to login on success

### **Frontend - Login.jsx**
✅ Added:
- State management for email & password
- Backend API call: `authAPI.login()`
- Error handling & display
- "Remember me" feature
- Stores user data in localStorage:
  - `isLoggedIn` - true/false
  - `userId` - user ID in database
  - `userEmail` - user's email
  - `userName` - user's full name
  - `userType` - "jobseeker" or "employer"
- Auto-redirect to Home on success

### **Backend - authController.js**
✅ Already has:
- `register()` - validates, checks duplicate email, saves user
- `login()` - finds user, verifies password, returns data

### **Backend - authRoutes.js**
✅ Already has:
- `POST /api/auth/register` - registration endpoint
- `POST /api/auth/login` - login endpoint

---

## 🧪 How to Test

### **Step 1: Register a New User**

1. Go to `http://localhost:3000/register`
2. Fill form:
   - Full Name: "Jane Smith"
   - Email: "jane@example.com"
   - User Type: "Job Seeker"
   - Password: "password123"
   - Confirm: "password123"
3. Click "Register"
4. Should see: ✅ "Registration successful! Redirecting to login..."
5. Auto-redirects to `/login`

### **Step 2: Login with New User**

1. On login page, fill:
   - Email: "jane@example.com"
   - Password: "password123"
   - Check "Remember me"
2. Click "Login"
3. Should see: ✅ "Login successful! Redirecting..."
4. Auto-redirects to Home page

### **Step 3: Verify in Browser**

Open Developer Console (F12) → Application → LocalStorage:
```
isLoggedIn: true
userId: 507f1f77bcf86cd799439011
userEmail: jane@example.com
userName: Jane Smith
userType: jobseeker
```

### **Step 4: Try Login with Test Data**

Pre-seeded users (from `npm run seed`):
```
Email: john.doe@example.com
Password: password123

Email: sarah.smith@example.com
Password: password123
```

---

## 📡 API Endpoints

### **Register**
```bash
POST /api/auth/register

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "jobseeker"
}

Response:
{
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "jobseeker"
  }
}
```

### **Login**
```bash
POST /api/auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "jobseeker",
    "phone": "+1 (555) 123-4567"
  }
}
```

---

## 📝 Code Examples

### **Using Auth in Components**

```javascript
import { authAPI } from '../services/api';

// Registration
const handleRegister = async (userData) => {
  const response = await authAPI.register({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    userType: "jobseeker"
  });
  
  if (response.message) {
    console.log("✅ Registered:", response.userId);
  }
};

// Login
const handleLogin = async () => {
  const response = await authAPI.login(
    "john@example.com",
    "password123"
  );
  
  if (response.user) {
    localStorage.setItem("userId", response.user.id);
    localStorage.setItem("userName", response.user.firstName);
  }
};

// Get Logged In User
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");
const isLoggedIn = localStorage.getItem("isLoggedIn");

console.log(`Logged in as: ${userName}`);
```

---

## 🔒 Security Notes

### **Current Implementation:**
- ✅ Passwords stored in database
- ✅ Email validation
- ✅ Duplicate email check
- ❌ **Passwords are NOT hashed** (plain text)

### **⚠️ IMPORTANT: Password Hashing Needed**

For production, passwords should be hashed using **bcrypt**:

**To upgrade (future task):**
```javascript
// In backend/controllers/authController.js
const bcrypt = require('bcrypt');

// During registration:
const hashedPassword = await bcrypt.hash(password, 10);
user.password = hashedPassword;

// During login:
const isValid = await bcrypt.compare(password, user.password);
```

---

## 📋 User Data Stored in Database

After registration, each user has:
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",  // ⚠️ Currently plain text
  phone: "+1 (555) 123-4567",
  userType: "jobseeker",
  bio: null,
  skills: [],
  experience: [],
  education: [],
  appliedJobs: [],
  createdAt: "2026-01-22T..."
}
```

---

## 🧪 Quick Test Commands

### **In Postman - Register**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "test123",
  "userType": "jobseeker"
}
```

### **In Postman - Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "test123"
}
```

### **In Browser Console**
```javascript
// Test registration
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: "Browser",
    lastName: "Test",
    email: "browser@test.com",
    password: "test123",
    userType: "jobseeker"
  })
}).then(r => r.json()).then(d => console.log(d));

// Test login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "browser@test.com",
    password: "test123"
  })
}).then(r => r.json()).then(d => console.log(d));
```

---

## 📊 Testing Checklist

- [ ] Backend running: `npm run dev`
- [ ] Frontend running: `npm start`
- [ ] Navigate to `/register`
- [ ] Fill registration form with new email
- [ ] Click Register
- [ ] See success message
- [ ] Auto-redirect to login
- [ ] Fill login form with same credentials
- [ ] Click Login
- [ ] See success message & redirect to home
- [ ] Check localStorage has user data
- [ ] Logout & login again works
- [ ] "Remember me" saves email
- [ ] Test with seeded users (john.doe@example.com)

---

## 🚨 Troubleshooting

### **"Error connecting to backend"**
```
✓ Verify backend is running on port 5000
✓ Check Network tab in DevTools
✓ Look for error response from /api/auth/login
```

### **"User already exists with this email"**
```
✓ Email is already registered
✓ Use different email for new account
✓ Or use seeded test account
```

### **"Invalid email or password"**
```
✓ Check email is correct
✓ Check password is correct (case-sensitive)
✓ Verify user was registered successfully
✓ Check database has user (npm run seed to create test data)
```

### **Password validation fails**
```
✓ Minimum 6 characters
✓ Must match confirm password
✓ Check for spaces/typos
```

---

## ✅ Summary

**User Registration:**
1. ✅ Form validates input
2. ✅ Sends to backend `/api/auth/register`
3. ✅ Backend saves to MongoDB
4. ✅ Frontend stores user info in localStorage
5. ✅ Auto-redirects to home

**User Login:**
1. ✅ Form validates input
2. ✅ Sends to backend `/api/auth/login`
3. ✅ Backend finds user & verifies password
4. ✅ Frontend stores user info in localStorage
5. ✅ Auto-redirects to home

**User Data Available:**
- In browser: `localStorage.getItem("userId")`
- In database: MongoDB user collection
- Ready for: Profile updates, job applications, etc.

---

**Status:** ✅ **FULLY FUNCTIONAL**  
**Date:** January 22, 2026  
**Next:** Implement JWT tokens for better security
