import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";

const resources = [
  "Lecture Hall A",
  "Lecture Hall B",
  "Computer Lab 1",
  "Computer Lab 2",
  "Meeting Room 1",
  "Meeting Room 2",
  "Projector",
  "Camera",
];

const Bookingpage = () => {
  const [formData, setFormData] = useState({
    resource: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const savedBookings = localStorage.getItem("smart-campus-bookings");

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      const demoBookings = [
        {
          id: 1,
          resource: "Lecture Hall A",
          date: "2026-04-10",
          startTime: "09:00",
          endTime: "11:00",
          purpose: "PAF Group Discussion",
          attendees: 25,
          status: "PENDING",
        },
        {
          id: 2,
          resource: "Computer Lab 1",
          date: "2026-04-11",
          startTime: "13:00",
          endTime: "15:00",
          purpose: "Lab Practice Session",
          attendees: 30,
          status: "APPROVED",
        },
      ];

      setBookings(demoBookings);
      localStorage.setItem(
        "smart-campus-bookings",
        JSON.stringify(demoBookings)
      );
    }
  }, []);

  const saveBookings = (updatedBookings) => {
    setBookings(updatedBookings);
    localStorage.setItem(
      "smart-campus-bookings",
      JSON.stringify(updatedBookings)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasTimeConflict = () => {
    return bookings.some((booking) => {
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

    if (hasTimeConflict()) {
      alert("Booking conflict detected for this resource and time.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      ...formData,
      attendees: Number(formData.attendees),
      status: "PENDING",
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookings(updatedBookings);

    setFormData({
      resource: "",
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
      attendees: "",
    });

    alert("Booking request submitted successfully.");
  };

  const handleCancel = (id) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: "CANCELLED" } : booking
    );
    saveBookings(updatedBookings);
  };

  const filteredBookings = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const approvedBookings = bookings.filter((b) => b.status === "APPROVED").length;
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED").length;

  const statusDotStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500";
      case "REJECTED":
        return "bg-red-500";
      case "CANCELLED":
        return "bg-slate-400";
      default:
        return "bg-amber-500";
    }
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
            Create facility reservations, manage booking requests, and monitor
            approval status with a clean and professional booking interface.
          </p>
        </div>
      </section>

      <main>
        <div className="container-custom px-4 py-16">
          <section className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Bookings"
              value={totalBookings}
              subtitle="Overall reservations"
              gradient="from-slate-900 to-slate-700"
            />
            <SummaryCard
              title="Pending Requests"
              value={pendingBookings}
              subtitle="Awaiting review"
              gradient="from-amber-500 to-orange-500"
            />
            <SummaryCard
              title="Approved Bookings"
              value={approvedBookings}
              subtitle="Confirmed bookings"
              gradient="from-emerald-500 to-green-600"
            />
            <SummaryCard
              title="Cancelled Bookings"
              value={cancelledBookings}
              subtitle="Closed requests"
              gradient="from-slate-500 to-slate-600"
            />
          </section>

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

                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Validation Notes
                    </p>
                    <ul className="space-y-2 text-sm text-slate-500">
                      <li>• All fields are required before submission.</li>
                      <li>• End time must be later than start time.</li>
                      <li>• Conflicting time slots are not allowed.</li>
                    </ul>
                  </div>

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
                    description="Every new booking request starts as PENDING and moves through review."
                  />
                  <RuleCard
                    title="Cancellation Policy"
                    description="Approved bookings can be cancelled later when necessary."
                  />
                  <RuleCard
                    title="Accurate Details"
                    description="Make sure the purpose, date, and attendee count are correct."
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

          <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F47C20]">
                  Records
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                  My Bookings
                </h2>
                <p className="mt-2 text-slate-500">
                  Review your submitted requests and current reservation status.
                </p>
              </div>

              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-[#F47C20] focus:ring-4 focus:ring-orange-100"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                <h3 className="text-xl font-semibold text-slate-700">
                  No bookings found
                </h3>
                <p className="mt-2 text-slate-500">
                  Your booking records will appear here after submission.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-100">
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
                                className={`h-2.5 w-2.5 rounded-full ${statusDotStyle(
                                  booking.status
                                )}`}
                              ></span>
                              <span className="text-xs font-semibold tracking-wide text-slate-700">
                                {booking.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            {(booking.status === "PENDING" ||
                              booking.status === "APPROVED") && (
                              <button
                                onClick={() => handleCancel(booking.id)}
                                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-100"
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const SummaryCard = ({ title, value, subtitle, gradient }) => {
  return (
    <div className={`rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-sm`}>
      <p className="text-sm text-white/80">{title}</p>
      <h3 className="mt-3 text-4xl font-black">{value}</h3>
      <p className="mt-2 text-sm text-white/70">{subtitle}</p>
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