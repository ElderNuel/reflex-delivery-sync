# Reflex – Delivery Sync System

> A real-time delivery coordination prototype for small retailers in Kenya.

**Project Status:** Prototype / MVP  
**Sprint:** Readiness Sprint

## 🚀 Overview

Reflex is a prototype delivery coordination system designed for small retailers who currently manage deliveries through WhatsApp messages and phone calls.

It provides a central system where:

- Retailer staff create delivery requests.
- Dispatchers view and assign deliveries to riders.
- Riders view their assigned deliveries and update delivery statuses.
- All changes are synchronised across views in real time using Firebase Realtime Database.

---

## 📌 Problem Statement

Small retailers often coordinate deliveries through WhatsApp messages and phone calls. This can lead to:

- No central record of delivery requests.
- Difficulty tracking delivery progress.
- Unclear rider assignments.
- Limited visibility of delivery status.
- Delays in communicating updates between retailers, dispatchers, and riders.

---

## 💡 Solution

Reflex provides a simple, centralised delivery coordination workflow connecting retailers, dispatchers, and riders through a shared Firebase Realtime Database.

### Delivery Workflow

```text
Retailer
   │
   │ Creates Delivery Request
   ▼
 OPEN
   │
   │ Dispatcher assigns Rider
   ▼
ASSIGNED
   │
   │ Rider collects order
   ▼
PICKED_UP
   │
   │ Rider completes delivery
   ▼
DELIVERED
```

All three views communicate with the same delivery records in Firebase, allowing changes made by one user to be reflected in the other views without manually refreshing the page.

---

## 🏗️ System Architecture

```text
                  Firebase Realtime Database
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   Retailer (Abraham)  Dispatcher (Milkah)  Rider (Tracy)
         │                 │                 │
   Create Request     Assign Rider     Update Status
         │                 │                 │
         └─────────────────┴─────────────────┘
                   Real-Time Sync
         ─────────────────────────────────────
         ⚡ 3-in-1 Live Simulator (/simulator.html)
```

### Application Roles & Personas

- **Retailer View (`/retailer/` - Abraham):** Creates delivery requests with status `OPEN`. Generates parcel QR verification codes.
- **Dispatcher View (`/dispatcher/` - Milkah):** Real-time monitoring engine. Assigns open delivery requests to active fleet riders (`rider_01`, `rider_02`, `rider_03`). Tracks Active Trips and Completed Deliveries.
- **Rider View (`/rider/` - Tracy Wangari):** Rider terminal with quick-switch persona support. Allows riders to scan/verify QR codes and transition status through `ASSIGNED` → `PICKED_UP` → `DELIVERED`.
- **3-in-1 Live Simulator (`/simulator.html`):** Split-screen live evaluation dashboard displaying Retailer, Dispatcher, and Rider terminals side-by-side with real-time sync metrics and automated test seeders.

---

## 📦 Delivery Data Model

All views read and write using an aligned contract supporting both primary fields and backward-compatible aliases:

```json
{
  "id": "DEL-1042",
  "customerName": "Amina Mohamed",
  "phone": "0712345678",
  "address": "Moi Avenue, Shop #4",
  "itemDescription": "Grocery package",
  "status": "OPEN",
  "assignedRider": null,
  "riderId": null,
  "retailerId": "retailer_01",
  "qrHash": "A87F2B1C",
  "createdAt": 1726941200000,
  "updatedAt": 1726941200000
}
```

| Field | Type | Description |
|---|---|---|
| `id` | String | Unique delivery identifier (e.g. `DEL-1042`) |
| `customerName` | String | Customer's full name |
| `phone` | String | Customer's contact number |
| `address` | String | Delivery destination |
| `itemDescription` | String | Description of the parcel |
| `status` | String | `OPEN` → `ASSIGNED` → `PICKED_UP` → `DELIVERED` |
| `assignedRider` | String / null | Rider identifier (`rider_01`, `rider_02`, `rider_03`) |
| `riderId` | String / null | Schema alias for assignment compatibility |
| `qrHash` | String | Checksum hash for proof of handoff verification |
| `retailerId` | String | Identifier for the originating merchant |
| `createdAt` | Number | Millisecond epoch timestamp |
| `updatedAt` | Number | Millisecond epoch timestamp |

---

## 🔄 Delivery Status Transitions

| Status | Trigger | Role | Live Sync Result |
|---|---|---|---|
| `OPEN` | Request submitted | Retailer | Instantly pops into Dispatcher Inbound Queue |
| `ASSIGNED` | Rider selected & dispatched | Dispatcher | Moves into Active Trips & appears on Rider's terminal |
| `PICKED_UP` | Rider confirms package pickup | Rider | Badge updates to purple across all 3 portals |
| `DELIVERED` | Rider confirms drop-off / proof | Rider | Moves to Completed Deliveries with Proof Confirmed |

---

## ⚙️ Design Decisions

| Decision | Rationale | Trade-off Accepted |
|---|---|---|
| **Firebase Realtime Database** | Out-of-the-box bidirectional synchronisation across three roles without building a backend API | Vendor lock-in and limited offline queueing |
| **Vanilla JavaScript + ES Modules** | Zero build step; team members can open and debug the application easily | No component reusability and manual DOM management |
| **Tailwind CSS via CDN** | Enabled rapid styling of the three views without building a design system | No purging and a larger payload |
| **Client-side assignment** | Dispatcher writes `assignedRider` directly to the database | No server-side validation and possible double-assignment under race conditions |
| **No authentication layer** | Kept the sprint focused on the core delivery workflow | Anyone with the URL can potentially read/write; not production-safe |

---

## ⚠️ Known Trade-offs & Sprint Solutions

We surfaced these considerations during the sprint and addressed the highest-impact UX & verification gaps directly in our prototype:

| Consideration | Initial Trade-off | Solution Implemented in Prototype |
|---|---|---|
| **Proof of Handoff** | No package verification at pickup | Built `qr-utils.js` generating live QR codes with deterministic parcel hashes on Retailer & Rider screens |
| **Multi-Screen Testing** | Hard to present 3 tabs simultaneously during evaluation | Created `simulator.html` displaying Retailer, Dispatcher, and Rider side-by-side with live sync |
| **Rider Persona Fleet** | Hardcoded to a single rider in early test | Added interactive rider switcher supporting Tracy Wangari (`rider_01`), David Ochieng (`rider_02`), and Grace Wanjiku (`rider_03`) |
| **Proof of Delivery Visibility** | Completed deliveries disappeared on refresh | Added dedicated "Delivered & Confirmed" history sections in Dispatcher and Rider views |
| **Schema Compatibility** | Variance between `assignedRider` and legacy `riderId` | Unified data layer that supports both keys interchangeably across all views |
| **Authentication** | Kept open for rapid sprint evaluation | Documented for production phase with Firebase Auth & Firestore security rules |

---

## 🛠️ Technology Stack

- **HTML5** – Responsive semantic application markup
- **Tailwind CSS** – Styling and responsive design system
- **JavaScript (ES Modules)** – Modular client-side architecture and Firebase integration
- **Node.js + Express** – Lightweight static delivery server and `/api/config` environment bridge
- **Vercel Edge & Serverless** – Production deployment with `vercel.json` clean routing
- **Firebase Realtime Database** – Distributed real-time event streaming and state synchronization
- **Vector QR Engine (`qr-utils.js`)** – Deterministic SVG QR code generator with cryptographic parcel hashing
- **Live Simulator (`simulator.html`)** – Side-by-side multi-portal real-time test environment

---

## 📁 Project Structure

```text
reflex-delivery-sync/
│
├── index.html                  # Main launchpad & portal selector
├── simulator.html              # ⚡ 3-in-1 Live Simulator (Root entrypoint)
├── firebase.js                 # Shared Firebase Realtime Database configuration
├── qr-utils.js                 # SVG QR generator & security hash helper
├── server.js                   # Node.js + Express local dev server & API proxy
├── vercel.json                 # Vercel deployment & clean URL routing rules
├── package.json                # Project dependencies, start, build, and lint scripts
├── README.md                   # System documentation & evaluation walkthrough
│
├── api/
│   └── config.js               # Native Vercel Serverless Function for /api/config
│
├── simulator/
│   └── index.html              # 3-in-1 Live Simulator (Directory entrypoint)
│
├── retailer/
│   └── index.html              # Retailer Portal (Create order + generate QR)
│
├── dispatcher/
│   └── index.html              # Dispatcher Engine (Assign riders + monitor active trips)
│
└── rider/
    └── index.html              # Rider Terminal (Verify QR + Pick Up + Proof of Delivery)
```

The shared `firebase.js` file is imported by all views, ensuring they read from and write to the same Firebase Realtime Database path (`deliveries`).

---

## 🔥 Firebase Setup

### 1. Create a Firebase Project

Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

### 2. Enable Realtime Database

Enable **Firebase Realtime Database** for the project.

> Ensure you use Realtime Database rather than Firestore for this implementation.

### 3. Get Your Firebase Web Configuration

In **Project Settings**, copy your Firebase web application configuration.

### 4. Add Configuration to `firebase.js` or Environment Variables

The application supports both environment variables via `/api/config` and direct fallback in `firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 💻 Running the Project Locally

### Option A: Using Node.js (Recommended)

Install dependencies and start the local server:

```bash
npm install
npm run dev
```

The server starts on port `3000`:

```text
http://localhost:3000
```

### Option B: Using Python HTTP Server

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Application URLs

- **⚡ 3-in-1 Live Simulator (Recommended for Demo):** `/simulator` or `/simulator.html`
- **Retailer View:** `/retailer/` or `/retailer`
- **Dispatcher View:** `/dispatcher/` or `/dispatcher`
- **Rider View:** `/rider/` or `/rider`

---

## 🌐 Production & Vercel Deployment

The project includes a production-ready `vercel.json` configuration for hosting on Vercel (e.g. `reflexsync.vercel.app`):

```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/simulator", "destination": "/simulator/index.html" },
    { "source": "/simulator.html", "destination": "/simulator/index.html" },
    { "source": "/retailer", "destination": "/retailer/index.html" },
    { "source": "/dispatcher", "destination": "/dispatcher/index.html" },
    { "source": "/rider", "destination": "/rider/index.html" }
  ]
}
```

### Architecture Highlights on Vercel
1. **Zero 404 Routing**: Directory index structures (`/simulator/index.html`, `/retailer/index.html`, `/dispatcher/index.html`, `/rider/index.html`) combined with clean rewrites ensure requests to `/simulator`, `/simulator/`, and `/simulator.html` resolve identically without trailing-slash or `Cannot GET` errors.
2. **Native Edge API (`/api/config.js`)**: Runs as a lightweight Vercel serverless function returning the Firebase configuration directly from environment variables.
3. **Deploying Updates**: Commit and push changes to GitHub. Vercel automatically deploys the updated build.

---

## 🧪 Demo Script (3-Minute Evaluation Walkthrough)

To observe all three personas updating live simultaneously without juggling separate browser windows, open `/simulator.html` or open 3 browser tabs.

| Step | Persona | Action | Live Real-Time Result |
|---|---|---|---|
| **1** | **Abraham (Retailer)** | Fill in customer **Amina Mohamed**, item **Fresh Bakery Box**, address **Moi Avenue**, and submit. | Request is written to Firebase. Status is `OPEN`. An order card appears with a **View QR** button. |
| **2** | **Milkah (Dispatcher)** | View the Inbound Queue. | The order appears **instantly without page refresh**. Inbound count increments. |
| **3** | **Milkah (Dispatcher)** | Select **Tracy Wangari (rider_01)** from the dropdown and click **Dispatch Rider**. | Order transitions to `ASSIGNED`. Card moves to Active Trips section in Dispatcher. |
| **4** | **Tracy Wangari (Rider)** | View the Rider Terminal (defaults to `rider_01`). | The delivery appears automatically in Tracy's assignments. |
| **5** | **Tracy Wangari (Rider)** | Click **QR Verify** to inspect package checksum, then click **Mark as Picked Up**. | Status transitions to `PICKED_UP`. Badge turns purple on **all three screens simultaneously**. |
| **6** | **Tracy Wangari (Rider)** | Click **Mark as Delivered**. | Status changes to `DELIVERED`. Order moves into **Completed Deliveries** with Proof of Delivery confirmed across all portals. |

> **Key talking point for evaluators:** All 3 views synchronize with zero polling and zero manual reloads. Updates propagate in sub-second latency through Firebase Realtime Database websocket listeners.

---

## ⚡ Real-Time Synchronisation

Firebase Realtime Database acts as the shared source of delivery information.

```text
Retailer creates delivery
          │
          ▼
       Firebase
          │
          ▼
Dispatcher receives request
          │
          ▼
Dispatcher assigns rider
          │
          ▼
       Firebase
          │
          ▼
Rider receives assignment
          │
          ▼
Rider updates status
          │
          ▼
       Firebase
          │
          ▼
Retailer + Dispatcher see updated status
```

The application uses Firebase listeners to detect changes to delivery records and update the user interface without requiring a manual page refresh.

---

## 🚀 Future Roadmap

With additional development time, Reflex could be extended with:

- User authentication and role-based access control.
- Multiple riders and dispatcher accounts.
- Rider location tracking.
- Automated rider assignment using a nearest-rider algorithm.
- Delivery history and reporting dashboards.
- Improved offline support and conflict resolution.
- Order confirmation scanning using QR codes or barcodes.
- Push notifications for delivery status changes.
- A repository/service layer to abstract Firebase database operations.
- Unit and integration tests.

---

## 📊 Project Status

**Prototype / MVP**

Reflex currently demonstrates the core delivery coordination and real-time synchronisation workflow across the following roles:

- Retailer
- Dispatcher
- Rider

The project focuses on validating the core workflow and real-time data synchronisation rather than providing a production-ready delivery management platform.

---

## 👥 Contributors

Built by the **Group 36 - Team Syntactix** for the Readiness Sprint:

- **Swaleh Rama**
- **Tracy Wangari**
- **Emmanuel Ukah**
- **Abraham Makur Mayor Nyidier**
- **Milkah Michira**

---

## 📄 License

This project was developed as a prototype for the Readiness Sprint. Add an appropriate license before using or distributing the project beyond its intended prototype scope.
