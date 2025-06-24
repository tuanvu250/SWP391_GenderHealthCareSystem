import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Tag, Divider, message, Alert } from "antd";
import { ClockCircleOutlined, UserOutlined, PhoneOutlined, MailOutlined, BankOutlined } from "@ant-design/icons";

export default function ConfirmConsultationBooking() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state || {
        name: "Nguyễn Văn A",
        phone: "0123456789",
        email: "nguyenvana@example.com",
        date: "23/06/2025",
        timeSlot: "09:00 - 10:00",
        expertName: "TS. Nguyễn Thị Minh Trang",
        notes: "Cần tư vấn về sức khỏe giới tính.",
        paymentMethod: "Ngân hàng"
    };

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/stis-booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                message.success("Đặt lịch thành công!");
                navigate("/history-consultant");
            } else {
                message.error("Đặt lịch thất bại.");
            }
        } catch (err) {
            console.error(err);
            message.error("Có lỗi xảy ra khi đặt lịch.");
        } finally {
            setLoading(false);
        }
    };

    if (!bookingData) {
        return <p className="text-center mt-8">Không có thông tin đặt lịch.</p>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-2">Đặt lịch tư vấn sức khỏe</h1>
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
                        <p><strong>Phương thức thanh toán:</strong> Chuyển khoản ngân hàng</p>
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
