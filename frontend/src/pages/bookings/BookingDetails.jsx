import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { getBookings, getStatusDotStyle } from "../../utils/bookingData";

const BookingDetails = () => {
  const { id } = useParams();
  const bookings = getBookings ? getBookings() : [];
  const booking = bookings.find((item) => String(item.id) === String(id));

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar activeSection="bookings" />
        <div className="container-custom px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Booking Not Found
          </h2>
          <Link
            to="/bookings"
            className="mt-6 inline-block rounded-2xl bg-[#F47C20] px-6 py-3 font-semibold text-white"
          >
            Back to Bookings
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeSection="bookings" />

      <div className="container-custom px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F47C20]">
              Booking Details
            </p>
            <h1 className="text-4xl font-bold text-slate-900">
              {booking.resource}
            </h1>
          </div>

          <Link
            to="/bookings"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
              <span
                className={`h-3 w-3 rounded-full ${getStatusDotStyle(booking.status)}`}
              ></span>
              <span className="text-sm font-semibold text-slate-700">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DetailCard title="Resource" value={booking.resource} />
            <DetailCard title="Date" value={booking.date} />
            <DetailCard
              title="Time"
              value={`${booking.startTime} - ${booking.endTime}`}
            />
            <DetailCard title="Expected Attendees" value={booking.attendees} />
            <DetailCard title="Requested By" value={booking.requestedBy} />
            <DetailCard title="Email" value={booking.email} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Purpose
            </h3>
            <p className="text-slate-600">{booking.purpose}</p>
          </div>

          {booking.status === "REJECTED" && booking.adminReason && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <h3 className="mb-2 text-lg font-semibold text-red-700">
                Admin Rejection Reason
              </h3>
              <p className="text-red-600">{booking.adminReason}</p>
            </div>
          )}
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

export default BookingDetails;