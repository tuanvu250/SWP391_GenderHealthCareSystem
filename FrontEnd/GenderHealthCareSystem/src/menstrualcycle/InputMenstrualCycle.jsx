import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
export default function HealthTracker() {
  const [selectedFunction, setSelectedFunction] = useState('cycle');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const navigate = useNavigate();
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
            onClick={() => navigate("/menstrual-ovulation")}
            className="bg-[#0099CF] hover:bg-blue-600 text-white px-4 py-2 rounded w-full">

            Tính ngay
          </button>
        </div>
      )}

      {selectedFunction === 'pill' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nhắc Uống Thuốc Tránh Thai</h3>

          <label className="block">
            Loại thuốc tránh thai:
            <select className="block w-full mt-1 border border-gray-300 rounded p-2">
              <option>21 ngày</option>
              <option>28 ngày</option>
            </select>
          </label>

          <label className="block">
            Ngày bắt đầu uống thuốc:
            <input
              type="date"
              className="block w-full mt-1 border border-gray-300 rounded p-2"
            />
          </label>

          <label className="block">
            Giờ uống thuốc:
            <input
              type="time"
              className="block w-full mt-1 border border-gray-300 rounded p-2"
            />
          </label>

          <button 
           onClick={() => navigate("/medication-reminder")}
          className="bg-[#0099CF] hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
            Cập nhật lịch uống thuốc
          </button>
        </div>
      )}
    </div>
  );
}
