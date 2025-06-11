import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HealthTracker() {
  const [selectedFunction, setSelectedFunction] = useState('cycle');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleSubmit = async () => {
    if (!startDate) {
      alert("Vui lòng chọn ngày bắt đầu kỳ kinh");
      return;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + periodLength - 1);

    try {
      setLoading(true);

      const res = await axios.post("/api/menstrual/calculate", {
        startDate,
        endDate: endDate.toISOString().split('T')[0],
        cycleLength,
        note: ""
      });

      // ✅ Truyền dữ liệu sang OvulationCalendar qua state
      navigate("/menstrual-ovulation", { state: { calendar: res.data } });

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Bạn chưa đăng nhập hoặc token không hợp lệ.");
      } else {
        alert("Lỗi khi tính toán chu kỳ. Hãy thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Chọn chức năng</h2>

      <div className="flex justify-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="cycle"
            checked={selectedFunction === 'cycle'}
            onChange={() => setSelectedFunction('cycle')}
          />
          Quản lí chu kỳ kinh nguyệt
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="pill"
            checked={selectedFunction === 'pill'}
            onChange={() => setSelectedFunction('pill')}
          />
          Biện pháp tránh thai
        </label>
      </div>

      {selectedFunction === 'cycle' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tính Chu Kỳ Kinh Nguyệt</h3>

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
            Độ dài chu kỳ (21–35 ngày):
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
            {loading ? "Đang tính..." : "Tính ngay"}
          </button>
        </div>
      )}
    </div>
  );
}
