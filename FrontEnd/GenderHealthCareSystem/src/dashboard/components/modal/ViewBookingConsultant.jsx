import React, { useEffect, useState } from "react";

export default function ConsultantSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedActionMap, setSelectedActionMap] = useState({});
  const [cancelReasonMap, setCancelReasonMap] = useState({});

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

  const filteredAppointments =
    filterStatus === "ALL"
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

  const handleUpdate = (id) => {
    const action = selectedActionMap[id];

    if (!action) {
      alert("Vui lòng chọn hành động.");
      return;
    }

    if (action === "CANCELLED") {
      const reason = cancelReasonMap[id];
      if (!reason) {
        alert("Vui lòng nhập lý do huỷ.");
        return;
      }
      alert(`✅ Đã cập nhật trạng thái cuộc hẹn ID ${id} là: Đã huỷ\n📝 Lý do: ${reason}`);
    } else if (action === "COMPLETED") {
      alert(`✅ Đã cập nhật trạng thái cuộc hẹn ID ${id} là: Đã hoàn thành`);
    }

    setSelectedActionMap((prev) => ({ ...prev, [id]: null }));
    setCancelReasonMap((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0099CF]">Lịch tư vấn của bạn</h1>
        <div className="flex space-x-2">
          {["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                filterStatus === status
                  ? "bg-[#0099CF] text-white border-[#0099CF]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status === "ALL" ? "Tất cả" : translateStatus(status)}
            </button>
          ))}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="flex flex-col items-center text-gray-400 py-10">
          <svg
            className="w-16 h-16 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M3 3v18h18M3 3l18 18"
            />
          </svg>
          <p>Không có cuộc hẹn nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Chủ đề</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredAppointments.map((item) => {
                const isScheduled = item.status === "SCHEDULED";
                const action = selectedActionMap[item.id];

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.customerName}</td>
                    <td className="px-4 py-3">{new Date(item.date).toLocaleString()}</td>
                    <td className="px-4 py-3">{item.topic}</td>
                    <td className="px-4 py-3">{translateStatus(item.status)}</td>
                    <td className="px-4 py-3">
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-[#0099CF] underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Chưa có</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center space-y-2">
                      {isScheduled && (
                        <>
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                setSelectedActionMap((prev) => ({
                                  ...prev,
                                  [item.id]: "COMPLETED",
                                }))
                              }
                              className="bg-[#0099CF] hover:bg-[#007eaa] text-white text-sm font-medium px-4 py-2 rounded-md"
                            >
                              Hoàn thành
                            </button>
                            <button
                              onClick={() =>
                                setSelectedActionMap((prev) => ({
                                  ...prev,
                                  [item.id]: "CANCELLED",
                                }))
                              }
                              className="bg-[#0099CF] hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md"
                            >
                              Huỷ
                            </button>
                          </div>

                          {action === "CANCELLED" && (
                            <textarea
                              placeholder="Lý do huỷ..."
                              rows={2}
                              value={cancelReasonMap[item.id] || ""}
                              onChange={(e) =>
                                setCancelReasonMap((prev) => ({
                                  ...prev,
                                  [item.id]: e.target.value,
                                }))
                              }
                              className="w-full border border-red-300 rounded-md px-3 py-2 text-sm mt-2"
                            />
                          )}

                          {action && (
                            <button
                              onClick={() => handleUpdate(item.id)}
                              className="mt-2 w-full bg-[#0099CF] hover:bg-[#007eaa] text-white text-sm font-semibold py-2 rounded-md transition"
                            >
                              Xác nhận 
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
