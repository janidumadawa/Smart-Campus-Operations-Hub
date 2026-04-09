import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/shared/Footer";
import { getBookings, saveBookings, getStatusDotStyle } from "../../utils/bookingData";

const AdminBookingReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const allBookings = getBookings();
  const booking = allBookings.find((item) => String(item.id) === String(id));

  const [reason, setReason] = useState(booking?.adminReason || "");

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container-custom px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Booking Not Found
          </h2>
          <Link
            to="/admin/bookings"
            className="mt-6 inline-block rounded-2xl bg-[#F47C20] px-6 py-3 font-semibold text-white"
          >
            Back to Admin Bookings
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleApprove = () => {
    const updatedBookings = allBookings.map((item) =>
      item.id === booking.id
        ? { ...item, status: "APPROVED", adminReason: "" }
        : item
    );

    saveBookings(updatedBookings);
    navigate("/admin/bookings");
  };

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Please enter rejection reason.");
      return;
    }

    const updatedBookings = allBookings.map((item) =>
      item.id === booking.id
        ? { ...item, status: "REJECTED", adminReason: reason }
        : item
    );

    saveBookings(updatedBookings);
    navigate("/admin/bookings");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-custom px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F47C20]">
              Admin Review
            </p>
            <h1 className="text-4xl font-bold text-slate-900">
              Review Booking Request
            </h1>
          </div>

          <Link
            to="/admin/bookings"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
              <span
                className={`h-3 w-3 rounded-full ${getStatusDotStyle(
                  booking.status
                )}`}
              ></span>
              <span className="text-sm font-semibold text-slate-700">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DetailCard title="Requested By" value={booking.requestedBy} />
            <DetailCard title="Email" value={booking.email} />
            <DetailCard title="Resource" value={booking.resource} />
            <DetailCard title="Date" value={booking.date} />
            <DetailCard
              title="Time"
              value={`${booking.startTime} - ${booking.endTime}`}
            />
            <DetailCard title="Attendees" value={booking.attendees} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Purpose
            </h3>
            <p className="text-slate-600">{booking.purpose}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Rejection Reason
            </label>
            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason"
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleApprove}
              className="rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              Approve Booking
            </button>

            <button
              onClick={handleReject}
              className="rounded-2xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              Reject Booking
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const DetailCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{value}</h3>
    </div>
  );
};

export default AdminBookingReview;