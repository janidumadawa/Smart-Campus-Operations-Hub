import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";

const BookingConfirmation = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeSection="bookings" />

      <div className="container-custom px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <span className="text-4xl text-emerald-600">✓</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            Booking Request Submitted
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Your booking request has been submitted successfully and is now
            waiting for admin review.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/bookings/my-bookings"
              className="rounded-2xl bg-[#F47C20] px-6 py-3 font-semibold text-white transition hover:bg-[#db6d16]"
            >
              Go to My Bookings
            </Link>

            <Link
              to="/bookings"
              className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Create Another Booking
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;