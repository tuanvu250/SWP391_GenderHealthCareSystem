import React, { useState, useRef, useEffect } from "react";
import { Rate, Avatar, Tag, Carousel, Button, message } from "antd";
import { LeftOutlined, ArrowRightOutlined, RightOutlined } from "@ant-design/icons";
import { getAverageRatingAPI, getPublicFeedbackTestingAPI } from "../components/api/FeedbackTesting.api";
import { getAllFeedbackConsultantAPI, getAverageRatingConsultantAPI } from "../components/api/FeedbackConsultant.api";
import { getUserByIdAPI } from "../components/api/Auth.api";
import dayjs from "dayjs";


const HomeRating = () => {
  const carouselRef = useRef();
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRatings, setAverageRatings] = useState({
    sti: 0,
    consult: 0,
    overall: 0,
  });

  const getUserById = async (userId) => {
    try {
      const res = await getUserByIdAPI(userId);
      return res.data.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }

  useEffect(() => {
    const fethcFeedback = async () => {
      try {
        const testingFeedback = await getPublicFeedbackTestingAPI({ page: 0, size: 5 });
        const consultingFeedback = await getAllFeedbackConsultantAPI({
          page: 0,
          size: 5,
          rating: 5,
        });
        const averageSti = await getAverageRatingAPI();
        const averageConsult = await getAverageRatingConsultantAPI();
        setAverageRatings({
          sti: averageSti.data,
          consult: averageConsult.data.data.totalAverageRating,
          overall: (averageSti.data + averageConsult.data.data.totalAverageRating) / 2,
        });

        const combinedFeedback = [
          ...testingFeedback.data.data.content.map((item) => ({
            ...item,
            type: "sti",
            tagColor: "cyan",
            tagText: "Xét nghiệm STIs",
            avatar: item.userImageUrl,
            name: item.userFullName,
            year: item.userId ? dayjs(getUserById(item.userId).createdAt).format("YYYY") : "N/A",
          })),
          ...consultingFeedback.data.data.content.map((item) => ({
            ...item,
            type: "consult",
            tagColor: "green",
            tagText: "Tư vấn",
            name: item.customerName,
            avatar: item.customerImageUrl,
            year: item.customerId ? dayjs(getUserById(item.customerId).createdAt).format("YYYY") : "N/A",
          })),
        ];
        setFeedbacks(combinedFeedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        message.error(error.response.message || "Lỗi khi tải phản hồi");
      }
    }
    fethcFeedback();
  }, []);

  // Filter state for testimonials
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter testimonials based on active filter
  const filteredTestimonials =
    activeFilter === "all"
      ? feedbacks
      : feedbacks.filter((item) => item.type === activeFilter);

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
            {filteredTestimonials.map((feedback) => (
              <div key={feedback.feedbackId} className="px-4 py-2">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[300px] flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="pt-1">
                      <Rate
                        disabled
                        defaultValue={feedback.rating}
                        className="text-yellow-400 block"
                        style={{ fontSize: "16px", lineHeight: "2" }}
                      />
                    </div>
                    <Tag color={feedback.tagColor} className="mt-1">
                      {feedback.tagText}
                    </Tag>
                  </div>
                  <div className="overflow-y-auto flex-grow mb-6 custom-scrollbar">
                    <p className="text-gray-700 italic">
                      "{feedback.comment}"
                    </p>
                  </div>
                  <div className="flex items-center mt-auto pt-3 border-t border-gray-100">
                    <Avatar src={feedback.avatar} size={48} />
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-800">
                        {feedback.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        Khách hàng từ {feedback.year}
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
          <div className="flex flex-col md:flex-row items-center justify-between md:mx-16">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Đánh giá trung bình</h3>
              <p className="text-gray-600">
                Dựa trên phản hồi từ người dùng về các dịch vụ của chúng tôi
              </p>
            </div>

            <div className="flex items-center gap-8 mb-6 md:mb-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0099CF]">{averageRatings.consult.toFixed(1)}</div>
                <p className="text-gray-600 text-sm">Dịch vụ tư vấn</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-[#0099CF]">{averageRatings.sti.toFixed(1)}</div>
                <p className="text-gray-600 text-sm">Xét nghiệm STIs</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-[#0099CF] mr-2">
                  {averageRatings.overall.toFixed(1)}
                </div>
                <p className="text-gray-600 text-sm">Tổng thể</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeRating;
