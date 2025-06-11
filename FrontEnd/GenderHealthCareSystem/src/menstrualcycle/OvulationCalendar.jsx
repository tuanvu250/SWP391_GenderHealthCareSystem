import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OvulationCalendar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState(null);

  useEffect(() => {
    const stateCalendar = location.state?.calendar;

    if (stateCalendar && stateCalendar.days && stateCalendar.startDate) {
      // Force update to avoid stale state
      setCalendar({ ...stateCalendar });
    } else {
      navigate("/health-tracker", { replace: true });
    }
  }, [location.state?.calendar?.startDate, navigate]);

  const getColor = (type) => {
    switch (type) {
      case "MENSTRUATION":
        return "bg-red-400 text-white";
      case "HIGH_FERTILITY":
        return "bg-green-500 text-white";
      case "MEDIUM_FERTILITY":
        return "bg-yellow-400 text-black";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!calendar) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg font-medium text-gray-600 mb-4">
          Đang tải dữ liệu chu kỳ...
        </p>
        <button
          onClick={() => navigate("/health-tracker")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Quay lại nhập chu kỳ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Dự đoán chu kỳ từ {calendar.startDate} ({calendar.cycleLength} ngày)
      </h2>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {calendar.days.map((day, idx) => (
          <div
            key={idx}
            className={`p-2 rounded shadow ${getColor(day.type)}`}
          >
            <div className="font-semibold">{day.date}</div>
            <div className="text-xs">{day.type.replace("_", " ")}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 space-y-2 text-sm">
        <p>
          <span className="inline-block w-4 h-4 bg-red-400 rounded mr-2"></span>
          Kinh nguyệt
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span>
          Thụ thai cao
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-yellow-400 rounded mr-2"></span>
          Thụ thai trung bình
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-gray-200 rounded mr-2"></span>
          Ngày thường
        </p>
      </div>
    </div>
  );
}