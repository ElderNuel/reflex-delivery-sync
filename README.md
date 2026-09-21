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
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Retailer        Dispatcher         Rider
          │                │                │
  Create Request     Assign Rider     Update Status
          │                │                │
          └────────────────┴────────────────┘
                    Real-Time Sync
```

### Application Roles

- **Retailer View:** Creates a new delivery request with the status `OPEN`.
- **Dispatcher View:** Listens for new `OPEN` deliveries and assigns an available rider. The status changes to `ASSIGNED`.
- **Rider View:** Sees deliveries assigned to them and updates the status through `ASSIGNED` → `PICKED_UP` → `DELIVERED`.

All changes are written back to Firebase and reflected across the other views in real time.

---

## 📦 Delivery Data Model

All three views use the same delivery object and field structure:

```json
{
  "id": "DEL-001",
  "customerName": "Amina Mohamed",
  "phone": "0712345678",
  "address": "Moi Avenue, Shop #4",
  "itemDescription": "Grocery order",
  "status": "OPEN",
  "assignedRider": null
}
```

| Field | Type | Description |
|---|---|---|
| `id` | String | Unique delivery identifier |
| `customerName` | String | Customer's full name |
| `phone` | String | Customer's contact number |
| `address` | String | Delivery destination |
| `itemDescription` | String | Description of the item being delivered |
| `status` | String | Current delivery status |
| `assignedRider` | String / null | Rider assigned to the delivery |

---

## 🔄 Delivery Statuses

| Status | Description |
|---|---|
| `OPEN` | Delivery request has been created and is waiting for dispatch |
| `ASSIGNED` | Dispatcher has assigned the delivery to a rider |
| `PICKED_UP` | Rider has collected the delivery |
| `DELIVERED` | Rider has completed the delivery |

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

## ⚠️ Known Trade-offs

We surfaced these limitations deliberately so they can be honestly evaluated and addressed in future iterations.

| Weak Point | Why We Accepted It | What We'd Do With More Time |
|---|---|---|
| **No authentication or role guards** | Firebase Auth would add additional configuration and UI flow, so features were frozen early in the sprint | Add Firebase Authentication and database security rules scoped by user ID |
| **No conflict resolution on assignment** | Two dispatchers could overwrite the same `assignedRider` field | Move assignment logic to a Firebase Cloud Function with a transaction lock |
| **No offline support** | Realtime Database syncs live, but riders may lose signal on the road | Implement an IndexedDB queue and background sync for status updates |
| **No order confirmation scanning** | Scoped out to keep the MVP focused on the core workflow | Add QR/barcode scanning via the Web Barcode Detection API at pickup and delivery handoffs |
| **Business logic is client-side** | Fastest path to a working demonstration | Extract logic into a service/repository layer and add unit tests |

> **Note on scanning:** QR/barcode scanning was explicitly scoped out of the MVP. A future implementation could use the device camera to scan a package at pickup and delivery, writing a `scannedAt` timestamp to Firebase as proof of handoff.

---

## 🛠️ Technology Stack

- **HTML5** – Application structure
- **Tailwind CSS** – Styling and responsive user interface
- **JavaScript (ES Modules)** – Application logic and Firebase integration
- **Firebase Realtime Database** – Shared delivery data and real-time synchronisation
- **Firebase Hosting / Vercel** – Application deployment

---

## 📁 Project Structure

```text
reflex-delivery-sync/
│
├── firebase.js                 # Shared Firebase config + DB reference
├── index.html                  # Landing page with role selection
├── README.md
│
├── retailer/
│   └── index.html              # Create delivery requests
│
├── dispatcher/
│   └── index.html              # View OPEN deliveries + assign riders
│
└── rider/
    └── index.html              # View assigned deliveries + update status
```

The shared `firebase.js` file is imported by all three views, ensuring they read from and write to the same Firebase Realtime Database path.

---

## 🔥 Firebase Setup

### 1. Create a Firebase Project

Go to the Firebase Console and create a new project.

### 2. Enable Realtime Database

Enable **Firebase Realtime Database** for the project.

> Ensure you use Realtime Database rather than Firestore for this implementation.

### 3. Get Your Firebase Web Configuration

In **Project Settings**, copy your Firebase web application configuration.

### 4. Add Configuration to `firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace the placeholder values with your Firebase project's actual configuration.

### 5. Configure Database Rules for Prototyping

For prototype testing, the following rules may be used:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ **Warning:** These rules allow unrestricted read and write access. They are suitable only for controlled prototyping and must be secured before production deployment.

---

## 💻 Running the Project Locally

Because the project uses JavaScript modules and Firebase, it should be served through a local web server rather than opened directly using `file://`.

### Option: Python HTTP Server

From the project directory, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Individual Application Views

You can access each role directly:

- **Retailer:** `http://localhost:8000/retailer/`
- **Dispatcher:** `http://localhost:8000/dispatcher/`
- **Rider:** `http://localhost:8000/rider/`

---

## 🧪 Demo Script

Use the following workflow to demonstrate the complete system in under three minutes.

| Step | Action | Expected Result |
|---|---|---|
| **1** | Open `/retailer/` and create a delivery for **Amina Mohamed** | A new delivery appears with status `OPEN` |
| **2** | Open `/dispatcher/` in a second tab | The `OPEN` delivery appears automatically via the Firebase listener |
| **3** | Dispatcher assigns the delivery to **Rider John** | Status changes to `ASSIGNED` |
| **4** | Open `/rider/` in a third tab | Rider John sees the assigned delivery |
| **5** | Rider clicks **Pick Up** | Status changes to `PICKED_UP`; retailer and dispatcher see the update live |
| **6** | Rider clicks **Delivered** | Status changes to `DELIVERED`; the workflow is complete |

> **Key talking point:** All three tabs update without a manual refresh. This is enabled by Firebase Realtime Database listeners.

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
