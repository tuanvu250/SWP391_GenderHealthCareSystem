import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillBank } from "react-icons/ai";
import { ClockCircleOutlined, GlobalOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons";

export default function ConsultantDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const expert = state;
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const defaultName = user?.fullName || "";
  const defaultPhone = user?.phone || "";
  const defaultEmail = user?.email || "";

  const handleCloseForm = () => setShowForm(false);
  const handleSubmitBooking = (e) => {
    e.preventDefault();
    const form = e.target;
    const customerId = user?.customerId;
    const paymentMethod = form.paymentMethod.value.toLowerCase() === "bank" ? "VNPAY" : "PAYPAL";

    const bookingData = {
      name: form.fullName.value,
      phone: form.phone.value,
      email: form.email.value,
      date: form.date.value,
      timeSlot: form.timeSlot.value,
      notes: form.notes.value,
      paymentMethod,
      expertName: expert.fullName,
      consultantId: expert.consultantId,
      customerId,
    };

    navigate("/confirm-consultant", { state: bookingData });
  };

  if (!expert) return <div className="p-6">Không tìm thấy thông tin tư vấn viên.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-[#f0f0f0]">
          {expert.userImageUrl ? (
            <img src={expert.userImageUrl} alt={expert.fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-[#0099CF]">{expert.fullName?.charAt(0)}</span>
          )}
        </div>
        <h2 className="text-xl font-bold mt-4">{expert.fullName}</h2>
        <p className="text-gray-500">{expert.jobTitle}</p>
        <p className="mt-2 text-gray-700 italic">{expert.specialization || "Chuyên ngành chưa cập nhật"}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {expert.languages && (
            <p className="flex items-center justify-center gap-2"><GlobalOutlined /> Ngôn ngữ: {expert.languages}</p>
          )}
          {expert.experienceYears !== undefined && (
            <p className="flex items-center justify-center gap-2"><ClockCircleOutlined /> Kinh nghiệm: {expert.experienceYears} năm</p>
          )}
          {expert.hourlyRate !== undefined && (
            <p className="flex items-center justify-center gap-2"><DollarOutlined /> Phí tư vấn: {expert.hourlyRate.toLocaleString()} VNĐ/giờ</p>
          )}
          {expert.introduction && (
            <div className="pt-4 text-gray-700">
              <p className="font-semibold text-base">Giới thiệu:</p>
              <p className="mt-1 whitespace-pre-line">{expert.introduction}</p>
            </div>
          )}
          {expert.details?.length > 0 && (
            <div className="pt-6 text-left">
              <p className="font-semibold text-base text-center mb-4">Chi tiết chuyên môn</p>
              <ul className="space-y-4">
                {expert.details.map((item, idx) => (
                  <li key={idx} className="border p-4 rounded-lg bg-[#f9f9f9]">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <CheckCircleOutlined className="text-green-500" /> {item.title} - {item.organization}
                    </p>
                    <p className="text-xs italic text-gray-500 mt-1">
                      {item.fromDate || item.issuedDate} → {item.toDate || "Nay"}
                    </p>
                    {item.description && (
                      <p className="text-sm mt-2 text-gray-600">{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg"
        >
          ← Quay lại
        </button>

      </div>


    
      </div>
);
}
