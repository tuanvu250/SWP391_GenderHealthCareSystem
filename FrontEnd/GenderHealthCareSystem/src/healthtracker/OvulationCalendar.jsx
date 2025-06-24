// 📁 src/pages/OvulationCalendar.jsx
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {menstrualHistoryAPI} from "../components/utils/api";

export default function OvulationCalendar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [calendar, setCalendar] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        const fetchCalendar = async () => {
            const token = sessionStorage.getItem("token");
            if (!token) return navigate("/login");
            try {
                let calendarData = location.state?.calendar;
                if (!calendarData) {
                    const res = await menstrualHistoryAPI();
                    calendarData = res.data;
                }
                if (!calendarData || !calendarData.days?.length) return navigate("/menstrual-tracker");

                setCalendar(calendarData);

                const allDates = calendarData.days.map((d) => d.date);
                const monthSet = new Set();
                allDates.forEach((d) => {
                    const [y, m] = d.split("-").map(Number);
                    monthSet.add(`${y}-${String(m).padStart(2, "0")}`);
                });

                const sorted = Array.from(monthSet).sort((a, b) => new Date(a + "-01") - new Date(b + "-01"));
                setAvailableMonths(sorted);

                const menstruationDates = calendarData.days.filter(
                    (d) => d.type === "MENSTRUATION" && d.note === "form"
                );

                let baseDate = new Date();
                if (menstruationDates.length > 0) {
                    baseDate = new Date(menstruationDates.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date);
                }
                const key = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, "0")}`;
                const [y, m] = key.split("-").map(Number);
                setSelectedYear(y);
                setSelectedMonth(m - 1);

                const today = new Date();
                const hasMenstruationThisMonth = calendarData.days.some((d) => {
                    const dDate = new Date(d.date);
                    return d.type === "MENSTRUATION" && dDate.getFullYear() === today.getFullYear() && dDate.getMonth() === today.getMonth();
                });
                setShowReminder(!hasMenstruationThisMonth);
            } catch (err) {
                console.error("Lỗi tải lịch dự đoán:", err);
                navigate("/menstrual-tracker");
            }
        };
        fetchCalendar();
    }, [location.state, navigate]);

    const getMonthDays = (year, month) => {
        const days = [];
        const lastDate = new Date(year, month + 1, 0);
        for (let d = 1; d <= lastDate.getDate(); d++) {
            const date = new Date(year, month, d);
            const dateStr = date.toISOString().split("T")[0];
            days.push({date, dateStr, weekday: date.getDay()});
        }
        return days;
    };

    const buildCalendarGrid = (year, month) => {
        const days = getMonthDays(year, month);
        const blanks = Array(days[0].weekday).fill(null);
        const grid = [...blanks, ...days];
        while (grid.length < 42) grid.push(null);
        const rows = [];
        for (let i = 0; i < 42; i += 7) rows.push(grid.slice(i, i + 7));
        return rows;
    };

    const getColor = (dateStr) => {
        const match = calendar.days.find((d) => d.date === dateStr);
        if (!match) return "bg-white text-gray-700";
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

    const handlePrev = () => {
        const currentKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
        const idx = availableMonths.indexOf(currentKey);
        if (idx > 0) {
            const [y, m] = availableMonths[idx - 1].split("-").map(Number);
            setSelectedYear(y);
            setSelectedMonth(m - 1);
        }
    };

    const handleNext = () => {
        const currentKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
        const idx = availableMonths.indexOf(currentKey);
        if (idx < availableMonths.length - 1) {
            const [y, m] = availableMonths[idx + 1].split("-").map(Number);
            setSelectedYear(y);
            setSelectedMonth(m - 1);
        }
    };

    if (!calendar || selectedYear === null || selectedMonth === null) return null;
    const calendarGrid = buildCalendarGrid(selectedYear, selectedMonth);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-center relative">
            <h2 className="text-2xl font-bold mb-6">Dự đoán chu kỳ - Tháng {selectedMonth + 1}/{selectedYear}</h2>

            {showReminder && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
                        <h3 className="text-lg font-semibold text-red-600 mb-4">Lưu ý</h3>
                        <p className="text-gray-800 mb-4">
                            Đây là bảng dự đoán. Vui lòng nhập kỳ kinh thực tế nếu đã có để cập nhật chính xác.
                        </p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => {
                                setShowReminder(false);
                                navigate("/menstrual-tracker", {state: {forceInput: true}});
                            }}
                        >
                            Nhập kỳ kinh mới
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center gap-4 mb-6">
                <button onClick={handlePrev} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">← Tháng trước
                </button>
                <span className="font-medium text-lg">Tháng {selectedMonth + 1} / {selectedYear}</span>
                <button onClick={handleNext} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Tháng sau →
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
                <div key={i} className="grid grid-cols-7 gap-2 mb-2 justify-items-center">
                    {week.map((day, j) =>
                        day ? (
                            <div key={j}
                                 className={`w-16 h-16 flex flex-col items-center justify-center rounded-full shadow text-xs ${getColor(day.dateStr)}`}>
                                <div className="font-bold text-base">{day.date.getDate()}</div>
                            </div>
                        ) : (
                            <div key={j} className="w-16 h-16"/>
                        )
                    )}
                </div>
            ))}

            <div className="mt-6 grid grid-cols-2 gap-2 text-sm max-w-sm mx-auto text-left">
                <p><span className="inline-block w-4 h-4 bg-red-400 rounded-full mr-2"></span>Kinh nguyệt</p>
                <p><span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></span>Thụ thai cao</p>
                <p><span className="inline-block w-4 h-4 bg-yellow-300 rounded-full mr-2"></span>Thụ thai trung bình</p>
                <p><span className="inline-block w-4 h-4 bg-gray-100 rounded-full mr-2"></span>Ngày thường</p>
            </div>

            <div className="mt-8 flex justify-center gap-4">
                <button
                    onClick={() => navigate("/menstrual-tracker", {state: {forceInput: true}})}
                    className="px-5 py-2 bg-[#0099CF] text-white rounded hover:bg-blue-600"
                >
                    ← Nhập kỳ kinh mới
                </button>
                <button
                    onClick={() => navigate("/period-history")}
                    className="px-5 py-2 bg-[#0099CF] text-white rounded hover:bg-blue-600"
                >
                     Lịch sử kỳ kinh
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2 bg-[#0099CF] text-white rounded hover:bg-blue-600"
                >
                    Lưu bảng
                </button>
            </div>

        </div>
    );
}
