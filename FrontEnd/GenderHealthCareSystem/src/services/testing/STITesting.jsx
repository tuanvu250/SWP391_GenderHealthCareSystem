import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Steps,
  Timeline,
  Collapse,
  Rate,
  Avatar,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import {
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EyeInvisibleOutlined,
  SafetyOutlined,
  HeartOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { FaVial, FaMicroscope, FaUserMd, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../../components/provider/AuthProvider";
import LoginRequiredModal from "../../components/common/LoginRequiredModal";
import { getSTISPackagesAPI } from "../../components/utils/api";

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;
const { Option } = Select;

const STITesting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [testingPackages, setTestingPackages] = useState([]);

  const handleUserService = () => {
    if (!user) {
      setIsLoginModal(true);
    } else {
      navigate("/sti-booking");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getSTISPackagesAPI();
        if (response && response.data) {
          // Assuming response.data is an array of packages
          const packages = response.data.data.map((pkg) => ({
            id: pkg.serviceId,
            name: pkg.serviceName,
            price: pkg.price,
            tests: pkg.tests.split(", "),
            duration: pkg.duration,
            description: pkg.description,
          }));
          setTestingPackages(packages);
        } else {
          console.error("No data found for testing packages");
        }
      } catch (error) {
        console.error("Error fetching testing packages:", error);
        message.error("Không thể tải gói xét nghiệm. Vui lòng thử lại sau.");
      }
    };
    fetchPackages();
  }, []);

  // Process steps
  const processSteps = [
    {
      title: "Đặt lịch",
      description: "Chọn gói xét nghiệm và đặt lịch hẹn",
    },
    {
      title: "Lấy mẫu",
      description: "Đến phòng lab hoặc lấy mẫu tại nhà",
    },
    {
      title: "Xét nghiệm",
      description: "Mẫu được xử lý tại phòng lab chứng nhận",
    },
    {
      title: "Kết quả",
      description: "Nhận kết quả qua app hoặc email bảo mật",
    },
  ];

  // FAQ data
  const faqData = [
    {
      key: "1",
      label: "Xét nghiệm STI có đau không?",
      children: (
        <p>
          Hầu hết các xét nghiệm STI chỉ cần lấy mẫu máu hoặc nước tiểu, hoàn
          toàn không đau. Một số trường hợp có thể cần lấy mẫu từ vùng sinh dục
          nhưng cũng rất nhanh chóng và ít gây khó chịu.
        </p>
      ),
    },
    {
      key: "2",
      label: "Thông tin của tôi có được bảo mật không?",
      children: (
        <p>
          Chúng tôi cam kết bảo mật hoàn toàn thông tin cá nhân và kết quả xét
          nghiệm của bạn. Tất cả dữ liệu được mã hóa và chỉ bạn mới có thể truy
          cập kết quả qua app hoặc email bảo mật.
        </p>
      ),
    },
    {
      key: "3",
      label: "Bao lâu tôi có thể nhận được kết quả?",
      children: (
        <p>
          Tùy thuộc vào gói xét nghiệm, bạn sẽ nhận được kết quả trong vòng 2-5
          ngày làm việc. Các xét nghiệm khẩn cấp có thể có kết quả trong 24 giờ
          với phụ phí.
        </p>
      ),
    },
    {
      key: "4",
      label: "Tôi có cần nhịn ăn trước khi xét nghiệm không?",
      children: (
        <p>
          Hầu hết các xét nghiệm STI không yêu cầu nhịn ăn. Tuy nhiên, một số
          xét nghiệm máu có thể yêu cầu nhịn ăn 8-12 tiếng. Chúng tôi sẽ thông
          báo cụ thể khi bạn đặt lịch.
        </p>
      ),
    },
    {
      key: "5",
      label: "Chi phí xét nghiệm có được bảo hiểm y tế chi trả không?",
      children: (
        <p>
          Một số gói xét nghiệm có thể được bảo hiểm y tế hỗ trợ một phần. Chúng
          tôi sẽ hỗ trợ bạn kiểm tra và làm thủ tục bảo hiểm nếu có thể.
        </p>
      ),
    },
  ];

  // Testimonials specific to STI testing
  const stiTestimonials = [
    {
      id: 1,
      rating: 5,
      content:
        "Quy trình xét nghiệm rất chuyên nghiệp và kín đáo. Tôi cảm thấy yên tâm và được tư vấn kỹ lưỡng về kết quả. Nhân viên rất thân thiện và hiểu biết.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      name: "Nguyễn Thị Lan",
      age: "28 tuổi",
    },
    {
      id: 2,
      rating: 5,
      content:
        "Dịch vụ lấy mẫu tại nhà rất tiện lợi, đặc biệt là cho người bận rộn như tôi. Kết quả chính xác và được giải thích rõ ràng.",
      avatar: "https://randomuser.me/api/portraits/men/25.jpg",
      name: "Trần Văn Minh",
      age: "31 tuổi",
    },
    {
      id: 3,
      rating: 4.5,
      content:
        "Gói xét nghiệm toàn diện giúp tôi yên tâm về sức khỏe của mình. Giá cả hợp lý và chất lượng dịch vụ tốt.",
      avatar: "https://randomuser.me/api/portraits/women/41.jpg",
      name: "Lê Thị Hương",
      age: "26 tuổi",
    },
  ];

  const handleBooking = (packageData) => {
    setIsBookingModalOpen(true);
    form.setFieldsValue({
      package: packageData.name,
      price: packageData.price,
    });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-100 overflow-hidden md:px-16 px-4">
        <div className="mx-auto pt-16 pb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center bg-blue-100 px-4 py-2 rounded-full">
                <SafetyOutlined className="text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Xét nghiệm STI an toàn & bảo mật
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                <span className="block">Xét nghiệm STI</span>
                <span className="block text-[#0099CF]">
                  Chính xác & Riêng tư
                </span>
              </h1>

              <p className="text-lg text-gray-600 max-w-lg">
                Dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục (STI)
                với công nghệ hiện đại, kết quả chính xác và hoàn toàn bảo mật.
              </p>

              <div className="flex gap-4 pt-4">
                <Button
                  type="primary"
                  size="large"
                  className="h-12 px-8 rounded-full shadow-md"
                  onClick={handleUserService}
                >
                  Đặt lịch ngay
                </Button>
                <LoginRequiredModal
                  open={isLoginModal}
                  onClose={() => setIsLoginModal(false)}
                />

                <Button
                  size="large"
                  className="h-12 px-8 rounded-full border-[#0099CF] text-[#0099CF] hover:text-[#0088bb] hover:border-[#0088bb] shadow-sm"
                  onClick={() => navigate("/consultation")}
                >
                  Tư vấn trước
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-green-500" />
                  <span className="text-gray-700">Kết quả trong 2-5 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeInvisibleOutlined className="text-blue-500" />
                  <span className="text-gray-700">100% bảo mật</span>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FaVial className="text-3xl text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Quy trình 4 bước đơn giản
                  </h3>
                  <p className="text-gray-600">Từ đặt lịch đến nhận kết quả</p>
                </div>

                <Steps
                  direction="vertical"
                  size="small"
                  current={activeStep}
                  items={processSteps}
                />
              </div>

              {/* Background decorations */}
              <div className="absolute -bottom-4 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-100 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Packages Section */}
      <div className="py-16 px-4 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">
              Gói xét nghiệm
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Chọn gói phù hợp với bạn
            </h2>
            <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
            <p className="text-gray-600 max-w-xl mx-auto mt-6">
              Các gói xét nghiệm được thiết kế để đáp ứng nhu cầu khác nhau với
              mức giá hợp lý
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testingPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col
                  border-2 border-[#0099CF] `}
              >
                {/* Package header */}
                <div className={`w-full px-6 pt-6 bg-gray-50`}>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 text-sm h-12 flex items-center justify-center">
                      {pkg.description}
                    </p>
                  </div>
                </div>

                {/* Package pricing */}
                <div className="p-4 flex-grow flex flex-col">
                  <div className="text-center mb-6">
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-[#0099CF]">
                        {formatPrice(pkg.price)}
                      </span>
                    </div>
                    <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 py-2 px-4 rounded-full">
                      <ClockCircleOutlined />
                      <span>Kết quả trong {pkg.duration}</span>
                    </div>
                  </div>

                  {/* Tests included - Redesigned to maintain height */}
                  <div className="mb-6 flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-1 h-5 bg-[#0099CF] rounded-full`}
                      ></div>
                      <h4 className="font-semibold text-gray-800">
                        Bao gồm các xét nghiệm:
                      </h4>
                    </div>

                    {/* Two-column grid for tests to save space */}
                    <div
                      className={`bg-gray-50 p-3 rounded-xl ${
                        pkg.tests.length > 5 ? "h-48" : "h-48"
                      } overflow-auto`}
                    >
                      <div
                        className={
                          pkg.tests.length > 5
                            ? "grid grid-cols-2 gap-x-2 gap-y-3"
                            : "space-y-3"
                        }
                      >
                        {pkg.tests.map((test, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircleOutlined
                              className={`text-base mt-0.5 mr-2 flex-shrink-0 text-[#0099CF]`}
                            />
                            <span className="text-sm text-gray-700">
                              {test}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <Button
                    type={"default"}
                    block
                    size="large"
                    className={`rounded-full h-12 text-base font-medium mt-auto
                        border-[#0099CF] text-[#0099CF] hover:text-[#008BBB] hover:border-[#008BBB]`}
                    onClick={handleUserService}
                  >
                    Đặt gói này ngay
                  </Button>
                  <LoginRequiredModal
                    open={isLoginModal}
                    onClose={() => setIsLoginModal(false)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional information */}
          <div className="mt-12 text-center max-w-3xl mx-auto bg-blue-50 p-6 rounded-xl">
            <div className="flex items-center justify-center mb-4">
              <InfoCircleOutlined className="text-[#0099CF] text-xl mr-2" />
              <h3 className="font-semibold text-gray-800">Thông tin bổ sung</h3>
            </div>
            <p className="text-gray-600">
              Tất cả các gói xét nghiệm đều bao gồm tư vấn miễn phí với bác sĩ
              sau khi có kết quả. Các mẫu xét nghiệm được xử lý bởi phòng lab
              đạt chuẩn ISO 15189.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 px-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">
              Ưu điểm vượt trội
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Tại sao chọn xét nghiệm STI tại đây?
            </h2>
            <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">100% Bảo mật</h3>
              <p className="text-gray-600 text-sm">
                Thông tin và kết quả được mã hóa, chỉ bạn mới truy cập được
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <FaMicroscope className="text-2xl text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Công nghệ hiện đại</h3>
              <p className="text-gray-600 text-sm">
                Sử dụng công nghệ xét nghiệm tiên tiến, độ chính xác cao
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <FaUserMd className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Đội ngũ chuyên nghiệp</h3>
              <p className="text-gray-600 text-sm">
                Bác sĩ và kỹ thuật viên giàu kinh nghiệm, tư vấn tận tình
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <ClockCircleOutlined className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Kết quả nhanh chóng</h3>
              <p className="text-gray-600 text-sm">
                Nhận kết quả trong 2-5 ngày, có dịch vụ khẩn cấp 24h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="py-16 px-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">
              Phản hồi khách hàng
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Khách hàng nói gì về dịch vụ
            </h2>
            <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stiTestimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="h-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-center mb-4">
                  <Rate
                    disabled
                    defaultValue={testimonial.rating}
                    className="text-yellow-400"
                  />
                </div>
                <p className="text-gray-700 italic mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <Avatar src={testimonial.avatar} size={48} />
                  <div className="ml-3">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.age}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-16 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">
              Câu hỏi thường gặp
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Giải đáp thắc mắc của bạn
            </h2>
            <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
          </div>

          <Collapse items={faqData} defaultActiveKey={["1"]} />
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-16 bg-gradient-to-r from-[#0099CF] to-blue-600">
        <div className="mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bảo vệ sức khỏe của bạn?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Đặt lịch xét nghiệm STI ngay hôm nay để có sự yên tâm về sức khỏe
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="large"
              className="h-12 px-8 rounded-full bg-white text-[#0099CF] border-0 hover:bg-gray-100"
              onClick={() => setIsBookingModalOpen(true)}
            >
              Đặt lịch ngay
            </Button>
            <Button
              size="large"
              className="h-12 px-8 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0099CF]"
              onClick={() => navigate("/consultation")}
            >
              Tư vấn miễn phí
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default STITesting;
