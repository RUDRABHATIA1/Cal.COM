# Cal.com Clone — Scheduling Platform

A full-stack scheduling platform clone inspired by [Cal.com](https://cal.com). This application allows users to create event types, set their availability, share public booking links, and manage their bookings — all without requiring login.

> **Note**: A default user (**John Doe**) is pre-seeded and automatically logged in. No login or signup is required to access any part of the application.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | SPA with fast HMR |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design |
| **Animations** | Framer Motion | Page transitions, micro-interactions |
| **Routing** | React Router v6 | Client-side navigation |
| **HTTP Client** | Axios | API communication |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB (via MongoMemoryServer) | Persistent local data storage |
| **Auth** | JWT (jsonwebtoken) | Token-based authentication |
| **ODM** | Mongoose | MongoDB object modeling |

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cal.com/CAN
```

### 2. Start the Backend
```bash
cd backend
npm install
node server.js
```
The backend will:
- Start a local MongoDB instance (data persisted in `backend/data/`)
- Seed the database with a default user, event types, availability, and sample bookings
- Listen on `http://localhost:5000`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

### 4. Access the Application
| URL | Description |
|-----|-------------|
| `http://localhost:5173/` | Landing page (marketing) |
| `http://localhost:5173/dashboard` | Admin dashboard (event types) |
| `http://localhost:5173/dashboard/bookings` | Bookings management |
| `http://localhost:5173/dashboard/availability` | Availability settings |
| `http://localhost:5173/john/15min` | Public booking page (15 min) |
| `http://localhost:5173/john/30min` | Public booking page (30 min) |

---

## 📐 Database Schema Design

### User
```
┌──────────────────────────────────────┐
│ User                                 │
├──────────────────────────────────────┤
│ _id          : ObjectId (PK)        │
│ username     : String (unique)       │
│ email        : String (unique)       │
│ password     : String (hashed)       │
│ name         : String                │
│ avatar       : String                │
│ bio          : String                │
│ timezone     : String                │
│ locale       : String                │
│ timeFormat   : Number (12|24)        │
│ weekStart    : String                │
│ theme        : String                │
│ brandColor   : String                │
│ plan         : String (FREE|PRO|...) │
│ completedOnboarding : Boolean        │
│ defaultScheduleId   : ObjectId (FK)  │
│ createdAt    : Date                  │
│ updatedAt    : Date                  │
└──────────────────────────────────────┘
```

### EventType
```
┌──────────────────────────────────────┐
│ EventType                            │
├──────────────────────────────────────┤
│ _id                 : ObjectId (PK)  │
│ userId              : ObjectId (FK → User) │
│ title               : String         │
│ slug                : String         │
│ description         : String         │
│ length              : Number (mins)  │
│ locationType        : String         │
│ location            : String         │
│ hidden              : Boolean        │
│ requiresConfirmation: Boolean        │
│ minimumBookingNotice: Number (mins)  │
│ beforeEventBuffer   : Number (mins)  │
│ afterEventBuffer    : Number (mins)  │
│ customInputs        : Array[Object]  │
│ price               : Number         │
│ requiresPayment     : Boolean        │
│ createdAt           : Date           │
│ updatedAt           : Date           │
└──────────────────────────────────────┘
Unique Index: (userId, slug)
```

### Availability
```
┌──────────────────────────────────────┐
│ Availability                         │
├──────────────────────────────────────┤
│ _id       : ObjectId (PK)           │
│ userId    : ObjectId (FK → User)    │
│ name      : String                   │
│ isDefault : Boolean                  │
│ timezone  : String                   │
│ days      : Array[DaySchema]         │
│   ├─ day       : String (e.g. "Monday") │
│   ├─ enabled   : Boolean            │
│   ├─ startTime : String (HH:mm)     │
│   └─ endTime   : String (HH:mm)     │
│ overrides : Array[OverrideSchema]    │
│   ├─ date      : String (YYYY-MM-DD)│
│   ├─ startTime : String (HH:mm)     │
│   ├─ endTime   : String (HH:mm)     │
│   └─ isOff     : Boolean            │
│ createdAt : Date                     │
│ updatedAt : Date                     │
└──────────────────────────────────────┘
```

### Booking
```
┌──────────────────────────────────────┐
│ Booking                              │
├──────────────────────────────────────┤
│ _id              : ObjectId (PK)     │
│ uid              : String (unique)   │
│ eventTypeId      : ObjectId (FK → EventType) │
│ hostUserId       : ObjectId (FK → User)      │
│ attendeeName     : String            │
│ attendeeEmail    : String            │
│ attendeeTimezone : String            │
│ startTime        : Date              │
│ endTime          : Date              │
│ title            : String            │
│ notes            : String            │
│ status           : String (PENDING|ACCEPTED|CANCELLED|RESCHEDULED) │
│ cancellationReason : String          │
│ location         : String            │
│ meetingUrl       : String            │
│ paid             : Boolean           │
│ createdAt        : Date              │
│ updatedAt        : Date              │
└──────────────────────────────────────┘
Auto-generated: uid (8-byte hex on save)
```

### Workflow
```
┌──────────────────────────────────────┐
│ Workflow                             │
├──────────────────────────────────────┤
│ _id      : ObjectId (PK)            │
│ userId   : ObjectId (FK → User)     │
│ name     : String                    │
│ trigger  : String (BEFORE_EVENT|...) │
│ time     : Number                    │
│ timeUnit : String (HOUR|MINUTE)      │
│ steps    : Array[StepSchema]         │
│ createdAt: Date                      │
│ updatedAt: Date                      │
└──────────────────────────────────────┘
```

### Entity Relationships
```
User  ──1:N──  EventType
User  ──1:N──  Availability
User  ──1:N──  Booking (as host)
User  ──1:N──  Workflow
EventType ──1:N── Booking
```

---

## ✅ Feature Checklist

### Core Features (Must Have)
- [x] **Event Types Management** — Create, edit, delete event types with title, description, duration, URL slug
- [x] **Unique Public Booking Links** — Each event type has a public link (`/:username/:slug`)
- [x] **Availability Settings** — Set available days, time slots per day, and timezone
- [x] **Public Booking Page** — Calendar view, time slot selection, booking form (name + email), double-booking prevention, confirmation page
- [x] **Bookings Dashboard** — View upcoming bookings, view past bookings, cancel bookings

### Good to Have (Bonus)
- [x] **Responsive Design** — Mobile, tablet, and desktop layouts
- [x] **Multiple Availability Schedules** — Create and manage multiple schedules
- [x] **Date Overrides** — Block specific dates or set different hours
- [x] **Rescheduling Flow** — Reschedule existing bookings via `?rescheduleId=`
- [x] **Buffer Time** — Configurable before/after event buffers
- [x] **Custom Booking Questions** — Add custom input fields to event types

### Important Notes Compliance
- [x] **UI Design** — Closely resembles Cal.com's design patterns
- [x] **No Login Required** — Default user (John Doe) is auto-logged in; dashboard always accessible
- [x] **Sample Data** — Database seeded with 4 event types and 5 bookings
- [x] **Database Design** — 5 collections with proper relationships and indexes
- [x] **README File** — This file (setup instructions, tech stack, assumptions)

---

## 🏗 Project Structure

```
CAN/
├── backend/
│   ├── data/              # Persistent MongoDB data
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── EventType.js
│   │   ├── Availability.js
│   │   ├── Booking.js
│   │   └── Workflow.js
│   ├── routes/
│   │   ├── auth.js        # Auto-login, register, login, Google OAuth
│   │   ├── eventTypes.js  # CRUD for event types
│   │   ├── availability.js# CRUD for availability schedules
│   │   ├── bookings.js    # Booking creation, listing, cancellation, rescheduling
│   │   ├── users.js       # User profile
│   │   └── teams.js       # Team management
│   ├── seed.js            # Database seeding script
│   ├── server.js          # Express server entry point
│   └── .env               # Environment variables
│
└── frontend/
    └── src/
        ├── components/    # Reusable UI components
        ├── context/       # React Context (AuthContext)
        ├── pages/
        │   ├── dashboard/ # Admin pages (EventTypes, Bookings, Availability, etc.)
        │   └── public/    # Public booking page
        ├── utils/         # API client (Axios)
        ├── App.jsx        # Router configuration
        └── main.jsx       # Entry point
```

---

## 📝 Assumptions Made

1. **Default User**: A pre-seeded user "John Doe" (`john@cal.com`) is automatically logged in. No registration or login is required.
2. **No Real Email**: Email notifications are not sent. The booking confirmation is displayed in-app only.
3. **No Real Calendar Integration**: Google Meet / Zoom links are simulated. No actual calendar events are created.
4. **Local Database**: MongoDB runs locally via `mongodb-memory-server` with data persisted to disk in `backend/data/`. No external MongoDB instance is required.
5. **Single User Mode**: The admin dashboard operates in single-user mode (John Doe). The public booking page supports any seeded user.
6. **Timezone**: The default timezone is set to `Asia/Kolkata`. Users can change this in availability settings.
