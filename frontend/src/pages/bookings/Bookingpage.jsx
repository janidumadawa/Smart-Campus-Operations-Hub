import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { getBookings, saveBookings, resources } from "../../utils/bookingData";
import { useAuth } from "../../context/AuthContext";

const Bookingpage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    resource: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasTimeConflict = (allBookings) => {
    return allBookings.some((booking) => {
      return (
        booking.resource === formData.resource &&
        booking.date === formData.date &&
        booking.status !== "REJECTED" &&
        booking.status !== "CANCELLED" &&
        formData.startTime < booking.endTime &&
        formData.endTime > booking.startTime
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login before submitting a booking.");
      navigate("/login");
      return;
    }

    if (
      !formData.resource ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.purpose ||
      !formData.attendees
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert("End time must be later than start time.");
      return;
    }

    const allBookings = getBookings();

    if (hasTimeConflict(allBookings)) {
      alert("Booking conflict detected for this resource and time.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      ...formData,
      attendees: Number(formData.attendees),
      status: "PENDING",
      requestedBy: user.fullName || user.name || "Campus User",
      email: user.email || "user@example.com",
      adminReason: "",
    };

    const updatedBookings = [newBooking, ...allBookings];
    saveBookings(updatedBookings);

    navigate("/bookings/confirmation");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeSection="bookings" />

      <section className="relative -mt-24 overflow-hidden bg-gradient-to-br from-[#071a33] via-[#0A2342] to-[#153e75] pt-40 pb-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-[#F47C20] blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10 px-4 text-center">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-white/90 backdrop-blur">
            Smart Campus Operations Hub
          </span>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
            Booking <span className="text-[#F47C20]">Management</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
            Create facility reservations through a clean and professional
            interface.
          </p>
        </div>
      </section>

      <main>
        <div className="container-custom px-4 py-16">
          <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F47C20]">
                    New Request
                  </p>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Create Booking
                  </h2>
                  <p className="mt-2 text-slate-500">
                    Fill in the details to request a facility or equipment
                    booking.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField label="Resource">
                    <select
                      name="resource"
                      value={formData.resource}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                    >
                      <option value="">Select Resource</option>
                      {resources.map((resource, index) => (
                        <option key={index} value={resource}>
                          {resource}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Booking Date">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField label="Start Time">
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                      />
                    </FormField>

                    <FormField label="End Time">
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                      />
                    </FormField>
                  </div>

                  <FormField label="Purpose">
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Enter booking purpose"
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                    />
                  </FormField>

                  <FormField label="Expected Attendees">
                    <input
                      type="number"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleChange}
                      placeholder="Enter number of attendees"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                    />
                  </FormField>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-[#F47C20] px-6 py-4 text-base font-bold text-white transition hover:bg-[#db6d16] focus:outline-none focus:ring-4 focus:ring-orange-100"
                  >
                    Submit Booking Request
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F47C20]">
                  Guidelines
                </p>
                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                  Booking Rules
                </h2>

                <div className="space-y-4">
                  <RuleCard
                    title="No Time Conflicts"
                    description="The same resource cannot be booked for overlapping time slots."
                  />
                  <RuleCard
                    title="Approval Workflow"
                    description="Every booking request starts as PENDING and goes for admin review."
                  />
                  <RuleCard
                    title="Cancellation Policy"
                    description="Approved bookings can be cancelled later if needed."
                  />
                  <RuleCard
                    title="Accurate Details"
                    description="Please enter correct date, time, purpose, and attendee count."
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F47C20]">
                  Status Flow
                </p>
                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                  Workflow Overview
                </h2>

                <div className="space-y-3">
                  <StatusFlow
                    label="PENDING"
                    dotClass="bg-amber-500"
                    panelClass="bg-amber-50 border-amber-200"
                  />
                  <StatusFlow
                    label="APPROVED"
                    dotClass="bg-emerald-500"
                    panelClass="bg-emerald-50 border-emerald-200"
                  />
                  <StatusFlow
                    label="REJECTED"
                    dotClass="bg-red-500"
                    panelClass="bg-red-50 border-red-200"
                  />
                  <StatusFlow
                    label="CANCELLED"
                    dotClass="bg-slate-400"
                    panelClass="bg-slate-100 border-slate-200"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const FormField = ({ label, children }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
};

const RuleCard = ({ title, description }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
};

const StatusFlow = ({ label, dotClass, panelClass }) => {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${panelClass}`}>
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${dotClass}`}></span>
        <span className="text-sm font-semibold text-slate-800">{label}</span>
      </div>
    </div>
  );
};

export default Bookingpage;

//nipuni
//k