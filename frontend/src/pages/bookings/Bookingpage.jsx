import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Bookingpage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const selectedResourceId = location.state?.resourceId || "";
  const selectedResourceName = location.state?.resourceName || "";

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  
  const [formData, setFormData] = useState({
    resourceId: selectedResourceId,
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  // Fetch available resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axiosInstance.get("/resources/available");
        setResources(res.data || []);
        
        // If resource is pre-selected, find and set it
        if (selectedResourceId) {
          const found = res.data?.find(r => r.id === selectedResourceId);
          setSelectedResource(found);
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    };
    fetchResources();
  }, [selectedResourceId]);

  // Fetch user's bookings
  useEffect(() => {
    if (user?.email) {
      fetchMyBookings();
    }
  }, [user]);

  const fetchMyBookings = async () => {
    try {
      const res = await axiosInstance.get(`/bookings/my?email=${user.email}`);
      const sorted = (res.data || []).sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setMyBookings(sorted);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (e) => {
    const resourceId = e.target.value;
    setFormData((prev) => ({ ...prev, resourceId }));
    
    // Find and set selected resource
    const found = resources.find(r => r.id === resourceId);
    setSelectedResource(found);
    
    // Reset attendees if equipment is selected
    if (found?.type === 'EQUIPMENT') {
      setFormData((prev) => ({ ...prev, attendees: '1' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to book a resource");
      navigate("/login");
      return;
    }

    const { resourceId, date, startTime, endTime, purpose, attendees } = formData;
    if (!resourceId || !date || !startTime || !endTime || !purpose) {
      toast.error("Please fill all fields");
      return;
    }

    // Check attendees only if not equipment
    if (selectedResource?.type !== 'EQUIPMENT' && !attendees) {
      toast.error("Please enter number of attendees");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        resourceId,
        date,
        startTime,
        endTime,
        purpose,
        attendees: selectedResource?.type === 'EQUIPMENT' ? 1 : parseInt(attendees),
        requestedBy: user.name || "User",
        email: user.email,
      };

      await axiosInstance.post("/bookings", bookingData);
      toast.success("Booking request submitted!");
      
      // Reset form but keep resource if pre-selected
      setFormData({
        resourceId: selectedResourceId,
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
        attendees: "",
      });
      
      // Refresh bookings list
      fetchMyBookings();
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create booking";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CANCELLED': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return 'text-green-700 bg-green-50 border-green-200';
      case 'REJECTED': return 'text-red-700 bg-red-50 border-red-200';
      case 'PENDING': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'CANCELLED': return 'text-gray-500 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isEquipment = selectedResource?.type === 'EQUIPMENT';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeSection="bookings" />

      <section className="relative -mt-24 overflow-hidden bg-gradient-to-br from-[#071a33] via-[#0A2342] to-[#153e75] pt-40 pb-16">
        <div className="container-custom relative z-10 px-4 text-center">
          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
            Book a <span className="text-[#F47C20]">Resource</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-200">
            {selectedResourceName ? `Booking: ${selectedResourceName}` : "Select a resource and time slot"}
          </p>
        </div>
      </section>

      <main className="container-custom px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-[#0A2342] mb-4">New Booking</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Resource</label>
                  <select
                    name="resourceId"
                    value={formData.resourceId}
                    onChange={handleResourceChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#F47C20]"
                    required
                  >
                    <option value="">Select Resource</option>
                    {resources.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.type === 'EQUIPMENT' ? 'Equipment' : 'Hall'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show capacity info for halls */}
                {selectedResource && !isEquipment && (
                  <div className="text-sm text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                    Capacity: {selectedResource.capacity} people
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#F47C20]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Start</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#F47C20]"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">End</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#F47C20]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Purpose</label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter purpose"
                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#F47C20]"
                    required
                  />
                </div>

                {/* Attendees field - HIDDEN for equipment */}
                {!isEquipment && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Attendees</label>
                    <input
                      type="number"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleChange}
                      min="1"
                      max={selectedResource?.capacity || 999}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#F47C20]"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#F47C20] py-2.5 font-semibold text-white hover:bg-[#db6d16] disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - My Bookings */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0A2342] mb-4">My Bookings</h2>
              
              {loadingBookings ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-3 border-[#F47C20] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : myBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {myBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className={`rounded-xl border p-4 ${getStatusColor(booking.status)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(booking.status)}
                            <span className="font-semibold">{booking.resourceName}</span>
                          </div>
                          <p className="text-sm">{booking.date} • {booking.startTime} - {booking.endTime}</p>
                          <p className="text-sm mt-1">{booking.purpose}</p>
                          {booking.attendees > 1 && (
                            <p className="text-xs mt-1 opacity-70">Attendees: {booking.attendees}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium uppercase">{booking.status}</span>
                          {booking.status === 'REJECTED' && booking.adminReason && (
                            <p className="text-xs mt-1 max-w-[200px]">Reason: {booking.adminReason}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Bookingpage;