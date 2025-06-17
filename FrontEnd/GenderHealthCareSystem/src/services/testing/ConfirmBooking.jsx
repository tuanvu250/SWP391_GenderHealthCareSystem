// src/services/STIBooking/ConfirmBooking.jsx
import React from "react";
import { Card, Alert, Row, Col, Tag, Divider } from "antd";
import { DollarCircleOutlined, BankOutlined } from "@ant-design/icons";

const ConfirmBooking = ({ form, userInfo, selectedPackage, totalPrice, formatPrice }) => {
  // Lấy phương thức thanh toán đã chọn
  const paymentMethod = form.getFieldValue("paymentMethod");

  return (
    <div className="space-y-6">
      <Alert
        message="Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt lịch"
        type="warning"
        showIcon
        className="mb-6"
      />

      {/* Thông tin người dùng - chỉ hiển thị, không cần nhập lại */}
      <Card title="Thông tin cá nhân" className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="space-y-3">
              <div>
                <strong>Họ tên:</strong> {userInfo.fullName}
              </div>
              <div>
                <strong>Điện thoại:</strong> {userInfo.phone}
              </div>
              <div>
                <strong>Email:</strong> {userInfo.email}
              </div>
              <div>
                <strong>Ngày sinh:</strong>{" "}
                {userInfo.birthDate.format("DD/MM/YYYY")}
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="space-y-3">
              <div>
                <strong>Ngày xét nghiệm:</strong>{" "}
                {form.getFieldValue("appointmentDate")?.format("DD/MM/YYYY")}
              </div>
              <div>
                <strong>Giờ xét nghiệm:</strong>{" "}
                {form.getFieldValue("appointmentTime")}
              </div>
              
              {/* Phương thức thanh toán */}
              <div>
                <strong>Phương thức thanh toán:</strong>{" "}
                {paymentMethod === "cash" ? (
                  <span className="flex items-center mt-1">
                    <DollarCircleOutlined className="text-green-600 mr-1" /> Thanh toán tiền mặt tại cơ sở
                  </span>
                ) : paymentMethod === "vnpay" ? (
                  <span className="flex items-center mt-1">
                    <BankOutlined className="text-blue-600 mr-1" /> Thanh toán qua VNPay
                  </span>
                ) : (
                  <span className="text-orange-500">Chưa chọn</span>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Chi tiết gói xét nghiệm */}
      {selectedPackage && (
        <Card title="Chi tiết gói xét nghiệm">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-lg">
                  {selectedPackage.serviceName}
                </h4>
                <p className="text-gray-600">
                  {selectedPackage.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#0099CF]">
                  {formatPrice(selectedPackage.price)}
                </div>
                <div className="text-gray-500 line-through text-sm">
                  {formatPrice(selectedPackage.originalPrice)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {selectedPackage.tests.map((test, index) => (
                <Tag key={index} color="blue" className="mb-1">
                  {test}
                </Tag>
              ))}
            </div>
          </div>

          <Divider />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Tổng cộng:</span>
            <span className="text-[#0099CF] text-xl">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </Card>
      )}

      {/* Thông tin bổ sung */}
      {(form.getFieldValue("medicalHistory") || form.getFieldValue("notes")) && (
        <Card title="Thông tin bổ sung" className="mb-6">
          {form.getFieldValue("medicalHistory") && (
            <div className="mb-4">
              <div className="font-semibold mb-2">Tiểu sử bệnh:</div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">
                {form.getFieldValue("medicalHistory")}
              </p>
            </div>
          )}
          
          {form.getFieldValue("notes") && (
            <div>
              <div className="font-semibold mb-2">Ghi chú thêm:</div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">
                {form.getFieldValue("notes")}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ConfirmBooking;