import { Row, Col, Typography, Space, Divider, Button } from "antd";
import {
  CheckCircleFilled,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer>
      {/* Main Footer - Reduced padding and updated colors */}
      <div className="bg-[#0099CF] text-white py-10 md:px-16 px-8">
        <div className="mx-auto">
          <Row gutter={[32, 24]}>
            {/* Company Info */}
            <Col xs={24} md={12} lg={8}>
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.66898 3.92278C3.26824 4.06336 3 4.44172 3 4.86641V10.6607C3 16.2212 6.51216 21.1752 11.7592 23.0158C11.9151 23.0705 12.0849 23.0705 12.2408 23.0158C17.4878 21.1752 21 16.2212 21 10.6606V4.86641C21 4.44172 20.7318 4.06336 20.331 3.92278L12.331 1.11643C12.1167 1.04127 11.8833 1.04127 11.669 1.11643L3.66898 3.92278ZM12.3333 8.00031C12.8856 8.00031 13.3333 8.44803 13.3333 9.00031V10.567C13.3333 10.6222 13.3781 10.667 13.4333 10.667H15C15.5523 10.667 16 11.1147 16 11.667V12.3336C16 12.8859 15.5523 13.3336 15 13.3336H13.4333C13.3781 13.3336 13.3333 13.3784 13.3333 13.4336V15.0003C13.3333 15.5526 12.8856 16.0003 12.3333 16.0003H11.6667C11.1144 16.0003 10.6667 15.5526 10.6667 15.0003V13.4336C10.6667 13.3784 10.6219 13.3336 10.5667 13.3336H9C8.44772 13.3336 8 12.8859 8 12.3336V11.667C8 11.1147 8.44772 10.667 9 10.667H10.5667C10.6219 10.667 10.6667 10.6222 10.6667 10.567V9.00031C10.6667 8.44803 11.1144 8.00031 11.6667 8.00031H12.3333Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-bold text-xl text-white">Gender Healthcare</span>
              </div>
              
              <p className="text-white mb-4">
                Gender Healthcare cam kết cung cấp dịch vụ chăm sóc sức khỏe giới tính chất lượng cao, 
                an toàn và riêng tư. Chúng tôi luôn đồng hành cùng bạn trên hành trình chăm sóc sức khỏe.
              </p>
              
              <Space direction="vertical" size="small" className="text-white">
                <div className="flex items-start">
                  <EnvironmentOutlined className="text-white text-lg mr-2 mt-1" />
                  <span>D. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh</span>
                </div>
                <div className="flex items-center">
                  <PhoneOutlined className="text-white text-lg mr-2" />
                  <span>Hotline: 1900-2805 (8:00 - 17:30 từ T2 đến T7)</span>
                </div>
                <div className="flex items-center">
                  <MailOutlined className="text-white text-lg mr-2" />
                  <span>support@genderhealthcare.com</span>
                </div>
              </Space>

              
            </Col>

            {/* Quick Links */}
            <Col xs={24} sm={12} md={6} lg={5}>
              <span className="font-bold text-xl text-white mb-4">Liên kết nhanh</span>
              <ul className="space-y-2 my-3">
                <li>
                  <a href="/about" className="!text-white hover:text-white/80 transition-colors flex items-center">
                    <ArrowRightOutlined className="mr-2 text-white" />
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="/blog" className="!text-white hover:text-white/80 transition-colors flex items-center">
                    <ArrowRightOutlined className="mr-2 text-white" />
                    Tin tức & Blog
                  </a>
                </li>
                <li>
                  <a href="/contact" className="!text-white hover:text-white/80 transition-colors flex items-center">
                    <ArrowRightOutlined className="mr-2 text-white" />
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="!text-white hover:text-white/80 transition-colors flex items-center">
                    <ArrowRightOutlined className="mr-2 text-white" />
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="/terms" className="!text-white hover:text-white/80 transition-colors flex items-center">
                    <ArrowRightOutlined className="mr-2 text-white" />
                    Điều khoản sử dụng
                  </a>
                </li>
              </ul>
            </Col>

            {/* Services */}
            <Col xs={24} sm={12} md={6} lg={5}>
              <span className="font-bold text-xl text-white pb-4">Dịch vụ</span>
              <ul className="space-y-2 my-3">
                <li className="flex items-center text-white hover:text-white/80 transition-colors"
                  onClick={() => navigate("/services/consultation")} >
                  <CheckCircleFilled className="text-white mr-2" />
                  Tư vấn trực tuyến
                </li>
                <li className="flex items-center text-white hover:text-white/80 transition-colors"
                  onClick={() => navigate("/services/asking")} >
                  <CheckCircleFilled className="text-white mr-2" />
                  Đặt câu hỏi trực tuyến
                </li>
                <li className="flex items-center text-white hover:text-white/80 transition-colors"
                  onClick={() => navigate("/sti-testing")} >
                  <CheckCircleFilled className="text-white mr-2" />
                  Xét nghiệm STIs
                </li>
                <li className="flex items-center text-white hover:text-white/80 transition-colors"
                  onClick={() => navigate("/menstrual/ovulation")} >
                  <CheckCircleFilled className="text-white mr-2" />
                  Theo dõi chu kỳ kinh nguyệt
                </li>
                <li className="flex items-center text-white hover:text-white/80 transition-colors"
                  onClick={() => navigate("/pill/tracker")} >
                  <CheckCircleFilled className="text-white mr-2" />
                  Theo dõi thuốc tránh thai
                </li>
              </ul>
            </Col>

            {/* Newsletter */}
            <Col xs={24} md={12} lg={6}>
              <span className="font-bold text-xl text-white">Đăng ký nhận thông tin</span>
              <p className="text-white my-3">
                Đăng ký để nhận những thông tin mới nhất về sức khỏe giới tính và các chương trình khuyến mãi.
              </p>
              
              <div className="flex flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="px-4 py-2 rounded-full border-2 focus:outline-none w-2/3" 
                />
                <button
                  type="ghost" 
                  className="rounded-full border-white border-2 text-white hover:bg-white/10 px-2 w-1/3"
                >
                  Đăng ký
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900 text-gray-400 py-4 px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="mb-2 md:mb-0">
            © {new Date().getFullYear()} Gender Healthcare. Số ĐKKD 0315286842 - Sở KH&ĐT TP. Hồ Chí Minh.
          </p>
          <p>
            Chịu trách nhiệm nội dung: Nguyễn Văn A
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
