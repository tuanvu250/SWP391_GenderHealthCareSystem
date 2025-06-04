import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Typography, ConfigProvider, Rate, Avatar, Tag, Carousel } from "antd";
import {
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  UserOutlined,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import heroImg from "../assets/hero-section.png";

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const carouselRef = useRef();
  
  // Sample testimonials data
  const [testimonials] = useState([
    {
      id: 1,
      rating: 5,
      type: "sti",
      tagColor: "cyan",
      tagText: "Xét nghiệm STIs",
      content: "Dịch vụ xét nghiệm STI rất chuyên nghiệp và kín đáo. Thủ tục đơn giản, nhân viên nhiệt tình và tôi nhận được kết quả nhanh chóng qua ứng dụng. Rất hài lòng với trải nghiệm này.",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      name: "Trần Văn Hùng",
      year: "2023"
    },
    {
      id: 2,
      rating: 5,
      type: "consult",
      tagColor: "green",
      tagText: "Tư vấn",
      content: "Tôi đã sử dụng dịch vụ tư vấn trực tuyến và vô cùng hài lòng. Bác sĩ rất lắng nghe và đưa ra những lời khuyên hữu ích, giúp tôi vượt qua nhiều vấn đề sức khỏe.",
      avatar: "https://randomuser.me/api/portraits/women/58.jpg",
      name: "Lê Thị Hương",
      year: "2023"
    },
    {
      id: 3,
      rating: 4,
      type: "sti",
      tagColor: "cyan",
      tagText: "Xét nghiệm STIs",
      content: "Tôi đánh giá cao sự riêng tư mà dịch vụ xét nghiệm STIs ở đây mang lại. Đặt lịch dễ dàng, quy trình lấy mẫu nhanh chóng và kết quả được bảo mật hoàn toàn.",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      name: "Hoàng Minh Tuấn",
      year: "2023"
    },
    {
      id: 4,
      rating: 5,
      type: "consult",
      tagColor: "green",
      tagText: "Tư vấn",
      content: "Dịch vụ tư vấn sức khỏe giới tính thực sự hiệu quả và tiện lợi. Tôi nhận được câu trả lời cho tất cả thắc mắc của mình mà không cần phải đến gặp trực tiếp. Các bác sĩ rất chuyên nghiệp!",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      name: "Phạm Thị Ngọc",
      year: "2022"
    },
    {
      id: 5,
      rating: 4.5,
      type: "sti",
      tagColor: "cyan",
      tagText: "Xét nghiệm STIs",
      content: "Xét nghiệm STIs ở đây làm tôi yên tâm vì sự chính xác và nhanh chóng. Đặc biệt ấn tượng với phần giải thích kết quả rất chi tiết và có hướng dẫn cụ thể cho từng trường hợp.",
      avatar: "https://randomuser.me/api/portraits/women/15.jpg",
      name: "Nguyễn Thanh Hà",
      year: "2023"
    },
    {
      id: 6,
      rating: 5,
      type: "consult",
      tagColor: "green",
      tagText: "Tư vấn",
      content: "Đội ngũ tư vấn rất nhiệt tình và chuyên nghiệp. Tôi được giải đáp mọi thắc mắc về sức khỏe sinh sản một cách tận tâm và dễ hiểu. Sẽ tiếp tục sử dụng dịch vụ này.",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      name: "Nguyễn Văn Thành",
      year: "2023"
    }
  ]);

  // Filter state for testimonials
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter testimonials based on active filter
  const filteredTestimonials = activeFilter === "all" 
    ? testimonials 
    : testimonials.filter(item => item.type === activeFilter);

  // Thêm state cho blog posts
  const [blogPosts] = useState([
    {
      id: 1,
      title: "Chu kỳ kinh nguyệt không đều: Nguyên nhân và giải pháp",
      excerpt: "Tìm hiểu về các yếu tố ảnh hưởng đến chu kỳ kinh nguyệt và những cách giúp cải thiện tình trạng không đều.",
      image: "https://img.freepik.com/free-photo/woman-suffering-from-menstrual-pain_23-2148741815.jpg",
      tags: [
        { color: "blue", text: "Sức khỏe phụ nữ" },
        { color: "cyan", text: "Kinh nguyệt" }
      ],
      author: {
        name: "BS. Trần Minh Hà",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg"
      },
      date: "15/05/2023"
    },
    {
      id: 2,
      title: "5 dấu hiệu cần đi khám sức khỏe sinh sản ngay lập tức",
      excerpt: "Những dấu hiệu cảnh báo về vấn đề sức khỏe sinh sản không nên bỏ qua và lợi ích của việc thăm khám sớm.",
      image: "https://img.freepik.com/free-photo/doctor-patient-medical-consultation-hospital-office_1303-21297.jpg",
      tags: [
        { color: "purple", text: "Sức khỏe sinh sản" },
        { color: "green", text: "Tư vấn" }
      ],
      author: {
        name: "BS. Nguyễn Văn Lâm",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      date: "02/06/2023"
    },
    {
      id: 3,
      title: "Xét nghiệm STI: Khi nào nên thực hiện và những điều cần biết",
      excerpt: "Hướng dẫn chi tiết về các loại xét nghiệm STI, thời điểm nên thực hiện và cách đọc kết quả xét nghiệm.",
      image: "https://img.freepik.com/free-photo/doctor-explaining-diagnosis-patient_23-2148030315.jpg",
      tags: [
        { color: "red", text: "STIs" },
        { color: "orange", text: "Xét nghiệm" }
      ],
      author: {
        name: "BS. Phạm Thu Hương",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg"
      },
      date: "20/06/2023"
    },
    {
      id: 4,
      title: "Sức khỏe giới tính: Điều cần biết về các bệnh lây truyền qua đường tình dục",
      excerpt: "Tổng quan về các bệnh lây truyền qua đường tình dục phổ biến, cách phòng tránh và điều trị hiệu quả.",
      image: "https://img.freepik.com/free-photo/close-up-doctor-with-stethoscope_23-2149191355.jpg",
      tags: [
        { color: "magenta", text: "Giáo dục giới tính" },
        { color: "blue", text: "Phòng ngừa" }
      ],
      author: {
        name: "BS. Lê Minh Quân",
        avatar: "https://randomuser.me/api/portraits/men/55.jpg"
      },
      date: "05/07/2023"
    }
  ]);

  return (
      <>
        {/* Banner Section styled like MedEase - Loại bỏ container */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-100 overflow-hidden md:px-16 px-4">
          <div className="mx-auto pt-8">
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

        {/* Services Section - Loại bỏ container */}
        <div className="py-16 px-16 bg-gradient-to-b from-white to-sky-50 relative">
          {/* Background decorations */}
          <div className="absolute top-12 right-8 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-12 left-8 w-48 h-48 bg-green-100 rounded-full opacity-30"></div>
          
          <div className="mx-auto relative z-10">
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

        {/* Features or Testimonials Section - Loại bỏ container */}
        <div className="py-16 px-16 bg-white">
          <div className="mx-auto">
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

        {/* Testimonials Section - Customer Ratings & Feedback - Loại bỏ container */}
        <div className="py-16 px-16 bg-gradient-to-b from-sky-50 to-white relative">
          {/* Background decorations */}
          <div className="absolute top-24 left-12 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
          <div className="absolute bottom-24 right-12 w-48 h-48 bg-green-100 rounded-full opacity-30"></div>
          
          <div className="mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">Phản hồi từ người dùng</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                Người dùng nói gì về chúng tôi
              </h2>
              <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
              <p className="text-gray-600 max-w-xl mx-auto mt-6">
                Phản hồi từ người dùng về các dịch vụ của chúng tôi
              </p>
            </div>

            {/* Feedback Categories Navigation */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-100 p-1 rounded-full">
                <button 
                  className={`py-2 px-6 rounded-full font-medium transition-colors ${activeFilter === "all" ? "bg-[#0099CF] text-white" : "text-gray-700 hover:bg-gray-200"}`}
                  onClick={() => setActiveFilter("all")}
                >
                  Tất cả
                </button>
                <button 
                  className={`py-2 px-6 rounded-full font-medium transition-colors ${activeFilter === "sti" ? "bg-[#0099CF] text-white" : "text-gray-700 hover:bg-gray-200"}`}
                  onClick={() => setActiveFilter("sti")}
                >
                  Xét nghiệm STIs
                </button>
                <button 
                  className={`py-2 px-6 rounded-full font-medium transition-colors ${activeFilter === "consult" ? "bg-[#0099CF] text-white" : "text-gray-700 hover:bg-gray-200"}`}
                  onClick={() => setActiveFilter("consult")}
                >
                  Tư vấn
                </button>
              </div>
            </div>

            {/* Testimonials Carousel */}
            <div className="relative max-h-full">
              <Carousel 
                ref={carouselRef}
                autoplay={false}
                dots={true}
                slidesToShow={3}
                slidesToScroll={1}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                    },
                  },
                  {
                    breakpoint: 640,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    },
                  },
                ]}
                dotPosition="bottom"
                className="testimonial-carousel"
              >
                {filteredTestimonials.map(testimonial => (
                  <div key={testimonial.id} className="px-4 py-2">
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[300px] flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="pt-1">
                          <Rate disabled defaultValue={testimonial.rating} className="text-yellow-400 block" style={{ fontSize: '16px', lineHeight: '2' }} />
                        </div>
                        <Tag color={testimonial.tagColor} className="mt-1">{testimonial.tagText}</Tag>
                      </div>
                      <div className="overflow-y-auto flex-grow mb-6 custom-scrollbar">
                        <p className="text-gray-700 italic">
                          "{testimonial.content}"
                        </p>
                      </div>
                      <div className="flex items-center mt-auto pt-3 border-t border-gray-100">
                        <Avatar src={testimonial.avatar} size={48} />
                        <div className="ml-4">
                          <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                          <p className="text-gray-500 text-sm">Khách hàng từ {testimonial.year}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>

              {/* Custom Navigation Arrows */}
              <div 
                onClick={() => carouselRef.current.prev()} 
                className="absolute top-1/2 -left-5 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100 z-10"
              >
                <LeftOutlined className="text-gray-600" />
              </div>
              <div 
                onClick={() => carouselRef.current.next()} 
                className="absolute top-1/2 -right-5 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100 z-10"
              >
                <RightOutlined className="text-gray-600" />
              </div>
            </div>
            
            {/* Overall Rating Card */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Đánh giá trung bình</h3>
                  <p className="text-gray-600">Dựa trên hơn 1,500+ đánh giá từ người dùng</p>
                </div>
                
                <div className="flex items-center gap-8 mb-6 md:mb-0">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0099CF]">4.9</div>
                    <p className="text-gray-600 text-sm">Dịch vụ tư vấn</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0099CF]">4.7</div>
                    <p className="text-gray-600 text-sm">Xét nghiệm STIs</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0099CF] mr-2">4.8</div>
                    <p className="text-gray-600 text-sm">Tổng thể</p>
                  </div>
                </div>
                
                <Button
                  type="primary"
                  className="rounded-full px-6 h-12 flex items-center gap-2"
                >
                  <span>Xem tất cả đánh giá</span> <ArrowRightOutlined />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Blog Posts Section - Loại bỏ container */}
        <div className="py-16 px-16 bg-white">
          <div className="mx-auto">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">Kiến thức sức khỏe</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
                Bài viết mới nhất
              </h2>
              <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
              <p className="text-gray-600 max-w-xl mx-auto mt-6">
                Khám phá kiến thức mới nhất về sức khỏe giới tính và chủ đề liên quan
              </p>
            </div>

            {/* Blog Posts Grid - 4 posts in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {blogPosts.map(post => (
                <Card 
                  key={post.id}
                  hoverable 
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                  cover={
                    <div className="h-40 md:h-36 lg:h-32 xl:h-40 overflow-hidden">
                      <img
                        alt={post.title}
                        src={post.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  }
                >
                  <div className="flex flex-col flex-grow p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags.map((tag, index) => (
                        <Tag key={index} color={tag.color} className="text-xs">{tag.text}</Tag>
                      ))}
                    </div>
                    <h3 className="text-base font-bold mb-1 text-gray-800 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <Avatar src={post.author.avatar} size="small" />
                        <span className="ml-2 text-gray-500 text-xs">{post.author.name}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{post.date}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* See All Blog Posts Button */}
            <div className="mt-12 text-center">
              <Button
                size="large"
                className="h-12 px-8 rounded-full border-[#0099CF] text-[#0099CF] hover:text-[#0088bb] hover:border-[#0088bb] shadow-sm"
                onClick={() => navigate("/blog")}
              >
                Xem tất cả bài viết <ArrowRightOutlined />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer will be rendered by the Layout component */}
      </>
  );
};

export default Home;
