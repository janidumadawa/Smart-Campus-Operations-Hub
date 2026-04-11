import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import { useAuth } from '../../context/AuthContext';  
import axiosInstance from '../../utils/axiosConfig';

const Ticketpage = () => {
  const ticketListRef = useRef(null);
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);

  // Fetch the real user ID from /auth/me
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        setUserId(response.data.id);
        console.log('Real user ID:', response.data.id);
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  const handleTicketSuccess = () => {
    if (ticketListRef.current?.refreshTickets) {
      ticketListRef.current.refreshTickets();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar activeSection="tickets" />

      <div className="relative -mt-24 pt-44 pb-24 bg-[#0A2342] overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            My Tic<span className="text-[#F47C20]">kets</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Submit incident report tickets and monitor resolution status instantly.
          </p>
        </div>
      </div>

      <main>
        <div className="container-custom py-16">
          <div className="mb-12">
            <TicketForm onSuccess={handleTicketSuccess} />
          </div>
          <div>
            <TicketList ref={ticketListRef} userId={userId} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Ticketpage;