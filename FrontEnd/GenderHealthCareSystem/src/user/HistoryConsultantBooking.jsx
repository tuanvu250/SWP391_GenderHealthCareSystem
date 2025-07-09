import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Spin,
  Button,
  message,
  Modal,
  DatePicker,
  Select,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  VideoCameraOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import FeedbackModal from "./FeedbackModal";
import { postFeedbackConsultantAPI } from "../components/api/FeedbackConsultant.api";
import { cancelBooking, getBookingHistory, rescheduleBooking } from "../components/api/ConsultantBooking.api";

const { Title, Text } = Typography;
const { Option } = Select;

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "13:30 - 14:30",
  "15:00 - 16:00",
  "16:30 - 17:30",
];

const HistoryConsultantBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState({
    open: false,
    bookingId: null,
  });

  // Cập nhật state cho modal đánh giá
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const [newDate, setNewDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  const fetchBookings = async () => {
    try {
      const response = await getBookingHistory({
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      setLoading(true);
      setPagination({
        ...pagination,
        total: response.data?.data?.totalElements || 0,
      });
      setBookings(response.data?.data?.content || []);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử booking:", error);
      message.error("Không thể tải lịch sử đặt lịch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = (bookingId) => {
    Modal.confirm({
      title: "Xác nhận hủy lịch?",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn chắc chắn muốn hủy lịch tư vấn này?",
      okText: "Hủy lịch",
      okType: "danger",
      cancelText: "Không",
      async onOk() {
        try {
          await cancelBooking(bookingId);
          message.success("Đã hủy lịch thành công!");
          fetchBookings();
        } catch (err) {
          console.error(err);
          message.error(err.response?.data?.message || "Không thể hủy lịch.");
        }
      },
    });
  };

  const handleOpenReschedule = (bookingId) => {
    setRescheduleModal({ open: true, bookingId });
    setNewDate(null);
    setSelectedSlot(null);
  };

  const handleRescheduleSubmit = async () => {
    if (!newDate || !selectedSlot) {
      message.warning("Vui lòng chọn ngày và khung giờ.");
      return;
    }

    const [startTime] = selectedSlot.split(" - ");
    const dateTimeStr = dayjs(
      newDate.format("YYYY-MM-DD") + "T" + startTime
    ).format("YYYY-MM-DDTHH:mm:ss");

    try {
      await rescheduleBooking({
        bookingId: rescheduleModal.bookingId,
        newDate: dateTimeStr,
      });
      message.success("Đổi lịch thành công!");
      setRescheduleModal({ open: false, bookingId: null });
      setNewDate(null);
      setSelectedSlot(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
      message.error("Không thể đổi lịch.");
    }
  };

  // Cập nhật hàm mở modal đánh giá sử dụng FeedbackModal
  const handleOpenRatingModal = (booking) => {
    setSelectedBooking({
      ...booking,
      id: booking.bookingId, // Đảm bảo có trường id cho FeedbackModal
      consultantName: booking.consultantName,
      consultationTime: dayjs(booking.bookingDate).format("DD/MM/YYYY HH:mm"),
      consultationType: "Trực tuyến", // Hoặc lấy từ booking nếu có
    });
    setFeedbackVisible(true);
  };

  // Cập nhật hàm xử lý gửi đánh giá
  const handleSubmitFeedback = async (feedback) => {
    try {
      setSubmittingFeedback(true);
      await postFeedbackConsultantAPI({
        bookingId: selectedBooking.bookingId,
        rating: feedback.rating,
        content: feedback.content,
        consultantId: selectedBooking.consultantId,
      });
      message.success("Đánh giá đã được gửi!");
      setFeedbackVisible(false);
      setSelectedBooking(null);
      setSubmittingFeedback(false);
      fetchBookings();
    } catch (err) {
      setSubmittingFeedback(false);
      console.error(err);
      message.error(
        err.response?.data?.message ||
          "Không thể gửi đánh giá. Vui lòng thử lại."
      );
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Tag icon={<ClockCircleOutlined />} color="blue">
            Đang xử lý
          </Tag>
        );
      case "CONFIRMED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Đã xác nhận
          </Tag>
        );
      case "CANCELLED":
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Đã hủy
          </Tag>
        );
      case "COMPLETED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="cyan">
            Hoàn thành
          </Tag>
        );
      default:
        return status ? <Tag>{status}</Tag> : "—";
    }
  };

  const renderPaymentStatus = (status) => {
    switch (status) {
      case "PAID":
        return <Tag color="green">Đã thanh toán</Tag>;
      case "UNPAID":
        return <Tag color="orange">Chưa thanh toán</Tag>;
      default:
        return status ? <Tag>{status}</Tag> : "—";
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Chuyên gia",
      dataIndex: "consultantName",
      key: "consultantName",
      render: (text, record) =>
        text || <span className="text-gray-500">ID {record.consultantId}</span>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => text || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: renderPaymentStatus,
    },
    {
      title: "Link tư vấn",
      dataIndex: "meetLink",
      key: "meetLink",
      render: (text) =>
        text ? (
          <Button
            type="link"
            href={text}
            target="_blank"
            icon={<VideoCameraOutlined />}
          >
            Tham gia
          </Button>
        ) : (
          <span className="text-gray-400">Chưa có</span>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        const canAct =
          record.paymentStatus === "PAID" && record.status !== "CANCELLED";
        return (
          <div className="flex gap-2">
            {record.status === "COMPLETED" && canAct && (
              <Button
                size="small"
                icon={<StarOutlined />}
                onClick={() => handleOpenRatingModal(record)}
              >
                Đánh giá
              </Button>
            )}
            {canAct && record.status !== "COMPLETED" && (
              <>
                <Button
                  danger
                  size="small"
                  onClick={() => handleCancelBooking(record.bookingId)}
                >
                  Hủy
                </Button>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenReschedule(record.bookingId)}
                >
                  Đổi lịch
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card className="shadow-sm">
      <div className="mb-4">
        <Title level={4} className="flex items-center mb-2">
          <UserOutlined className="mr-2 text-blue-500" />
          Lịch sử đặt lịch tư vấn
        </Title>
        <Text type="secondary">
          Xem, hủy, đổi lịch hoặc đánh giá chuyên gia.
        </Text>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
          <div className="mt-4">Đang tải dữ liệu...</div>
        </div>
      ) : bookings.length > 0 ? (
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="bookingId"
          pagination={pagination}
          onChange={(pagination) => {
            setPagination({
              ...pagination,
              current: pagination.current,
            });
            fetchBookings();
          }}
          scroll={{ x: "max-content" }}
          className="mt-4"
        />
      ) : (
        <Empty
          description="Bạn chưa có lịch tư vấn nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {/* Modal đổi lịch cải tiến */}
      <Modal
        open={rescheduleModal.open}
        title={
          <div className="text-lg flex items-center">
            <EditOutlined className="mr-2 text-blue-500" />
            <span>Đổi lịch tư vấn</span>
          </div>
        }
        onCancel={() => setRescheduleModal({ open: false, bookingId: null })}
        onOk={handleRescheduleSubmit}
        okText="Xác nhận đổi lịch"
        cancelText="Hủy"
        width={500}
        okButtonProps={{ 
          disabled: !newDate || !selectedSlot,
          className: !newDate || !selectedSlot ? "" : "bg-blue-500"
        }}
      >
        <div className="space-y-5">
          {/* Thông tin lịch hiện tại */}
          {rescheduleModal.bookingId && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="text-gray-500 mb-2 font-medium">Lịch hiện tại:</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">Mã đặt lịch:</span>
                  <div className="font-medium">{rescheduleModal.bookingId}</div>
                </div>
                <div>
                  <span className="text-gray-500">Chuyên gia:</span>
                  <div className="font-medium">
                    {bookings.find(b => b.bookingId === rescheduleModal.bookingId)?.consultantName || "Không xác định"}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Thời gian hiện tại:</span>
                  <div className="font-medium">
                    {bookings.find(b => b.bookingId === rescheduleModal.bookingId)
                      ? dayjs(bookings.find(b => b.bookingId === rescheduleModal.bookingId)?.bookingDate)
                          .format("HH:mm - DD/MM/YYYY")
                      : "Không xác định"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Divider orientation="center">Chọn thời gian mới</Divider>
          
          {/* Chọn ngày */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="newDate" className="font-medium">Ngày tư vấn mới:</label>
              <Tag color="orange" className="ml-auto">Bắt buộc</Tag>
            </div>
            <DatePicker
              id="newDate"
              className="w-full"
              value={newDate}
              onChange={(date) => setNewDate(date)}
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày tư vấn mới"
              size="large"
            />
            {!newDate && (
              <div className="text-red-500 text-xs mt-1">
                Vui lòng chọn ngày tư vấn
              </div>
            )}
          </div>

          {/* Chọn khung giờ */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="timeSlot" className="font-medium">Khung giờ mới:</label>
              <Tag color="orange" className="ml-auto">Bắt buộc</Tag>
            </div>
            <Select
              id="timeSlot"
              placeholder="Chọn khung giờ tư vấn mới"
              className="w-full"
              value={selectedSlot}
              onChange={(value) => setSelectedSlot(value)}
              size="large"
            >
              {timeSlots.map((slot) => (
                <Option key={slot} value={slot}>
                  <span className="font-medium">{slot}</span>
                </Option>
              ))}
            </Select>
            {!selectedSlot && (
              <div className="text-red-500 text-xs mt-1">
                Vui lòng chọn khung giờ tư vấn
              </div>
            )}
          </div>

          {/* Hiển thị thời gian đã chọn */}
          {newDate && selectedSlot && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
              <div className="text-blue-700 mb-2 font-medium">Thời gian tư vấn mới:</div>
              <div className="text-lg font-semibold flex items-center">
                <ClockCircleOutlined className="mr-2 text-blue-500" />
                {dayjs(newDate).format("DD/MM/YYYY")} {selectedSlot}
              </div>
            </div>
          )}

          <div className="text-gray-500 text-sm pt-2">
             Sau khi đổi lịch, bạn sẽ nhận được email xác nhận về lịch tư vấn mới.
          </div>
        </div>
      </Modal>

      {/* Thay thế Modal đánh giá cũ bằng FeedbackModal */}
      <FeedbackModal
        visible={feedbackVisible}
        onCancel={() => setFeedbackVisible(false)}
        onSubmit={handleSubmitFeedback}
        data={selectedBooking}
        type="consultant"
        loading={submittingFeedback}
        mode="create"
      />
    </Card>
  );
};

export default HistoryConsultantBooking;
