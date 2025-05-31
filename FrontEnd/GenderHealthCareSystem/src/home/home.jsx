import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Typography, ConfigProvider } from "antd";
import {
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  UserOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import heroImg from "../assets/hero-section.png";

const { Title, Paragraph } = Typography;

const Home = () => {
 const navigate = useNavigate();
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0099CF',
        },
      }}
    >
      <>
        {/* Banner Section styled like MedEase - Updated with px-16 */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-100 overflow-hidden">
          <div className="container mx-auto pt-8 md:px-16 px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-0" >
              {/* Left content */}
              <div className="w-full lg:w-1/2 space-y-6 lg:pb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                  <span className="block">Trao quyền sức khỏe </span>
                  <span className="block text-[#0099CF]">với Gender Healthcare</span>
                </h1>
                
                <p className="text-lg text-gray-600 mt-4 max-w-lg">
                  Kết nối với các chuyên gia hàng đầu, khám phá dịch vụ chăm sóc cá nhân hóa và
                  trải nghiệm cuộc sống khỏe mạnh hơn chỉ với vài cú nhấp chuột.
                </p>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="primary"
                    size="large"
                    className="h-12 px-8 rounded-full shadow-md"
                  >
                    Xét nghiệm
                  </Button>
                  
                  <Button
                    size="large"
                    className="h-12 px-8 rounded-full border-[#0099CF] text-[#0099CF] hover:text-[#0088bb] hover:border-[#0088bb] shadow-sm"
                  >
                    Tư vấn
                  </Button>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                        <img 
                          src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`} 
                          alt="User" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-gray-700 font-medium">50K+ người dùng tin tưởng</span>
                </div>
              </div>

              {/* Right image */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative z-10">
                  <img 
                    src={heroImg} 
                    alt="Healthcare professionals" 
                    className="rounded-2xl w-full h-auto"
                  />
                </div>
                
                {/* Floating tags */}
                <div 
                className="absolute top-20 right-15 md:top-20 md:right-30 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <p className="md:text-sm font-medium text-gray-700 text-sm/2">Sức khỏe tốt hơn</p>
                </div>
                
                <div className="absolute bottom-10 right-20 md:bottom-20 md:right-32 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-40">
                  <p className="md:text-sm font-medium text-gray-700 text-sm/2">Chăm sóc chất lượng</p>
                </div>
                
                <div className="absolute bottom-20 left-5 md:bottom-36 md:left-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-40">
                  <p className="md:text-sm text-sm/2 font-medium text-gray-700">Ưu tiên sức khỏe của bạn</p>
                </div>
                
                {/* Background decorations */}
                <div className="absolute -bottom-4 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-100 rounded-full opacity-50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section - Updated with px-16 */}
        <div className="py-16 px-16 bg-gradient-to-b from-white to-sky-50 relative">
          {/* Background decorations */}
          <div className="absolute top-12 right-8 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-12 left-8 w-48 h-48 bg-green-100 rounded-full opacity-30"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16 relative">
              <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">Giải pháp sức khỏe toàn diện</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                Dịch vụ của chúng tôi
              </h2>
              <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
              <p className="text-gray-600 max-w-xl mx-auto mt-6">
                Các dịch vụ được thiết kế đặc biệt để đáp ứng nhu cầu sức khỏe của bạn
                với sự chăm sóc chuyên nghiệp và tiện lợi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service Card 1 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-[#0099CF]"></div>
                <div className="p-8">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#0099CF] text-3xl group-hover:scale-110 transition-transform duration-300">
                    <CalendarOutlined />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Theo dõi chu kỳ kinh nguyệt</h3>
                  <p className="text-gray-600 mb-8">
                    Theo dõi chu kì kinh nguyệt của bạn, nhận nhắc nhở thời gian rụng trứng, 
                    khả năng mang thai, và thời gian uống thuốc tránh thai.
                  </p>
                  <Button
                    type="primary"
                    className="rounded-full px-6 flex items-center gap-2 hover:translate-x-1 transition-transform"
                     onClick={() => navigate("/menstrual-cycle")}
                  >
                    <span>Theo dõi</span> <ArrowRightOutlined />
                  </Button>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-blue-100/50 rounded-full blur-lg"></div>
              </div>

              {/* Service Card 2 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-[#0099CF]"></div>
                <div className="p-8">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#0099CF] text-3xl group-hover:scale-110 transition-transform duration-300">
                    <MessageOutlined />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Tư vấn trực tuyến</h3>
                  <p className="text-gray-600 mb-8">
                    Đặt lịch trực tuyến với tư vấn viên để trao đổi những thắc mắc của 
                    bạn về sức khỏe một cách riêng tư và an toàn.
                  </p>
                  <Button
                    type="primary"
                    className="rounded-full px-6 flex items-center gap-2 hover:translate-x-1 transition-transform"
                  >
                    <span>Tư vấn</span> <ArrowRightOutlined />
                  </Button>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-blue-100/50 rounded-full blur-lg"></div>
              </div>

              {/* Service Card 3 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-[#0099CF]"></div>
                <div className="p-8">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#0099CF] text-3xl group-hover:scale-110 transition-transform duration-300">
                    <FileTextOutlined />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Xét nghiệm STIs</h3>
                  <p className="text-gray-600 mb-8">
                    Đặt lịch xét nghiệm STIs và nhận kết quả online một cách 
                    nhanh chóng, bảo mật và chính xác.
                  </p>
                  <Button
                    type="primary"
                    className="rounded-full px-6 flex items-center gap-2 hover:translate-x-1 transition-transform"
                  >
                    <span>Đặt lịch</span> <ArrowRightOutlined />
                  </Button>
                </div>
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-blue-100/50 rounded-full blur-lg"></div>
              </div>
            </div>

            {/* See All Services button */}
            <div className="mt-12 text-center">
              <Button
                size="large"
                className="h-12 px-8 rounded-full border-[#0099CF] text-[#0099CF] hover:text-[#0088bb] hover:border-[#0088bb] shadow-sm"
              >
                Xem tất cả dịch vụ <ArrowRightOutlined />
              </Button>
            </div>
          </div>
        </div>

        {/* Features or Testimonials Section - With px-16 */}
        <div className="py-16 px-16 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">Tại sao chọn chúng tôi</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                Cùng nhau vì sức khỏe tốt hơn
              </h2>
              <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#0099CF] text-3xl">
                  <UserOutlined />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Chuyên gia tin cậy</h3>
                <p className="text-gray-600">
                  Đội ngũ tư vấn viên và bác sĩ được đào tạo chuyên sâu về sức khỏe giới tính.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#0099CF] text-3xl">
                  <HeartOutlined />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Riêng tư & An toàn</h3>
                <p className="text-gray-600">
                  Cam kết bảo mật thông tin cá nhân và tạo môi trường an toàn cho người dùng.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#0099CF] text-3xl">
                  <CalendarOutlined />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Truy cập 24/7</h3>
                <p className="text-gray-600">
                  Theo dõi sức khỏe và truy cập thông tin bất kỳ lúc nào, nơi nào bạn muốn.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 text-[#0099CF] text-3xl">
                  <FileTextOutlined />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Kết quả chính xác</h3>
                <p className="text-gray-600">
                  Kết quả xét nghiệm chính xác với độ tin cậy cao từ các phòng lab được chứng nhận.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    </ConfigProvider>
  );
};

export default Home;
