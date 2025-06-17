import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OvulationCalendar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const stateCalendar = location.state?.calendar;
    if (stateCalendar && stateCalendar.days && stateCalendar.startDate) {
      const start = new Date(stateCalendar.startDate);
      setCalendar({ ...stateCalendar });
      setSelectedMonth(start.getMonth());
      setSelectedYear(start.getFullYear());

      const allDates = stateCalendar.days.map((d) => d.date);
      const allMonthSet = new Set();

      allDates.forEach((dateStr) => {
        const [y, m] = dateStr.split("-").map(Number);
        const key = `${y}-${m.toString().padStart(2, "0")}`;
        allMonthSet.add(key);
      });

      const allSorted = Array.from(allMonthSet).sort(
          (a, b) => new Date(a + "-01") - new Date(b + "-01")
      );
      const startIndex = allSorted.findIndex(
          (m) =>
              m ===
              `${start.getFullYear()}-${(start.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}`
      );

      const sliceStart = Math.max(0, startIndex - 1);
      const sliceEnd = Math.min(allSorted.length, sliceStart + 5);
      setAvailableMonths(allSorted.slice(sliceStart, sliceEnd));
    } else {
      navigate("/health-tracker", { replace: true });
    }
  }, [location.state, navigate]);

  const translateType = (type) => {
    switch (type) {
      case "MENSTRUATION":
        return "Kinh nguyệt";
      case "HIGH_FERTILITY":
        return "Thụ thai cao";
      case "MEDIUM_FERTILITY":
        return "Thụ thai trung bình";
      default:
        return "";
    }
  };

  const getColor = (dateStr) => {
    const match = calendar.days.find((d) => d.date === dateStr);
    if (!match) return "bg-white text-gray-600";
    switch (match.type) {
      case "MENSTRUATION":
        return "bg-red-400 text-white";
      case "HIGH_FERTILITY":
        return "bg-green-500 text-white";
      case "MEDIUM_FERTILITY":
        return "bg-yellow-300 text-black";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split("T")[0];
      days.push({ date, dateStr, weekday: date.getDay() });
    }

    return days;
  };

  const buildCalendarGrid = (year, month) => {
    const days = getMonthDays(year, month);
    const firstDayWeekday = days[0].weekday;
    const blanks = Array(firstDayWeekday).fill(null);
    const fullGrid = [...blanks, ...days];

    while (fullGrid.length < 42) {
      fullGrid.push(null);
    }

    const grid = [];
    for (let i = 0; i < 42; i += 7) {
      grid.push(fullGrid.slice(i, i + 7));
    }
    return grid;
  };

  const handlePrevMonth = () => {
    const currentKey = `${selectedYear}-${(selectedMonth + 1)
        .toString()
        .padStart(2, "0")}`;
    const index = availableMonths.findIndex((m) => m === currentKey);
    if (index > 0) {
      const [y, m] = availableMonths[index - 1].split("-").map(Number);
      setSelectedYear(y);
      setSelectedMonth(m - 1);
    }
  };

  const handleNextMonth = () => {
    const currentKey = `${selectedYear}-${(selectedMonth + 1)
        .toString()
        .padStart(2, "0")}`;
    const index = availableMonths.findIndex((m) => m === currentKey);
    if (index < availableMonths.length - 1) {
      const [y, m] = availableMonths[index + 1].split("-").map(Number);
      setSelectedYear(y);
      setSelectedMonth(m - 1);
    }
  };

  if (!calendar || selectedMonth === null || selectedYear === null) {
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

  const currentMonthKey = `${selectedYear}-${(selectedMonth + 1)
      .toString()
      .padStart(2, "0")}`;
  if (!availableMonths.includes(currentMonthKey)) return null;

  const calendarGrid = buildCalendarGrid(selectedYear, selectedMonth);

  return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-6">
          Dự đoán chu kỳ - Tháng {selectedMonth + 1}/{selectedYear}
        </h2>

        <div className="flex justify-center items-center gap-4 mb-6">
          <button
              onClick={handlePrevMonth}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={availableMonths[0] === currentMonthKey}
          >
            ← Tháng trước
          </button>
          <span className="font-medium text-lg">
          Tháng {selectedMonth + 1} / {selectedYear}
        </span>
          <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={
                  availableMonths[availableMonths.length - 1] === currentMonthKey
              }
          >
            Tháng sau →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 font-semibold text-center text-sm text-gray-700 mb-2">
          <div>CN</div>
          <div>T2</div>
          <div>T3</div>
          <div>T4</div>
          <div>T5</div>
          <div>T6</div>
          <div>T7</div>
        </div>

        {calendarGrid.map((week, i) => (
            <div
                key={i}
                className="grid grid-cols-7 gap-2 mb-2 justify-items-center"
            >
              {week.map((day, j) =>
                  day ? (
                      <div
                          key={j}
                          className={`w-16 h-16 flex flex-col items-center justify-center rounded-full shadow text-xs cursor-pointer ${getColor(
                              day.dateStr
                          )}`}
                      >
                        <div className="font-bold text-base">
                          {day.date.getDate()}
                        </div>
                        <div className="text-xs leading-tight text-center">
                          {translateType(
                              calendar.days.find((d) => d.date === day.dateStr)?.type
                          )}
                        </div>
                      </div>
                  ) : (
                      <div key={j} className="w-16 h-16" />
                  )
              )}
            </div>
        ))}

        <div className="mt-6 grid grid-cols-2 gap-2 text-sm max-w-sm mx-auto text-left">
          <p>
            <span className="inline-block w-4 h-4 bg-red-400 rounded-full mr-2 align-middle"></span>
            Kinh nguyệt
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2 align-middle"></span>
            Thụ thai cao
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-yellow-300 rounded-full mr-2 align-middle"></span>
            Thụ thai trung bình
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-gray-200 rounded-full mr-2 align-middle"></span>
            Ngày thường
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
              onClick={() => navigate("/health-tracker")}
              className="px-5 py-2 bg-[#0099CF] text-white rounded hover:bg-blue-600"
          >
            ← Quay lại theo dõi sức khỏe
          </button>

          <button
              onClick={() => navigate("/period-history")}
              className="px-5 py-2 bg-[#0099CF] text-white rounded hover:bg-blue-600"
          >
            📖 Xem lịch sử ghi chu kỳ
          </button>
        </div>

      </div>
  );
}
