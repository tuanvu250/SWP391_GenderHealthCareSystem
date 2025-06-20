import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pillAPI, getAllPillSchedules } from '../components/utils/api';

export default function PillTracker() {
  const [pillStartDate, setPillStartDate] = useState('');
  const [pillType, setPillType] = useState('28');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Nếu đã có lịch thuốc → tự động chuyển qua bảng lịch
  useEffect(() => {
    const checkExistingSchedule = async () => {
      try {
        const res = await getAllPillSchedules();
        if (res?.data?.length > 0) {
          navigate('/pill-schedule');
        }
      } catch (err) {
        console.error('Lỗi kiểm tra lịch thuốc:', err);
        // Không popup ở đây, vì có thể user chưa có lịch thật
      }
    };

    checkExistingSchedule();
  }, [navigate]);

  const fetchPillSchedule = async () => {
    if (!pillStartDate) {
      setPopupMessage("Vui lòng chọn ngày bắt đầu uống thuốc.");
      setShowPopup(true);
      return;
    }
    try {
      setLoading(true);
      const pillData = {
        startDate: pillStartDate,
        pillType,
        timeOfDay: "08:00:00",
        isActive: true,
        notificationFrequency: "DAILY"
      };
      const res = await pillAPI(pillData);
      const scheduleArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      navigate("/pill-schedule", { state: { schedule: scheduleArray } });
    } catch (err) {
      console.error("Lỗi khi gọi API thuốc:", err);
      setPopupMessage("Không thể khởi tạo lịch thuốc.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Tạo Lịch Uống Thuốc Tránh Thai</h2>

      <label className="block">Ngày bắt đầu uống thuốc:
        <input
          type="date"
          value={pillStartDate}
          onChange={(e) => setPillStartDate(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded p-2"
        />
      </label>

      <label className="block">Loại thuốc:
        <select
          value={pillType}
          onChange={(e) => setPillType(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded p-2"
        >
          <option value="21">21 ngày</option>
          <option value="28">28 ngày</option>
        </select>
      </label>

      <button
        onClick={fetchPillSchedule}
        disabled={loading}
        className="bg-[#0099CF] hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Đang tạo..." : "Tạo và xem lịch"}
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-[#00000080] flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center border-t-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-600 mb-3">Thông báo</h3>
            <p className="text-gray-700 mb-4">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
