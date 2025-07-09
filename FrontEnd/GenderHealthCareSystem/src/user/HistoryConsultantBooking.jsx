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
  Rate,
  Input,
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, bookingId: null });
  const [ratingModal, setRatingModal] = useState({ open: false, bookingId: null, consultantId: null });
  const [newDate, setNewDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingContent, setRatingContent] = useState("");
  const navigate = useNavigate();

  const fetchBookings = async () => {
    const token = sessionStorage.getItem("token");
    const userString = sessionStorage.getItem("user");

    if (!token || !userString) {
      message.error("Bạn chưa đăng nhập hoặc phiên đã hết hạn.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`/api/bookings/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 0,
          size: 10,
          sort: "createdAt,desc",
        },
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
  }, [navigate]);

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
          const token = sessionStorage.getItem("token");
          await axios.put(`/api/bookings/cancel/${bookingId}`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          message.success("Đã hủy lịch thành công!");
          fetchBookings();
        } catch (err) {
          console.error(err);
          message.error("Không thể hủy lịch.");
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
    const dateTimeStr = dayjs(newDate.format("YYYY-MM-DD") + "T" + startTime).format("YYYY-MM-DDTHH:mm:ss");

    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `/api/bookings/reschedule`,
        {
          bookingId: rescheduleModal.bookingId,
          newBookingDate: dateTimeStr,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const handleOpenRatingModal = (bookingId, consultantId) => {
    setRatingModal({ open: true, bookingId, consultantId });
    setRatingValue(0);
    setRatingContent("");
  };

  const handleSubmitRating = async () => {
    if (!ratingValue || !ratingContent.trim()) {
      message.warning("Vui lòng chọn sao và nhập nội dung đánh giá.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `/api/reviews`,
        {
          bookingId: ratingModal.bookingId,
          consultantId: ratingModal.consultantId,
          rating: ratingValue,
          content: ratingContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Đánh giá đã được gửi!");
      setRatingModal({ open: false, bookingId: null, consultantId: null });
      fetchBookings();
    } catch (err) {
      console.error(err);
      message.error("Không thể gửi đánh giá.");
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag icon={<ClockCircleOutlined />} color="blue">Đang xử lý</Tag>;
      case "CONFIRMED":
        return <Tag icon={<CheckCircleOutlined />} color="green">Đã xác nhận</Tag>;
      case "CANCELLED":
        return <Tag icon={<CloseCircleOutlined />} color="red">Đã hủy</Tag>;
      case "COMPLETED":
        return <Tag icon={<CheckCircleOutlined />} color="cyan">Hoàn thành</Tag>;
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
          <Button type="link" href={text} target="_blank" icon={<VideoCameraOutlined />}>
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
        const canAct = record.paymentStatus === "PAID" && record.status !== "CANCELLED";
        return (
          <div className="flex gap-2">
            {record.status === "COMPLETED" && canAct && (
              <Button
                size="small"
                icon={<StarOutlined />}
                onClick={() => handleOpenRatingModal(record.bookingId, record.consultantId)}
              >
                Đánh giá
              </Button>
            )}
            {canAct && record.status !== "COMPLETED" && (
              <>
                <Button danger size="small" onClick={() => handleCancelBooking(record.bookingId)}>
                  Hủy
                </Button>
                <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenReschedule(record.bookingId)}>
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
        <Text type="secondary">Xem, hủy, đổi lịch hoặc đánh giá chuyên gia.</Text>
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
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
          className="mt-4"
        />
      ) : (
        <Empty description="Bạn chưa có lịch tư vấn nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      {/* Modal đổi lịch */}
      <Modal
        open={rescheduleModal.open}
        title="Chọn ngày và khung giờ mới"
        onCancel={() => setRescheduleModal({ open: false, bookingId: null })}
        onOk={handleRescheduleSubmit}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <DatePicker
          className="w-full mb-4"
          value={newDate}
          onChange={(date) => setNewDate(date)}
          disabledDate={(current) => current && current < dayjs().startOf("day")}
        />
        <Select
          placeholder="-- Chọn khung giờ tư vấn *"
          className="w-full"
          value={selectedSlot}
          onChange={(value) => setSelectedSlot(value)}
        >
          {timeSlots.map((slot) => (
            <Option key={slot} value={slot}>
              {slot}
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Modal đánh giá */}
      <Modal
        open={ratingModal.open}
        title="Đánh giá chuyên gia"
        onCancel={() => setRatingModal({ open: false, bookingId: null, consultantId: null })}
        onOk={handleSubmitRating}
        okText="Gửi đánh giá"
        cancelText="Hủy"
      >
        <div className="mb-3">
          <Text strong>Chấm sao:</Text>
          <Rate value={ratingValue} onChange={(val) => setRatingValue(val)} />
        </div>
        <div>
          <Text strong>Nội dung:</Text>
          <TextArea
            rows={4}
            value={ratingContent}
            onChange={(e) => setRatingContent(e.target.value)}
            placeholder="Viết đánh giá của bạn về buổi tư vấn..."
          />
        </div>
      </Modal>
    </Card>
  );
};

export default HistoryConsultantBooking;
