import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Helper để định dạng ngày
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
};

export default function PeriodHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Giả định token được lưu trong localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPeriodHistory();
  }, []);

  const fetchPeriodHistory = async () => {
    try {
      const res = await axios.get("/api/menstrual/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
      alert("Không thể tải dữ liệu lịch sử.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-period/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?");
    if (!confirm) return;

    try {
      await axios.delete(`/api/menstrual/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory((prev) => prev.filter((item) => item.cycleId !== id));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Xóa bản ghi thất bại.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Lịch sử chu kỳ</h2>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có bản ghi nào.</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div
              key={entry.cycleId}
              className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="font-medium">
                  {formatDate(entry.startDate)} → {formatDate(entry.endDate)}
                </p>
                <p className="text-sm text-gray-500">
                  Chu kỳ: {entry.cycleLength} ngày
                </p>
                {entry.note && (
                  <p className="text-sm italic text-gray-600 mt-1">
                    Ghi chú: {entry.note}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry.cycleId)}
                  className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(entry.cycleId)}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/menstrual-ovulation")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← Quay lại theo dõi sức khỏe
        </button>
      </div>
    </div>
  );
}
