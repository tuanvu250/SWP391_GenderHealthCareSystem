import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HistoryConsultantBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const userString = localStorage.getItem("user");

      if (!userString) {
        console.error("User not found in localStorage");
        navigate("/login");
        return;
      }

      let customer;
      try {
        customer = JSON.parse(userString);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        navigate("/login");
        return;
      }

      const customerId = 10; // 👈 Tạm fix

      try {
        const response = await axios.get(`/api/bookings/history/${customerId}`);
        setBookings(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch booking history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đặt lịch tư vấn</h2>

      {loading ? (
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      ) : bookings.length === 0 ? (
        <div className="text-gray-500">Bạn chưa có lịch tư vấn nào.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="px-4 py-3 border-b">#</th>
                <th className="px-4 py-3 border-b">Ngày tạo</th>
                <th className="px-4 py-3 border-b">Chuyên gia</th>
                <th className="px-4 py-3 border-b">Ghi chú</th>
                <th className="px-4 py-3 border-b">Trạng thái</th>
                <th className="px-4 py-3 border-b">Thanh toán</th>
                <th className="px-4 py-3 border-b">Link tư vấn</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {bookings.map((booking, index) => (
                <tr key={booking.bookingId} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {new Date(booking.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {booking.consultantName || `ID ${booking.consultantId}`}
                  </td>
                  <td className="px-4 py-2">{booking.note || "—"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        booking.status === "PENDING"
                          ? "bg-yellow-500"
                          : booking.status === "CONFIRMED"
                          ? "bg-green-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{booking.paymentStatus}</td>
                  <td className="px-4 py-2">
                    {booking.meetLink ? (
                      <a
                        href={booking.meetLink}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join
                      </a>
                    ) : (
                      "Chưa có"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryConsultantBooking;
