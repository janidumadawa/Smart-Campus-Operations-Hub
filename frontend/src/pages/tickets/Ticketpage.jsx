import React, { useRef } from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';

const Ticketpage = () => {
  const ticketListRef = useRef(null);

  const handleTicketSuccess = () => {
    // Trigger refresh in TicketList
    if (ticketListRef.current?.refreshTickets) {
      ticketListRef.current.refreshTickets();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar activeSection="tickets" />

      {/* Hero Section */}
      <div className="relative -mt-24 pt-44 pb-24 bg-[#0A2342] overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Tic<span className="text-[#F47C20]">kets</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Submit incident report tickets and monitor resolution status instantly.
          </p>
        </div>
      </div>

      <main>
        <div className="container-custom py-16">
          {/* Ticket Form */}
          <div className="mb-12">
            <TicketForm onSuccess={handleTicketSuccess} />
          </div>

          {/* Ticket List */}
          <div>
            <TicketList ref={ticketListRef} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Ticketpage;