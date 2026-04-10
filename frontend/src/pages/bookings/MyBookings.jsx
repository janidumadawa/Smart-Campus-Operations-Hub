import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosConfig";
import toast from "react-hot-toast";

const statusColors = {
  PENDING: "bg-amber-500",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-red-500",
  CANCELLED: "bg-slate-400",
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get(`/bookings/my?email=${user.email}`);
      setBookings(res.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await axiosInstance.patch(`/bookings/${id}/cancel?email=${user.email}`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel");
    }
  };

  const filteredBookings = filter === "ALL" 
    ? bookings 
    : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F47C20] border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeSection="bookings" />

      <div className="container-custom px-4 py-12">
<div className="mb-8">
  <h1 className="text-4xl font-bold text-slate-900">Booking History</h1>
  <p className="mt-2 text-slate-500">Track all your past and current reservations</p>
</div>

        <div className="mb-6 flex justify-between">
          <Link
            to="/bookings"
            className="rounded-xl bg-[#F47C20] px-5 py-3 font-semibold text-white hover:bg-[#db6d16]"
          >
            New Booking
          </Link>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-slate-500">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Resource</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Time</th>
                  <th className="px-6 py-4 text-left">Purpose</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100">
                    <td className="px-6 py-4">{b.resourceName}</td>
                    <td className="px-6 py-4">{b.date}</td>
                    <td className="px-6 py-4">{b.startTime} - {b.endTime}</td>
                    <td className="px-6 py-4">{b.purpose}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusColors[b.status]}`}></span>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(b.status === "PENDING" || b.status === "APPROVED") && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      )}
                      {b.status === "REJECTED" && b.adminReason && (
                        <span className="text-sm text-red-500">{b.adminReason}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;