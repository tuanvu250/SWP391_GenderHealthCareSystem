import React, { useState, useRef } from "react";
import { Rate, Avatar, Tag, Carousel, Button } from "antd";
import { LeftOutlined, ArrowRightOutlined, RightOutlined } from "@ant-design/icons";


const HomeRating = () => {
  const carouselRef = useRef();
  const [testimonials] = useState([
    {
      id: 1,
      rating: 5,
      type: "sti",
      tagColor: "cyan",
      tagText: "Xét nghiệm STIs",
      content:
        "Dịch vụ xét nghiệm STI rất chuyên nghiệp và kín đáo. Thủ tục đơn giản, nhân viên nhiệt tình và tôi nhận được kết quả nhanh chóng qua ứng dụng. Rất hài lòng với trải nghiệm này.",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      name: "Trần Văn Hùng",
      year: "2023",
    },
    {
      id: 2,
      rating: 5,
      type: "consult",
      tagColor: "green",
      tagText: "Tư vấn",
      content:
        "Tôi đã sử dụng dịch vụ tư vấn trực tuyến và vô cùng hài lòng. Bác sĩ rất lắng nghe và đưa ra những lời khuyên hữu ích, giúp tôi vượt qua nhiều vấn đề sức khỏe.",
      avatar: "https://randomuser.me/api/portraits/women/58.jpg",
      name: "Lê Thị Hương",
      year: "2023",
    },
    {
      id: 3,
      rating: 4,
      type: "sti",
      tagColor: "cyan",
      tagText: "Xét nghiệm STIs",
      content:
        "Tôi đánh giá cao sự riêng tư mà dịch vụ xét nghiệm STIs ở đây mang lại. Đặt lịch dễ dàng, quy trình lấy mẫu nhanh chóng và kết quả được bảo mật hoàn toàn.",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      name: "Hoàng Minh Tuấn",
      year: "2023",
    },
    {
      id: 4,
      rating: 5,
      type: "consult",
      tagColor: "green",
      tagText: "Tư vấn",
      content:
        "Dịch vụ tư vấn sức khỏe giới tính thực sự hiệu quả và tiện lợi. Tôi nhận được câu trả lời cho tất cả thắc mắc của mình mà không cần phải đến gặp trực tiếp. Các bác sĩ rất chuyên nghiệp!",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      name: "Phạm Thị Ngọc",
      year: "2022",
    },
    {
      id: 5,
      rating: 4.5,
      type: "sti",
      tagColor: "cyan",
      tagText: "Xét nghiệm STIs",
      content:
        "Xét nghiệm STIs ở đây làm tôi yên tâm vì sự chính xác và nhanh chóng. Đặc biệt ấn tượng với phần giải thích kết quả rất chi tiết và có hướng dẫn cụ thể cho từng trường hợp.",
      avatar: "https://randomuser.me/api/portraits/women/15.jpg",
      name: "Nguyễn Thanh Hà",
      year: "2023",
    },
    {
      id: 6,
      rating: 5,
      type: "consult",
      tagColor: "green",
      tagText: "Tư vấn",
      content:
        "Đội ngũ tư vấn rất nhiệt tình và chuyên nghiệp. Tôi được giải đáp mọi thắc mắc về sức khỏe sinh sản một cách tận tâm và dễ hiểu. Sẽ tiếp tục sử dụng dịch vụ này.",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      name: "Nguyễn Văn Thành",
      year: "2023",
    },
  ]);

  // Filter state for testimonials
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter testimonials based on active filter
  const filteredTestimonials =
    activeFilter === "all"
      ? testimonials
      : testimonials.filter((item) => item.type === activeFilter);

  return (
    <div className="py-16 px-16 bg-gradient-to-b from-sky-50 to-white relative">
      {/* Background decorations */}
      <div className="absolute top-24 left-12 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>
      <div className="absolute bottom-24 right-12 w-48 h-48 bg-green-100 rounded-full opacity-30"></div>

      <div className="mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">
            Phản hồi từ người dùng
          </span>
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
              className={`py-2 px-6 rounded-full font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-[#0099CF] text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`py-2 px-6 rounded-full font-medium transition-colors ${
                activeFilter === "sti"
                  ? "bg-[#0099CF] text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter("sti")}
            >
              Xét nghiệm STIs
            </button>
            <button
              className={`py-2 px-6 rounded-full font-medium transition-colors ${
                activeFilter === "consult"
                  ? "bg-[#0099CF] text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
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
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4 py-2">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[300px] flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="pt-1">
                      <Rate
                        disabled
                        defaultValue={testimonial.rating}
                        className="text-yellow-400 block"
                        style={{ fontSize: "16px", lineHeight: "2" }}
                      />
                    </div>
                    <Tag color={testimonial.tagColor} className="mt-1">
                      {testimonial.tagText}
                    </Tag>
                  </div>
                  <div className="overflow-y-auto flex-grow mb-6 custom-scrollbar">
                    <p className="text-gray-700 italic">
                      "{testimonial.content}"
                    </p>
                  </div>
                  <div className="flex items-center mt-auto pt-3 border-t border-gray-100">
                    <Avatar src={testimonial.avatar} size={48} />
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        Khách hàng từ {testimonial.year}
                      </p>
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
              <p className="text-gray-600">
                Dựa trên hơn 1,500+ đánh giá từ người dùng
              </p>
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
                <div className="text-3xl font-bold text-[#0099CF] mr-2">
                  4.8
                </div>
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
  );
};

export default HomeRating;
