import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { message } from 'antd';
import { getAllPillSchedules, markPillTaken } from '../components/utils/api';
import axios from 'axios';

export default function PillScheduleCalendar() {
  const navigate = useNavigate();
  const [updatedSchedule, setUpdatedSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Load lịch uống thuốc từ DB
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await getAllPillSchedules();
      const data = res?.data ?? [];
      const map = {};
      data.forEach(item => {
        const dateStr = dayjs(item.pillDate).format("YYYY-MM-DD");
        map[dateStr] = item;
      });
      setUpdatedSchedule(map);
    } catch (err) {
      const code = err?.response?.status;
      if (code === 401) {
        message.error("Bạn chưa đăng nhập hoặc phiên đã hết hạn.");
        navigate("/login");
      } else {
        message.error("Không thể tải lịch uống thuốc (lỗi server).");
      }
      console.error("❌ Lỗi fetchSchedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const getMonthDates = () => {
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');
    const days = [];
    for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth); date = date.add(1, 'day')) {
      days.push(date);
    }
    return days;
  };

  const handleToggleCheck = async (dateStr) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      message.error("Bạn chưa đăng nhập.");
      return;
    }

    let item = updatedSchedule[dateStr];

    try {
      if (!item) {
        const res = await axios.post(
          "/api/pills",
          {
            pillType: "28",
            startDate: dateStr,
            timeOfDay: "08:00:00",
            isActive: true,
            notificationFrequency: "DAILY"
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        message.success("Đã tạo thuốc và lịch mới.");
      } else {
        const newValue = !item.hasTaken;
        if (item.scheduleId) {
          await markPillTaken(item.scheduleId, newValue);
          message.success("Đã cập nhật trạng thái.");
        }
      }

      await fetchSchedule(); // ✅ Tải lại sau khi thay đổi
    } catch (err) {
      console.error("❌ Lỗi cập nhật lịch:", err?.response?.data || err.message);
      message.error("Không thể cập nhật lịch uống thuốc.");
    }
  };

  const daysInMonth = getMonthDates();
  const firstDayOfWeek = dayjs().startOf('month').day();
  const calendarRows = [];
  let currentRow = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentRow.push(<td key={`empty-${i}`} className="p-2"></td>);
  }

  daysInMonth.forEach((date, index) => {
    const dateStr = date.format('YYYY-MM-DD');
    const item = updatedSchedule[dateStr];
    const hasTaken = item?.hasTaken ?? false;
    const isToday = dayjs().format('YYYY-MM-DD') === dateStr;

    currentRow.push(
      <td key={dateStr} className="p-2 text-center">
        <button
          onClick={() => handleToggleCheck(dateStr)}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition duration-200
            ${hasTaken ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
            ${isToday ? 'ring-2 ring-blue-500' : ''}
            hover:scale-105`}
        >
          {date.date()}
        </button>
      </td>
    );

    if ((currentRow.length + firstDayOfWeek) % 7 === 0) {
      calendarRows.push(<tr key={`row-${index}`}>{currentRow}</tr>);
      currentRow = [];
    }
  });

  if (currentRow.length > 0) {
    while (currentRow.length < 7) {
      currentRow.push(<td key={`end-empty-${currentRow.length}`} className="p-2"></td>);
    }
    calendarRows.push(<tr key="last-row">{currentRow}</tr>);
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-6">Lịch uống thuốc theo tháng</h2>
      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <>
          <table className="w-full table-fixed border-separate border-spacing-1">
            <thead>
              <tr className="text-gray-700 font-medium text-sm">
                <th>CN</th><th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>T6</th><th>T7</th>
              </tr>
            </thead>
            <tbody>{calendarRows}</tbody>
          </table>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={fetchSchedule}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              🔄 Làm mới
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ← Quay lại
            </button>
          </div>
        </>
      )}
    </div>
  );
}
