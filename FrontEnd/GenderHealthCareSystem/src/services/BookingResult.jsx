import React, { useEffect, useState } from "react";
import { Button, Result, Typography } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";

const { Paragraph, Text } = Typography;

const BookingResult = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [check, setCheck] = useState(false);
  
  // Email mặc định là từ user auth hoặc từ bookingData
  const userEmail = user?.email || "";

  // Sửa cách lấy query params để hoạt động đúng
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get('vnp_ResponseCode');
  
  useEffect(() => {
    // Kiểm tra mã phản hồi từ URL
    if (responseCode === "00") {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [responseCode]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-center">
      {check ? (
        // Hiển thị kết quả thành công
        <Result        
          status="success"
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
              onClick={() => navigate("/services/sti-testing")}
              className="ml-4"
            >
              Quay lại trang dịch vụ
            </Button>,
          ]}
        />
      ) : (
        // Hiển thị kết quả thất bại
        <Result
          status="error"
          icon={<CloseCircleFilled style={{ color: "#ff4d4f" }} />}
          title="Thanh toán thất bại!"
          subTitle="Đã xảy ra lỗi trong quá trình xử lý thanh toán của bạn."
          extra={[
            <Paragraph className="mb-5" key="error-info">
              Việc đặt lịch của bạn chưa được xác nhận do thanh toán không thành công.
              Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </Paragraph>,
            <Button
              type="primary"
              key="retry"
              size="large"
              onClick={() => navigate("/services/sti-testing")}
            >
              Thử lại
            </Button>,
            <Button
              key="home"
              size="large"
              onClick={() => navigate("/")}
              className="ml-4"
            >
              Về trang chủ
            </Button>,
          ]}
        />
      )}
    </div>
  );
};

export default BookingResult;