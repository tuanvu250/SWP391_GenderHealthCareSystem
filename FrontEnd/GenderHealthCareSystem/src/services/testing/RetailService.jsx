import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Divider,
  Rate,
  Input,
  Select,
  Tabs,
  List,
  Avatar,
  Skeleton,
  Breadcrumb,
  message,
} from "antd";
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  SearchOutlined,
  FilterOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../components/utils/format"; // Import hàm định dạng giá
import { getServiceSingleAPI } from "../../components/api/ServiceTesting.api";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;


const RetailService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async() => {
      try {
        const response = await getServiceSingleAPI();
        setServices(response.data.data || []);
        setLoading(false);
      } catch (error) {
        message.error(error.response?.data?.message || "Lỗi khi tải dữ liệu dịch vụ");
      }
    };

    fetchServices();
  }, []);

  const handleBookService = (serviceId) => {
    navigate(`/sti-booking?serviceId=${serviceId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/">Trang chủ</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/sti-testing">Xét nghiệm STIs</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Xét nghiệm STIs lẻ </Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 text-center">
          <Title level={1} className="text-3xl md:text-4xl font-bold">
            Dịch Vụ Xét Nghiệm STIs
          </Title>
          <Text className="text-gray-500 text-base md:text-lg mt-2 block">
            Dịch vụ chẩn đoán và xét nghiệm các bệnh lây truyền qua đường tình dục tại Gender Health Care
          </Text>
        </div>
        {/* Services List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="shadow-sm">
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {services.map((service) => (
              <div
                key={service.serviceId}
                className="transition-all duration-300"
              >
                <Card 
                  hoverable 
                  className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <Title level={4} className="mb-1">
                        {service.serviceName}
                      </Title>
                    </div>

                    <Paragraph className="text-gray-500 mb-4 line-clamp-3">
                      {service.description}
                    </Paragraph>

                    <div className="flex gap-2 mb-3">
                      <Tag color="cyan">Thời gian: {service.duration} phút</Tag>
                      <Tag color="blue">Xét nghiệm đơn</Tag>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex flex-col">
                        <Text className="font-semibold text-xl text-primary">
                          {formatPrice(service.price)}
                        </Text>
                      </div>

                      <Button 
                        type="primary" 
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleBookService(service.serviceId)}
                      >
                        Đặt lịch
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Title level={4} className="text-gray-500">
              Không tìm thấy dịch vụ nào phù hợp
            </Title>
            <Text className="text-gray-400">
              Vui lòng thử tìm kiếm với từ khóa khác
            </Text>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 mb-6">
          <Title level={2} className="text-center mb-8">
            Tại sao nên xét nghiệm STIs định kỳ?
          </Title>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center shadow-sm">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <CheckCircleFilled />
              </div>
              <Title level={4}>Phát hiện sớm</Title>
              <Paragraph className="text-gray-500">
                Nhiều bệnh lây truyền qua đường tình dục không có triệu chứng rõ ràng trong giai đoạn đầu. Xét nghiệm giúp phát hiện và điều trị sớm.
              </Paragraph>
            </Card>
            
            <Card className="text-center shadow-sm">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <ClockCircleOutlined />
              </div>
              <Title level={4}>Ngăn ngừa biến chứng</Title>
              <Paragraph className="text-gray-500">
                Nếu không được phát hiện và điều trị kịp thời, STIs có thể dẫn đến nhiều biến chứng nghiêm trọng như vô sinh, ung thư và các vấn đề sức khỏe mãn tính.
              </Paragraph>
            </Card>
            
            <Card className="text-center shadow-sm">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                <UserOutlined />
              </div>
              <Title level={4}>Bảo vệ đối tác</Title>
              <Paragraph className="text-gray-500">
                Biết tình trạng sức khỏe của bản thân giúp bạn có trách nhiệm hơn với người thân và đối tác, ngăn ngừa sự lây lan của bệnh.
              </Paragraph>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="my-12">
          <Title level={2} className="text-center mb-8">
            Câu hỏi thường gặp
          </Title>
          
          <Card className="shadow-sm">
            <List
              itemLayout="vertical"
              dataSource={[
                {
                  question: "Khi nào nên đi xét nghiệm STIs?",
                  answer: "Bạn nên xét nghiệm STIs khi: có quan hệ tình dục không an toàn, thay đổi đối tác, có triệu chứng bất thường, bắt đầu một mối quan hệ mới hoặc định kỳ mỗi 6-12 tháng nếu có nhiều đối tác tình dục."
                },
                {
                  question: "Quy trình xét nghiệm STIs diễn ra như thế nào?",
                  answer: "Quy trình thường bao gồm: đăng ký và tư vấn, lấy mẫu xét nghiệm (máu, nước tiểu hoặc dịch tiết), xét nghiệm mẫu và trả kết quả kèm tư vấn. Toàn bộ quá trình đảm bảo riêng tư và bảo mật."
                },
                {
                  question: "Làm thế nào để chuẩn bị cho xét nghiệm STIs?",
                  answer: "Với đa số xét nghiệm, bạn không cần chuẩn bị gì đặc biệt. Tuy nhiên, với một số loại như xét nghiệm nước tiểu, bạn không nên đi tiểu trong vòng 1-2 giờ trước khi lấy mẫu. Đối với xét nghiệm HPV và PAP, phụ nữ không nên quan hệ tình dục, sử dụng thuốc đặt âm đạo hoặc đang trong kỳ kinh nguyệt."
                },
                {
                  question: "Kết quả xét nghiệm STIs có bảo mật không?",
                  answer: "Có, kết quả xét nghiệm STIs được bảo mật tuyệt đối. Chúng tôi cam kết chỉ cung cấp kết quả cho chính người đã thực hiện xét nghiệm hoặc người được ủy quyền hợp pháp."
                }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<strong className="text-lg">{item.question}</strong>} // Dùng strong thay vì Title
                    description={<Paragraph>{item.answer}</Paragraph>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetailService;