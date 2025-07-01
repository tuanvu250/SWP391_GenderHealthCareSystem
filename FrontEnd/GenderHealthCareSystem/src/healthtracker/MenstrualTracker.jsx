// ✅ File: src/pages/MenstrualTracker.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  healthTrackerAPI,
  updateTrackerAPI,
  menstrualHistoryAPI,
} from '../components/api/HeathTracker.api';

export default function MenstrualTracker() {
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return navigate('/login');

    const checkExistingCycle = async () => {
      try {
        const res = await menstrualHistoryAPI();
        const data = res.data;

        if (
          Array.isArray(data.days) &&
          data.days.length > 0 &&
          !location.state?.forceInput // Chỉ chuyển nếu không phải bấm "nhập lại"
        ) {
          navigate('/menstrual-ovulation', { state: { calendar: data } });
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra dữ liệu chu kỳ:', err);
        // vẫn tiếp tục cho người dùng nhập nếu lỗi
      }
    };

    checkExistingCycle();
  }, [navigate, location.state]);

  const handleSubmit = async () => {
    if (!startDate) {
      setPopupMessage('Vui lòng chọn ngày bắt đầu kỳ kinh');
      setShowPopup(true);
      return;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + periodLength - 1);

    try {
      setLoading(true);

      // Gửi dữ liệu kỳ kinh mới
      await healthTrackerAPI({
        startDate,
        endDate: endDate.toISOString().split('T')[0],
        cycleLength,
        note: 'form',
      });

      // Gửi cập nhật
      await updateTrackerAPI({
        startDate,
        endDate: endDate.toISOString().split('T')[0],
        cycleLength,
        note: 'form',
      });

      // Sau khi lưu thành công, lấy lại dữ liệu và điều hướng
      const updatedCalendar = await menstrualHistoryAPI();
      navigate('/menstrual-ovulation', { state: { calendar: updatedCalendar.data } });
    } catch (err) {
      console.error(err);
      setPopupMessage('Lỗi khi tính hoặc lưu chu kỳ.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Tính Chu Kỳ Kinh Nguyệt</h2>

      <label className="block">
        Ngày bắt đầu kỳ kinh:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded p-2"
        />
      </label>

      <label className="block">
        Chu kỳ (21–35 ngày):
        <input
          type="range"
          min="21"
          max="35"
          value={cycleLength}
          onChange={(e) => setCycleLength(Number(e.target.value))}
          className="w-full mt-1"
        />
        <p>{cycleLength} ngày</p>
      </label>

      <label className="block">
        Số ngày hành kinh (2–10 ngày):
        <input
          type="range"
          min="2"
          max="10"
          value={periodLength}
          onChange={(e) => setPeriodLength(Number(e.target.value))}
          className="w-full mt-1"
        />
        <p>{periodLength} ngày</p>
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-[#0099CF] hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Đang tính...' : 'Tính ngay'}
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
