// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import './index.css';

import Facilities from "./pages/facilities/Facilitiespage";
import Bookings from "./pages/bookings/Bookingpage";
import Tickets from "./pages/tickets/Ticketpage";
import Profilepage from './pages/Profile/Profilepage';

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminLayout from './layouts/AdminLayout';
import Dashboardpage from './pages/admin/Dashboardpage';
import Bookingmanagement from './pages/admin/Bookingmanagement';
import ResourceManagement from './pages/admin/ResourceManagement';
import TicketManagement from './pages/admin/TicketManagement';
import NotificationPage from './pages/admin/NotificationPage';
import AdvancedFeatures from './pages/admin/AdvancedFeatures';
import UserManagement from './pages/admin/UserManagement';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/facilities" element={<Facilities />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profilepage />} />


          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Add more routes as needed */}


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboardpage />} />
            <Route path="bookings" element={<Bookingmanagement />} />
            <Route path="resources" element={<ResourceManagement />} />
            <Route path="tickets" element={<TicketManagement />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="advanced" element={<AdvancedFeatures />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;