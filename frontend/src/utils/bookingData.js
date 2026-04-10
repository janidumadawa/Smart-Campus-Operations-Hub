// frontend\src\utils\bookingData.js
export const resources = [
  "Lecture Hall A",
  "Lecture Hall B",
  "Computer Lab 1",
  "Computer Lab 2",
  "Meeting Room 1",
  "Meeting Room 2",
  "Projector",
  "Camera",
];

export const demoBookings = [
  {
    id: 1,
    resource: "Lecture Hall A",
    date: "2026-04-12",
    startTime: "09:00",
    endTime: "11:00",
    purpose: "PAF Group Discussion",
    attendees: 25,
    status: "PENDING",
    requestedBy: "Nipuni Kavindya",
    email: "nipuni@example.com",
    adminReason: "",
  },
  {
    id: 2,
    resource: "Computer Lab 1",
    date: "2026-04-14",
    startTime: "01:00 PM",
    endTime: "03:00 PM",
    purpose: "Database Lab Session",
    attendees: 30,
    status: "APPROVED",
    requestedBy: "Nipuni Kavindya",
    email: "nipuni@example.com",
    adminReason: "",
  },
  {
    id: 3,
    resource: "Meeting Room 1",
    date: "2026-04-15",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    purpose: "Project Review Meeting",
    attendees: 8,
    status: "REJECTED",
    requestedBy: "Kavinda Perera",
    email: "kavinda@example.com",
    adminReason: "Room already allocated for urgent faculty meeting.",
  },
];

export const getBookings = () => {
  const savedBookings = localStorage.getItem("smart-campus-bookings");
  if (savedBookings) {
    return JSON.parse(savedBookings);
  }

  localStorage.setItem("smart-campus-bookings", JSON.stringify(demoBookings));
  return demoBookings;
};

export const saveBookings = (bookings) => {
  localStorage.setItem("smart-campus-bookings", JSON.stringify(bookings));
};

export const getStatusDotStyle = (status) => {
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