import { Row, Col, Typography } from "antd";
import { CheckCircleFilled } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Footer = () => {
  return (
    <div className="bg-gray text-white py-10 px-8">
      {/* Content */}
      <div className="bg-gray-100 text-black p-8 ">
        <Row gutter={[32, 16]}>
          {/* Left column - company info */}
          <Col xs={24} md={16}>
            <Title level={3} className="text-[#3399FF] font-bold m-0">
              GenderHealthcare
            </Title>
            <Paragraph className="mt-2 mb-1">
              VPĐD: D. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh<br />
              Hotline: 1900-2805 (8:00 - 17:30 từ T2 đến T7)<br />
              Số ĐKKD 0315286842 do Sở Kế Hoạch Và Đầu Tư TP. Hồ Chí Minh cấp lần đầu ngày 12/5/2025.<br />
              Chịu trách nhiệm nội dung: Nguyễn Văn A
            </Paragraph>

            <hr className="my-4 border-gray-300" />
          </Col>

          {/* Right column - services */}
          <Col xs={24} md={8}>
            <Title level={5} className="uppercase mb-4">Dịch vụ</Title>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircleFilled className="text-[#0074B7] mr-2" />
                Tư Vấn Trực Tuyến
              </li>
              <li className="flex items-center">
                <CheckCircleFilled className="text-[#0074B7] mr-2" />
                Đặt Câu Hỏi Trực Tuyến
              </li>
              <li className="flex items-center">
                <CheckCircleFilled className="text-[#0074B7] mr-2" />
                Xét Nghiệm STIs,..
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
