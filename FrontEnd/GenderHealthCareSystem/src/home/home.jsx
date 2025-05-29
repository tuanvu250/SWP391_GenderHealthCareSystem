import bannerImage from "../assets/banner.png";
import { Row, Col, Card, Button, Typography, ConfigProvider } from "antd";
import {
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0099CF',
        },
      }}
    >
      <>
        {/* Banner Section */}
        <div className="relative w-full overflow-hidden">
          <div className="flex items-center px-8 py-12">
            {/* Left side image with SVG background */}
            <div className="flex-1 flex justify-start relative">
              {/* SVG Background positioned absolutely behind image */}
              <div className="absolute inset-0 -mx-8 w-screen">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 1437 397"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path d="M0 0H1440V397H0V0Z" fill="url(#paint0_linear_122_1190)" />
                  <defs>
                    <linearGradient
                      id="paint0_linear_122_1190"
                      x1="0"
                      y1="198.5"
                      x2="1440"
                      y2="198.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset="0.259615"
                        stopColor="#E5E5E5"
                        stopOpacity="0.787616"
                      />
                      <stop
                        offset="0.716346"
                        stopColor="#0573AA"
                        stopOpacity="0.787616"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Image positioned relatively to stay above SVG */}
              <img
                src={bannerImage}
                alt="Banner"
                className="max-h-80 object-contain relative z-10"
              />
            </div>

            {/* Right side content */}
            <div className="flex-1 max-w-[60%] git text-white text-center flex flex-col items-center">
              <Title level={1} className="text-white mb-4">Chào mừng đến với Gender Healthcare</Title>
              <Paragraph className="text-lg text-white">
                Tư vấn y khoa, xét nghiệm STIs,...
              </Paragraph>
              <div className="flex gap-4 mt-6">
                <Button type="primary" size="large">
                  Xét nghiệm
                </Button>
                <Button type="primary" size="large">
                  Tư vấn
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-12 px-8">
          <Title level={2} className="text-center mb-10">
            Dịch vụ của chúng tôi
          </Title>

          <Row gutter={[24, 24]} justify="center">
            {/* Card 1 */}
            <Col xs={24} sm={13} md={7}>
              <Card
                hoverable
                className="h-full"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-[#0099CF] text-5xl mb-6">
                    <CalendarOutlined />
                  </div>
                  <Title level={4}>Theo dõi chu kỳ kinh nguyệt</Title>
                  <Paragraph className="mb-6 flex-grow">
                    Theo dõi chu kì kinh nguyệt của bạn, nhận nhắc nhở thời gian rụng trứng, khả năng mang thai, và thời gian uống thuốc tránh thai.
                  </Paragraph>
                  <Button
                    type="primary"
                  >
                    Theo dõi <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Card 2 */}
            <Col xs={24} sm={12} md={7}>
              <Card
                hoverable
                className="h-full"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-[#0099CF] text-5xl mb-6">
                    <MessageOutlined />
                  </div>
                  <Title level={4}>Tư vấn trực tuyến</Title>
                  <Paragraph className="mb-6 flex-grow">
                    Đặt lịch trực tuyến với tư vấn viên để trao đổi những thắc mắc của bạn về sức khỏe.
                  </Paragraph>
                  <Button
                    type="primary"
                  >
                    Tư vấn <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>

            {/* Card 3 */}
            <Col xs={24} sm={12} md={7}>
              <Card
                hoverable
                className="h-full"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-[#0099CF] text-5xl mb-6">
                    <FileTextOutlined />
                  </div>
                  <Title level={4}>Xét nghiệm STIs</Title>
                  <Paragraph className="mb-6 flex-grow">
                    Đặt lịch xét nghiệm STIs và nhận kết quả online một cách nhanh chóng.
                  </Paragraph>
                  <Button
                    type="primary"
                  >
                    Đặt lịch <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

      </>
    </ConfigProvider>
  );
};

export default Home;
