import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OvulationCalendar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    const stateCalendar = location.state?.calendar;
    if (stateCalendar && stateCalendar.days && stateCalendar.startDate) {
      setCalendar({ ...stateCalendar });
    } else {
      navigate("/health-tracker", { replace: true });
    }
  }, [location.state, navigate]);

  const getColor = (dateStr) => {
    const match = calendar.days.find((d) => d.date === dateStr);
    if (!match) return "bg-white text-gray-600";

    switch (match.type) {
      case "MENSTRUATION": return "bg-red-400 text-white";
      case "HIGH_FERTILITY": return "bg-green-500 text-white";
      case "MEDIUM_FERTILITY": return "bg-yellow-300 text-black";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split("T")[0];
      days.push({
        date,
        dateStr,
        weekday: date.getDay()
      });
    }

    return days;
  };

  const buildCalendarGrid = (year, month) => {
    const days = getMonthDays(year, month);
    const firstDayWeekday = days[0].weekday;
    const blanks = Array(firstDayWeekday).fill(null);
    const fullGrid = [...blanks, ...days];

    const grid = [];
    for (let i = 0; i < fullGrid.length; i += 7) {
      grid.push(fullGrid.slice(i, i + 7));
    }
    return grid;
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
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

  const calendarGrid = buildCalendarGrid(selectedYear, selectedMonth);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Dự đoán chu kỳ sinh sản - Tháng {selectedMonth + 1}/{selectedYear}
      </h2>

      {/* Nút chuyển tháng */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Tháng trước
        </button>
        <span className="font-medium text-lg">
          Tháng {selectedMonth + 1} / {selectedYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Tháng sau →
        </button>
      </div>

      {/* Hiển thị lưới ngày */}
      <div className="grid grid-cols-7 gap-2 font-semibold text-center text-sm text-gray-700 mb-1">
        <div>CN</div><div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div>
      </div>

      {calendarGrid.map((week, i) => (
        <div key={i} className="grid grid-cols-7 gap-2 mb-1">
          {week.map((day, j) =>
            day ? (
              <div
                key={j}
                className={`h-24 p-2 rounded shadow text-xs ${getColor(day.dateStr)}`}
              >
                <div className="font-semibold text-sm">{day.date.getDate()}</div>
                <div>{calendar.days.find(d => d.date === day.dateStr)?.type.replace("_", " ") || ""}</div>
              </div>
            ) : (
              <div key={j} className="h-24 p-2 rounded bg-transparent"></div>
            )
          )}
        </div>
      ))}

      {/* Chú thích màu */}
      <div className="mt-6 space-y-2 text-sm">
        <p><span className="inline-block w-4 h-4 bg-red-400 rounded mr-2"></span> Kinh nguyệt</p>
        <p><span className="inline-block w-4 h-4 bg-green-500 rounded mr-2"></span> Thụ thai cao</p>
        <p><span className="inline-block w-4 h-4 bg-yellow-300 rounded mr-2"></span> Thụ thai trung bình</p>
        <p><span className="inline-block w-4 h-4 bg-gray-200 rounded mr-2"></span> Ngày thường</p>
      </div>

      {/* Nút quay lại */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/health-tracker")}
          className="px-5 py-2 bg-[#0099CF] text-white rounded hover:bg-blue-600"
        >
          ← Quay lại theo dõi sức khỏe
        </button>
      </div>

    </div>
  );
}
