import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Divider, message, Alert } from "antd";
import { createConsultationBooking } from "../../components/api/ConsultantBooking.api";
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
            const startTime = bookingData.timeSlot.split(" - ")[0]; // e.g. "09:00"
            const bookingDate = dayjs(`${bookingData.date} ${startTime}`).format("YYYY-MM-DDTHH:mm:ss");

            const payload = {

                consultantId: bookingData.consultantId || 1, // fallback nếu ID không có

                customerId: bookingData.customerId || 10,
                bookingDate,
                note: bookingData.notes || "",
                paymentMethod: bookingData.paymentMethod === "bank" ? "VNPAY" : "PAYPAL",
            };

            console.log("Gửi lên:", payload);

            const response = await createConsultationBooking(payload);

            if (response.paymentUrl) {
                message.success("Đang chuyển đến cổng thanh toán...");
                setTimeout(() => {
                    window.location.href = response.paymentUrl;
                }, 1500);
            } else {
                message.success("Đặt lịch thành công!");
                navigate("/history-consultant");
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
            <p className="text-center text-gray-500 mb-6">
                Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt lịch
            </p>

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
