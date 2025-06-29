import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { message } from 'antd';
import { getAllPillSchedules, markPillTaken } from '../components/api/Pill.api';
import axios from 'axios';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale('vi');

export default function PillScheduleCalendar() {
  const navigate = useNavigate();
  const [updatedSchedule, setUpdatedSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [takenCount, setTakenCount] = useState(0);
  const [notTakenCount, setNotTakenCount] = useState(0);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await getAllPillSchedules();
      const data = res?.data ?? [];

      const startDateStr = localStorage.getItem("pillStartDate");
      const pillType = parseInt(localStorage.getItem("pillType") || "28", 10);
      const startDate = startDateStr ? dayjs(startDateStr) : null;
      const today = dayjs();

      const map = {};
      data.forEach(item => {
        const dateObj = dayjs(item.pillDate);
        if (!startDate || dateObj.isBefore(startDate)) return;
        const dateStr = dateObj.format("YYYY-MM-DD");
        map[dateStr] = item;
      });

      if (!startDate || !startDate.isValid() || today.isBefore(startDate)) {
        setUpdatedSchedule(map);
        setTakenCount(0);
        setNotTakenCount(0);
        return;
      }

      const validDates = [];
      let currentDate = startDate;
      let counted = 0;

      while (currentDate.isSameOrBefore(today) && counted < pillType) {
        const dateStr = currentDate.format("YYYY-MM-DD");
        const item = map[dateStr];
        if (!item || item.isPlacebo) {
          currentDate = currentDate.add(1, "day");
          continue;
        }
        validDates.push({ ...item, dateStr });
        counted++;
        currentDate = currentDate.add(1, "day");
      }

      const autoMarkPromises = [];
      const todayStr = today.format("YYYY-MM-DD");

      validDates.forEach(item => {
        const isPast = dayjs(item.dateStr).isBefore(todayStr);
        if (isPast && item.hasTaken == null) {
          autoMarkPromises.push(markPillTaken(item.scheduleId, true));
          item.hasTaken = true;
        }
      });

      if (autoMarkPromises.length > 0) {
        await Promise.all(autoMarkPromises);
        const updated = await getAllPillSchedules();
        updated?.data?.forEach(item => {
          const dateObj = dayjs(item.pillDate);
          if (!startDate || dateObj.isBefore(startDate)) return;
          const dateStr = dateObj.format("YYYY-MM-DD");
          map[dateStr] = item;
        });
      }

      const taken = validDates.filter(i => i.hasTaken === true).length;
      const notTaken = pillType - taken;

      setUpdatedSchedule(map);
      setTakenCount(taken);
      setNotTakenCount(notTaken);
    } catch (err) {
      message.error("Không thể tải lịch uống thuốc.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleToggleCheck = async (dateStr) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      message.error("Bạn chưa đăng nhập.");
      return;
    }

    const clickedDate = dayjs(dateStr);
    if (clickedDate.isAfter(dayjs(), 'day')) {
      message.warning("Bạn đang đánh dấu cho ngày mai hoặc tương lai!");
    }

    const item = updatedSchedule[dateStr];

    try {
      if (!item) {
        await axios.post(
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

      await fetchSchedule();
    } catch (err) {
      console.error("Lỗi cập nhật:", err?.response?.data || err.message);
      message.error("Không thể cập nhật lịch.");
    }
  };

  const renderCalendarForMonth = (month) => {
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');
    const days = [];
    for (let d = startOfMonth; d.isSameOrBefore(endOfMonth); d = d.add(1, 'day')) {
      days.push(d);
    }

    const firstDayOfWeek = startOfMonth.day();
    const rows = [];
    let row = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      row.push(<td key={`empty-${i}`} className="p-2"></td>);
    }

    days.forEach((date, index) => {
      const dateStr = date.format('YYYY-MM-DD');
      const item = updatedSchedule[dateStr];
      const hasTaken = item?.hasTaken ?? false;
      const isToday = dayjs().isSame(date, 'day');
      const isPlacebo = item?.isPlacebo ?? false;
      const showButton = item && !isPlacebo;

      row.push(
        <td key={dateStr} className="p-1">
          {showButton ? (
            <button
              onClick={() => handleToggleCheck(dateStr)}
              className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-semibold transition
                ${hasTaken ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}
                ${isToday ? 'ring-2 ring-blue-600 ring-offset-2' : ''}
                hover:scale-105`}
            >
              {date.date()}
            </button>
          ) : (
            <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-gray-300 border border-dashed">
              {date.date()}
            </div>
          )}
        </td>
      );

      if ((row.length + firstDayOfWeek) % 7 === 0) {
        rows.push(<tr key={`row-${index}`}>{row}</tr>);
        row = [];
      }
    });

    if (row.length > 0) {
      while (row.length < 7) {
        row.push(<td key={`end-${row.length}`} className="p-2"></td>);
      }
      rows.push(<tr key="last">{row}</tr>);
    }

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-center mb-2">
          Tháng {month.month() + 1} năm {month.year()}
        </h3>
        <table className="w-full table-fixed text-center border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-700 font-medium text-sm">
              <th>CN</th><th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>T6</th><th>T7</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  };

  const startDateStr = localStorage.getItem("pillStartDate");

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-2">Lịch uống thuốc theo tháng</h2>

      {startDateStr && (
        <p className="text-center text-gray-600 text-sm mb-4">
          📅 Ngày bắt đầu: <strong>{dayjs(startDateStr).format("DD/MM/YYYY")}</strong>
        </p>
      )}

      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <>
          {[-1, 0, 1].map(offset => (
            <div key={offset}>{renderCalendarForMonth(dayjs().add(offset, 'month'))}</div>
          ))}

          <div className="mt-4 text-center text-sm text-gray-700">
            <p>✅ Đã uống: <strong>{takenCount}</strong> viên</p>
            <p>❌ Chưa uống: <strong>{notTakenCount}</strong> viên</p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => {
                localStorage.removeItem("pillStartDate");
                localStorage.removeItem("pillType");
                navigate("/pill-tracker");
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ← Nhập lại lịch
            </button>
            <button
              onClick={fetchSchedule}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Làm mới
            </button>
          </div>
        </>
      )}
    </div>
  );
}
