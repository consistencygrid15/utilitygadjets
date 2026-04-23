# UG (UtilityGadgets) — System Setup Guide

## What Was Built

A full production-ready GSM home security system with:
- **Backend** — Node.js + Express + MongoDB (MVC architecture)
- **Mobile App** — React Native CLI (JavaScript, no TypeScript)

---

## 📁 Project Structure

```
d:\startup\Nexsof\
├── ug-backend/
│   ├── src/
│   │   ├── controllers/   authController.js, deviceController.js, alertController.js, webhookController.js
│   │   ├── models/        User.js, Device.js, Alert.js
│   │   ├── routes/        auth.js, device.js, alert.js, webhook.js
│   │   ├── services/      firebaseService.js, smsService.js
│   │   ├── middleware/    authMiddleware.js, errorHandler.js, rateLimiter.js
│   │   ├── utils/         logger.js, smsParser.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── ug-app/
    ├── src/
    │   ├── components/    Button, Input, Badge, AlertItem, DeviceCard, LoadingOverlay, EmptyState
    │   ├── screens/       Splash, Login, Signup, Dashboard, DeviceManagement, AlertHistory, Settings
    │   ├── navigation/    AppNavigator, AuthNavigator, MainTabNavigator
    │   ├── redux/         store.js + slices/authSlice, deviceSlice, alertSlice, appSlice
    │   ├── services/      api.js, authService, deviceService, alertService, fcmService
    │   ├── hooks/         useAuth, useDevices, useAlerts, useFCM
    │   └── utils/         constants.js, storage.js, formatters.js
    ├── App.js
    ├── index.js
    └── package.json
```

---

## 🚀 Step 1: Backend Setup

```bash
cd d:\startup\Nexsof\ug-backend
npm install
copy .env.example .env
# Fill in .env values (see below)
npm run dev
```

### Backend `.env` values to fill:

| Key | Where to get it |
|---|---|
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Create cluster → Connect |
| `JWT_SECRET` | Any random 32+ char string |
| `MSG91_AUTH_KEY` | [MSG91 Dashboard](https://msg91.com) → API Keys |
| `MSG91_SENDER_ID` | Registered DLT sender ID (e.g. UGALRM) |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | See Firebase step below |
| `WEBHOOK_SECRET` | Any random string — paste same in MSG91 webhook config |

---

## 🔥 Step 2: Firebase Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project → Enable Analytics (optional)
3. Add **Android app** (package name: `com.ugapp`)
4. Download `google-services.json` → place in `ug-app/android/app/`

### Enable Firebase Cloud Messaging
1. Firebase Console → Cloud Messaging → (already enabled)

### Get Admin Service Account (for backend)
1. Firebase Console → Project Settings → **Service Accounts**
2. Click **Generate new private key** → download JSON
3. Encode to base64:

```powershell
# PowerShell
$bytes = [System.IO.File]::ReadAllBytes("serviceAccountKey.json")
[Convert]::ToBase64String($bytes) | clip
# Paste the clipboard contents into FIREBASE_SERVICE_ACCOUNT_BASE64 in .env
```

### Android FCM channel setup
Add this to `ug-app/android/app/src/main/res/values/strings.xml`:
```xml
<string name="default_notification_channel_id">ug_alerts</string>
```

---

## 📱 Step 3: Mobile App Setup

```bash
cd d:\startup\Nexsof\ug-app
npm install

# Link native modules (React Native 0.73+ — auto-linking handles most)
cd android && ./gradlew clean && cd ..

# Start Metro
npm start

# In another terminal
npm run android
```

### Update API URL
In `src/services/api.js`, change `BASE_URL`:
- Android emulator: `http://10.0.2.2:5000/api`
- Physical device: `http://<your-local-IP>:5000/api`
- Production: `https://api.yourdomain.com/api`

---

## 📩 Step 4: SMS Webhook Setup (MSG91)

1. Login to MSG91 → **Inbound SMS** → Add Webhook
2. Webhook URL: `https://your-backend.com/api/sms-webhook`
3. Method: **POST**
4. Add header: `X-Webhook-Secret: your_webhook_secret`
5. Format: MSG91 sends `{ "from": "91XXXXXXXXXX", "message": "..." }`

### Test the webhook locally (PowerShell):
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/sms-webhook" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json"; "X-Webhook-Secret" = "your_webhook_secret" } `
  -Body '{"from":"919876543210","message":"ALERT|DEVICE123|MAIN_DOOR|10:30PM"}'
```

---

## 🔐 Step 5: Device SMS Format

Your GSM device must send SMS in this format:
```
ALERT|DEVICE123|MAIN_DOOR|10:30PM
```

| Part | Example | Meaning |
|---|---|---|
| Type | `ALERT` | intrusion, PANIC, TAMPER, LOWBAT, ARM, DISARM |
| Device ID | `DEVICE123` | Must match `deviceId` added in app |
| Zone | `MAIN_DOOR` | Zone name |
| Time | `10:30PM` | Time of alert |

### Backend sends commands as:
```
#PWD123#ARM
#PWD123#DISARM
#PWD123#PANIC
```
(Password is set via `DEVICE_PASSWORD` in `.env`)

---

## 🔒 Security — Play Store Compliance

| ✅ What we do | ❌ What we avoid |
|---|---|
| Backend reads SMS via webhook | App reads SMS directly |
| JWT stored in Keychain (secure) | JWT in AsyncStorage (plain text) |
| HTTPS only in production | HTTP in production |
| Rate limiting on all endpoints | Unlimited requests |
| Webhook shared secret | Open webhook |

---

## 📡 API Endpoints Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register user |
| POST | `/api/auth/login` | None | Login |
| GET | `/api/auth/me` | JWT | Get profile |
| POST | `/api/auth/fcm-token` | JWT | Register FCM token |
| POST | `/api/device/add` | JWT | Add device |
| GET | `/api/device/list` | JWT | List devices |
| POST | `/api/device/:id/command` | JWT | Send ARM/DISARM/PANIC |
| GET | `/api/alerts` | JWT | Get alerts (paginated) |
| PATCH | `/api/alerts/:id/read` | JWT | Mark read |
| PATCH | `/api/alerts/read-all` | JWT | Mark all read |
| POST | `/api/sms-webhook` | Secret | SMS gateway webhook |
| GET | `/api/health` | None | Health check |

---

## 🌐 Deployment (Production)

### Backend — Railway / Render
1. Push `ug-backend/` to GitHub
2. Connect to Railway.app → Deploy
3. Add all environment variables from `.env.example`
4. Get public URL → update `API_BASE_URL` in app

### Android APK — Play Store
1. Generate keystore
2. `cd android && ./gradlew assembleRelease`
3. APK at `android/app/build/outputs/apk/release/`

---

> **Built by Antigravity for UG (UtilityGadgets) — Startup grade, Play Store safe.**
