import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillBank } from "react-icons/ai";
const experts = [
  {
    id: 0,
    name: "TS. Nguyễn Thị Minh Trang",
    specialty: "Tư vấn sức khỏe giới tính",
    desc: "Tiến sĩ Tâm lý học – Hơn 10 năm tư vấn sức khỏe giới.",
    image: "https://hthaostudio.com/wp-content/uploads/2022/08/Anh-profile-bac-si-min.jpg",
  },
  {
    id: 1,
    name: "ThS. Lê Anh Tuấn",
    specialty: "Nam khoa – Tâm lý giới",
    desc: "Thạc sĩ Tâm lý học – Chuyên hỗ trợ rối loạn giới.",
    image: "https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp",
  },
  {
    id: 2,
    name: "ThS. Bùi Thị Hồng Ánh",
    specialty: "LGBTQ+ – Cộng đồng & Tâm lý",
    desc: "Tư vấn cộng đồng, từng làm việc với nhiều tổ chức phi chính phủ.",
    image: "https://images2.thanhnien.vn/thumb_w/686/528068263637045248/2024/3/7/41498385661961282804899348165590311304931596n-17098051418122006775403-0-286-2048-1822-crop-1709805739243640175866.jpg",
  },
  {
    id: 3,
    name: "ThS. Vũ Thị Lan",
    specialty: "Giáo dục giới tính tuổi teen",
    desc: "Thạc sĩ Giáo dục – Chuyên tư vấn tuổi vị thành niên.",
    image: "https://studiochupanhdep.com/Upload/Images/Album/anh-bac-sy-04.jpg",
  },
  {
    id: 4,
    name: "ThS. Trần Văn Hòa",
    specialty: "Tư vấn tâm lý nam giới",
    desc: "Thạc sĩ Tâm lý học – Hỗ trợ sức khỏe sinh lý nam.",
    image: "https://htmediagroup.vn/wp-content/uploads/2022/12/Anh-bac-si-12-min-585x878.jpg.webp",
  },
  {
    id: 5,
    name: "PGS.TS. Lưu Thị Hằng",
    specialty: "Tư vấn nội tiết nữ",
    desc: "Phó Giáo sư, Tiến sĩ – Giảng viên Y khoa, 15 năm kinh nghiệm.",
    image: "https://htmediagroup.vn/wp-content/uploads/2022/09/Anh-bac-si-nu-1-min.jpg.webp",
  },
  {
    id: 6,
    name: "ThS. Nguyễn Minh Quân",
    specialty: "Tư vấn giáo dục giới tính",
    desc: "Chuyên tổ chức workshop giáo dục giới tính học đường.",
    image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/12/25/1-17035025379211648167770.png",
  },
  {
    id: 7,
    name: "ThS. Phạm Quốc Khánh",
    specialty: "Tâm lý giới & gia đình",
    desc: "Chuyên hỗ trợ các cặp đôi đồng giới và chuyển giới.",
    image: "https://bizweb.dktcdn.net/100/175/849/files/z4277781980584-afef6aa4d11e23c78d25762713d84b0a.jpg?v=1681895248409",
  },
  {
    id: 8,
    name: "ThS. Vũ Quốc Việt",
    specialty: "Tâm lý trẻ em & giới tính",
    desc: "Thạc sĩ – Hướng dẫn phụ huynh trong giáo dục giới tính cho trẻ.",
    image: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/anh-bac-si-27.jpg",
  },
  {
    id: 9,
    name: "ThS. Nguyễn Thị Mỹ Linh",
    specialty: "Tiền hôn nhân & sức khỏe sinh sản",
    desc: "Tư vấn cho các cặp đôi chuẩn bị kết hôn.",
    image: "https://media.sohuutritue.net.vn/files/huongmi/2023/01/27/bsi-pham-ly-0853.jpg",
  },
  {
    id: 10,
    name: "ThS. Đỗ Văn Hùng",
    specialty: "Sức khỏe tình dục nam",
    desc: "Thạc sĩ – Chuyên tư vấn về rối loạn sinh lý nam.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6vkLej_bKmmM-GsfU1rf5XLloXPOr79PyAg&s",
  },
  {
    id: 11,
    name: "TS. Lê Kim Dung",
    specialty: "Phụ nữ – Nội tiết học",
    desc: "Tiến sĩ – Chăm sóc phụ nữ tiền mãn kinh.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYOOi8yOwsMCPm8VkL7BEdLsVBnZu1HOBvlw&s",
  },
];



export default function ConsultationBooking() {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

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

    const bookingData = {
      name: form.fullName.value,
      phone: form.phone.value,
      email: form.email.value,
      date: form.date.value,
      timeSlot: form.timeSlot.value,
      notes: form.notes.value,
      paymentMethod: form.paymentMethod.value,
      expertName: selectedExpert.name,
      consultantId: selectedExpert.id,
      customerId: 10, // hardcoded nếu chưa có auth
    };

    navigate("/confirm-consultant", { state: bookingData });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header & Title */}
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

      {/* Expert List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {experts.map((expert) => (
          <div key={expert.id} className="bg-white p-4 shadow rounded-xl">
            <img src={expert.image} alt={expert.name} className="w-24 h-24 mx-auto rounded-full object-cover ring-2 ring-[#0099CF]" />
            <h3 className="text-center mt-4 font-semibold">{expert.name}</h3>
            <p className="text-center text-sm text-gray-500">{expert.specialty}</p>
            <p
              onClick={() => navigate(`/expert/${expert.id}`)}
              className="text-[#0099CF] hover:text-[#0077aa] text-sm underline text-center cursor-pointer mt-3"
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
        ))}
      </div>

      {/* Booking Form */}
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
              <img
                src={selectedExpert.image}
                alt={selectedExpert.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#0099CF]"
              />
              <div>
                <h3 className="text-xl font-bold text-[#0099CF]">{selectedExpert.name}</h3>
                <p className="text-gray-600 text-sm">{selectedExpert.specialty}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên *"
                  required
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại *"
                  required
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0099CF]"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email (Tùy chọn)"
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

              <div className="space-y-4">
                <label className="flex items-start border rounded-lg p-4 cursor-pointer transition hover:shadow-md">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    className="mt-1.5 accent-[#0099CF]"
                    required
                  />
                  <div className="ml-3">
                    <div className="flex items-center space-x-2 text-gray-800 font-semibold">
                      <AiFillBank className="text-xl " />
                      <span>Thanh toán trực tuyến</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Thanh toán bằng ATM/Visa/MasterCard/QR Code
                    </p>
                  </div>
                </label>
              </div>

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
