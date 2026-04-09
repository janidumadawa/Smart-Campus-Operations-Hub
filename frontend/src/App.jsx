// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import './index.css';

import Facilities from "./pages/facilities/Facilitiespage";
import Bookings from "./pages/bookings/Bookingpage";
import MyBookings from "./pages/bookings/MyBookings";
import BookingDetails from "./pages/bookings/BookingDetails";
import BookingConfirmation from "./pages/bookings/BookingConfirmation";
import Tickets from "./pages/tickets/Ticketpage";
import Profilepage from './pages/Profile/Profilepage';

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminLayout from './layouts/AdminLayout';
import Dashboardpage from './pages/admin/Dashboardpage';
import Bookingmanagement from './pages/admin/Bookingmanagement';
import AdminBookingReview from './pages/bookings/AdminBookingReview';
import ResourceManagement from './pages/admin/ResourceManagement';
import TicketManagement from './pages/admin/TicketManagement';
import NotificationPage from './pages/admin/NotificationPage';
import AdvancedFeatures from './pages/admin/AdvancedFeatures';
import UserManagement from './pages/admin/UserManagement';

<<<<<<< HEAD
import NotificationHistoryPage from './pages/NotificationHistoryPage';
import NotificationPreferencesPage from './pages/NotificationPreferencesPage';

=======
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
>>>>>>> origin/dev

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/facilities" element={<Facilities />} />

<<<<<<< HEAD
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profilepage />} />
          
          {/* Notification Routes */}
          <Route path="/notifications" element={<NotificationHistoryPage />} />
          <Route path="/notification-preferences" element={<NotificationPreferencesPage />} />
=======
            {/* Public Routes */}
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
>>>>>>> origin/dev

            {/* Protected User Routes */}
            <Route
              path="/bookings/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/details/:id"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/confirmation"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <Tickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profilepage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminLayout />
                </RoleProtectedRoute>
              }
            >
              <Route index element={<Dashboardpage />} />
              <Route path="bookings" element={<Bookingmanagement />} />
              <Route path="bookings/review/:id" element={<AdminBookingReview />} />
              <Route path="resources" element={<ResourceManagement />} />
              <Route path="tickets" element={<TicketManagement />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="advanced" element={<AdvancedFeatures />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;