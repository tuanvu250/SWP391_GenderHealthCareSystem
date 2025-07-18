import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Spin,
  message,
  Button,
  Popconfirm,
  Input,
  Select,
  Space,
  Row,
  Col,
  DatePicker,
  Tooltip,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getConsultantSchedule,
  updateBookingStatus,
} from "../../../components/api/ConsultantBooking.api";

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ConsultantBookingSchedule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(""); // Trạng thái lọc
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchMySchedule = async () => {
    try {
      setLoading(true);
      const res = await getConsultantSchedule({
        customerName: searchText,
        status,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DDT00:00") : "",
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DDT00:00") : "",
        page: pagination.current - 1, 
        size: pagination.pageSize,
      });
      setPagination({
        ...pagination,
        total: res?.data?.data.totalElements || 0,
      });
      const data = res.data.data.content.map((item, index) => ({
        ...item,
        key: item.bookingId,
        bookingTimeStart: dayjs(item.bookingDate).format("HH:mm"),
        bookingTimeEnd: dayjs(item.bookingDate).add(1, "hour").format("HH:mm"),
      }));
      console.log("Lịch tư vấn:", data);
      setBookings(data);
    } catch (err) {
      console.error("Lỗi tải lịch tư vấn của bạn:", err);
      message.error(
        err?.response?.data?.message || "Không thể tải lịch tư vấn."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySchedule();
  }, [
    pagination.current,
    pagination.pageSize,
    searchText,
    status,
    startDate,
    endDate,
  ]);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
    });
  };

  // Cập nhật hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Xử lý khi chọn khoảng ngày
  const handleDateRangeChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Xử lý khi chọn trạng thái
  const handleStatusFilterChange = (value) => {
    setStatus(value);
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      message.success(`Cập nhật trạng thái thành công`);
      fetchMySchedule();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err?.response?.data || err);
      message.error("Không thể cập nhật trạng thái.");
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "PROCESSING":
        return (
          <Tag icon={<ClockCircleOutlined />} color="blue">
            Chờ xác nhận
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
            Đã hoàn thành
          </Tag>
        );
      case "SCHEDULED":
        return <Tag color="purple">Đã lên lịch</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // Thêm function renderPaymentStatus vào sau renderStatus
  const renderPaymentStatus = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return <Tag color="green">Đã thanh toán</Tag>;
      case "UNPAID":
        return <Tag color="orange">Chờ thanh toán</Tag>;
      case "REFUND_PENDING":
        return <Tag color="blue">Đang xử lí hoàn tiền</Tag>;
      default:
        return <Tag color="default">{paymentStatus || "Không xác định"}</Tag>;
    }
  };

  // Cập nhật mảng columns để thêm cột paymentStatus
  const columns = [
    {
      title: "#",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Ngày hẹn",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ",
      key: "time",
      render: (_, record) =>
        `${record.bookingTimeStart || "?"} - ${record.bookingTimeEnd || "?"}`,
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
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex gap-2 flex-wrap">
            {/* Thay thế nút xem chi tiết bằng nút tham gia cuộc họp nếu là SCHEDULED */}
            {record.status === "SCHEDULED" && record.meetLink && (
              <Tooltip title="Tham gia cuộc họp">
                <Button
                  type="primary"
                  icon={<VideoCameraOutlined />}
                  size="small"
                  onClick={() => openMeetLink(record.meetLink)}
                >
                  Tham gia
                </Button>
              </Tooltip>
            )}

            {record.status === "SCHEDULED" && (
              <>
                <Popconfirm
                  title="Xác nhận hoàn thành lịch hẹn này?"
                  onConfirm={() =>
                    handleUpdateStatus(record.bookingId, "COMPLETED")
                  }
                  okText="Hoàn thành"
                  cancelText="Hủy"
                >
                  <Button type="primary" size="small" className="bg-green-600">
                    Hoàn thành
                  </Button>
                </Popconfirm>
              </>
            )}
            {record.status !== "COMPLETED" && (
              <Popconfirm
                title="Xác nhận hủy lịch hẹn này?"
                onConfirm={() =>
                  handleUpdateStatus(record.bookingId, "CANCELLED")
                }
                okText="Đồng ý"
                cancelText="Không"
              >
                <Button danger size="small">
                  Hủy
                </Button>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  // Hàm mở link cuộc họp trong tab mới - đã sửa
  const openMeetLink = (meetLink) => {
    if (!meetLink) {
      message.warning("Không có link cuộc họp cho lịch hẹn này");
      return;
    }

    // Kiểm tra xem link có chứa protocol hay không
    if (!meetLink.startsWith("http://") && !meetLink.startsWith("https://")) {
      // Nếu không có, thêm https:// vào đầu
      meetLink = "https://" + meetLink;
    }

    // Mở link trong tab mới
    window.open(meetLink, "_blank");
  };

  return (
    <div className="p-6">
      <Card className="shadow-md">
        <Title level={4} className="flex items-center gap-2 mb-4">
          <CalendarOutlined className="text-blue-500" />
          Lịch tư vấn của bạn
        </Title>

        {/* Thanh tìm kiếm theo thiết kế mới */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <Search
              placeholder="Tìm kiếm theo tên khách hàng"
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />

            <RangePicker
              onChange={handleDateRangeChange}
              placeholder={["Từ ngày", "Đến ngày"]}
              format="DD/MM/YYYY"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              placeholder="Lọc trạng thái đặt lịch"
              style={{ minWidth: 200 }}
              onChange={handleStatusFilterChange}
              defaultValue={""}
              allowClear
            >
              <Option value="PROCESSING">Chờ xác nhận</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
              <Option value="SCHEDULED">Đã lên lịch</Option>
              <Option value="">Tất cả</Option>
            </Select>
          </div>
        </div>

        {/* Table hiển thị dữ liệu */}
        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
            <div className="mt-2">Đang tải dữ liệu...</div>
          </div>
        ) : bookings.length > 0 ? (
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="bookingId"
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: "max-content" }}
          />
        ) : (
          <Empty
            description="Không tìm thấy lịch tư vấn nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
}
