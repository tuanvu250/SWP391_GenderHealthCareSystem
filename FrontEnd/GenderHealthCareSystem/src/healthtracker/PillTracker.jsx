import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAllPillSchedules, pillAPI } from '../components/api/Pill.api';

export default function PillTracker() {
  const [pillStartDate, setPillStartDate] = useState('');
  const [pillType, setPillType] = useState('28');
  const [notificationDaily, setNotificationDaily] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [hasSchedule, setHasSchedule] = useState(false);
  const navigate = useNavigate();

  // ✅ Hàm kiểm tra lịch mới nhất (dựa theo createdAt)
  const checkExistingSchedule = async () => {
    try {
      const res = await getAllPillSchedules();
      const data = res?.data ?? [];

      // Lọc ra viên thuốc hợp lệ
      const valid = data.filter(item => !item.isPlacebo && item.createdAt);

      if (valid.length === 0) {
        setHasSchedule(false);
        setPillStartDate('');
        setPillType('28');
        localStorage.removeItem('pillStartDate');
        localStorage.removeItem('pillType');
        return;
      }

      // ✅ Nhóm theo createdAt
      const grouped = {};
      valid.forEach(item => {
        const key = item.createdAt;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      // ✅ Tìm nhóm có createdAt mới nhất
      const latestCreatedAt = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a))[0];
      const latestGroup = grouped[latestCreatedAt].sort((a, b) => new Date(a.pillDate) - new Date(b.pillDate));

      const start = latestGroup[0].pillDate.slice(0, 10);
      const type = latestGroup.length >= 28 ? '28' : '21';

      setPillStartDate(start);
      setPillType(type);
      setHasSchedule(true);
      localStorage.setItem('pillStartDate', start);
      localStorage.setItem('pillType', type);
    } catch (err) {
      console.error('❌ Lỗi kiểm tra lịch thuốc:', err);
      setHasSchedule(false);
    }
  };

  useEffect(() => {
    checkExistingSchedule();
  }, []);

  const fetchPillSchedule = async () => {
    if (!pillStartDate) {
      setPopupMessage('Vui lòng chọn ngày bắt đầu uống thuốc.');
      setShowPopup(true);
      return;
    }

    try {
      setLoading(true);
      const pillData = {
        startDate: pillStartDate,
        pillType,
        timeOfDay: '08:00:00',
        isActive: true,
        notificationFrequency: notificationDaily ? 'DAILY' : 'NONE',
      };

      const res = await pillAPI(pillData);
      const scheduleArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];

      localStorage.setItem('pillStartDate', pillStartDate);
      localStorage.setItem('pillType', pillType);
      setHasSchedule(true);

      navigate('/pill-schedule', { state: { schedule: scheduleArray } });
    } catch (err) {
      console.error('❌ Lỗi khi tạo lịch thuốc:', err);
      setPopupMessage('Không thể khởi tạo lịch thuốc.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasSchedule(false);
    setPillStartDate('');
    setPillType('28');
    localStorage.removeItem('pillStartDate');
    localStorage.removeItem('pillType');
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-[#0099CF]">Theo dõi lịch uống thuốc</h2>

      {hasSchedule ? (
        <>
          <div className="text-center text-gray-700 space-y-2">
            <p>Ngày bắt đầu: <strong>{dayjs(pillStartDate).format('DD/MM/YYYY')}</strong></p>
            <p>Loại thuốc: <strong>{pillType} ngày</strong></p>
          </div>

          <button
            onClick={() => navigate('/pill-schedule')}
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
            {loading ? 'Đang tạo...' : 'Tạo và xem lịch'}
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
