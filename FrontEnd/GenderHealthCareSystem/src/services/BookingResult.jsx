import React, { useEffect, useState, useRef } from "react";
import { Button, Result, Typography, message } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";
import { createInvoiceAPI, paypalSuccessAPI } from "../components/utils/api";

const { Paragraph, Text } = Typography;

const BookingResult = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [check, setCheck] = useState(false);
  // Thêm flag để kiểm soát việc gọi API chỉ một lần
  const hasCreatedInvoice = useRef(false);

  // Email mặc định là từ user auth hoặc từ bookingData
  const userEmail = user?.email || "";

  // Sửa cách lấy query params để hoạt động đúng
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fullQueryString = location.search.substring(1);
  const vnpayResponseCode = queryParams.get("vnp_ResponseCode");

  const paymentId = queryParams.get("paymentId");
  const payerId = queryParams.get("PayerID");

  const isVNpay = vnpayResponseCode !== null;
  const isPaypal = paymentId && payerId;

  const isPaymentSuccessful = () => {
    if (isVNpay) {
      return vnpayResponseCode === "00";
    } else if (isPaypal) {
      return !!payerId;
    }
    return false;
  };

  useEffect(() => {
    const onFinish = async () => {
      setCheck(isPaymentSuccessful());
      if (isVNpay) {
        // Xóa dữ liệu localStorage chỉ khi thanh toán thành công
        localStorage.removeItem("bookingID");
        localStorage.removeItem("amount");
        localStorage.removeItem("orderInfo");

        // Chỉ gọi API tạo hóa đơn nếu chưa gọi
        if (!hasCreatedInvoice.current) {
          hasCreatedInvoice.current = true;
          try {
            await createInvoiceAPI(fullQueryString);
          } catch (error) {
            console.error("Error creating invoice:", error);
            message.error("Có lỗi xảy ra khi tạo hóa đơn, vui lòng thử lại.");
          }
        }
      } else if (isPaypal) {
        if (!hasCreatedInvoice.current) {
          hasCreatedInvoice.current = true;
          try {
            console.log(">>> Paypal paymentId:", paymentId);
            console.log(">> Paypal payerId:", payerId);
            await paypalSuccessAPI(paymentId, payerId);
          } catch (error) {
            console.error("Error creating invoice:", error);
            message.error(error.response?.data?.message || "Có lỗi xảy ra khi xác nhận thanh toán PayPal.");
          }
        }
      }
    };

    onFinish();

    // Cleanup function để đảm bảo xử lý đúng khi component unmount
    return () => {
      // Không cần làm gì trong cleanup function
    };
  }, [fullQueryString]); // Thêm các dependencies

  const handlePaymentAgain = async () => {
    try {
      const bookingID = localStorage.getItem("bookingID");
      const amount = localStorage.getItem("amount");
      const orderInfo = localStorage.getItem("orderInfo");

      // Kiểm tra xem các giá trị có tồn tại không
      if (!bookingID || !amount || !orderInfo) {
        message.error(
          "Thông tin thanh toán không đầy đủ. Vui lòng đặt lịch lại."
        );
        navigate("/sti-testing");
        return;
      }

      // Chỉ xóa localStorage sau khi đã lấy các giá trị
      localStorage.removeItem("bookingID");
      localStorage.removeItem("amount");
      localStorage.removeItem("orderInfo");

      const response = await paymentAPI(amount, orderInfo, bookingID);

      message.success("Đang chuyển hướng đến trang thanh toán ...");

      setTimeout(() => {
        window.location.href = response.data;
      }, 1500); // Rút ngắn thời gian để tránh người dùng nghĩ trang bị treo
    } catch (error) {
      console.error("Error processing payment:", error);
      message.error("Có lỗi xảy ra khi xử lý thanh toán, vui lòng thử lại.");
    }
  };

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
              Cảm ơn bạn đã đặt lịch. Chúng tôi đã gửi email xác nhận chi tiết
              đến địa chỉ {userEmail}.
            </Paragraph>,
            <Paragraph className="mb-8" key="payment-info">
              Thanh toán của bạn đã được xử lý thành công. Vui lòng đến đúng giờ
              đã đặt.
            </Paragraph>,
            <Button
              type="primary"
              key="dashboard"
              size="large"
              onClick={() => navigate("/user/history-testing")}
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
      ) : (
        // Hiển thị kết quả thất bại
        <Result
          status="error"
          icon={<CloseCircleFilled style={{ color: "#ff4d4f" }} />}
          title="Thanh toán thất bại!"
          subTitle="Đã xảy ra lỗi trong quá trình xử lý thanh toán của bạn."
          extra={[
            <Paragraph className="mb-5" key="error-info">
              Việc đặt lịch của bạn chưa được xác nhận do thanh toán không thành
              công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </Paragraph>,
            <Button
              type="primary"
              key="retry"
              size="large"
              onClick={handlePaymentAgain}
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
