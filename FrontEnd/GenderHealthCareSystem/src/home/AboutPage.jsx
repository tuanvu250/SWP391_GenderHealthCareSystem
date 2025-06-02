import React from 'react';

const AboutPage  = () => {
  return (
    <div className="px-8 py-12 max-w-7xl mx-auto text-gray-800">
      {/* Menu */}
      <nav className="flex gap-6 mb-10 text-sm text-gray-500">
        <span className="text-blue-600 font-semibold border-b-2 border-blue-600">Giới thiệu</span>
        <span>Dịch vụ</span>
        <span>Ban chuyên gia</span>
        <span>Biên tập nội dung</span>
        <span>Chính sách</span>
        <span>Ban điều hành</span>
        <span>Liên hệ</span>
      </nav>

      {/* Giới thiệu */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h1 className="text-3xl font-bold mb-4">Giới thiệu Gender HealthCare</h1>
          <p className="text-gray-700 mb-4">
            Gender Healthcare được ra mắt vào năm 202525 tại Việt Nam với mong muốn cung cấp trực tuyến những kiến thức sức khỏe hữu ích cho bạn đọc. Tại Hello Bacsi, bạn có thể tham khảo thông tin, đặt lịch hẹn với chuyên gia, sử dụng công cụ đo lường và đánh giá tình trạng sức khỏe, gia nhập cộng đồng bạn đọc và cùng nhau chia sẻ câu chuyện sức khỏe của mình.
          </p>
          <p className="text-gray-700">
            Chúng tôi tin rằng với những thông tin luôn cập nhật và các công cụ kiểm tra sức khỏe mới, bạn có thể đưa ra những quyết định sáng suốt hơn vì sức khỏe của bản thân và những người thân yêu. Khỏe hơn – hạnh phúc hơn!
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://via.placeholder.com/200x150" alt="img1" className="rounded-lg w-full" />
         
        </div>
      </div>

      {/* Tầm nhìn & Sứ mệnh */}
      <div className="grid md:grid-cols-2 gap-12 mt-16">
        <div className="flex gap-4 items-start">
          <img src="https://cdn-icons-png.flaticon.com/512/2910/2910791.png" alt="Vision" className="w-12 h-12" />
          <div>
            <h3 className="text-blue-600 font-bold">Tầm nhìn</h3>
            <p className="text-gray-700">Trở thành nền tảng hàng đầu Châu Á trong việc cung cấp kiến thức và dịch vụ y tế - sức khỏe.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <img src="https://cdn-icons-png.flaticon.com/512/1484/1484569.png" alt="Mission" className="w-12 h-12" />
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
          <p className="text-sm text-gray-600">CEO - Người sáng lập Hello Health Group</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
