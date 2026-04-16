import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/PageTransition';
import './index.css';

// Pages
import LandingPage      from './pages/LandingPage';
import Login            from './pages/Login';
import Signup           from './pages/Signup';
import Onboarding       from './pages/Onboarding';
import BookingPage      from './pages/public/BookingPage';

// Dashboard pages
import EventTypes       from './pages/dashboard/EventTypes';
import EditEventType    from './pages/dashboard/EditEventType';
import Bookings         from './pages/dashboard/Bookings';
import Availability     from './pages/dashboard/Availability';
import EditAvailability from './pages/dashboard/EditAvailability';
import Apps             from './pages/dashboard/Apps';
import InstalledApps    from './pages/dashboard/InstalledApps';
import Insights         from './pages/dashboard/Insights';
import Workflows        from './pages/dashboard/Workflows';
import Teams            from './pages/dashboard/Teams';
import RoutingForms     from './pages/dashboard/RoutingForms';
import Settings         from './pages/dashboard/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing — kept as the public marketing page */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />

        {/* Auth — still accessible but not required */}
        <Route path="/login"  element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

        {/* Dashboard — ProtectedRoute auto-passes since user is always John */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index                     element={<PageTransition><EventTypes /></PageTransition>} />
          <Route path="event-types/:id"    element={<PageTransition><EditEventType /></PageTransition>} />
          <Route path="bookings"           element={<PageTransition><Bookings /></PageTransition>} />
          <Route path="availability"       element={<PageTransition><Availability /></PageTransition>} />
          <Route path="availability/:id"   element={<PageTransition><EditAvailability /></PageTransition>} />
          <Route path="apps"               element={<PageTransition><Apps /></PageTransition>} />
          <Route path="apps/installed"     element={<PageTransition><InstalledApps /></PageTransition>} />
          <Route path="insights"           element={<PageTransition><Insights /></PageTransition>} />
          <Route path="insights/bookings"  element={<PageTransition><Insights /></PageTransition>} />
          <Route path="insights/routing"   element={<PageTransition><Insights /></PageTransition>} />
          <Route path="insights/router-position" element={<PageTransition><Insights /></PageTransition>} />
          <Route path="insights/call-history"    element={<PageTransition><Insights /></PageTransition>} />
          <Route path="insights/wrong-routing"   element={<PageTransition><Insights /></PageTransition>} />
          <Route path="teams"              element={<PageTransition><Teams /></PageTransition>} />
          <Route path="routing-forms"      element={<PageTransition><RoutingForms /></PageTransition>} />
          <Route path="workflows"          element={<PageTransition><Workflows /></PageTransition>} />
          <Route path="settings"           element={<PageTransition><Settings /></PageTransition>} />
        </Route>

        {/* Onboarding */}
        <Route path="/onboarding" element={<ProtectedRoute />}>
          <Route index element={<PageTransition><Onboarding /></PageTransition>} />
        </Route>

        {/* Public Booking Page */}
        <Route path="/:username/:slug" element={<PageTransition><BookingPage /></PageTransition>} />

        {/* Catch-all → dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}