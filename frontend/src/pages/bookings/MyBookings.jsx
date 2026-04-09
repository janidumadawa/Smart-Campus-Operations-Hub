import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { getBookings, saveBookings, getStatusDotStyle } from "../../utils/bookingData";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleCancel = (id) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: "CANCELLED" } : booking
    );

    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const filteredBookings = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeSection="bookings" />

      <div className="container-custom px-4 py-16">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F47C20]">
            Records
          </p>
          <h1 className="text-4xl font-bold text-slate-900">My Bookings</h1>
          <p className="mt-2 text-slate-500">
            Review your submitted requests and current reservation status.
          </p>
        </div>

        <div className="mb-6 flex justify-end">
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

        {filteredBookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <h3 className="text-xl font-semibold text-slate-700">
              No bookings found
            </h3>
            <p className="mt-2 text-slate-500">
              Your booking records will appear here after submission.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="bg-slate-900 text-left text-sm text-white">
                    <th className="px-6 py-4 font-semibold">Resource</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Purpose</th>
                    <th className="px-6 py-4 font-semibold">Attendees</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Details</th>
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
                      <td className="px-6 py-5 text-sm font-medium text-slate-800">
                        {booking.resource}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {booking.date}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {booking.purpose}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {booking.attendees}
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
                          to={`/bookings/details/${booking.id}`}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          View
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        {(booking.status === "PENDING" ||
                          booking.status === "APPROVED") && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;