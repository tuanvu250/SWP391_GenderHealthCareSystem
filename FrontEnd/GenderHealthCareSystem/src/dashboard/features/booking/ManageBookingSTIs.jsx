import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Card,
  Typography,
  Space,
  Select,
  Input,
  DatePicker,
  message,
  Tooltip,
  Badge,
  Popconfirm,
  Modal,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ViewBookingStisModal from "../../components/modal/ViewBookingStisModal";
import ResultStisModal from "../../components/modal/ResultStisModal";
import { formatPrice } from "../../../components/utils/format"; // Import hàm định dạng giá
import {
  manageBookingsAPI,
  markCompletedBookingStisAPI,
  markConfirmedBookingStisAPI,
  markDeniedBookingStisAPI,
  markNoShowBookingStisAPI,
} from "../../../components/api/BookingTesting.api";
import { getUserByIdAPI } from "../../../components/api/Auth.api";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const ManageBookingStis = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  // Cấu hình trạng thái đặt lịch
  const bookingStatusConfig = {
    PENDING: {
      text: "Chờ xác nhận",
      color: "blue",
      icon: <ClockCircleOutlined />,
    },
    CONFIRMED: {
      text: "Đã xác nhận",
      color: "purple",
      icon: <CheckCircleOutlined />,
    },
    COMPLETED: {
      text: "Hoàn thành",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    CANCELLED: {
      text: "Đã hủy",
      color: "red",
      icon: <CloseCircleOutlined />,
    },
    DENIED: {
      text: "Đã từ chối",
      color: "red",
      icon: <CloseCircleOutlined />,
    },
    NO_SHOW: {
      text: "Không đến",
      color: "orange",
      icon: <CloseCircleOutlined />,
    },
  };

  // Cấu hình trạng thái thanh toán
  const paymentStatusConfig = {
    PAID: {
      text: "Đã thanh toán",
      color: "green",
    },
    UNPAID: {
      text: "Chưa thanh toán",
      color: "orange",
    },
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý lọc theo ngày
  const handleDateRangeChange = (dates) => {
    setStartDate(dayjs(dates[0]).format("YYYY-MM-DDT00:00"));
    setEndDate(dayjs(dates[1]).format("YYYY-MM-DDT00:00"));
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý lọc theo trạng thái đặt lịch
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý lọc theo trạng thái thanh toán
  const handlePaymentFilterChange = (value) => {
    setPaymentFilter(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Load dữ liệu (mô phỏng API call)
  const loadData = async () => {
    setLoading(true);

    try {
      // Mô phỏng API call với delay
      const response = await manageBookingsAPI({
        name: searchText,
        page: pagination.current - 1,
        size: pagination.pageSize,
        status: statusFilter,
        //sort: "bookingDate,desc",
        startDate: startDate,
        endDate: endDate,
      });
      setPagination({
        ...pagination,
        total: response.data.totalElements,
      });

      setBookings(
        response.data.data.content.map((booking) => ({
          ...booking,
          id: booking.bookingId,
          bookingTime: `${booking.bookingTimeStart} - ${booking.bookingTimeEnd}`,
        }))
      );
    } catch (error) {
      console.error("Error loading bookings:", error);
      message.error(
        error.response?.data?.message || "Không thể tải dữ liệu đặt lịch"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.current, searchText, statusFilter, startDate, endDate]);

  const handleConfirm = async (bookingId) => {
    try {
      await markConfirmedBookingStisAPI(bookingId);
      loadData();
      message.success("Lịch đã được xác nhận thành công");
    } catch (error) {
      console.error("Error confirming booking:", error);
      message.error("Không thể xác nhận lịch hẹn");
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await markCompletedBookingStisAPI(bookingId);
      loadData();
      message.success("Lịch đã được đánh dấu hoàn thành");
    } catch (error) {
      console.error("Error completing booking:", error);
      message.error("Không thể đánh dấu lịch hẹn là hoàn thành");
    }
  };

  const handleNoShow = async (bookingId) => {
    try {
      // Gọi API để đánh dấu lịch hẹn là không đến
      await markNoShowBookingStisAPI(bookingId);
      loadData();
      message.success("Lịch đã được đánh dấu là không đến");
    } catch (error) {
      console.error("Error marking booking as no show:", error);
      message.error("Không thể đánh dấu lịch hẹn là không đến");
    }
  }

  const handleDenied = async (bookingId) => {
    try {
      // Gọi API để đánh dấu lịch hẹn là từ chối
      await markDeniedBookingStisAPI(bookingId);
      loadData();
      message.success("Lịch đã được từ chối thành công");
    } catch (error) {
      console.error("Error denying booking:", error);
      message.error("Không thể từ chối lịch hẹn");
    }
  }

  const handleEnterResult = async (booking) => {
    try {
      const response = await getUserByIdAPI(booking.customerId);
      if (response.data) {
        setCustomer(response.data);
      }
    } catch (cerror) {
      console.error("Error fetching customer data:", cerror);
    }
    setSelectedBooking(booking);
    setResultModalVisible(true);
  };

  const handleViewBooking = async (booking) => {
    try {
      const response = await getUserByIdAPI(booking.customerId);
      if (response.data) {
        setCustomer(response.data);
      }
    } catch (cerror) {
      console.error("Error fetching customer data:", cerror);
    }
    setSelectedBooking(booking);
    setViewModalVisible(true);
  };

  // Cột cho bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
      render: (text, record) => (
        <Tooltip title={`SĐT: ${record.customerPhone}`}>
          <span className="font-medium">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      width: 130,
    },
    {
      title: "Giá",
      dataIndex: "servicePrice",
      key: "servicePrice",
      width: 100,
      render: (price) => (
        <span className="font-medium">{formatPrice(price)}</span>
      ),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 150,
      render: (status) => {
        const config = paymentStatusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Trạng thái đặt lịch",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const config = bookingStatusConfig[status];
        return (
          <Badge
            status={config.color}
            text={
              <Tag icon={config.icon} color={config.color}>
                {config.text}
              </Tag>
            }
          />
        );
      },
      filters: [
        { text: "Chờ xác nhận", value: "pending" },
        { text: "Đã xác nhận", value: "confirmed" },
        { text: "Hoàn thành", value: "completed" },
        { text: "Đã hủy", value: "cancelled" },
        { text: "Không đến", value: "no_show" },
      ],
      onFilter: (value, record) => record.bookingStatus === value,
    },
    {
      title: "Ngày giờ hẹn",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 130,
      render: (_, record) => (
        <span>
          {dayjs(record.bookingDate).format("DD/MM/YYYY")}
          <br />
          {record.bookingTime}
        </span>
      ),
      sorter: (a, b) =>
        dayjs(a.bookingDate).unix() - dayjs(b.bookingDate).unix(),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewBooking(record)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            {record.status === "CONFIRMED" && (
              <div className="flex flex-col gap-1">
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleComplete(record.id)}
                >
                  Hoàn thành
                </Button>
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleNoShow(record.id)}
                >
                  Không đến
                </Button>
              </div>
            )}
            {record.status === "PENDING" && (
              <div className="flex flex-col gap-1">
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleConfirm(record.id)}
                >
                  Xác nhận
                </Button>
                <Button
                  type="default"
                  size="small"
                  onClick={() => handleDenied(record.id)}
                >
                  Từ chối
                </Button>
              </div>
            )}
            {record.status === "COMPLETED" && (
              <Button
                type="default"
                size="small"
                onClick={() => handleEnterResult(record)}
              >
                Nhập kết quả
              </Button>
            )}
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="mb-6">
          <Title level={4}>Quản lý đặt lịch xét nghiệm STIs</Title>
          <Text type="secondary">
            Quản lý các lịch hẹn xét nghiệm STIs và cập nhật trạng thái
          </Text>
        </div>

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
              mode="single"
              placeholder="Lọc trạng thái đặt lịch"
              style={{ minWidth: 200 }}
              onChange={handleStatusFilterChange}
              defaultValue={""}
            >
              <Option value="PENDING">Chờ xác nhận</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
              <Option value="no_show">Không đến</Option>
              <Option value="">Tất cả</Option>
            </Select>

            {/* <Select
              mode="multiple"
              placeholder="Lọc trạng thái thanh toán"
              style={{ minWidth: 200 }}
              allowClear
              onChange={handlePaymentFilterChange}
            >
              <Option value="paid">Đã thanh toán</Option>
              <Option value="unpaid">Chưa thanh toán</Option>
              <Option value="refunded">Đã hoàn tiền</Option>
            </Select> */}
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
          scroll={{ x: 1300 }}
          size="middle"
        />
        <ViewBookingStisModal
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          booking={selectedBooking}
          customer={customer}
        />
        <ResultStisModal
          open={resultModalVisible}
          onCancel={() => setResultModalVisible(false)}
          booking={selectedBooking}
          customer={customer}
        />
      </Card>
    </div>
  );
};

export default ManageBookingStis;
