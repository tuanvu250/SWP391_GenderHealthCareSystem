import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Row,
  Col,
  Divider,
  message,
  Alert,
  Modal,
} from "antd";
import { createConsultationBooking } from "../../components/api/ConsultantBooking.api";
import { getConsultantPaymentRedirectURL } from "../../components/api/Payment.api";
import dayjs from "dayjs";

export default function ConfirmBookingConsultant() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleConfirm = async () => {
    if (!bookingData) {
      message.error("Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt lịch");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const startTime = bookingData.timeSlot.split(" - ")[0];
      const bookingDate = dayjs(`${bookingData.date} ${startTime}`).toDate();

      let consultantId = bookingData.consultantId;
      let hourlyRate = 120000; // fallback mặc định

      // ✅ Lấy từ localStorage nếu cần
      if (!consultantId) {
        const consultants = JSON.parse(localStorage.getItem("consultants")) || [];
        const match = consultants.find(
          (c) => c.fullName === bookingData.expertName
        );
        consultantId = match?.consultantId;
        hourlyRate = match?.hourlyRate || hourlyRate;
      }

      if (!consultantId) {
        throw new Error("Không xác định được consultantId từ thông tin chuyên gia.");
      }

      const payload = {
        bookingDate,
        note: bookingData.notes || "",
        consultantId,
      };

      const response = await createConsultationBooking(payload);
      const bookingId = response?.data?.data?.bookingId;
      if (!bookingId) throw new Error("Không nhận được bookingId từ hệ thống.");

      const method = (bookingData.paymentMethod || "").toUpperCase();

      // 👉 Lưu vào localStorage (vẫn giữ hourlyRate để hiển thị nếu cần)
      localStorage.setItem("bookingID", bookingId);
      localStorage.setItem("amount", hourlyRate); // chỉ để hiển thị
      localStorage.setItem("orderInfo", "Đặt lịch tư vấn");
      localStorage.setItem("bookingType", "consultant");

      await delay(1000);

      // ❌ Không gửi amount nữa
      const res = await getConsultantPaymentRedirectURL(bookingId, method);

      message.success("Đang chuyển đến cổng thanh toán...");
      window.location.href = res?.data;
    } catch (err) {
      console.error("Đặt lịch lỗi:", err);
      const backendMsg = err?.response?.data?.message;
      Modal.error({
        title: "Lỗi đặt lịch",
        content: backendMsg || err.message || "Đặt lịch thất bại.",
      });
      setErrorMsg(backendMsg || err.message || "Đặt lịch thất bại.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return <p className="text-center mt-8">Không có thông tin đặt lịch.</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">
        Xác nhận đặt lịch tư vấn
      </h1>

      {errorMsg && (
        <Alert message={errorMsg} type="error" showIcon className="mb-4" />
      )}

      <Alert
        message="Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt lịch"
        type="warning"
        showIcon
        className="mb-6"
      />

      <Card className="mb-6 rounded-xl shadow">
        <h2 className="font-semibold text-lg mb-4">Thông tin cá nhân</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <p><strong>Họ tên:</strong> {bookingData.name}</p>
            <p><strong>Điện thoại:</strong> {bookingData.phone}</p>
            <p><strong>Email:</strong> {bookingData.email || "(Không có)"}</p>
          </Col>
          <Col xs={24} md={12}>
            <p><strong>Ngày tư vấn:</strong> {bookingData.date}</p>
            <p><strong>Khung giờ:</strong> {bookingData.timeSlot}</p>
            <p><strong>Chuyên gia:</strong> {bookingData.expertName}</p>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {bookingData.paymentMethod === "paypal" ? "PayPal" : "VNPay"}
            </p>
          </Col>
        </Row>
      </Card>

      {bookingData.notes && (
        <Card className="mb-6 rounded-xl shadow" title="Ghi chú thêm">
          <p className="text-gray-700 bg-gray-50 p-3 rounded">
            {bookingData.notes}
          </p>
        </Card>
      )}

      <Divider />
      <div className="flex justify-between mt-6">
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
        <Button
          type="primary"
          loading={loading}
          onClick={handleConfirm}
        >
          Xác nhận đặt lịch
        </Button>
      </div>
    </div>
  );
}
