import React, { use } from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Divider,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Avatar,
  Card,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  IdcardOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ViewBookingStisModal = ({ open, onCancel, booking, customer }) => {
  if (!booking) return null;

  // Hàm format giá
  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN") + " đ";
  };

  // Hàm render trạng thái đặt lịch
  const renderBookingStatus = (status) => {
    const statusConfig = {
      PENDING: { color: "blue", label: "Chờ xác nhận" },
      CONFIRMED: { color: "purple", label: "Đã xác nhận" },
      COMPLETED: { color: "green", label: "Hoàn thành" },
      CANCELLED: { color: "red", label: "Đã hủy" },
      no_show: { color: "orange", label: "Không đến" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  // Hàm render trạng thái thanh toán
  const renderPaymentStatus = (status) => {
    const statusConfig = {
      PAID: { color: "green", label: "Đã thanh toán" },
      UNPAID: { color: "red", label: "Chưa thanh toán" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  // Hàm render phương thức thanh toán
  const renderPaymentMethod = (method) => {
    const methodConfig = {
      cash: { label: "Tiền mặt" },
      "credit card": { label: "Ngân hàng" },
      vnpay: { label: "VNPay" },
      momo: { label: "MoMo" },
    };

    const config = methodConfig[method] || { label: method || "Chưa xác định" };
    return config.label;
  };

  // Kiểm tra có giảm giá không
  const hasDiscount =  booking.discount > 0;
  const originalPrice = booking?.servicePrice || 0;
  const discountedPrice = hasDiscount ? originalPrice * (1 - booking.discount / 100) : originalPrice;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={<Title level={4}>Chi tiết đặt lịch xét nghiệm</Title>}
      width={800}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      <Card className="shadow-sm mb-4">
        <Row gutter={[16, 0]}>
          <Col span={24} md={6}>
            <div className="flex flex-col items-center justify-center">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={customer?.userImageUrl || ""}
              />
              <Text className="mt-2 font-medium text-lg">
                {booking.customerName}
              </Text>
              <Text type="secondary">{customer?.email || "Không có"}</Text>
            </div>
          </Col>
          <Col span={24} md={18}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item
                label={
                  <Space>
                    <IdcardOutlined /> ID
                  </Space>
                }
              >
                {booking.id || booking.bookingId}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <PhoneOutlined /> Số điện thoại
                  </Space>
                }
              >
                {customer?.phone || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <HomeOutlined /> Địa chỉ
                  </Space>
                }
              >
                {customer?.address || "Không có"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      <Divider orientation="left">Thông tin đặt lịch</Divider>

      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item
              label={
                <Space>
                  <MedicineBoxOutlined /> Dịch vụ
                </Space>
              }
            >
              <Text strong>{booking.serviceName}</Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <DollarOutlined /> Giá
                </Space>
              }
            >
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  {/* Giá đã giảm */}
                  <Text type="danger" strong>
                    {formatPrice(discountedPrice)}
                  </Text>

                  {/* Tag giảm giá */}
                  <Tag color="red" className="ml-2">
                    <PercentageOutlined /> {booking.discount}%  
                  </Tag>
                </div>
              ) : (
                <Text type="danger" strong>
                  {formatPrice(originalPrice)}
                </Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <CalendarOutlined /> Ngày hẹn
                </Space>
              }
            >
              {dayjs(booking.bookingDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <ClockCircleOutlined /> Giờ hẹn
                </Space>
              }
            >
              {booking.bookingTime}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={24} md={12}>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Trạng thái đặt lịch">
              {renderBookingStatus(booking.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              {renderPaymentStatus(booking.paymentStatus)}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {renderPaymentMethod(booking.paymentMethod)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt lịch">
              {dayjs(booking.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      {booking.note && (
        <>
          <Divider orientation="left">Ghi chú</Divider>
          <Card>
            <Text>{booking.note}</Text>
          </Card>
        </>
      )}
    </Modal>
  );
};

export default ViewBookingStisModal;
