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
  DatePicker,
  Tooltip,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  LinkOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getAllBookings, updateBookingStatus } from "../../../components/api/ConsultantBooking.api";
import { useAuth } from "../../../components/provider/AuthProvider";
import UpdateMeetLinkModal from "../../components/modal/UpdateMeetLinkModal";

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ManageBookingConsultant() {
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  const isStaff = user?.role === "Staff"; // Kiểm tra xem người dùng có phải là staff không
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(""); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // State cho modal cập nhật link meet
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings({
        consultantName: searchText,
        status: status,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DDT00:00') : '',
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DDT00:00') : '',
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      setPagination({
        ...pagination,
        total: res?.data?.totalElements || 0,
      });
      const data = res.data.content.map((item) => ({
        ...item,
        key: item.bookingId,
        bookingTimeStart: dayjs(item.bookingDate).format("HH:mm"),
        bookingTimeEnd: dayjs(item.bookingDate).add(1, 'hour').format("HH:mm"),
      }));
      setBookings(data);
    } catch (err) {
      console.error("Lỗi tải danh sách lịch tư vấn:", err);
      message.error(err?.response?.data?.message || "Không thể tải danh sách lịch tư vấn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pagination.current, pagination.pageSize, searchText, status, startDate, endDate]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({
      ...pagination,
      current: 1,
    });
  };

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
      message.success(`Cập nhật trạng thái thành công: ${status}`);
      fetchBookings();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      message.error(err?.response?.data?.message || "Không thể cập nhật trạng thái.");
    }
  };

  const showMeetLinkModal = (booking) => {
    setCurrentBooking(booking);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentBooking(null);
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false);
    setCurrentBooking(null);
    fetchBookings(); // Tải lại dữ liệu để cập nhật danh sách
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
        return (
          <Tag color="purple">
            Đã lên lịch
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const renderPaymentStatus = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return (
          <Tag color="green">
            Đã thanh toán
          </Tag>
        );
      case "UNPAID":
        return (
          <Tag color="orange">
            Chờ thanh toán
          </Tag>
        );
      case "REFUNDED":
        return (
          <Tag color="blue">
            Đã hoàn tiền
          </Tag>
        );
      default:
        return <Tag color="default">{paymentStatus || "Không xác định"}</Tag>;
    }
  };

  // Tạo columns cơ bản không có cột hành động
  let columns = [
    {
      title: "#",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 80,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Consultant",
      dataIndex: "consultantName",
      key: "consultantName",
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
      title: "Link Meet",
      dataIndex: "meetLink",
      key: "meetLink",
      render: (meetLink) => (
        <div className="max-w-[200px] truncate">
          {meetLink ? (
            <Tooltip title={meetLink}>
              <Text className="text-blue-500">
                <LinkOutlined className="mr-1" />
                {meetLink.substring(0, 25)}...
              </Text>
            </Tooltip>
          ) : (
            <Text type="secondary">Chưa có</Text>
          )}
        </div>
      ),
    },
  ];

  // Nếu người dùng là Staff, thêm cột hành động
  if (isStaff) {
    columns.push({
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex gap-2 flex-wrap">
            {/* Hiển thị nút Cập nhật link cho tất cả trạng thái trừ CANCELLED và COMPLETED */}
            {record.status !== "CANCELLED" && record.status !== "COMPLETED" && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => showMeetLinkModal(record)}
              >
                Cập nhật link
              </Button>
            )}
            
            {record.status === "CONFIRMED" && (
              <Popconfirm
                title="Xác nhận đã lên lịch cho buổi tư vấn này?"
                onConfirm={() => handleUpdateStatus(record.bookingId, "SCHEDULED")}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button type="primary" size="small" className="bg-purple-600">
                  Lên lịch
                </Button>
              </Popconfirm>
            )}
          </div>
        );
      },
    });
  }

  return (
    <div className="p-6">
      <Card className="shadow-md">
        <Title level={4} className="flex items-center gap-2 mb-4">
          <CalendarOutlined className="text-blue-500" />
          Quản lý lịch tư vấn
        </Title>

        {/* Thanh tìm kiếm */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <Search
              placeholder="Tìm kiếm theo tên consultant"
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
              <Option value="SCHEDULED">Đã lên lịch</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
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

      {/* Sử dụng component Modal riêng biệt */}
      <UpdateMeetLinkModal
        visible={isModalVisible}
        booking={currentBooking}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}