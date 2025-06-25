import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pillAPI, getAllPillSchedules } from '../components/utils/api';
import dayjs from 'dayjs';

export default function PillTracker() {
  const [pillStartDate, setPillStartDate] = useState('');
  const [pillType, setPillType] = useState('28');
  const [notificationDaily, setNotificationDaily] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [hasSchedule, setHasSchedule] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingSchedule = async () => {
      try {
        const res = await getAllPillSchedules();
        const data = res?.data ?? [];

        // ✅ Ưu tiên dữ liệu trong localStorage nếu hợp lệ
        const startDateStr = localStorage.getItem("pillStartDate");
        const pillTypeStr = localStorage.getItem("pillType");

        if (startDateStr && pillTypeStr && dayjs(startDateStr).isValid()) {
          setPillStartDate(startDateStr);
          setPillType(pillTypeStr);
          setHasSchedule(true);
          return;
        }

        // ❌ Nếu không có localStorage, fallback theo API
        const firstItem = data.find(item => !item.isPlacebo);
        if (firstItem) {
          const inferredType = data.length === 21 ? '21' : '28';
          const dateOnly = firstItem.pillDate.slice(0, 10);
          setPillStartDate(dateOnly);
          setPillType(inferredType);
          setHasSchedule(true);
          localStorage.setItem('pillStartDate', dateOnly);
          localStorage.setItem('pillType', inferredType);
        }
      } catch (err) {
        console.error('Lỗi kiểm tra lịch thuốc:', err);
      }
    };
    checkExistingSchedule();
  }, []);

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
        notificationFrequency: notificationDaily ? "DAILY" : "NONE"
      };

      const res = await pillAPI(pillData);
      const scheduleArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];

      localStorage.setItem("pillStartDate", pillStartDate);
      localStorage.setItem("pillType", pillType);

      setHasSchedule(true);
      navigate("/pill-schedule", { state: { schedule: scheduleArray } });
    } catch (err) {
      console.error("Lỗi khi gọi API thuốc:", err);
      setPopupMessage("Không thể khởi tạo lịch thuốc.");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasSchedule(false);
    setPillStartDate('');
    setPillType('28');
    localStorage.removeItem("pillStartDate");
    localStorage.removeItem("pillType");
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-[#0099CF]">Theo dõi lịch uống thuốc</h2>

      {hasSchedule ? (
        <>
          <div className="text-center text-gray-700 space-y-2">
            <p>Ngày bắt đầu: <strong>{dayjs(pillStartDate).format("DD/MM/YYYY")}</strong></p>
            <p>Loại thuốc: <strong>{pillType} ngày</strong></p>
          </div>

          <button
            onClick={() => navigate("/pill-schedule")}
            className="bg-[#0099CF] hover:bg-[#007eaa] text-white px-4 py-2 rounded w-full"
          >
            Xem lịch hiện tại
          </button>

          <button
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded w-full"
          >
            Nhập lại lịch
          </button>
        </>
      ) : (
        <>
          <label className="block text-gray-700 font-medium">
            Ngày bắt đầu uống thuốc:
            <input
              type="date"
              value={pillStartDate}
              onChange={(e) => setPillStartDate(e.target.value)}
              className="block w-full mt-1 border border-gray-300 rounded p-2"
            />
          </label>

          <label className="block text-gray-700 font-medium">
            Loại thuốc:
            <select
              value={pillType}
              onChange={(e) => setPillType(e.target.value)}
              className="block w-full mt-1 border border-gray-300 rounded p-2"
            >
              <option value="21">21 ngày</option>
              <option value="28">28 ngày</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={notificationDaily}
              onChange={(e) => setNotificationDaily(e.target.checked)}
            />
            Nhận thông báo uống thuốc hằng ngày
          </label>

          <button
            onClick={fetchPillSchedule}
            disabled={loading}
            className="bg-[#0099CF] hover:bg-[#007eaa] text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Đang tạo..." : "Tạo và xem lịch"}
          </button>
        </>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-[#00000080] flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center border-t-4 border-[#0099CF]">
            <h3 className="text-xl font-bold text-[#0099CF] mb-3">Thông báo</h3>
            <p className="text-gray-700 mb-4">{popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-[#0099CF] text-white rounded hover:bg-[#007eaa]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
