# 📅 Cal.com Clone — Full-Stack Scheduling Platform

A production-ready, full-stack scheduling platform clone inspired by [Cal.com](https://cal.com). This application replicates the core scheduling workflow: creating event types, configuring availability, sharing public booking links, and managing bookings — all with a premium dark-mode UI.

> **No Login Required**: A default user (**John Doe** — `john@cal.com`) is pre-seeded and automatically logged in. The entire admin dashboard is accessible instantly. The public booking page works without any authentication.

---

## 🖥 Live Demo

| Page | URL | Description |
|------|-----|-------------|
| **Landing Page** | `http://localhost:5173/` | Marketing landing page |
| **Dashboard** | `http://localhost:5173/dashboard` | Event types management |
| **Bookings** | `http://localhost:5173/dashboard/bookings` | View/cancel upcoming & past bookings |
| **Availability** | `http://localhost:5173/dashboard/availability` | Configure availability schedules |
| **Settings** | `http://localhost:5173/dashboard/settings` | User profile & preferences |
| **Book 15min** | `http://localhost:5173/john/15min` | Public: book a 15-min meeting |
| **Book 30min** | `http://localhost:5173/john/30min` | Public: book a 30-min meeting |
| **Book 60min** | `http://localhost:5173/john/60min` | Public: book a 60-min consultation |

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite 8 | SPA with fast HMR |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design |
| **Animations** | Framer Motion | Page transitions, micro-interactions |
| **Routing** | React Router v7 | Client-side navigation |
| **HTTP Client** | Axios | API communication |
| **Calendar** | react-calendar | Date picker for booking page |
| **Dates** | date-fns | Date formatting & comparison |
| **Backend** | Node.js + Express 5 | REST API server |
| **Database** | MongoDB (MongoMemoryServer) | Persistent local data storage |
| **Auth** | JWT (jsonwebtoken) | Token-based authentication |
| **ODM** | Mongoose 9 | MongoDB object modeling |
| **Encryption** | bcryptjs | Password hashing |

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- No MongoDB installation needed — the app uses an embedded database

### 1. Clone the Repository
```bash
git clone https://github.com/RUDRABHATIA1/Cal.COM.git
cd Cal.COM/CAN
```

### 2. Start the Backend
```bash
cd backend
npm install
node server.js
```

**What happens on startup:**
- A local MongoDB instance starts automatically (data persisted in `backend/data/`)
- The database is seeded with:
  - 👤 **1 user** — John Doe (`john@cal.com` / `password123`)
  - 📋 **6 event types** — 15min, 30min, 60min, Pair Programming, Standup, Secret
  - 📅 **2 availability schedules** — Working Hours (Mon–Fri 9AM–5PM) + Evening & Weekends
  - 🗓 **3 date overrides** — Day off, short day, extended hours on upcoming dates
  - 📖 **15 sample bookings** — mix of upcoming, past, pending, and cancelled
  - ⚡ **2 workflows** — Booking Reminder + Thank You Follow-up
- Server listens on `http://localhost:5000`

### 3. Start the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend starts on `http://localhost:5173`

### 4. Open the App
Navigate to `http://localhost:5173/dashboard` — you'll be auto-logged in as John Doe.

---

## ✅ Feature Checklist

### Core Features (Must Have)

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 1 | **Event Types Management** | ✅ | Create, edit, delete event types with title, description, duration (15/30/45/60 min), and URL slug |
| 2 | **Unique Public Booking Links** | ✅ | Each event type has a shareable link: `/:username/:slug` (e.g., `/john/30min`) |
| 3 | **Availability Settings** | ✅ | Set available days, time slots per day (start/end time), and timezone |
| 4 | **Public Booking Page** | ✅ | Calendar view → time slot selection → booking form (name + email + notes) → confirmation page |
| 5 | **Double-Booking Prevention** | ✅ | Server-side conflict check prevents overlapping bookings |
| 6 | **Bookings Dashboard** | ✅ | Tabs: Upcoming, Unconfirmed, Past, Cancelled — with counts and search |
| 7 | **Cancel Bookings** | ✅ | Cancel with reason via modal — updates status and shows in Cancelled tab |

### Bonus Features (Good to Have)

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 1 | **Responsive Design** | ✅ | Mobile, tablet, and desktop layouts |
| 2 | **Multiple Availability Schedules** | ✅ | Create and manage multiple schedules (Working Hours + Evening & Weekends) |
| 3 | **Date Overrides** | ✅ | Block specific dates or set different hours (3 sample overrides seeded) |
| 4 | **Rescheduling Flow** | ✅ | Reschedule existing bookings via `?rescheduleId=` parameter |
| 5 | **Buffer Time** | ✅ | Configurable before/after event buffers per event type |
| 6 | **Custom Booking Questions** | ✅ | Add text, textarea, select custom fields to event types |
| 7 | **Booking Confirmation** | ✅ | Animated confirmation page with event details summary |

### Additional Features

- ✅ Auto-login as John Doe (no auth required)
- ✅ Event type visibility toggle (show/hide from public page)
- ✅ Copy booking link to clipboard
- ✅ Real-time search across event types and bookings
- ✅ Skeleton loading states
- ✅ Animated page transitions (Framer Motion)
- ✅ Dark mode UI matching Cal.com's design
- ✅ Settings page with profile, appearance, and timezone configuration
- ✅ Workflows page (booking reminders & follow-ups)
- ✅ Teams page
- ✅ App store page

---

## 📐 Database Schema Design

### Entity-Relationship Diagram

```
┌──────────┐      1:N      ┌──────────────┐
│   User   │──────────────▶│  EventType   │
│          │               │              │
│  _id     │     1:N       │  _id         │
│  name    │──────┐        │  userId (FK) │
│  email   │      │        │  title       │
│  username│      │        │  slug        │
│  ...     │      │        │  duration    │
└──────────┘      │        │  customInputs│
     │            │        └──────────────┘
     │ 1:N        │               │
     │            │               │ 1:N
     ▼            ▼               ▼
┌──────────────┐  ┌──────────────┐
│ Availability │  │   Booking    │
│              │  │              │
│ _id          │  │ _id          │
│ userId (FK)  │  │ eventTypeId  │
│ name         │  │ hostUserId   │
│ isDefault    │  │ attendeeName │
│ timezone     │  │ startTime    │
│ days[]       │  │ endTime      │
│ overrides[]  │  │ status       │
└──────────────┘  └──────────────┘
```

### Collections

#### User
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `username` | String | Unique, used in booking URLs |
| `email` | String | Unique |
| `password` | String | bcrypt hashed |
| `name` | String | Display name |
| `avatar` | String | Avatar URL |
| `bio` | String | Public bio |
| `timezone` | String | e.g. "Asia/Kolkata" |
| `locale` | String | e.g. "en" |
| `timeFormat` | Number | 12 or 24 |
| `weekStart` | String | Sunday/Monday/Saturday |
| `theme` | String | dark/light/system |
| `brandColor` | String | Hex color |
| `plan` | String | FREE/PRO/TEAMS/ENTERPRISE |
| `completedOnboarding` | Boolean | |
| `defaultScheduleId` | ObjectId | FK → Availability |

#### EventType
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `userId` | ObjectId | FK → User |
| `title` | String | e.g. "30 Min Meeting" |
| `slug` | String | URL-safe, unique per user |
| `description` | String | Event description |
| `length` | Number | Duration in minutes |
| `locationType` | String | google:meet, zoom, etc. |
| `location` | String | Display name |
| `hidden` | Boolean | Visibility toggle |
| `requiresConfirmation` | Boolean | |
| `minimumBookingNotice` | Number | Minutes |
| `beforeEventBuffer` | Number | Buffer before (minutes) |
| `afterEventBuffer` | Number | Buffer after (minutes) |
| `customInputs` | Array | Custom booking questions |
| **Unique Index** | | `(userId, slug)` |

#### Availability
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `userId` | ObjectId | FK → User |
| `name` | String | e.g. "Working Hours" |
| `isDefault` | Boolean | Default schedule flag |
| `timezone` | String | Schedule timezone |
| `days` | Array[DaySchema] | `{ day, enabled, startTime, endTime }` |
| `overrides` | Array[OverrideSchema] | `{ date, startTime, endTime, isOff }` |

#### Booking
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `uid` | String | Auto-generated 8-byte hex |
| `eventTypeId` | ObjectId | FK → EventType |
| `hostUserId` | ObjectId | FK → User |
| `attendeeName` | String | Booker's name |
| `attendeeEmail` | String | Booker's email |
| `attendeeTimezone` | String | Booker's timezone |
| `startTime` | Date | Meeting start |
| `endTime` | Date | Meeting end |
| `title` | String | "Alice <> John Doe" |
| `status` | String | PENDING/ACCEPTED/CANCELLED/RESCHEDULED |
| `cancellationReason` | String | Reason if cancelled |
| `location` | String | Meeting location |
| `meetingUrl` | String | Video call link |
| `notes` | String | Attendee notes |
| `userFieldsResponses` | Mixed | Custom question answers |

#### Workflow
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | Primary key |
| `userId` | ObjectId | FK → User |
| `name` | String | Workflow name |
| `trigger` | String | BEFORE_EVENT/AFTER_EVENT/etc. |
| `time` | Number | Trigger delay |
| `timeUnit` | String | HOUR/MINUTE/DAY |
| `steps` | Array | `{ action, sendTo, emailSubject, ... }` |

### Relationships
```
User  ──1:N──▶  EventType
User  ──1:N──▶  Availability
User  ──1:N──▶  Booking (as host)
User  ──1:N──▶  Workflow
EventType ──1:N──▶  Booking
```

---

## 🏗 Project Structure

```
CAN/
├── .gitignore
├── README.md
│
├── backend/
│   ├── .env.example          # Environment template
│   ├── .env                  # Actual env vars (gitignored)
│   ├── package.json
│   ├── server.js             # Express entry point
│   ├── seed.js               # Database seeding (John Doe + sample data)
│   ├── data/                 # Persistent MongoDB data (gitignored)
│   ├── middleware/
│   │   └── auth.js           # JWT auth + fallback to default user
│   ├── models/
│   │   ├── User.js
│   │   ├── EventType.js
│   │   ├── Availability.js
│   │   ├── Booking.js
│   │   └── Workflow.js
│   └── routes/
│       ├── auth.js           # Auto-login, register, login, Google OAuth
│       ├── eventTypes.js     # CRUD for event types
│       ├── availability.js   # CRUD for availability + public endpoint
│       ├── bookings.js       # Create, list, cancel, reschedule bookings
│       ├── users.js          # User profile & settings
│       └── teams.js          # Team management
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx                    # Entry point
        ├── App.jsx                     # Router configuration
        ├── index.css                   # Global styles + Cal Sans font
        ├── context/
        │   └── AuthContext.jsx         # Auto-login auth context
        ├── utils/
        │   └── api.js                  # Axios instance with JWT interceptor
        ├── components/
        │   ├── DashboardLayout.jsx     # Sidebar + header layout
        │   ├── ProtectedRoute.jsx      # Auth guard (always passes)
        │   ├── Navbar.jsx              # Landing page nav
        │   ├── Hero.jsx                # Landing page hero
        │   ├── Features.jsx            # Landing page features
        │   ├── Footer.jsx              # Landing page footer
        │   ├── Pricing.jsx             # Pricing section
        │   ├── ShareModal.jsx          # Share event type modal
        │   ├── UpgradeModal.jsx        # Upgrade plan modal
        │   └── PageTransition.jsx      # Framer Motion transitions
        └── pages/
            ├── LandingPage.jsx         # Marketing landing page
            ├── Login.jsx               # Login page
            ├── Signup.jsx              # Signup page
            ├── Onboarding.jsx          # Onboarding flow
            ├── dashboard/
            │   ├── EventTypes.jsx      # Event types list + create modal
            │   ├── EditEventType.jsx   # Edit event type (full settings)
            │   ├── Bookings.jsx        # Bookings list + cancel modal
            │   ├── Availability.jsx    # Availability schedules list
            │   ├── EditAvailability.jsx# Edit schedule + date overrides
            │   ├── Apps.jsx            # App store
            │   ├── InstalledApps.jsx   # Installed apps
            │   ├── Insights.jsx        # Analytics dashboard
            │   ├── Workflows.jsx       # Automation workflows
            │   ├── Teams.jsx           # Team management
            │   ├── RoutingForms.jsx    # Routing forms
            │   └── Settings.jsx        # User settings
            └── public/
                └── BookingPage.jsx     # Public booking flow (calendar → time → form → confirm)
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/auth/auto-login` | No | Get JWT for default user (John Doe) |
| POST | `/api/auth/login` | No | Login with email/password |
| POST | `/api/auth/register` | No | Create new account |
| GET | `/api/auth/me` | Yes | Get current user profile |

### Event Types
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/event-types` | Yes | List all event types |
| GET | `/api/event-types/:id` | Yes | Get single event type |
| POST | `/api/event-types` | Yes | Create new event type |
| PATCH | `/api/event-types/:id` | Yes | Update event type |
| DELETE | `/api/event-types/:id` | Yes | Delete event type |

### Availability
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/availability` | Yes | List all schedules |
| POST | `/api/availability` | Yes | Create new schedule |
| GET | `/api/availability/:id` | Yes | Get schedule details |
| PATCH | `/api/availability/:id` | Yes | Update schedule |
| DELETE | `/api/availability/:id` | Yes | Delete schedule |
| GET | `/api/availability/public/:userId` | No | Get default schedule (for booking page) |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/bookings` | Yes | List all bookings |
| GET | `/api/bookings/:id` | Yes | Get single booking |
| POST | `/api/bookings` | No | Create booking (public) |
| PATCH | `/api/bookings/:id/cancel` | Yes | Cancel booking with reason |
| PATCH | `/api/bookings/:id/reschedule` | No | Reschedule booking (public) |
| GET | `/api/bookings/public/:username/:slug` | No | Get event info for booking page |
| GET | `/api/bookings/public/:userId/:date` | No | Get busy slots for a date |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me` | Yes | Get current user |
| PUT | `/api/users/profile` | Yes | Update profile |
| PUT | `/api/users/settings` | Yes | Update settings |

---

## 🗂 Seed Data (Pre-loaded)

### Default User
| Field | Value |
|-------|-------|
| Name | John Doe |
| Email | john@cal.com |
| Password | password123 |
| Username | john |
| Timezone | Asia/Kolkata |
| Plan | PRO |

### Event Types (6)
| Title | Slug | Duration | Location | Visibility |
|-------|------|----------|----------|------------|
| 15 Min Meeting | `15min` | 15 min | Google Meet | Public |
| 30 Min Meeting | `30min` | 30 min | Google Meet | Public |
| 60 Min Consultation | `60min` | 60 min | Zoom | Public |
| Pair Programming | `pair-programming` | 45 min | Google Meet | Public |
| Team Standup | `standup` | 15 min | Google Meet | Public |
| Secret Beta Session | `secret` | 45 min | Google Meet | Hidden |

### Availability Schedules (2)
| Name | Days | Hours | Timezone |
|------|------|-------|----------|
| Working Hours **(default)** | Mon–Fri | 9:00 AM – 5:00 PM | Asia/Kolkata |
| Evening & Weekends | Mon,Tue,Thu,Fri evenings + Sat,Sun | Varies | Asia/Kolkata |

### Sample Bookings (15)
- **8 upcoming** — mix of ACCEPTED and PENDING status
- **5 past** — completed meetings
- **2 cancelled** — with cancellation reasons

### Date Overrides (3)
- Day off (next week)
- Short day — 10:00 AM to 2:00 PM (two weeks out)
- Extended hours — 8:00 AM to 8:00 PM (three weeks out)

---

## 📝 Assumptions Made

1. **Default User**: A pre-seeded user "John Doe" (`john@cal.com`) is automatically logged in. No registration or login is required.
2. **No Real Email**: Email notifications are not sent. The booking confirmation is displayed in-app only.
3. **No Real Calendar Integration**: Google Meet / Zoom links are simulated. No actual calendar events are created.
4. **Local Database**: MongoDB runs locally via `mongodb-memory-server` with data persisted to disk in `backend/data/`. No external MongoDB instance is required for local development.
5. **Single User Mode**: The admin dashboard operates in single-user mode (John Doe). The public booking page supports any seeded user via `/:username/:slug`.
6. **Timezone**: The default timezone is set to `Asia/Kolkata`. Users can change this in availability settings.
7. **Meeting URLs**: Simulated Google Meet URLs are auto-generated on booking creation.

---

## 🚢 Deployment

### Production (with MongoDB Atlas)

1. Create a MongoDB Atlas cluster and get the connection string
2. Set environment variables:
   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_production_secret
   ```
3. Backend: `npm start` (runs `node server.js`)
4. Frontend: `npm run build` then serve the `dist/` folder

### Render / Railway
- See `render.yaml` for Render Blueprint configuration
- See `netlify.toml` for Netlify frontend deployment

---

## 📄 License

This project is built for educational and demonstration purposes.
