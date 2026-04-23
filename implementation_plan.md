# UG (UtilityGadgets) — GSM Home Security System

> **Language**: Plain JavaScript (no TypeScript) — both backend and React Native app.

A full-stack, startup-grade mobile + backend system for a GSM-based home security alarm. The app never touches SMS/calls directly — all communication flows through the backend.

---

## Architecture Overview

```
GSM Device ──SMS──► SMS Gateway (MSG91/Exotel)
                         │
                    Webhook POST
                         │
                    Backend (Node.js)
                    ├── Parse SMS
                    ├── Identify device/user
                    ├── Store alert (MongoDB)
                    └── Push via Firebase Admin
                              │
                         FCM Push Notification
                              │
                    React Native App
                    ├── Show alert (foreground/background)
                    ├── Display alert history
                    └── Send commands → Backend → SMS Gateway → Device
```

---

## Project Layout on Disk

```
d:\startup\Nexsof\
├── ug-backend/       ← Node.js + Express + MongoDB
└── ug-app/           ← React Native CLI (TypeScript)
```

---

## Open Questions

> [!IMPORTANT]
> **No blocking questions — proceeding with best-practice defaults for a startup MVP.**

Design decisions applied:
- **JavaScript (ES2020+)** for both backend and React Native app (no TypeScript)
- JWT stored in secure storage (react-native-keychain)
- MSG91 used as SMS gateway (Exotel as alternate note in .env)
- Firebase service account credentials loaded from `.env` (base64-encoded JSON)
- MongoDB Atlas URI expected in `.env`
- React Native version: **0.73.x** (latest stable at time of writing)

---

## Proposed Changes

### Backend — `ug-backend/`

#### [NEW] Project bootstrap

`package.json`, `.env.example`, `nodemon.json`, `.eslintrc.js`, `babel.config.js`

#### [NEW] `src/models/`

| File | Purpose |
|---|---|
| `User.js` | email, password (hashed), fcmTokens[], createdAt |
| `Device.js` | userId, phoneNumber, deviceId, name, status (armed/disarmed), createdAt |
| `Alert.js` | deviceId, userId, zone, raw, timestamp, read |

#### [NEW] `src/controllers/`

| File | Exports |
|---|---|
| `authController.js` | `register`, `login` |
| `deviceController.js` | `addDevice`, `listDevices`, `sendCommand` |
| `alertController.js` | `getAlerts`, `markRead` |
| `webhookController.js` | `handleSmsWebhook` |

#### [NEW] `src/routes/`

`auth.js`, `device.js`, `alert.js`, `webhook.js`

#### [NEW] `src/middleware/`

`authMiddleware.js` — JWT verify, attaches `req.user`
`errorHandler.js` — global Express error handler
`rateLimiter.js` — express-rate-limit for auth endpoints

#### [NEW] `src/services/`

`firebaseService.js` — Firebase Admin SDK init + `sendPushNotification()`
`smsService.js` — MSG91 SMS send for device commands

#### [NEW] `src/utils/`

`logger.js` — winston logger
`smsParser.js` — parses `"ALERT|DEVICE123|MAIN_DOOR|10:30PM"` format

#### [NEW] `src/app.js` + `src/server.js`

Express app setup and server entry point.

---

### Mobile App — `ug-app/`

#### [NEW] Project bootstrap (React Native CLI — JavaScript)

`package.json`, `.env`, `index.js`, `babel.config.js`, `.eslintrc.js`

#### [NEW] `src/services/`

| File | Purpose |
|---|---|
| `api.js` | Axios instance, JWT interceptor, refresh logic |
| `fcmService.js` | FCM token fetch, notification handlers (foreground+background) |
| `authService.js` | login/register API calls |
| `deviceService.js` | add device, list, send command |
| `alertService.js` | fetch alerts, mark read |

#### [NEW] `src/redux/`

| File | Purpose |
|---|---|
| `store.js` | Redux Toolkit store |
| `slices/authSlice.js` | user, token, loading, error |
| `slices/deviceSlice.js` | devices[], selected device |
| `slices/alertSlice.js` | alerts[], unread count |
| `slices/appSlice.js` | global loading, theme |

#### [NEW] `src/navigation/`

`AppNavigator.jsx` — root navigator (auth stack vs main tabs)
`AuthNavigator.jsx` — Splash → Login/Signup
`MainTabNavigator.jsx` — Dashboard | Devices | Alerts | Settings

#### [NEW] `src/screens/`

| Screen | Key Features |
|---|---|
| `SplashScreen.jsx` | Logo animation, token check, auto-navigate |
| `LoginScreen.jsx` | Email + password, JWT login, link to Signup |
| `SignupScreen.jsx` | Register, auto-login after register |
| `DashboardScreen.jsx` | Device status cards, quick arm/disarm, recent alert |
| `DeviceManagementScreen.jsx` | Add device form, device list, status badges |
| `AlertHistoryScreen.jsx` | Flat list, zone icons, mark-read swipe |
| `SettingsScreen.jsx` | Profile, notification toggle, logout |

#### [NEW] `src/components/`

| Component | Purpose |
|---|---|
| `Button.jsx` | Primary/secondary/danger variants |
| `Card.jsx` | Glassmorphic device/alert card |
| `Badge.jsx` | Armed/Disarmed/Alert status |
| `AlertItem.jsx` | Alert list row with icon + time |
| `DeviceCard.jsx` | Device info + arm/disarm/panic buttons |
| `LoadingOverlay.jsx` | Full-screen loading state |
| `Input.jsx` | Styled text input with error state |
| `EmptyState.jsx` | Illustration + message for empty lists |

#### [NEW] `src/hooks/`

`useAuth.js`, `useFCM.js`, `useAlerts.js`, `useDevices.js`

#### [NEW] `src/utils/`

`storage.js` — react-native-keychain wrapper
`formatters.js` — date/time formatting
`constants.js` — command strings, zone labels

---

## API Contract Summary

| Method | Endpoint | Auth | Body / Response |
|---|---|---|---|
| POST | `/api/auth/register` | None | `{email, password, name}` |
| POST | `/api/auth/login` | None | `{email, password}` → `{token, user}` |
| POST | `/api/device/add` | JWT | `{phoneNumber, name}` → device |
| GET | `/api/device/list` | JWT | `[devices]` |
| POST | `/api/device/:id/command` | JWT | `{command: 'ARM'|'DISARM'|'PANIC'}` |
| GET | `/api/alerts` | JWT | `[alerts]` (paginated) |
| POST | `/api/sms-webhook` | Shared secret | Raw SMS → process + push |

---

## SMS Webhook Flow

```
POST /api/sms-webhook
Body: { from: "+91XXXXXXXXXX", message: "ALERT|DEVICE123|MAIN_DOOR|10:30PM" }

1. Validate shared secret header
2. smsParser.parse(message) → { deviceId, zone, time }
3. Device.findOne({ deviceId }) → get userId
4. Alert.create({ deviceId, userId, zone, timestamp })
5. User.findById(userId) → get fcmTokens[]
6. firebaseService.sendPushNotification(tokens, payload)
```

---

## Environment Variables

**Backend `.env.example`:**
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
MSG91_AUTH_KEY=your_msg91_key
MSG91_SENDER_ID=UGALRM
FIREBASE_SERVICE_ACCOUNT_BASE64=<base64 encoded service account JSON>
WEBHOOK_SECRET=your_webhook_shared_secret
```

**App `.env`:**
```
API_BASE_URL=http://your-backend-url/api
GOOGLE_SERVICES_JSON_CONFIGURED=true
```

---

## Verification Plan

### Automated
- `node src/server.js` — verify backend starts and connects to MongoDB
- Lint: `eslint src/`

### Manual / Browser Verification
- Backend health endpoint: `GET /api/health` → 200
- Auth flow: register → login → JWT returned
- Webhook simulation: POST to `/api/sms-webhook` with test payload
- Push notification visible in app (via FCM test message in Firebase Console)

### What the User Must Do
1. Create a **Firebase project** → download `google-services.json` → place in `ug-app/android/app/`
2. Create Firebase Admin **service account** → encode to base64 → paste in backend `.env`
3. Create **MSG91** account → get auth key → paste in backend `.env`
4. Provision a **MongoDB Atlas** cluster → paste URI in backend `.env`
5. Deploy backend (Railway / Render / VPS) and update `API_BASE_URL` in app `.env`

---

## Execution Order

1. `ug-backend/` — models → middleware → services → controllers → routes → app.ts
2. `ug-app/` — navigation scaffold → redux → services → screens → components → FCM wiring
3. Documentation: Firebase setup guide + webhook config steps
