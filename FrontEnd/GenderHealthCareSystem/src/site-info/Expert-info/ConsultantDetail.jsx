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
          onClick={() => setShowForm(true)}
          className="mt-6 bg-[#0099CF] hover:bg-[#0077aa] text-white font-semibold py-2 px-6 rounded-lg"
        >
          Đặt lịch tư vấn
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              onClick={handleCloseForm}
            >✕</button>

            <h3 className="text-xl font-bold mb-4 text-[#0099CF]">Đặt lịch tư vấn với {expert.fullName}</h3>

            <form className="space-y-4" onSubmit={handleSubmitBooking}>
              <input type="text" name="fullName" placeholder="Họ và tên *" required defaultValue={defaultName}
                     className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
              <input type="tel" name="phone" placeholder="Số điện thoại *" required defaultValue={defaultPhone}
                     className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
              <input type="email" name="email" placeholder="Email (Tùy chọn)" defaultValue={defaultEmail}
                     className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
              <input type="date" name="date" required
                     className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
              <select name="timeSlot" required
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]">
                <option value="">-- Chọn khung giờ tư vấn *</option>
                <option value="08:00 - 09:00">08:00 - 09:00</option>
                <option value="09:00 - 10:00">09:00 - 10:00</option>
                <option value="10:00 - 11:00">10:00 - 11:00</option>
                <option value="13:30 - 14:30">13:30 - 14:30</option>
                <option value="15:00 - 16:00">15:00 - 16:00</option>
                <option value="16:30 - 17:30">16:30 - 17:30</option>
              </select>
              <label className="flex items-start border rounded-lg p-4 cursor-pointer hover:shadow-md">
                <input type="radio" name="paymentMethod" value="bank" required className="mt-1.5 accent-[#0099CF]" />
                <div className="ml-3">
                  <div className="flex items-center space-x-2 text-gray-800 font-semibold">
                    <AiFillBank className="text-xl" /><span>Thanh toán trực tuyến</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">ATM/Visa/MasterCard/QR Code</p>
                </div>
              </label>
              <label className="flex items-start border rounded-lg p-4 cursor-pointer hover:shadow-md">
                <input type="radio" name="paymentMethod" value="paypal" className="mt-1.5 accent-[#0099CF]" />
                <div className="ml-3">
                  <div className="flex items-center space-x-2 text-gray-800 font-semibold">🅿️<span>PayPal</span></div>
                  <p className="text-sm text-gray-500 mt-1">Tài khoản PayPal hoặc thẻ quốc tế</p>
                </div>
              </label>
              <textarea name="notes" rows={3} placeholder="Ghi chú thêm (nếu có)"
                        className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleCloseForm}
                        className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300">Hủy</button>
                <button type="submit"
                        className="bg-[#0099CF] text-white px-6 py-2 rounded-lg hover:bg-[#0077aa]">Xác nhận đặt lịch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
