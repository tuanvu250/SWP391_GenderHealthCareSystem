import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { menstrualHistoryAPI } from "../components/utils/api";

export default function PeriodHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await menstrualHistoryAPI();
        const allDays = res.data?.days || [];

        // ✅ Chỉ lấy ngày do người dùng nhập (note === "form")
        const userDays = allDays
          .filter((d) => d.type === "MENSTRUATION" && d.note === "form")
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        const periods = [];
        let current = [];

        for (let i = 0; i < userDays.length; i++) {
          const cur = new Date(userDays[i].date);
          const prev = i > 0 ? new Date(userDays[i - 1].date) : null;

          if (!prev || (cur - prev) / (1000 * 60 * 60 * 24) === 1) {
            current.push(userDays[i]);
          } else {
            if (current.length > 0) periods.push([...current]);
            current = [userDays[i]];
          }
        }
        if (current.length > 0) periods.push(current);

        // ✅ Nhóm theo tháng, lấy kỳ có ngày bắt đầu mới nhất mỗi tháng
        const map = new Map();
        for (let group of periods) {
          const startDate = group[0].date;
          const monthKey = startDate.slice(0, 7); // yyyy-mm
          const existing = map.get(monthKey);
          if (!existing || new Date(startDate) > new Date(existing[0].date)) {
            map.set(monthKey, group);
          }
        }

        const result = Array.from(map.entries())
          .map(([month, group]) => ({
            month,
            startDate: group[0].date,
            endDate: group[group.length - 1].date,
            length: group.length,
          }))
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        setHistory(result);
      } catch (err) {
        console.error("Lỗi tải lịch sử kỳ kinh:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Đang tải dữ liệu...</p>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        <p>Không có dữ liệu kỳ kinh nào được nhập từ bạn.</p>
        <button
          onClick={() => navigate("/menstrual-tracker")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Nhập kỳ kinh đầu tiên
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-center mb-6">📖 Lịch sử kỳ kinh của bạn</h2>
      <ul className="space-y-4">
        {history.map((item, idx) => (
          <li key={idx} className="border rounded p-4 shadow bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-semibold">
                🗓️ Tháng {+item.month.split("-")[1]}/{item.month.split("-")[0]}
              </span>
              <span className="text-sm text-gray-500">
                {item.startDate} → {item.endDate}
              </span>
            </div>
            <p className="text-sm text-gray-700">🩸 {item.length} ngày</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/menstrual-tracker")}
          className="px-5 py-2 bg-[#0099CF] text-white rounded hover:bg-blue-600"
        >
          Nhập kỳ kinh mới →
        </button>
      </div>
    </div>
  );
}
