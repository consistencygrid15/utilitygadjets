# utilitygadjets

> GSM-based Smart Home Security System — UG (UtilityGadgets)

## Project Structure

```
utilitygadjets/
├── ug-backend/   → Node.js + Express + MongoDB Backend
└── ug-app/       → React Native Mobile App
```

## Backend Setup

```bash
cd ug-backend
npm install
cp .env.example .env   # Fill in your credentials
npm run dev
```

## App Setup

```bash
cd ug-app
npm install
npm start
# In another terminal:
npm run android
```

## Tech Stack

- React Native CLI (JavaScript)
- Node.js + Express + MongoDB
- Firebase Cloud Messaging (Push Notifications)
- MSG91 (SMS Gateway)
- Redux Toolkit
- JWT Authentication
