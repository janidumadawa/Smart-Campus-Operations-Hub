import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/facilities" element={
              <ProtectedRoute>
                <Facilities />
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/bookings/my-bookings" element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/bookings/details/:id" element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            } />
            <Route path="/bookings/confirmation" element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/tickets" element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profilepage />
              </ProtectedRoute>
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_TECHNICIAN']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboardpage />} />
              <Route path="bookings" element={<Bookingmanagement />} />
              <Route path="bookings/review/:id" element={<AdminBookingReview />} />
              <Route path="resources" element={<ResourceManagement />} />
              <Route path="tickets" element={<TicketManagement />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="advanced" element={
                <ProtectedRoute roles={['ROLE_ADMIN']}>
                  <AdvancedFeatures />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute roles={['ROLE_ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;