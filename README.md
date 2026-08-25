# 🏫 Smart Campus Visitor Management System (VMS)
[live website - https://mit-smart-visitor-management.vercel.app/ ]

A digital visitor management solution designed for college/campus entry gates that replaces manual visitor registers with a fast, secure, and trackable digital check-in/check-out process — complete with QR-based passes, WhatsApp notifications, and in-campus navigation for visitors.

---

## Problem Statement

Most colleges and institutional campuses still rely on **manual visitor registers** at the entry gate, where visitors write their name, phone number, and purpose of visit by hand. This traditional approach leads to several issues:

- ❌ No real-time record of **who is currently inside** the campus.
- ❌ **No automatic notification** to the person/department being visited — security has to call manually.
- ❌ Illegible handwriting makes visitor data **unreliable and hard to search**.
- ❌ Visitors often **get lost** navigating a large campus to find the right department/building.
- ❌ No easy way to generate **visit history, analytics, or audit trails** for security or compliance purposes.
- ❌ Manual checkout is often skipped, leaving **stale "still inside" records**.

This creates security gaps, delays, poor visitor experience, and makes it difficult for campus administration to monitor and audit visitor activity.

---

## Solution

The **Visitor Management System (VMS)** digitizes the entire visitor lifecycle — from entry to exit — using a simple gate-side digital form, automatic QR pass generation, WhatsApp-based communication, and real-time dashboards.

Instead of manual entries, a security guard (or the visitor via a self-service kiosk) fills a short digital form. The system then:

1. Validates and stores the visitor's details securely.
2. Generates a **unique QR-coded visitor pass**.
3. Sends the pass and a **campus navigation link** directly to the visitor's WhatsApp.
4. **Automatically notifies** the concerned person/department of the visitor's arrival.
5. Guides the visitor to the right location using an **interactive campus map**.
6. Logs **check-out time and visit duration** when the visitor exits, updating a live admin dashboard.

This eliminates paperwork, reduces wait times, improves security traceability, and gives campus administrators a live, searchable record of all visitor activity.

---

## Workflow

The system follows a structured entry-to-exit visitor journey:

### 1. Entry & Registration
- Visitor arrives at the **college entry gate**.
- Security/staff opens the VMS application at the gate.
- Visitor's **New Visitor Form** is filled with:
  - Name
  - Phone / WhatsApp number
  - Email (optional)
  - ID / Address details
  - Person or Department to visit
  - Purpose of visit
- Visitor's **photograph is captured**.

### 2. Validation & Storage
- The system **validates** the entered details.
  - If invalid → an error is shown and details are corrected.
  - If valid → details are **stored in the database**.
- A **unique Visitor ID** is generated for tracking.

### 3. QR Pass Generation & Notification
- A **QR-coded visitor pass** is generated, embedding the Visitor ID / secure token.
- The QR pass, along with a **campus navigation link**, is sent to the visitor's **WhatsApp**.
- A **check-in record** is created (Visitor ID, date, entry time, department, purpose, status = `ACTIVE`).
- The visitor is allowed to **enter the campus**.

### 4. Auto-Notification to Host
- The system identifies the **concerned person/department**.
- An **automatic notification** is sent:
  > "Visitor [Name] has entered to meet you."

### 5. In-Campus Navigation
- The visitor opens the internal campus map from WhatsApp.
- If **location access is granted**, the visitor's current position and destination are shown on the map with a **suggested route**.
- If location access is **denied**, the map is shown without live positioning.
- Visitor **navigates the campus** and reaches the concerned person/department.

### 6. Visit Completion & Exit
- Visitor completes their meeting/purpose and returns to the **exit gate**.
- Security **scans the visitor's QR pass**.
- The system retrieves the **active visitor record**.
  - If found → proceeds to checkout.
  - If not found → **manual verification** is performed by security.
- **Check-out time is recorded**, and **visit duration is calculated**.
- Visitor status is updated to `COMPLETED`, and the full record is stored.

### 7. Dashboard Update
- The **Admin Dashboard** is updated in real time with:
  - Active visitors
  - Completed visits
  - Entry/exit history
  - Full visitor details

---

## Key Features 

| Feature | Description |
|---|---|
| 📝 **Digital Visitor Registration** | Quick gate-side form replacing manual paper registers. |
| 📸 **Visitor Photo Capture** | Captures a photo of the visitor for security records. |
| ✅ **Form Validation** | Ensures accurate and complete visitor data before submission. |
| 🆔 **Unique Visitor ID Generation** | Every visitor gets a traceable unique identifier. |
| 🔳 **QR Code Visitor Pass** | Secure, scannable pass generated for each visit. |
| 📲 **WhatsApp Integration** | Sends QR pass and campus map link directly to visitor's WhatsApp. |
| 🔔 **Automatic Host Notification** | Notifies the person/department being visited as soon as the visitor checks in. |
| 🗺️ **Interactive Campus Navigation** | Guides visitors to their destination using an internal campus map with optional live location. |
| ⏱️ **Check-in / Check-out Tracking** | Logs entry time, exit time, and total visit duration automatically. |
| 🛡️ **Manual Verification Fallback** | Allows security to manually verify visitors if QR scan/record lookup fails. |
| 📊 **Real-Time Admin Dashboard** | Displays active visitors, completed visits, and full visitor history for administrators. |
| 🗄️ **Centralized Visitor Database** | Stores all visitor and visit records securely for future reference and auditing. |

---

##  Technologies to be Used


**Frontend**
- React.js / HTML, CSS, JavaScript (Gate kiosk UI & Admin Dashboard)

**Backend**
- Node.js with Express.js (REST API for visitor management)

**Database**
- MongoDB / MySQL (Visitor records, check-in/check-out logs)

**QR Code Generation**
- `qrcode` (Node.js library) for generating secure visitor passes

**WhatsApp Integration**
- WhatsApp Business API / Twilio API (sending QR pass & navigation link)

**Maps & Navigation**
- Custom interactive campus map (SVG/Canvas-based) with Geolocation API for optional live tracking

**Authentication & Security**
- JWT-based authentication for admin/staff access
- Secure tokenization of QR pass data

**Hosting/Deployment**
- Cloud hosting (e.g., Render, Vercel, AWS, or similar)

---

##  System Architecture

The VMS follows a **modular client-server architecture** with clear separation between the gate-side client, backend services, third-party integrations, and the database layer.

```
┌───────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                              │
│                                                                        │
│   ┌─────────────────────────┐         ┌────────────────────────────┐   │
│   │  Entry Gate Kiosk / App  │        │     Admin Dashboard (Web)  │   │
│   │  - Visitor Registration │         │  - Live Visitor Monitoring │   │
│   │  - Photo Capture         │        │  - Reports & Analytics     │   │
│   │  - QR Scan (Exit Gate)   │        │  - Visitor History Search  │   │
│   └────────────┬─────────────┘        └───────────────┬────────────┘   │
└────────────────┼────────────────────────────────────────┼──────────────┘
                 │  REST API (HTTPS)                       │
                 ▼                                          ▼
┌───────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                            │
│                     (Backend Server - Node.js/Express)                │
│                                                                       │
│  ┌─────────────────┐  ┌───────────────────┐   ┌───────────────────┐   │
│  │ Visitor Service │  │ QR Pass Service    │  │ Notification        │ │
│  │ - Validation    │  │ - QR Generation    │  │ Service             │ │
│  │ - Check-in/out  │  │ - Token Encoding   │  │ - WhatsApp Alerts   │ │
│  │ - ID Generation │  │                    │  │ - Host Notification │ │
│  └─────────┬─────────┘└──────────┬─────────┘  └──────────┬──────────┘ |
│            │                        │                       │         │
│  ┌─────────▼────────────────────────▼───────────────────────▼────────┐│
│  │                     Business Logic / API Layer                     │ 
│  └──────────────────────────────┬────────────────────────────────────┘│
└─────────────────────────────────┼──────────────────────────────────────┘
                                   │
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│                           INTEGRATION LAYER                           │
│                                                                       │
│   ┌───────────────────────┐        ┌─────────────────────────────┐    │
│   │  WhatsApp Business API│        │   Campus Map / Navigation   │    │
│   │  (Twilio / Meta API)  │        │   Module (Geolocation API)  │    │
│   └───────────────────────┘        └─────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                               │
│                                                                       │
│   ┌───────────────────────┐        ┌─────────────────────────────┐    │
│   │   Visitor Database    │        │     Visit Logs / History    │    │
│   │  (MongoDB / MySQL)    │        │  (Check-in, Check-out,      │    │
│   │  - Visitor Profiles   │        │   Duration, Status)         │    │
│   └───────────────────────┘        └─────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
```

### Architecture Flow Summary
1. **Client Layer** — Gate kiosk (registration, photo capture, QR scan) and Admin Dashboard interact with the backend over REST API calls.
2. **Application Layer** — The backend server handles core logic: visitor validation, ID/QR generation, check-in/check-out processing, and triggering notifications.
3. **Integration Layer** — External services (WhatsApp API for messaging, Geolocation/Map module for navigation) are called by the application layer to deliver passes, alerts, and directions.
4. **Data Layer** — All visitor profiles and visit logs are persisted in a central database, which powers both real-time dashboard updates and historical reporting.

---

##  Project Status

 **Under Development** — This README reflects the planned features and architecture for the project. Sections will be updated as implementation progresses.




