import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMicroscope, FaComments, FaCalendarCheck } from "react-icons/fa";

const Services = () => {
  const navigate = useNavigate();

  const serviceData = [
    {
      icon: FaMicroscope,
      color: "text-blue-600",
      title: "Xét nghiệm STIs",
      description:
        "Dễ dàng tiếp cận các xét nghiệm STIs một cách riêng tư và an toàn. Nhận kết quả và tư vấn trực tuyến từ chuyên gia.",
      action: "Tìm hiểu thêm",
    },
    {
      icon: FaComments,
      color: "text-green-600",
      title: "Đặt câu hỏi hoặc tư vấn",
      description:
        "Kết nối với bác sĩ hoặc chuyên gia y tế để được tư vấn trực tiếp hoặc đặt câu hỏi ẩn danh về sức khỏe.",
      action: "Hỏi ngay",
    },
    {
      icon: FaCalendarCheck,
      color: "text-purple-600",
      title: "Đặt lịch khám",
      description:
        "Chọn bác sĩ, thời gian và dịch vụ bạn cần. Đặt lịch nhanh chóng và quản lý lịch khám dễ dàng.",
      action: "Đặt lịch",
    },
  ];

  return (
    <section className="bg-white py-12 px-4">
      {/* Thanh menu */}
      <div className="px-8 pb-8 max-w-7xl mx-auto text-gray-800">
        <nav className="hidden lg:block">
          <ul className="flex space-x-8 font-medium text-[#a6acaf]">
            <li className="hover:text-[#909497] cursor-pointer py-2 ">
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

      <h2 className="text-3xl font-bold text-center mb-10">Dịch vụ</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {serviceData.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-md transition"
            >
              <Icon className={`${service.color} text-4xl mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button className="text-blue-600 font-medium hover:underline">
                {service.action} →
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;
