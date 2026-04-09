import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { getBookings, getStatusDotStyle } from "../../utils/bookingData";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const filteredBookings = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeSection="bookings" />

      <div className="container-custom px-4 py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F47C20]">
              Admin Panel
            </p>
            <h1 className="text-4xl font-bold text-slate-900">
              All Booking Requests
            </h1>
            <p className="mt-2 text-slate-500">
              Review and manage all booking requests in the system.
            </p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-slate-900 text-left text-sm text-white">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Resource</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">Purpose</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className={`border-b border-slate-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                    }`}
                  >
                    <td className="px-6 py-5 text-sm text-slate-700">
                      <div className="font-semibold">{booking.requestedBy}</div>
                      <div className="text-slate-500">{booking.email}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {booking.resource}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {booking.date}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {booking.purpose}
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${getStatusDotStyle(
                            booking.status
                          )}`}
                        ></span>
                        <span className="text-xs font-semibold tracking-wide text-slate-700">
                          {booking.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        to={`/admin/bookings/review/${booking.id}`}
                        className="rounded-xl bg-[#F47C20] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#db6d16]"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminBookings;