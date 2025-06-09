import { useState } from "react";

// Dữ liệu tư vấn viên (giữ nguyên)
const advisors = [
  {
    name: "BS. Nguyễn Thị Hoa",
    specialty: "Sức khỏe sinh sản",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "BS. Lê Văn An",
    specialty: "Tư vấn giới tính",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "ThS. Trần Mai Anh",
    specialty: "STI & HIV",
    image: "https://randomuser.me/api/portraits/women/30.jpg",
  },
  {
    name: "BS. Đặng Khánh Linh",
    specialty: "Tâm lý giới tính",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    name: "BS. Trương Văn Kiệt",
    specialty: "Nam khoa",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "ThS. Nguyễn Thị Thảo",
    specialty: "Sức khỏe LGBTQ+",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    name: "BS. Lý Thị Mai",
    specialty: "Nội tiết tố nữ",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    name: "BS. Trịnh Văn Nam",
    specialty: "Tư vấn hiếm muộn",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

export default function ConsultationBooking() {
  const [showForm, setShowForm] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  const handleAdvisorSelect = (advisor) => {
    setSelectedAdvisor(advisor);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedAdvisor(null);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();

    const formData = {
      advisor: selectedAdvisor.name,
      specialty: selectedAdvisor.specialty,
      fullName: e.target.fullName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      date: e.target.date.value,
      consultationType: e.target.consultationType.value,
      notes: e.target.notes.value,
    };

    console.log("Dữ liệu đặt lịch:", formData);
    setShowForm(false);
    setSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal(false);
    setSelectedAdvisor(null);
  };

  return (
    <div className="container mx-auto p-6 lg:p-12 font-sans">
      {/* Phần giới thiệu thêm vào */}
      <div className="bg-[#E6F7FB] p-6 lg:p-8 rounded-xl shadow mb-10 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0077aa] mb-2">
          Dịch vụ tư vấn sức khỏe cá nhân
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Bạn đang gặp khó khăn hay cần người lắng nghe? Hãy chọn chuyên gia phù hợp để được tư vấn tận tâm và bảo mật.
        </p>
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8 text-[#0099CF]">
        Đặt lịch cùng tư vấn viên
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {advisors.map((advisor, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out bg-white transform hover:-translate-y-1"
          >
            <img
              src={advisor.image}
              alt={advisor.name}
              className="w-24 h-24 rounded-full object-cover mb-4 ring-2 ring-[#0099CF] ring-offset-2"
            />
            <div className="text-center flex-grow">
              <h2 className="font-bold text-lg text-gray-800">{advisor.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{advisor.specialty}</p>
            </div>
            <button
              className="mt-5 w-full py-2 bg-[#0099CF] text-white font-semibold rounded-lg hover:bg-[#0077aa] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0099CF] focus:ring-opacity-50"
              onClick={() => handleAdvisorSelect(advisor)}
            >
              Tư vấn ngay
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-[#00000080] backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg p-8 rounded-xl relative shadow-2xl animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={handleCloseForm}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-4 text-[#0099CF]">Đặt lịch tư vấn</h2>
            <p className="mb-6 text-gray-700">
              Bạn đang đặt lịch với:{" "}
              <strong className="text-[#0099CF]">{selectedAdvisor.name}</strong> -{" "}
              <span className="text-gray-500">{selectedAdvisor.specialty}</span>
              <br />
              <button
                className="text-[#0099CF] underline text-sm mt-2 hover:text-[#0077aa] transition"
                onClick={handleCloseForm}
              >
                Chọn tư vấn viên khác
              </button>
            </p>

            <form className="space-y-4" onSubmit={handleSubmitBooking}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên *"
                  required
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF] focus:border-transparent transition"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại *"
                  required
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF] focus:border-transparent transition"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email (Tùy chọn)"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF] focus:border-transparent transition"
              />
              <input
                type="date"
                name="date"
                required
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF] focus:border-transparent transition"
              />

              <div className="mt-2">
                <p className="font-semibold mb-2 text-gray-700">Hình thức tư vấn *</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="consultationType"
                      value="online"
                      required
                      className="w-4 h-4 text-[#0099CF]"
                      defaultChecked
                    />
                    <span>Tư vấn Online (Video call)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="consultationType"
                      value="direct"
                      className="w-4 h-4 text-[#0099CF]"
                    />
                    <span>Tư vấn Trực tiếp</span>
                  </label>
                </div>
              </div>

              <textarea
                name="notes"
                placeholder="Ghi chú thêm (Nếu có)"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF] focus:border-transparent transition"
                rows={4}
              ></textarea>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={handleCloseForm}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0099CF] text-white font-semibold rounded-lg hover:bg-[#0077aa] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#0099CF] focus:ring-opacity-50"
                >
                  Xác nhận đặt lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successModal && (
        <div className="fixed inset-0 bg-[#00000080] backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-xl text-center shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-[#0099CF] mb-4">Đặt lịch thành công!</h2>
            <p className="text-gray-700 mb-6">
              Cảm ơn bạn đã đặt lịch tư vấn. Chúng tôi sẽ liên hệ lại sớm nhất.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCloseSuccessModal}
                className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Đóng
              </button>
              <button
                className="px-5 py-2 bg-[#0099CF] text-white font-semibold rounded-lg hover:bg-[#0077aa] transition"
              >
                Xem lịch sử
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
