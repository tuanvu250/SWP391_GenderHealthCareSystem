import React from "react";
import { Button, Result, Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";

const { Paragraph, Text } = Typography;

const BookingResult = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Email mặc định là từ user auth hoặc từ bookingData
  const userEmail = user?.email || "";
  
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-center">
      <Result
        icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
        title={`Đặt lịch thành công!`}
        extra={[
          <Paragraph className="mb-5" key="email-info">
            Cảm ơn bạn đã đặt lịch. Chúng tôi đã gửi email xác nhận chi tiết đến địa chỉ {userEmail}.
          </Paragraph>,
          <Paragraph className="mb-8" key="payment-info">
            Thanh toán của bạn đã được xử lý thành công. Vui lòng đến đúng giờ đã đặt.
          </Paragraph>,
          <Button
            type="primary"
            key="dashboard"
            size="large"
            onClick={() => navigate("/dashboard/appointments")}
          >
            Xem lịch sử đặt lịch
          </Button>,
          <Button
            key="services"
            size="large"
            onClick={() => navigate("/sti-testing")}
            className="ml-4"
          >
            Quay lại trang dịch vụ
          </Button>,
        ]}
      />
    </div>
  );
};

export default BookingResult;