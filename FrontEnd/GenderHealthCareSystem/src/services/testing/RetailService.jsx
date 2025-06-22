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

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Mock data cho các dịch vụ xét nghiệm STIs
const mockServices = [
  {
    id: 1,
    name: "Xét nghiệm HIV",
    description:
      "Xét nghiệm HIV là xét nghiệm phát hiện kháng thể hoặc kháng nguyên của virus HIV trong máu. Đây là phương pháp chính xác để biết một người có nhiễm HIV hay không.",
    shortDescription: "Phát hiện nhiễm HIV qua xét nghiệm máu chuyên sâu",
    price: 200000,
    category: "single",
    testType: "hiv",
    discountPercent: 0,
    duration: 30,
    rating: 4.8,
    reviewCount: 124,
    popularityScore: 95,
  },
  {
    id: 4,
    name: "Xét nghiệm Giang mai",
    description:
      "Xét nghiệm giang mai phát hiện sự hiện diện của kháng thể được tạo ra để chống lại vi khuẩn gây bệnh giang mai (Treponema pallidum). Xét nghiệm này giúp phát hiện sớm và điều trị kịp thời.",
    shortDescription: "Phát hiện bệnh giang mai qua xét nghiệm huyết thanh",
    price: 180000,
    category: "single",
    testType: "syphilis",
    discountPercent: 0,
    duration: 30,
    rating: 4.7,
    reviewCount: 98,
    popularityScore: 85,
  },
  {
    id: 5,
    name: "Xét nghiệm Viêm gan B",
    description:
      "Xét nghiệm viêm gan B giúp phát hiện sự hiện diện của virus viêm gan B (HBV) trong máu, xác định tình trạng nhiễm trùng cấp tính hoặc mãn tính. Đây là xét nghiệm quan trọng để ngăn ngừa các biến chứng nguy hiểm về gan.",
    shortDescription: "Xét nghiệm phát hiện virus viêm gan B và tình trạng miễn dịch",
    price: 250000,
    category: "single",
    testType: "hepatitisB",
    discountPercent: 0,
    duration: 40,
    rating: 4.9,
    reviewCount: 156,
    popularityScore: 90,
  },
  {
    id: 7,
    name: "Xét nghiệm HPV",
    description:
      "Xét nghiệm HPV phát hiện sự hiện diện của virus HPV có nguy cơ cao, giúp đánh giá nguy cơ ung thư cổ tử cung ở nữ giới. Đây là xét nghiệm quan trọng trong tầm soát và phòng ngừa ung thư sớm.",
    shortDescription: "Phát hiện các chủng HPV nguy cơ cao gây ung thư",
    price: 450000,
    category: "single",
    testType: "hpv",
    discountPercent: 0,
    duration: 45,
    rating: 4.8,
    reviewCount: 132,
    popularityScore: 92,
  },
  {
    id: 10,
    name: "Xét nghiệm Herpes",
    description:
      "Xét nghiệm Herpes phát hiện kháng thể chống lại virus Herpes simplex (HSV) type 1 và 2 trong máu. Giúp chẩn đoán chính xác nhiễm herpes sinh dục hoặc herpes miệng, đặc biệt trong các trường hợp không có triệu chứng rõ ràng.",
    shortDescription: "Xét nghiệm phân biệt HSV-1 và HSV-2 qua mẫu máu",
    price: 300000,
    category: "single",
    testType: "herpes",
    discountPercent: 0,
    duration: 30,
    rating: 4.6,
    reviewCount: 85,
    popularityScore: 78,
  },
];

const RetailService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOption, setSortOption] = useState("popularity");
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  // Lấy dữ liệu dịch vụ từ mock data
  useEffect(() => {
    setLoading(true);
    
    // Giả lập API call với timeout
    setTimeout(() => {
      // Lọc ra chỉ các dịch vụ đơn lẻ (single)
      const retailServices = mockServices.filter(service => service.category === "single");
      
      let filteredServices = [...retailServices];
      
      // Lọc theo từ khóa tìm kiếm
      if (searchQuery) {
        filteredServices = filteredServices.filter(
          service => service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   service.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Lọc theo loại xét nghiệm
      if (filterType !== "all") {
        filteredServices = filteredServices.filter(service => service.testType === filterType);
      }
      
      // Sắp xếp dịch vụ
      switch (sortOption) {
        case "price_low":
          filteredServices.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          filteredServices.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filteredServices.sort((a, b) => b.rating - a.rating);
          break;
        default: // popularity
          filteredServices.sort((a, b) => b.popularityScore - a.popularityScore);
          break;
      }
      
      setServices(filteredServices);
      setLoading(false);
    }, 800);
  }, [searchQuery, filterType, sortOption]);

  // Đặt lịch dịch vụ
  const handleBookService = (serviceId) => {
    // Chuyển đến trang đặt lịch (có thể thêm mã sau)
    // navigate(`/book-service/${serviceId}`);
  };

  // Thêm/xóa dịch vụ yêu thích
  const toggleFavorite = (serviceId) => {
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter(id => id !== serviceId));
    } else {
      setFavorites([...favorites, serviceId]);
    }
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

        {/* Filters and Search */}
        <Card className="mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input.Search
                placeholder="Tìm kiếm dịch vụ..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={(value) => setSearchQuery(value)}
              />
            </div>

            <div>
              <Select
                placeholder="Loại xét nghiệm"
                style={{ width: "100%" }}
                size="large"
                onChange={(value) => setFilterType(value)}
                value={filterType}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">Tất cả các loại</Option>
                <Option value="hiv">HIV</Option>
                <Option value="syphilis">Giang mai</Option>
                <Option value="hepatitisB">Viêm gan B</Option>
                <Option value="hpv">HPV</Option>
                <Option value="herpes">Herpes</Option>
              </Select>
            </div>

            <div>
              <Select
                placeholder="Sắp xếp theo"
                style={{ width: "100%" }}
                size="large"
                onChange={(value) => setSortOption(value)}
                value={sortOption}
              >
                <Option value="popularity">Phổ biến nhất</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
                <Option value="price_low">Giá thấp đến cao</Option>
                <Option value="price_high">Giá cao đến thấp</Option>
              </Select>
            </div>
          </div>
        </Card>


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
                key={service.id}
                className="transition-all duration-300"
              >
                <Card 
                  hoverable 
                  className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      {/* Loại bỏ icon - chỉ giữ lại tiêu đề */}
                      <Title level={4} className="mb-1">
                        {service.name}
                      </Title>
                      <Button
                        type="text"
                        shape="circle"
                        icon={favorites.includes(service.id) ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(service.id);
                        }}
                      />
                    </div>

                    <Paragraph className="text-gray-500 mb-4 line-clamp-3">
                      {service.description}
                    </Paragraph>

                    <div className="mb-4">
                      <div className="flex items-center gap-1">
                        <Rate disabled defaultValue={service.rating} allowHalf character={<StarFilled />} className="text-sm" />
                        <Text className="text-sm text-gray-500">
                          ({service.reviewCount} đánh giá)
                        </Text>
                      </div>
                    </div>

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

                      {/* Loại bỏ nút Chi tiết, chỉ giữ lại Đặt lịch */}
                      <Button 
                        type="primary" 
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleBookService(service.id)}
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
                    title={<Title level={5}>{item.question}</Title>}
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