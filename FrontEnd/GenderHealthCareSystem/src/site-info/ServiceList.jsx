import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaComments, FaFileMedical, FaUserClock } from "react-icons/fa";

const Services = () => {
  const navigate = useNavigate();

  const serviceData = [
    {
      icon: FaCalendarAlt,
      color: "text-blue-500",
      title: "Theo dõi chu kỳ kinh nguyệt",
      description:
        "Theo dõi chu kì kinh nguyệt của bạn, nhận nhắc nhở thời gian rụng trứng, khả năng mang thai, và thời gian uống thuốc tránh thai.",
      button: "Theo dõi",
    },
    {
      icon: FaUserClock,
      color: "text-blue-500",
      title: "Đặt lịch tư vấn với tư vấn viên",
      description:
        "Đặt lịch trực tuyến với tư vấn viên để trao đổi những thắc mắc và nhận lời khuyên về sức khỏe một cách riêng tư và an toàn.",
      button: "Tư vấn",
    },
    {
      icon: FaFileMedical,
      color: "text-blue-500",
      title: "Xét nghiệm STIs",
      description:
        "Đặt lịch xét nghiệm STIs và nhận kết quả online một cách nhanh chóng, bảo mật và chính xác.",
      button: "Đặt lịch",
    },
    {
      icon: FaComments,
      color: "text-blue-500",
      title: "Đặt câu hỏi trực tuyến",
      description:
        "Gửi câu hỏi cho tư vấn viên về các thắc mắc về sức khỏe của bạn.",
      button: "Đặt lịch ngay",
    },
  ];

  return (
    <section className="bg-[#f8fbfe] py-12 px-4">
      {/* Thanh menu */}
      <div className="px-8 pb-8 max-w-7xl mx-auto text-gray-800">
        <nav className="hidden lg:block">
          <ul className="flex space-x-8 font-medium text-[#a6acaf]">
            <li className="hover:text-[#909497] cursor-pointer py-2">
              <a onClick={() => navigate("/about")}>Giới thiệu</a>
            </li>
            <li className="hover:text-[#909497] cursor-pointer py-2 text-blue-600 font-semibold border-b-2 border-blue-600">
              <a onClick={() => navigate("/servicelist")}>Dịch vụ</a>
            </li>
            <li className="hover:text-[#909497] cursor-pointer py-2">
              <a onClick={() => navigate("/about")}>Chuyên gia</a>
            </li>
            <li className="hover:text-[#909497] cursor-pointer py-2">
              <a onClick={() => navigate("/privacy")}>Chính sách</a>
            </li>
            <li className="hover:text-[#909497] cursor-pointer py-2">
              <a onClick={() => navigate("/contact")}>Liên hệ</a>
            </li>
          </ul>
        </nav>
      </div>

      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Dịch vụ</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {serviceData.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition border-t-4 border-blue-100 flex flex-col justify-between"
            >
              <div>
                <Icon className={`${service.color} text-3xl mb-4`} />
                <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
              </div>
              <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition text-sm font-semibold">
                {service.button} →
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <button
          className="border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => navigate("/servicelist")}
        >
          Xem tất cả dịch vụ →
        </button>
      </div>
    </section>
  );
};

export default Services;
