import React, { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';


const Facilitiespage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar activeSection="facilities" />

            {/* Hero Section */}
            <div className="relative -mt-24 pt-44 pb-24 bg-[#0A2342] overflow-hidden">

                <div className="container-custom relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Faci<span className="text-[#F47C20]">lities</span>
                    </h1>
                    <p className="text-gray-300 text-xl max-w-2xl mx-auto">
                        Submit incident report tickets and monitor resolution status instantly.
                    </p>
                </div>
            </div>

            <main>
                <div className="container-custom py-16">
                    <div className="text-center text-gray-500">
















                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Facilitiespage;  