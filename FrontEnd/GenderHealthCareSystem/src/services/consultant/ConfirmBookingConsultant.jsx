import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Divider, message, Alert } from "antd";
import { createConsultationBooking } from "../../components/api/ConsultantBooking.api";
import { paymentVNPayAPI, paymentPayPalAPI } from "../../components/api/Payment.api";
import { convertVndToUsd } from "../../components/utils/format";
import dayjs from "dayjs";

export default function ConfirmConsultationBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!bookingData) {
      message.error("Không có dữ liệu đặt lịch.");
      return;
    }

    setLoading(true);

    try {
      const startTime = bookingData.timeSlot.split(" - ")[0];
      const bookingDate = dayjs(`${bookingData.date} ${startTime}`).toDate();

      if (!bookingData.consultantId) {
        throw new Error("Thiếu consultantId");
      }

      const payload = {
        consultantId: bookingData.consultantId,
        customerId: bookingData.customerId || 10,
        bookingDate,
        note: bookingData.notes || "",
        paymentMethod: bookingData.paymentMethod === "bank" ? "VNPAY" : "PayPal",
      };

      const response = await createConsultationBooking(payload);
      if (!response?.data?.bookingId) {
        throw new Error("Không nhận được bookingId.");
      }

      const bookingId = response.data.bookingId;
      const amount = 100000;
      const orderInfo = "Đặt lịch tư vấn";

      localStorage.setItem("bookingID", bookingId);
      localStorage.setItem("amount", amount);
      localStorage.setItem("orderInfo", orderInfo);

      if (payload.paymentMethod === "VNPAY") {
        const payRes = await paymentVNPayAPI(amount, orderInfo, bookingId);
        message.success("Đang chuyển đến cổng thanh toán...");
        setTimeout(() => {
          window.location.href = payRes.data;
        }, 1000);
      } else {
        const payRes = await paymentPayPalAPI(convertVndToUsd(amount), bookingId);
        message.success("Đang chuyển đến PayPal...");
        setTimeout(() => {
          window.location.href = payRes.data;
        }, 1000);
      }
    } catch (err) {
      console.error("Đặt lịch lỗi:", err);
      message.error("Đặt lịch thất bại.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return <p className="text-center mt-8">Không có thông tin đặt lịch.</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Xác nhận đặt lịch tư vấn</h1>
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
            <p><strong>Phương thức thanh toán:</strong> {bookingData.paymentMethod === "bank" ? "VNPAY" : "PayPal"}</p>
          </Col>
        </Row>
      </Card>

      {bookingData.notes && (
        <Card className="mb-6 rounded-xl shadow" title="Ghi chú thêm">
          <p className="text-gray-700 bg-gray-50 p-3 rounded">{bookingData.notes}</p>
        </Card>
      )}

      <Divider />
      <div className="flex justify-between mt-6">
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
        <Button type="primary" loading={loading} onClick={handleConfirm}>
          Xác nhận đặt lịch
        </Button>
      </div>
    </div>
  );
}
