import { getAllPillSchedules, markPillTaken } from '../components/api/Pill.api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { message, Modal } from 'antd';
import axios from 'axios';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function PillScheduleCalendar() {
  const navigate = useNavigate();
  const [updatedSchedule, setUpdatedSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [takenCount, setTakenCount] = useState(0);
  const [notTakenCount, setNotTakenCount] = useState(0);
  const [pillTypeCount, setPillTypeCount] = useState(28);
  const [newStartDate, setNewStartDate] = useState('');
  const [newPillType, setNewPillType] = useState('28');

  const clearPillData = () => {
    localStorage.removeItem("pillStartDate");
    localStorage.removeItem("pillType");
  };

  const handleFinishSchedule = () => {
    Modal.confirm({
      title: "Bạn đã uống hết thuốc",
      content: "Bạn muốn tiếp tục theo dõi chu kỳ mới hay dừng lại?",
      okText: "Tiếp tục",
      cancelText: "Dừng theo dõi",
      onOk: () => {
        clearPillData();
        navigate("/pill-tracker", { replace: true });
        window.location.reload();
      },
      onCancel: () => {
        clearPillData();
        message.info("Bạn đã dừng theo dõi thuốc.");
        navigate("/pill-tracker", { replace: true });
        window.location.reload();
      },
    });
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await getAllPillSchedules();
      const data = res?.data ?? [];

      const startDateStr = localStorage.getItem("pillStartDate");
      const pillType = parseInt(localStorage.getItem("pillType") || "28", 10);
      setPillTypeCount(pillType);
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

      while (counted < pillType) {
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

      if (taken >= pillType) {
        handleFinishSchedule();
      }
    } catch (err) {
      message.error("Không thể tải lịch uống thuốc.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasStart = localStorage.getItem("pillStartDate");
    if (hasStart) {
      fetchSchedule();
    } else {
      setLoading(false);
    }
  }, []);

  const getMonthDates = () => {
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');
    const days = [];
    for (let date = startOfMonth; date.isSameOrBefore(endOfMonth); date = date.add(1, 'day')) {
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
        await axios.post(
          "/api/pills",
          {
            pillType: pillTypeCount.toString(),
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
      console.error("❌ Lỗi cập nhật:", err?.response?.data || err.message);
      message.error("Không thể cập nhật lịch.");
    }
  };

  const handleCreateNewSchedule = () => {
    if (!newStartDate) {
      return message.warning("Vui lòng chọn ngày bắt đầu.");
    }
    localStorage.setItem("pillStartDate", newStartDate);
    localStorage.setItem("pillType", newPillType);
    setLoading(true);
    fetchSchedule();
  };

  const startDateStr = localStorage.getItem("pillStartDate");

  if (!startDateStr) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Nhập lịch uống thuốc mới</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Ngày bắt đầu:</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={newStartDate}
            onChange={(e) => setNewStartDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Loại thuốc:</label>
          <select
            className="w-full border p-2 rounded"
            value={newPillType}
            onChange={(e) => setNewPillType(e.target.value)}
          >
            <option value="28">28 viên</option>
            <option value="21">21 viên</option>
          </select>
        </div>
        <button
          onClick={handleCreateNewSchedule}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Bắt đầu theo dõi
        </button>
      </div>
    );
  }

  const daysInMonth = getMonthDates();
  const startDay = daysInMonth[0].day();
  const calendarCells = [];

  for (let i = 0; i < startDay; i++) {
    calendarCells.push(<td key={`empty-start-${i}`} className="p-2"></td>);
  }

  daysInMonth.forEach((date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const item = updatedSchedule[dateStr];
    const hasTaken = item?.hasTaken ?? false;
    const isToday = dayjs().format('YYYY-MM-DD') === dateStr;
    const isPlacebo = item?.isPlacebo ?? false;
    const isFuture = dayjs(dateStr).isAfter(dayjs());
    const showButton = item && !isPlacebo;

    calendarCells.push(
      <td key={dateStr} className="p-2 text-center">
        {showButton ? (
          <button
            onClick={() => handleToggleCheck(dateStr)}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition
              ${hasTaken ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
              ${isToday ? 'ring-2 ring-blue-500' : ''}
              ${isFuture ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}`}
            disabled={isFuture}
          >
            {date.date()}
          </button>
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-300">
            {date.date()}
          </div>
        )}
      </td>
    );
  });

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(<td key={`empty-end-${calendarCells.length}`} className="p-2"></td>);
  }

  const calendarRows = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    calendarRows.push(<tr key={`row-${i}`}>{calendarCells.slice(i, i + 7)}</tr>);
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-center mb-2">
        Lịch uống thuốc theo tháng
      </h2>
      {startDateStr && (
        <p className="text-center text-gray-600 text-sm mb-4">
          📅 Bắt đầu uống: <strong>{dayjs(startDateStr).format("DD/MM/YYYY")}</strong>
        </p>
      )}

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

          <div className="mt-4 text-center text-sm text-gray-700">
            <p>✅ Đã uống: <strong>{takenCount}</strong> viên</p>
            <p>❌ Chưa uống: <strong>{notTakenCount}</strong> viên</p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => {
                clearPillData();
                navigate("/pill-tracker", { replace: true });
                window.location.reload();
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
