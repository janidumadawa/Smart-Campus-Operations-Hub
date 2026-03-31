// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import './index.css';

import Facilities from "./pages/facilities/Facilitiespage";
import Bookings from "./pages/bookings/Bookingpage";
import Tickets from "./pages/tickets/Ticketpage";

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
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;