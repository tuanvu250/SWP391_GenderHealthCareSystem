import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillBank } from "react-icons/ai";
import { getAllConsultants } from "../../components/api/Consultant.api";

export default function ConsultationBooking() {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // ✅ Lấy user từ sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const defaultName = user?.fullName || "";
  const defaultPhone = user?.phone || "";
  const defaultEmail = user?.email || "";

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const data = await getAllConsultants();
        console.log("Danh sách consultants:", data);
        setExperts(data);
      } catch (err) {
        console.error("Failed to fetch consultants", err);
      }
    };
    fetchExperts();
  }, []);

  const handleSelect = (expert) => {
    setSelectedExpert(expert);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedExpert(null);
    setShowForm(false);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    const form = e.target;
    const user = JSON.parse(sessionStorage.getItem("user"));
    const customerId = user?.customerId;

    let rawMethod = form.paymentMethod.value;
    let normalizedMethod = rawMethod.toLowerCase() === "bank" ? "VNPAY" : "PAYPAL";

    const bookingData = {
      name: form.fullName.value,
      phone: form.phone.value,
      email: form.email.value,
      date: form.date.value,
      timeSlot: form.timeSlot.value,
      notes: form.notes.value,
      paymentMethod: normalizedMethod,
      expertName: selectedExpert.fullName,
      consultantId: selectedExpert.consultantId,
      customerId: customerId, // thêm nếu cần thiết cho confirm
    };

    navigate("/confirm-consultant", { state: bookingData });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-[#E6F7FB] p-6 lg:p-8 rounded-xl shadow mb-10 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0077aa] mb-2">
          Dịch vụ tư vấn sức khỏe cá nhân
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Bạn đang gặp khó khăn hay cần người lắng nghe? Hãy chọn chuyên gia phù hợp để được tư vấn tận tâm và bảo mật.
        </p>
      </div>

      <h2 className="text-3xl font-bold text-center text-[#0099CF] mb-10">
        Đặt lịch tư vấn sức khỏe giới tính
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {experts.length === 0 ? (
          <p className="text-center col-span-full">Đang tải danh sách tư vấn viên...</p>
        ) : (
          experts.map((expert, index) => (
            <div key={index} className="bg-white p-4 shadow rounded-xl">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#f0f0f0] flex items-center justify-center text-xl font-bold text-[#0099CF]">
                {expert.fullName?.charAt(0) || "?"}
              </div>
              <h3 className="text-center mt-4 font-semibold">{expert.fullName}</h3>
              <p className="text-center text-sm text-gray-500">{expert.jobTitle}</p>
              <p
                className="text-[#0099CF] hover:text-[#0077aa] text-sm underline text-center cursor-pointer mt-3"
                onClick={() => navigate(`/expert/${expert.id}`)}
              >
                Xem thông tin chi tiết
              </p>
              <button
                onClick={() => handleSelect(expert)}
                className="mt-4 w-full bg-[#0099CF] hover:bg-[#0077aa] text-white font-semibold py-2 rounded-lg"
              >
                Tư vấn ngay
              </button>
            </div>
          ))
        )}
      </div>

      {showForm && selectedExpert && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              onClick={handleCloseForm}
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#f0f0f0] flex items-center justify-center text-xl font-bold text-[#0099CF]">
                {selectedExpert.fullName?.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0099CF]">{selectedExpert.fullName}</h3>
                <p className="text-gray-600 text-sm">{selectedExpert.jobTitle}</p>
                <p
                  onClick={handleCloseForm}
                  className="mt-2 text-sm text-[#0099CF] hover:underline cursor-pointer"
                >
                  Chọn tư vấn viên khác
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-[#0099CF]">Đặt lịch tư vấn</h3>

            <form className="space-y-4" onSubmit={handleSubmitBooking}>
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên *"
                required
                defaultValue={defaultName}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại *"
                required
                defaultValue={defaultPhone}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
              />

              <input
                type="email"
                name="email"
                placeholder="Email (Tùy chọn)"
                defaultValue={defaultEmail}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
              />

              <input
                type="date"
                name="date"
                required
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
              />

              <select
                name="timeSlot"
                required
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
              >
                <option value="">-- Chọn khung giờ tư vấn *</option>
                <option value="08:00 - 09:00">08:00 - 09:00</option>
                <option value="09:00 - 10:00">09:00 - 10:00</option>
                <option value="10:00 - 11:00">10:00 - 11:00</option>
                <option value="13:30 - 14:30">13:30 - 14:30</option>
                <option value="15:00 - 16:00">15:00 - 16:00</option>
                <option value="16:30 - 17:30">16:30 - 17:30</option>
              </select>

              <label className="flex items-start border rounded-lg p-4 cursor-pointer transition hover:shadow-md">
                <input type="radio" name="paymentMethod" value="bank" className="mt-1.5 accent-[#0099CF]" required />
                <div className="ml-3">
                  <div className="flex items-center space-x-2 text-gray-800 font-semibold">
                    <AiFillBank className="text-xl" />
                    <span>Thanh toán trực tuyến</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Thanh toán bằng ATM/Visa/MasterCard/QR Code</p>
                </div>
              </label>

              <label className="flex items-start border rounded-lg p-4 cursor-pointer transition hover:shadow-md">
                <input type="radio" name="paymentMethod" value="paypal" className="mt-1.5 accent-[#0099CF]" />
                <div className="ml-3">
                  <div className="flex items-center space-x-2 text-gray-800 font-semibold">
                    🅿️
                    <span>Thanh toán qua PayPal</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Thanh toán bằng tài khoản PayPal hoặc thẻ quốc tế</p>
                </div>
              </label>

              <textarea
                name="notes"
                rows={3}
                placeholder="Ghi chú thêm (nếu có)"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
              ></textarea>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#0099CF] text-white px-6 py-2 rounded-lg hover:bg-[#0077aa]"
                >
                  Xác nhận đặt lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
