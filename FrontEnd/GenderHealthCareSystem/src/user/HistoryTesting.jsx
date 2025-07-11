import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Tooltip,
  Empty,
  Modal,
  Spin,
  message,
  Rate,
  Input,
  Form,
  Row,
  Col,
  Pagination,
  Divider,
  Popconfirm,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
  StarFilled,
  CalendarOutlined,
  FieldTimeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../components/provider/AuthProvider";

import { convertVndToUsd, formatPrice } from "../components/utils/format";
import {
  cancelBookingAPI,
  historyBookingAPI,
} from "../components/api/BookingTesting.api";
import {
  paymentPayPalAPI,
  paymentVNPayAPI,
} from "../components/api/Payment.api";
import { postFeedbackTestingAPI } from "../components/api/FeedbackTesting.api";
import FeedbackModal from "./FeedbackModal";

const { Title, Text } = Typography;

const HistoryTesting = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewResult, setViewResult] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });
  // State cho feedback
  const [feedbackForm] = Form.useForm();
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Fetch booking history
  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const response = await historyBookingAPI({
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
        price: item.servicePrice,
        bookingDate: dayjs(item.updatedAt).format("DD/MM/YYYY"),
        appointmentDate: dayjs(item.bookingDate).format("DD/MM/YYYY"),
        appointmentTime: `${item.bookingTimeStart} - ${item.bookingTimeEnd}`,
        notes: item.note,
        testingStatus: item.status,
      }));
      setBookings(data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      message.error("Không thể tải lịch sử đặt lịch");
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
      const response =
        paymentMethod === "vnpay"
          ? await paymentVNPayAPI(
              totalPrice,
              "Đặt lịch xét nghiệm STI",
              bookingId
            )
          : await paymentPayPalAPI(convertVndToUsd(totalPrice), bookingId);

      localStorage.setItem("bookingID", bookingId);
      localStorage.setItem("amount", totalPrice);
      localStorage.setItem("orderInfo", "Đặt lịch xét nghiệm STI");

      // Mô phỏng thanh toán thành công
      message.success("Đang chuyển hướng đến trang thanh toán ...");

      // Giả lập thanh toán thành công sau 3 giây
      setTimeout(() => {
        window.location.href = response.data;
      }, 3000);
    } catch (error) {
      console.error("Error processing payment:", error);
      message.error("Có lỗi xảy ra khi xử lý thanh toán, vui lòng thử lại.");
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBookingAPI(bookingId);
      // Giả lập hủy thành công sau 2 giây
      setTimeout(() => {
        fetchBookingHistory();
        message.success("Đã hủy đặt lịch thành công!");
      }, 200);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error("Có lỗi xảy ra khi hủy đặt lịch, vui lòng thử lại.");
    }
  };

  const handleFeedback = (record) => {
    setSelectedBooking(record);
    setOpenFeedback(true);
    // Reset form khi mở modal
    if (feedbackForm) {
      feedbackForm.resetFields();
      setFeedbackRating(5);
    }
  };

  // Thêm hàm xử lý gửi đánh giá
  const handleSubmitFeedback = async (feedback) => {
    try {
      setSubmittingFeedback(true);
      // Gọi API với các giá trị từ feedback object
      await postFeedbackTestingAPI(
        feedback.id,
        feedback.rating,
        feedback.content
      );

      setOpenFeedback(false);
      setSubmittingFeedback(false);
      message.success("Cảm ơn bạn đã gửi đánh giá!");
      // Refresh danh sách nếu cần
      fetchBookingHistory();
    } catch (error) {
      setSubmittingFeedback(false);
      console.error("Error submitting feedback:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá"
      );
    }
  };

  // Xử lý xem kết quả xét nghiệm
  const handleViewResult = (record) => {
    setSelectedBooking(record);
    setViewResult(true);
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
      case "COMPLETED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Hoàn thành
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
      case "NO_SHOW":
        return (
          <Tag icon={<CloseCircleOutlined />} color="orange">
            Không đến
          </Tag>
        );
      case "PENDING_TEST_RESULT":
        return (
          <Tag icon={<ClockCircleOutlined />} color="yellow">
            Chờ kết quả
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

  // Modal xem kết quả xét nghiệm - giữ nguyên
  const renderTestResultModal = () => (
    <Modal
      title={<span className="text-lg">Kết quả xét nghiệm</span>}
      open={viewResult}
      footer={[
        <Button key="download" type="primary" icon={<FileDoneOutlined />}>
          Tải kết quả
        </Button>,
        <Button key="back" onClick={() => setViewResult(false)}>
          Đóng
        </Button>,
      ]}
      onCancel={() => setViewResult(false)}
      width={700}
    >
      {selectedBooking && (
        <div className="space-y-4">
          <div className="text-center pb-4 border-b">
            <Title level={4} className="mb-1">
              GENDER HEALTHCARE CENTER
            </Title>
            <div className="text-gray-500 text-sm">
              PHIẾU KẾT QUẢ XÉT NGHIỆM
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Text type="secondary">Họ và tên:</Text>
              <div className="font-medium">
                {user?.fullName || "Khách hàng"}
              </div>
            </div>
            <div>
              <Text type="secondary">Mã xét nghiệm:</Text>
              <div className="font-medium">{selectedBooking.id}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Text type="secondary">Ngày xét nghiệm:</Text>
              <div>
                {dayjs(selectedBooking.appointmentDate).format("DD/MM/YYYY")}
              </div>
            </div>
            <div>
              <Text type="secondary">Ngày trả kết quả:</Text>
              <div>
                {dayjs(selectedBooking.appointmentDate)
                  .add(2, "day")
                  .format("DD/MM/YYYY")}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Title level={5}>Kết quả chi tiết</Title>
            <Table
              size="small"
              pagination={false}
              dataSource={[
                {
                  test: "HIV 1/2 Ab/Ag",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
                {
                  test: "Giang mai (Syphilis RPR)",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
                {
                  test: "Chlamydia trachomatis",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
                {
                  test: "Neisseria gonorrhoeae",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
                {
                  test: "Vi khuẩn Trichomonas",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
              ]}
              columns={[
                {
                  title: "Xét nghiệm",
                  dataIndex: "test",
                  key: "test",
                  width: "30%",
                },
                {
                  title: "Kết quả",
                  dataIndex: "result",
                  key: "result",
                  width: "20%",
                  render: (text) => <span className="font-medium">{text}</span>,
                },
                {
                  title: "Đơn vị",
                  dataIndex: "unit",
                  key: "unit",
                  width: "10%",
                },
                {
                  title: "Giá trị tham chiếu",
                  dataIndex: "reference",
                  key: "reference",
                  width: "20%",
                },
                {
                  title: "Ghi chú",
                  dataIndex: "note",
                  key: "note",
                  width: "20%",
                },
              ]}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="font-medium">Kết luận:</div>
            <div className="p-2 bg-gray-50 rounded mt-2">
              <p className="font-medium">
                Không phát hiện bệnh lây truyền qua đường tình dục.
              </p>
              <p>Khuyến nghị tái khám định kỳ 6 tháng/lần.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 pt-4">
            <div></div>
            <div className="text-center">
              <div>Bác sĩ kết luận</div>
              <div className="h-16"></div>
              <div className="font-medium">BS. Nguyễn Văn A</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  // Component để render mỗi booking dạng card
  const BookingCard = ({ booking }) => (
    <div className="mb-4">
      <Card hoverable className="w-full my-4 shadow-sm">
        <div className="flex flex-col md:flex-row w-full">
          {/* Cột bên trái - Thông tin dịch vụ và thời gian */}
          <div className="flex-1 md:pr-4">
            {/* Header - Tên dịch vụ và ID */}
            <div className="mb-3">
              <Title level={5} className="m-0">
                {booking.serviceName}
              </Title>
              <Text type="secondary">Mã đặt lịch: #{booking.id}</Text>
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
                  {renderPaymentMethod(booking.paymentMethod.toUpperCase())}
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
              {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                <Popconfirm
                  title="Xác nhận hủy lịch khám"
                  description="Bạn có chắc chắn muốn hủy lịch đã đặt này không?"
                  okText="Có, hủy lịch"
                  cancelText="Không"
                  onConfirm={() => handleCancel(booking.id)}
                  okButtonProps={{ danger: true }}
                  icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                >
                  <Button
                    danger
                    size="middle"
                  >
                    Hủy lịch
                  </Button>
                </Popconfirm>
              )}

              {booking.paymentMethod !== "cash" &&
                booking.paymentStatus === "UNPAID" &&
                booking.status !== "CANCELLED" && (
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => {
                      handlePayment(
                        booking.id,
                        booking.price,
                        booking.paymentMethod
                      );
                    }}
                  >
                    Thanh toán
                  </Button>
                )}

              {booking.status === "COMPLETED" && (
                <>
                  <Button
                    type="default"
                    size="middle"
                    onClick={() => handleFeedback(booking)}
                  >
                    Đánh giá
                  </Button>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => handleViewResult(booking)}
                  >
                    Xem kết quả
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Render giao diện chính
  return (
    <Card className="shadow-sm" bordered={false}>
      <div className="mb-4">
        <Title level={4} className="flex items-center mb-3">
          <MedicineBoxOutlined className="mr-2 text-[#0099CF]" />
          Lịch sử khám bệnh
        </Title>
        <Text type="secondary">
          Xem lịch sử đặt khám và kết quả xét nghiệm của bạn tại đây.
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
          description="Bạn chưa có lịch sử đặt khám"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {renderTestResultModal()}

      {/* Component FeedbackModal */}
      <FeedbackModal
        visible={openFeedback}
        onCancel={() => setOpenFeedback(false)}
        onSubmit={handleSubmitFeedback}
        data={selectedBooking}
        type="service"
        loading={submittingFeedback}
        mode="create"
      />
    </Card>
  );
};

export default HistoryTesting;
