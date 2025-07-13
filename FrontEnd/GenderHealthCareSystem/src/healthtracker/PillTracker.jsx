import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAllPillSchedules, pillAPI } from '../components/api/Pill.api';

export default function PillTracker() {
  const [pillStartDate, setPillStartDate] = useState('');
  const [pillType, setPillType] = useState('28');
  const [notificationOption, setNotificationOption] = useState('DAILY'); // 🔁 new
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const checkExistingSchedule = async () => {
    const startInStorage = localStorage.getItem('pillStartDate');
    if (!startInStorage) return;

    try {
      const res = await getAllPillSchedules();
      const data = res?.data ?? [];

      const valid = data.filter(item => !item.isPlacebo);
      if (valid.length === 0) {
        localStorage.removeItem('pillStartDate');
        localStorage.removeItem('pillType');
        return;
      }

      navigate('/pill/schedule');
    } catch (err) {
      console.error('❌ Lỗi kiểm tra lịch:', err);
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
        notificationFrequency: notificationOption,
      };

      const res = await pillAPI(pillData);
      const scheduleArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];

      localStorage.setItem('pillStartDate', pillStartDate);
      localStorage.setItem('pillType', pillType);

      navigate('/pill/schedule', { state: { schedule: scheduleArray } });
    } catch (err) {
      console.error('❌ Lỗi tạo lịch:', err);
      setPopupMessage('Không thể khởi tạo lịch.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6 mt-12">
      <h2 className="text-2xl font-bold text-center text-[#0099CF]">Theo dõi lịch uống thuốc</h2>

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

      <label className="block text-gray-700 font-medium">
        Tần suất thông báo:
        <select
          value={notificationOption}
          onChange={(e) => setNotificationOption(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded p-2"
        >
          <option value="DAILY">Hằng ngày</option>
          <option value="WEEKLY">Mỗi 7 ngày</option>
        </select>
      </label>

      <button
        onClick={fetchPillSchedule}
        disabled={loading}
        className="bg-[#0099CF] hover:bg-[#007eaa] text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Đang tạo...' : 'Tạo và xem lịch'}
      </button>

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
