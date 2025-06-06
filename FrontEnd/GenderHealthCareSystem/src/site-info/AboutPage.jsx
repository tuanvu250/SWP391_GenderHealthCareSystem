import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';
import { CaretDownFilled } from '@ant-design/icons';


const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="px-8 py-12 max-w-7xl mx-auto text-gray-800">
      {/* Menu */}
      <nav className="hidden lg:block">
        <ul className="flex space-x-8 font-medium text-[#a6acaf] ">
          <li className="hover:text-[#909497] cursor-pointer py-2 text-blue-600 font-semibold border-b-2 border-blue-600">
            <a onClick={() => navigate("/about")}>Giới thiệu</a>
          </li>

          <li className="hover:text-[#909497] cursor-pointer py-2 ">
            <a onClick={() => navigate("/servicelist")}>Dịch vụ</a>
          </li>

          <li className="hover:text-[#909497] cursor-pointer py-2 ">
            <a onClick={() => navigate("/about")}>Chuyên gia</a>
          </li>

          <li className="hover:text-[#909497] cursor-pointer py-2 ">
            <a onClick={() => navigate("/about")}>Chính sách</a>
          </li>

          <li className="hover:text-[#909497] cursor-pointer py-2 ">
            <a onClick={() => navigate("/about")}>Liên hệ</a>
          </li>
        </ul>
      </nav>
      {/* Giới thiệu */}
      <div className="grid md:grid-cols-2 gap-8 items-start mt-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Giới thiệu Gender HealthCare</h1>
          <p className="text-gray-700 mb-4">
            Gender Healthcare được ra mắt vào năm 2025 tại Việt Nam với mong muốn cung cấp trực tuyến những kiến thức sức khỏe hữu ích cho bạn đọc. Tại Gender Healthcare, bạn có thể tham khảo thông tin, đặt lịch hẹn với chuyên gia, sử dụng công cụ đo lường và đánh giá tình trạng sức khỏe, gia nhập cộng đồng bạn đọc và cùng nhau chia sẻ câu chuyện sức khỏe của mình.
          </p>
          <p className="text-gray-700">
            Chúng tôi tin rằng với những thông tin luôn cập nhật và các công cụ kiểm tra sức khỏe mới, bạn có thể đưa ra những quyết định sáng suốt hơn vì sức khỏe của bản thân và những người thân yêu. Khỏe hơn – hạnh phúc hơn!
          </p>
        </div>
        <div>
          <img
            src="https://sandiegomagazine.com/wp-content/uploads/2023/08/4ebd3202b5396fd043b142145624b1ec.jpg"
            alt="img1"
            className="rounded-lg w-full"
          />
        </div>
      </div>

      {/* Tầm nhìn & Sứ mệnh */}
      <div className="grid md:grid-cols-2 gap-12 mt-16">
        <div className="flex gap-4 items-start">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2910/2910791.png"
            alt="Vision"
            className="w-12 h-12"
          />
          <div>
            <h3 className="text-blue-600 font-bold">Tầm nhìn</h3>
            <p className="text-gray-700">
              Trở thành nền tảng hàng đầu Châu Á trong việc cung cấp kiến thức và dịch vụ y tế - sức khỏe.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1484/1484569.png"
            alt="Mission"
            className="w-12 h-12"
          />
          <div>
            <h3 className="text-blue-600 font-bold">Sứ mệnh</h3>
            <p className="text-gray-700">
              Giúp hàng triệu người Việt Nam đưa ra quyết định sáng suốt khi chăm sóc sức khỏe, để có thể sống khỏe mạnh và hạnh phúc hơn.
            </p>
          </div>
        </div>
      </div>

      {/* Trích dẫn */}
      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <p className="text-lg italic text-blue-600">
          “Chúng tôi mong muốn nền tảng của mình có thể bổ sung kiến thức y tế cho bạn đọc châu Á, hỗ trợ bạn đọc đưa ra quyết định sáng suốt khi chăm sóc sức khỏe.”
        </p>
        <div className="mt-4">
          <p className="font-bold">James Miles-Lambert</p>
          <p className="text-sm text-gray-600">CEO - Người sáng lập Gender Health Group</p>
        </div>
      </div>
    </div>

  );
};

export default AboutPage;
