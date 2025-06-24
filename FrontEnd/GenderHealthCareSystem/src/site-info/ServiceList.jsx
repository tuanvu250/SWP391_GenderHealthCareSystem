import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaComments, FaFileMedical, FaUserClock, FaCalendarCheck } from "react-icons/fa";

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
      route: "/menstrual-tracker",
    },
    {
      icon: FaCalendarCheck,
      color: "text-blue-500",
      title: "Theo dõi lịch uống thuốc tránh thai",
      description:
        "Theo dõi lịch uống thuốc tránh thai, nhận nhắc nhở hằng ngày/hằng tuần.",
      button: "Theo dõi ",
      route: "/pill-tracker",
    },
    {
      icon: FaUserClock,
      color: "text-blue-500",
      title: "Đặt lịch tư vấn ",
      description:
        "Đặt lịch trực tuyến với tư vấn viên để trao đổi những thắc mắc và nhận lời khuyên về sức khỏe một cách riêng tư và an toàn tại nhà hoặc cơ sở y tế.",
      button: "Tư vấn",
      route: "/services/consultation",
    },
    {
      icon: FaFileMedical,
      color: "text-blue-500",
      title: "Xét nghiệm STIs",
      description:
        "Đặt lịch xét nghiệm STIs và nhận kết quả online một cách nhanh chóng, bảo mật và chính xác.",
      button: "Đặt lịch",
      route: "/sti-testing",

    },
    {
      icon: FaComments,
      color: "text-blue-500",
      title: "Đặt câu hỏi trực tuyến",
      description:
        "Gửi câu hỏi cho tư vấn viên về các thắc mắc về sức khỏe của bạn.",
      button: "Đặt lịch ngay",
      route: "/services/asking",
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
            <li className="hover:text-[#909497] cursor-pointer py-2 text-[#0099CF] font-semibold border-b-2 border-[#0099CF]">
              <a onClick={() => navigate("/servicelist")}>Dịch vụ</a>
            </li>
            <li className="hover:text-[#909497] cursor-pointer py-2">
              <a onClick={() => navigate("/expert")}>Chuyên gia</a>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 max-w-[1400px] mx-auto px-6 py-5">
        {serviceData.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border-t-4 border-[#0099CF] flex flex-col justify-between max-w-[300px] w-full mx-auto h-[370px]"
            >
              <div>
                <Icon className="text-[#0099CF] text-5xl mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.description}</p>
              </div>
              <button
                onClick={() => navigate(service.route)}
                className="bg-[#0099CF] text-white w-full py-3 rounded-md hover:bg-[#007aa6] transition text-sm font-semibold"
              >
                {service.button} →
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default Services;
