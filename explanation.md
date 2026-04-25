# Cal.com Clone: Technical Explanation

This document provides a detailed breakdown of the project architecture, component design, and core logic.

## 1. Technology Stack
- **Frontend:** React (Vite), Tailwind CSS 4, Framer Motion (animations), Lucide React (icons).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (with Mongoose ODM).
- **Date Handling:** `date-fns` for time slot calculations and formatting.

---

## 2. Frontend Architecture

The frontend is built with a modular component-based approach, focusing on reusability and responsiveness.

### Core Components

#### `DashboardLayout.jsx`
- **Purpose:** Acts as a wrapper for all authenticated dashboard pages.
- **Function:** It provides the consistent sidebar, top navigation, and mobile drawer. It ensures that whenever a user is in the dashboard, the navigation state is preserved.
- **Responsiveness:** Uses a "slide-over" drawer on mobile and a fixed sidebar on desktop.

#### `Navbar.jsx` & `Hero.jsx`
- **Purpose:** The "front door" of the application.
- **Function:** `Navbar` handles navigation links and the call-to-action buttons. `Hero` creates the visual impact with an interactive-looking booking widget mockup.
- **Design:** Uses glassmorphism and subtle gradients to feel premium.

### Feature Pages

#### `EventTypes.jsx`
- **Purpose:** Management of meeting types (e.g., "15 Min Quick Chat").
- **Logic:** It fetches all event types from the backend and displays them in a list. Each card allows for editing, deleting, or copying the public link.
- **Purpose Solved:** Centralizes meeting creation so users don't have to manually share their availability every time.

#### `BookingPage.jsx` (Public Page)
- **Purpose:** The actual interface where guest users book a slot.
- **Logic:** 
    1. Fetches the host's event details and availability.
    2. Uses a **Step-based UI** (Date Selection -> Time Selection -> Details -> Confirmation).
    3. Calculates available slots by comparing the host's "Working Hours" against existing "Busy Bookings".
- **Purpose Solved:** Automates the "When are you free?" back-and-forth email chain.

#### `EditAvailability.jsx`
- **Purpose:** Configures when the host is reachable.
- **Logic:** Allows toggling specific days (Mon-Sun) and setting time ranges (e.g., 9:00 AM - 5:00 PM). It also supports **Date Overrides** for specific holidays or one-off schedule changes.

---

## 3. Backend Logic

The backend acts as a secure API that manages the state of the application.

### Data Models (Mongoose)
- **User:** Stores profile info, username, and encrypted passwords.
- **EventType:** Defines the meeting (length, title, slug, host ID).
- **Availability:** Stores the weekly schedule and timezone for a specific user.
- **Booking:** Stores the actual meeting data (attendee info, start/end time, status).

### Core Logic: Preventing Double Booking
The system ensures no two meetings overlap. This is solved in `routes/bookings.js` using an interval overlap formula:
```javascript
const conflict = await Booking.findOne({
  hostUserId: hostId,
  status: { $ne: 'CANCELLED' },
  startTime: { $lt: new Date(newBookingEndTime) },
  endTime:   { $gt: new Date(newBookingStartTime) },
});
```
If a `conflict` is found, the API returns a `409 Conflict` error, preventing the database from saving a redundant meeting.

---

## 4. Key Design Patterns

### Step-Based Forms
In `BookingPage.jsx`, we use a `step` state (1 to 4). This reduces cognitive load for the booker by only showing one task at a time (picking a date, then picking a time).

### Responsive-First UI
Every component was built using Tailwind's mobile-first utilities. For example:
- **Grids:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` ensures the layout stacks on phones and expands on desktops.
- **Drawers:** Fixed vertical sidebars are hidden on mobile (`hidden lg:flex`) and replaced by a toggleable overlay.

### Animation for Premium Feel
We use **Framer Motion** for:
- Page transitions (fading in content).
- Modal pop-ups (scaling and opacity shifts).
- Hover effects on cards (subtle lifting and border lighting).

## 5. Summary of Workflow
1. **Auth:** User logs in and gets a JWT token.
2. **Setup:** User creates an "Event Type" and sets their "Availability".
3. **Sharing:** User shares their public link (`/username/slug`).
4. **Booking:** A guest visits the link, picks a slot, and a `Booking` record is created.
5. **Management:** The host views/cancels the booking from their dashboard.

This architecture ensures a scalable, secure, and user-friendly scheduling platform.
