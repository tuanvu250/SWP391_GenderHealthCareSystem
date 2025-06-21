import React, { useState } from "react";

const statusStyles = {
  "chờ thanh toán": "bg-yellow-100 text-yellow-800",
  "chờ xác nhận": "bg-blue-100 text-blue-800",
  "hoàn tất": "bg-green-100 text-green-800",
};

const mockBookings = [
  {
    id: 1,
    expertId: 0,
    name: "TS. Nguyễn Thị Minh Trang",
    date: "2025-06-20",
    time: "08:00 - 09:00",
    status: "chờ thanh toán",
    method: "Online",
  },
  {
    id: 2,
    expertId: 1,
    name: "ThS. Lê Anh Tuấn",
    date: "2025-06-15",
    time: "13:30 - 14:30",
    status: "chờ xác nhận",
    method: "Trực tiếp",
  },
  {
    id: 3,
    expertId: 2,
    name: "ThS. Bùi Thị Hồng Ánh",
    date: "2025-06-05",
    time: "10:00 - 11:00",
    status: "hoàn tất",
    method: "Online",
  },
];

export default function MyBookings() {
  const [bookings] = useState(mockBookings);

  const pendingBookings = bookings.filter(
    (b) => b.status === "chờ thanh toán" || b.status === "chờ xác nhận"
  );
  const completedBookings = bookings.filter((b) => b.status === "hoàn tất");

  const handlePayment = (bookingId) => {
    alert(`Thanh toán cho lịch hẹn ID ${bookingId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#0099CF] mb-6">
        Lịch đã đặt của bạn
      </h2>

      {pendingBookings.length > 0 ? (
        <div className="space-y-4 mb-10">
          {pendingBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border rounded-xl shadow bg-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#0099CF]">
                    {booking.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Ngày hẹn: {booking.date} | Giờ: {booking.time} | Hình thức:{" "}
                    {booking.method}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${statusStyles[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

             {booking.status === "chờ thanh toán" && (
  <div className="mt-3 text-right">
    <button
      className="text-sm px-3 py-1.5 rounded-md bg-[#0099CF] text-white hover:bg-[#007fb3] transition"
      onClick={() => handlePayment(booking.id)}
    >
      Thanh toán
    </button>
  </div>
)}

            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-10">
          Không có lịch đang chờ xác nhận hoặc thanh toán.
        </p>
      )}

      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Lịch sử đã hoàn tất
      </h3>
      {completedBookings.length > 0 ? (
        <div className="space-y-4">
          {completedBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border rounded-xl bg-gray-50 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {booking.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Ngày hẹn: {booking.date} | Giờ: {booking.time} | Hình thức:{" "}
                  {booking.method}
                </p>
              </div>
              <div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${statusStyles[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Bạn chưa có lịch sử hoàn tất nào.
        </p>
      )}
    </div>
  );
}
