import React, { useEffect, useState, useRef } from "react";
import { Button, Result, Typography, message } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";

import { convertVndToUsd } from "../components/utils/format";
import {
  createInvoiceAPI,
  paymentPayPalAPI,
  paymentVNPayAPI,
  paypalSuccessAPI,
  consultantPaypalSuccessAPI,
  consultantVNPaySuccessAPI,
  getConsultantPaymentRedirectURL,
} from "../components/api/Payment.api";

const { Paragraph } = Typography;

const BookingResult = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [check, setCheck] = useState(false);
  const hasCreatedInvoice = useRef(false);

  const userEmail = user?.email || "";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fullQueryString = location.search.substring(1);

  const vnpayResponseCode = queryParams.get("vnp_ResponseCode");
  const paymentId = queryParams.get("paymentId");
  const payerId = queryParams.get("PayerID");

  const isVNpay = !!vnpayResponseCode;
  const isPaypal = !!paymentId && !!payerId;

  // ✅ THÊM VÀO ĐÂY — không còn lỗi nữa
  const bookingType = localStorage.getItem("bookingType") || "sti";

  const isPaymentSuccessful = () => {
    if (isVNpay) return vnpayResponseCode === "00";
    if (isPaypal) return !!payerId;
    return false;
  };

  useEffect(() => {
    const onFinish = async () => {
      const checkResult = isPaymentSuccessful();
      setCheck(checkResult);

      if (!hasCreatedInvoice.current && checkResult) {
        hasCreatedInvoice.current = true;

        try {
          // ✅ DEBUG
          console.log(">>> bookingType:", bookingType, "| isVNpay:", isVNpay, "| isPaypal:", isPaypal);

          if (bookingType === "consultant") {
            if (isVNpay) {
              const queryParamsObj = Object.fromEntries(queryParams.entries());
              await consultantVNPaySuccessAPI(queryParamsObj);
            } else if (isPaypal) {
              await consultantPaypalSuccessAPI(paymentId, payerId);
            } else {
              message.error("Không xác định phương thức thanh toán.");
              return;
            }
          } else {
            // STI hoặc loại khác
            if (isVNpay || isPaypal) {
              await createInvoiceAPI(fullQueryString);
            } else {
              message.error("Không xác định phương thức thanh toán.");
              return;
            }
          }

          localStorage.removeItem("bookingID");
          localStorage.removeItem("amount");
          localStorage.removeItem("orderInfo");
          localStorage.removeItem("bookingType");
        } catch (error) {
          console.error("❌ Error creating invoice:", error);
          message.error(
            error.response?.data?.message ||
              "Có lỗi xảy ra khi xác nhận thanh toán."
          );
        }
      }
    };

    onFinish();
  }, [fullQueryString]);

  const handlePaymentAgain = async () => {
    try {
      const bookingID = localStorage.getItem("bookingID");
      const amount = localStorage.getItem("amount");
      const orderInfo = localStorage.getItem("orderInfo");

      if (!bookingID || !amount || !orderInfo) {
        message.error("Thiếu thông tin. Vui lòng đặt lịch lại.");
        navigate(bookingType === "consultant" ? "/consultation" : "/sti-testing");
        return;
      }

      localStorage.setItem("bookingType", bookingType);
      localStorage.removeItem("bookingID");
      localStorage.removeItem("amount");
      localStorage.removeItem("orderInfo");

      let response;
      if (bookingType === "consultant") {
        response = await getConsultantPaymentRedirectURL(
          bookingID,
          isVNpay ? "VNPay" : "PayPal"
        );
      } else {
        response = isVNpay
          ? await paymentVNPayAPI(amount, orderInfo, bookingID)
          : await paymentPayPalAPI(convertVndToUsd(amount), bookingID);
      }

      message.success("Đang chuyển hướng đến trang thanh toán ...");
      setTimeout(() => {
        window.location.href = response.data;
      }, 1500);
    } catch (error) {
      console.error("Error retrying payment:", error);
      message.error("Lỗi khi xử lý lại thanh toán.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-center">
      {check ? (
        <Result
          status="success"
          icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
          title="Đặt lịch thành công!"
          extra={[
            <Paragraph className="mb-5" key="email-info">
              Cảm ơn bạn đã đặt lịch. Thông tin đã được gửi tới {userEmail || "email của bạn"}.
            </Paragraph>,
            <Paragraph className="mb-8" key="payment-info">
              Thanh toán đã hoàn tất. Hẹn gặp bạn vào thời gian đã đặt!
            </Paragraph>,
            <Button
              type="primary"
              key="history"
              size="large"
              onClick={() =>
                navigate(
                  bookingType === "consultant"
                    ? "/user/history-consultation"
                    : "/user/history-testing"
                )
              }
            >
              Xem lịch sử đặt lịch
            </Button>,
            <Button
              key="back"
              size="large"
              onClick={() =>
                navigate(
                  bookingType === "consultant" ? "/consultation" : "/sti-testing"
                )
              }
              className="ml-4"
            >
              Quay lại trang dịch vụ
            </Button>,
          ]}
        />
      ) : (
        <Result
          status="error"
          icon={<CloseCircleFilled style={{ color: "#ff4d4f" }} />}
          title="Thanh toán thất bại!"
          subTitle="Hệ thống không thể xác nhận thanh toán. Vui lòng thử lại."
          extra={[
            <Paragraph className="mb-5" key="error-info">
              Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.
            </Paragraph>,
            <Button
              type="primary"
              key="retry"
              size="large"
              onClick={handlePaymentAgain}
            >
              Thử lại thanh toán
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
