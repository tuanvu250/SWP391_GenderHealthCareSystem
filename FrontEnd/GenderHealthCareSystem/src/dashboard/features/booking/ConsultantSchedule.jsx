import React, { useEffect, useState } from "react";

export default function ConsultantSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [updateMap, setUpdateMap] = useState({});

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        customerName: "Nguyễn Thị A",
        date: "2025-06-25T10:00:00",
        topic: "Tư vấn tâm lý",
        link: "",
        status: "SCHEDULED",
      },
      {
        id: 2,
        customerName: "Trần Văn B",
        date: "2025-06-26T14:30:00",
        topic: "Tư vấn sức khỏe sinh sản",
        link: "https://meet.google.com/abc-defg-hij",
        status: "COMPLETED",
      },
      {
        id: 3,
        customerName: "Lê Hồng C",
        date: "2025-06-27T09:00:00",
        topic: "Tư vấn kế hoạch hóa gia đình",
        link: "",
        status: "CANCELLED",
      },
    ];
    setAppointments(mockData);
  }, []);

  const handleChange = (id, field, value) => {
    setUpdateMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdateLink = (id) => {
    const update = updateMap[id];
    if (!update?.link) return alert("Vui lòng nhập link cuộc hẹn.");
    alert(`Đã cập nhật link cho cuộc hẹn ID ${id}:\n${update.link}`);
  };

  const handleUpdateStatus = (id) => {
    const update = updateMap[id];
    if (!update?.status) return alert("Vui lòng chọn trạng thái.");
    alert(`Đã cập nhật trạng thái cho cuộc hẹn ID ${id}:\n${translateStatus(update.status)}`);
  };

  const translateStatus = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "Đã lên cuộc hẹn";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã huỷ";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0099CF]">Lịch tư vấn của bạn</h1>

      {appointments.length === 0 ? (
        <p>Không có cuộc hẹn nào.</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((item) => {
            const update = updateMap[item.id] || {};
            return (
              <div key={item.id} className="p-5 border rounded-lg shadow-sm bg-white space-y-3">
                <p><strong>Khách hàng:</strong> {item.customerName}</p>
                <p><strong>Ngày:</strong> {new Date(item.date).toLocaleString()}</p>
                <p><strong>Chủ đề:</strong> {item.topic}</p>
                <p><strong>Trạng thái hiện tại:</strong> {translateStatus(item.status)}</p>
                <p><strong>Link hiện tại:</strong>{" "}
                  {item.link ? (
                    <a href={item.link} className="text-[#0099CF] underline" target="_blank" rel="noreferrer">
                      {item.link}
                    </a>
                  ) : (
                    <span className="italic text-gray-500">Chưa có</span>
                  )}
                </p>

                {/* Nhập link */}
                <div className="mt-3 flex gap-3 flex-col sm:flex-row items-stretch sm:items-center">
                  <input
                    type="text"
                    placeholder="Nhập link Meet/Zoom"
                    value={update.link ?? ""}
                    onChange={(e) => handleChange(item.id, "link", e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <button
                    onClick={() => handleUpdateLink(item.id)}
                    className="bg-[#0099CF] hover:bg-[#007eaa] text-white px-4 py-2 rounded"
                  >
                    Cập nhật link
                  </button>
                </div>

                {/* Chọn trạng thái */}
                <div className="mt-2 flex gap-3 flex-col sm:flex-row items-stretch sm:items-center">
                  <select
                    value={update.status ?? ""}
                    onChange={(e) => handleChange(item.id, "status", e.target.value)}
                    className="px-3 py-2 border rounded w-full sm:w-auto"
                  >
                    <option value="">-- Chọn trạng thái --</option>
                    <option value="SCHEDULED">Đã lên cuộc hẹn</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                    <option value="CANCELLED">Đã huỷ</option>
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(item.id)}
                    className="bg-[#0099CF] hover:bg-[#007eaa] text-white px-4 py-2 rounded"
                  >
                    Cập nhật trạng thái
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
