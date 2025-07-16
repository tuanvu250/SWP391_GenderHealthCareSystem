import React, { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Space,
  Typography,
  Empty,
  Spin,
  message,
  Pagination,
  Popconfirm,
  Dropdown,
  Menu,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
  DownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../components/provider/AuthProvider";

import { formatPrice } from "../components/utils/format";

import FeedbackModal from "./FeedbackModal";
import {
  cancelBooking,
  getBookingHistory,
} from "../components/api/ConsultantBooking.api";
import { postFeedbackConsultantAPI } from "../components/api/FeedbackConsultant.api";
import { getConsultantPaymentRedirectURL } from "../components/api/Payment.api";

const { Title, Text } = Typography;

const HistoryConsultantBooking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Fetch booking history
  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const response = await getBookingHistory({
        page: pagination.current - 1,
        size: pagination.pageSize,
        status: "",
        sort: "",
      });
      setPagination({
        ...pagination,
        total: response.data.data.totalElements,
      });
      const data = response.data.data.content.map((item) => ({
        ...item,
        id: item.bookingId,
        price: item.hourlyRate,
        bookingDate: dayjs(item.createAt).format("DD/MM/YYYY"),
        appointmentDate: dayjs(item.bookingDate).format("DD/MM/YYYY"),
        appointmentTime: `${dayjs(item.bookingDate).format("HH:mm")} - ${dayjs(
          item.bookingDate
        )
          .add(1, "hour")
          .format("HH:mm")}`,
        notes: item.note,
      }));
      setBookings(data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      message.error("Không thể tải lịch sử đặt lịch tư vấn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, [pagination.current]);

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  // Xử lý thanh toán
  const handlePayment = async (bookingId, totalPrice, paymentMethod) => {
    try {
      console.log(
        "Processing payment for booking:",
        paymentMethod,
        bookingId,
        totalPrice
      );
      const response = await getConsultantPaymentRedirectURL(
        bookingId,
        paymentMethod.toUpperCase()
      );

      localStorage.setItem("bookingID", bookingId);
      localStorage.setItem("orderInfo", "Đặt lịch tư vấn");
      localStorage.setItem("bookingType", "consultant");

      message.success("Đang chuyển hướng đến trang thanh toán ...");

      setTimeout(() => {
        window.location.href = response.data;
      }, 3000);
    } catch (error) {
      console.error("Error processing payment:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán"
      );
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setTimeout(() => {
        fetchBookingHistory();
        message.success("Đã hủy lịch tư vấn thành công!");
      }, 200);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi hủy lịch tư vấn"
      );
    }
  };

  const handleFeedback = (record) => {
    setSelectedBooking(record);
    setOpenFeedback(true);
  };

  // Xử lý tham gia cuộc gọi
  const handleJoinMeeting = (meetLink) => {
    if (!meetLink) {
      message.warning("Không có link cuộc họp cho lịch hẹn này");
      return;
    }
    if (!meetLink.startsWith("http://") && !meetLink.startsWith("https://")) {
      meetLink = "https://" + meetLink;
    }
    // Mở link trong tab mới
    window.open(meetLink, "_blank");
  };

  // Render trạng thái đặt lịch
  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Tag icon={<ClockCircleOutlined />} color="blue">
            Đang xử lý
          </Tag>
        );
      case "PROCESSING":
        return (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            Chờ thanh toán
          </Tag>
        );
      case "COMPLETED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Hoàn thành
          </Tag>
        );
      case "REFUND_PENDING":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Đang xử lý hoàn tiền
          </Tag>
        );
      case "CANCELLED":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Đã hủy
          </Tag>
        );
      case "CONFIRMED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="purple">
            Đã xác nhận
          </Tag>
        );
      case "DENIED":
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Đã từ chối
          </Tag>
        );
      case "SCHEDULED":
        return (
          <Tag icon={<CalendarOutlined />} color="geekblue">
            Đã lên lịch
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // Render trạng thái thanh toán
  const renderPaymentStatus = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã thanh toán
          </Tag>
        );
      case "UNPAID":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Chưa thanh toán
          </Tag>
        );
      case "REFUND_PENDING":
        return (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            Đang xử lý hoàn tiền
          </Tag>
        );
      default:
        return <Tag color="default">Chưa thanh toán</Tag>;
    }
  };

  // Render phương thức thanh toán
  const renderPaymentMethod = (method) => {
    switch (method) {
      case "VNPAY":
        return (
          <span>
            <CreditCardOutlined className="mr-1" /> VNPAY
          </span>
        );
      case "PAYPAL":
        return (
          <span>
            <CreditCardOutlined className="mr-1" /> PayPal
          </span>
        );
      case "CASH":
        return (
          <span>
            <DollarOutlined className="mr-1" /> Tiền mặt
          </span>
        );
      default:
        return method;
    }
  };

  // Component để render mỗi booking dạng card
  const BookingCard = ({ booking }) => {
    const canJoinMeeting = booking.meetLink && booking.status === "SCHEDULED";
    const paymentMenu = (
      <Menu
        onClick={({ key }) => {
          handlePayment(booking.id, booking.price, key);
        }}
        items={[
          {
            key: "VNPAY",
            label: (
              <div className="flex items-center">
                <CreditCardOutlined className="mr-2" /> VNPAY
              </div>
            ),
          },
          {
            key: "PAYPAL",
            label: (
              <div className="flex items-center">
                <CreditCardOutlined className="mr-2" /> PayPal
              </div>
            ),
          },
        ]}
      />
    );

    return (
      <div className="mb-4">
        <Card hoverable className="w-full my-4 shadow-sm" bordered={false}>
          <div className="flex flex-col md:flex-row w-full">
            {/* Cột bên trái - Thông tin dịch vụ và thời gian */}
            <div className="flex-1 md:pr-4">
              {/* Header - Tên tư vấn viên và ID */}
              <div className="mb-3">
                <div className="flex items-center">
                  <UserOutlined className="mr-2 text-blue-500" />
                  <Title level={5} className="m-0">
                    {booking.consultantName}
                  </Title>
                </div>
                <div className="flex items-center mt-1">
                  <PhoneOutlined className="mr-2 text-gray-500" />
                  <Text type="secondary">
                    {booking.consultantPhone || "Không có số điện thoại"}
                  </Text>
                </div>
                <Text type="secondary" className="mt-1 block">
                  Mã đặt lịch: #{booking.id}
                </Text>
              </div>

              {/* Thông tin thời gian */}
              <div className="mb-2 flex gap-2 items-center">
                <CalendarOutlined className="text-gray-500" />
                <Text className="text-gray-500">Ngày hẹn:</Text>
                <Text strong>{booking.appointmentDate}</Text>
              </div>

              <div className="mb-3 flex gap-2 items-center">
                <FieldTimeOutlined className="text-gray-500" />
                <Text className="text-gray-500">Giờ hẹn:</Text>
                <Text strong>{booking.appointmentTime}</Text>
              </div>

              {booking.notes && (
                <div className="mb-3 mt-2 bg-gray-50 p-2 rounded text-sm">
                  <Text className="text-gray-500">Ghi chú: </Text>
                  <Text>{booking.notes}</Text>
                </div>
              )}
            </div>

            {/* Cột giữa - Thông tin thanh toán */}
            <div className="md:w-1/4 mb-3 md:mb-0 md:px-4">
              {/* Thông tin giá và thanh toán */}
              <div className="mb-2">
                <Text className="text-gray-500 block">Giá:</Text>
                <Text className="font-medium text-blue-500 text-lg">
                  {formatPrice(booking.price)}
                </Text>
              </div>

              <div>
                <Text className="text-gray-500 block">Thanh toán:</Text>
                <div className="mt-1">
                  <div className="mb-1">
                    {renderPaymentMethod(booking.paymentMethod)}
                  </div>
                  <div>{renderPaymentStatus(booking.paymentStatus)}</div>
                </div>
              </div>
            </div>

            {/* Cột bên phải - Trạng thái và nút hành động */}
            <div className="md:w-1/4 md:pl-4 flex flex-col justify-between">
              <div className="mb-4 flex justify-end">
                {renderStatus(booking.status)}
              </div>

              {/* Nút hành động */}
              <div className="flex flex-wrap justify-end gap-2">
                {booking.status !== "CANCELLED" &&
                  booking.status !== "COMPLETED" && (
                    <Popconfirm
                      title="Xác nhận hủy lịch tư vấn"
                      description="Bạn có chắc chắn muốn hủy lịch tư vấn này không?"
                      okText="Có, hủy lịch"
                      cancelText="Không"
                      onConfirm={() => handleCancel(booking.id)}
                      okButtonProps={{ danger: true }}
                      icon={
                        <ExclamationCircleOutlined style={{ color: "red" }} />
                      }
                    >
                      <Button danger size="middle">
                        Hủy lịch
                      </Button>
                    </Popconfirm>
                  )}

                {/* Thay nút thanh toán bằng dropdown */}
                {booking.paymentStatus === "UNPAID" &&
                  booking.status !== "CANCELLED" && (
                    <Dropdown overlay={paymentMenu} trigger={["click"]}>
                      <Button
                        type="primary"
                        size="middle"
                        className="flex items-center"
                      >
                        Thanh toán <DownOutlined className="ml-1" />
                      </Button>
                    </Dropdown>
                  )}

                {/* Nút tham gia cuộc gọi khi có meetLink và trạng thái phù hợp */}
                {canJoinMeeting && (
                  <Button
                    type="primary"
                    size="middle"
                    icon={<VideoCameraOutlined />}
                    onClick={() => handleJoinMeeting(booking.meetLink)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Tham gia
                  </Button>
                )}

                {booking.status === "COMPLETED" && (
                  <Button
                    type="default"
                    size="middle"
                    onClick={() => handleFeedback(booking)}
                  >
                    Đánh giá
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Render giao diện chính
  return (
    <Card className="shadow-sm" bordered={false}>
      <div className="mb-4">
        <Title level={4} className="flex items-center mb-3">
          <UserOutlined className="mr-2 text-[#0099CF]" />
          Lịch sử đặt lịch tư vấn
        </Title>
        <Text type="secondary">
          Xem lịch sử đặt lịch tư vấn và đánh giá tư vấn viên tại đây.
        </Text>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
          <div className="mt-4">Đang tải dữ liệu...</div>
        </div>
      ) : bookings.length > 0 ? (
        <>
          <div className="mt-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <Empty
          description="Bạn chưa có lịch sử đặt lịch tư vấn"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {/* Component FeedbackModal */}
      <FeedbackModal
        visible={openFeedback}
        onCancel={() => setOpenFeedback(false)}
        data={selectedBooking}
        type="consultant"
        mode="create"
        onSuccess={fetchBookingHistory}
      />
    </Card>
  );
};

export default HistoryConsultantBooking;
