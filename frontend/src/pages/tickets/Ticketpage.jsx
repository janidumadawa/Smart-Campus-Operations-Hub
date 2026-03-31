import React, { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { AlertCircle, FileText, CheckCircle, Clock } from 'lucide-react';

const Ticketpage = () => {
    const [view, setView] = useState('MyTickets');
    const [isCreating, setIsCreating] = useState(false);

    const tickets = [
        { id: "TCK-001", title: "Projector not working in Rm 204", status: "Open", date: "Oct 12, 10:00 AM", type: "Equipment" },
        { id: "TCK-002", title: "AC leak in Main Auditorium", status: "In Progress", date: "Oct 11, 02:30 PM", type: "Facility" },
        { id: "TCK-003", title: "Lab PC 15 blue screen", status: "Resolved", date: "Oct 10, 09:15 AM", type: "IT" },
        { id: "TCK-004", title: "Broken door hinge at Library", status: "Open", date: "Oct 12, 08:00 AM", type: "Facility" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar activeSection="tickets" />

            {/* Dark Page Hero */}
            <div className="relative pt-32 pb-24 bg-[#0A2342] overflow-hidden">
                <div className="container-custom relative z-10 text-center">
                    <h1
                        className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                    >
                        Report & <span className="text-[#F47C20]">Track</span>
                    </h1>
                    <p
                        className="text-gray-400 text-xl max-w-2xl mx-auto"
                    >
                        Submit incident report tickets and monitor resolution status instantly.
                    </p>
                </div>
                {/* Wave Overlay */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                    <svg
                        className="w-full h-12 md:h-20 rotate-180 absolute bottom-[-5px] left-0 z-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                            className="fill-[#f9fafb]"
                        ></path>
                    </svg>
                </div>
            </div>

            <main className="flex-grow container-custom py-16">

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <h2 className="text-3xl font-black text-[#0A2342]">Incident Dashboard</h2>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-8 py-4 bg-[#F47C20] text-[#0A2342] rounded-full font-black hover:bg-[#E06A10] transition-all hover:shadow-[0_8px_20px_rgba(255,204,0,0.3)] hover:-translate-y-1 flex items-center gap-2 tracking-wide"
                    >
                        <AlertCircle className="w-5 h-5" /> Report Incident
                    </button>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0A2342] text-white">
                                    <th className="py-6 px-8 font-bold uppercase tracking-widest text-sm text-gray-400">Status</th>
                                    <th className="py-6 px-8 font-bold uppercase tracking-widest text-sm text-gray-400">ID</th>
                                    <th className="py-6 px-8 font-bold uppercase tracking-widest text-sm text-gray-400">Title</th>
                                    <th className="py-6 px-8 font-bold uppercase tracking-widest text-sm text-gray-400">Type</th>
                                    <th className="py-6 px-8 font-bold uppercase tracking-widest text-sm text-gray-400">Date/Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((t, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-6 px-8">
                                            {t.status === 'Open' ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    <AlertCircle className="w-3 h-3" /> Open
                                                </div>
                                            ) : t.status === 'In Progress' ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    <Clock className="w-3 h-3" /> Progress
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    <CheckCircle className="w-3 h-3" /> Resolved
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-6 px-8 font-bold text-gray-500">{t.id}</td>
                                        <td className="py-6 px-8 font-bold text-[#0A2342]">{t.title}</td>
                                        <td className="py-6 px-8 text-gray-600 font-medium">{t.type}</td>
                                        <td className="py-6 px-8 text-gray-500 text-sm font-medium">{t.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Report Form Modal Placeholder representation */}
                <AnimatePresence>
                    {isCreating && (
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <div
                                className="bg-white rounded-[32px] w-full max-w-xl p-10 shadow-2xl border border-gray-100"
                            >
                                <h3 className="text-3xl font-black text-[#0A2342] mb-6">New Incident Report</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Title</label>
                                        <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#F47C20]/30 transition-all font-medium text-gray-900" placeholder="Brief summary of issue" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Description</label>
                                        <textarea rows="4" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#F47C20]/30 transition-all font-medium text-gray-900 resize-none" placeholder="Provide detailed context..."></textarea>
                                    </div>
                                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                                        <button onClick={() => setIsCreating(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-[#0A2342] transition-colors rounded-xl hover:bg-gray-100">Cancel</button>
                                        <button onClick={() => setIsCreating(false)} className="px-8 py-3 bg-[#F47C20] text-[#0A2342] font-black rounded-xl hover:bg-[#E06A10] transition-colors shadow-lg hover:-translate-y-1">Submit Ticket</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

            </main>

            <Footer />
        </div>
    );
};

export default Ticketpage;