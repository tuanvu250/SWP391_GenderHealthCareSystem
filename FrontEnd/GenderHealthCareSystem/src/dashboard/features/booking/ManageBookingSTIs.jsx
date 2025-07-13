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
  Dropdown,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  DownOutlined,
  EditOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ViewBookingStisModal from "../../components/modal/ViewBookingStisModal";
import ResultStisModal from "../../components/modal/ResultStisModal";
import InvoiceModal from "../../components/modal/InvoiceModal";
import { formatPrice } from "../../../components/utils/format";
import {
  manageBookingsAPI,
  markConfirmedBookingStisAPI,
  markDeniedBookingStisAPI,
  markNoShowBookingStisAPI,
  markPendingResultBookingStisAPI,
  viewResultStisAPI,
} from "../../../components/api/BookingTesting.api";
import { getUserByIdAPI } from "../../../components/api/Auth.api";
import { getServiceTestingByIdAPI } from "../../../components/api/ServiceTesting.api";
import ViewResultStisModal from "../../components/modal/ViewResultStisModal";
import {
  getInvoiceTestingAPI,
  markPaymentCashedAPI,
} from "../../../components/api/Payment.api";

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
    pageSize: 6,
    total: 0,
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [serviceData, setServiceData] = useState(null);
  const [isViewResultModal, setIsViewResultModal] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});

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
    PENDING_TEST_RESULT: {
      text: "Chờ kết quả",
      color: "yellow",
      icon: <ClockCircleOutlined />,
    },
    FAILED_PAYMENT: {
      text: "Thanh toán thất bại",
      color: "grey",
      icon: <ClockCircleOutlined />,
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

  // Load dữ liệu
  const loadData = async () => {
    setLoading(true);

    try {
      const response = await manageBookingsAPI({
        name: searchText,
        page: pagination.current - 1,
        size: pagination.pageSize,
        status: statusFilter,
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
          discount: booking.discount || 0,
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

  const handleNoShow = async (bookingId) => {
    try {
      await markNoShowBookingStisAPI(bookingId);
      loadData();
      message.success("Lịch đã được đánh dấu là không đến");
    } catch (error) {
      console.error("Error marking booking as no show:", error);
      message.error("Không thể đánh dấu lịch hẹn là không đến");
    }
  };

  const handleDenied = async (bookingId) => {
    try {
      await markDeniedBookingStisAPI(bookingId);
      loadData();
      message.success("Lịch đã được từ chối thành công");
    } catch (error) {
      console.error("Error denying booking:", error);
      message.error("Không thể từ chối lịch hẹn");
    }
  };

  const handleConfirmPayment = async (record) => {
    try {
      // Tính giá đã giảm
      const hasDiscount = record.discount > 0;
      const discountedPrice = hasDiscount
        ? record.servicePrice * (1 - record.discount / 100)
        : record.servicePrice;

      const data = {
        bookingId: record.bookingId,
        totalAmount: discountedPrice, // Sử dụng giá đã giảm
      };
      await markPaymentCashedAPI(data);
      loadData();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Không thể xác nhận thanh toán"
      );
    }
  };

  const handleResultPending = async (bookingId) => {
    try {
      await markPendingResultBookingStisAPI(bookingId);
      loadData();
      message.success("Lịch đã được đánh dấu là chờ kết quả");
    } catch (error) {
      console.error("Error marking booking as pending result:", error);
      message.error(
        error.response?.data?.message ||
          "Không thể đánh dấu lịch hẹn là chờ kết quả"
      );
    }
  };

  const handleGetDataResult = async (booking) => {
    try {
      const response = await getUserByIdAPI(booking.customerId);
      setCustomer(response.data.data);
      const res = await getServiceTestingByIdAPI(booking.serviceId);
      setServiceData(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setSelectedBooking(booking);
  };

  const handleViewBooking = async (booking) => {
    handleGetDataResult(booking);
    setSelectedBooking(booking);
    setViewModalVisible(true);
  };

  const handleEnterResultStis = async (booking) => {
    handleGetDataResult(booking);
    setResultModalVisible(true);
  };

  const handleViewResultStis = async (booking) => {
    try {
      handleGetDataResult(booking);
      const response = await viewResultStisAPI(booking.bookingId);
      setSelectedBooking(booking);
      setResultData(response.data.data || []);
      setAttachmentUrl(response.data.data[0]?.pdfResultUrl || "");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Không thể tải kết quả xét nghiệm"
      );
    }
    setIsViewResultModal(true);
  };

  // Hàm xử lý hiển thị hóa đơn
  const handleViewInvoice = async (record) => {
    try {
      handleGetDataResult(record);
      const response = await getInvoiceTestingAPI(record.stisInvoiceID);
      setInvoiceData({
        ...response.data,
        serviceName: record.serviceName,
      });
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể tải hóa đơn");
      return;
    }
    // Hiển thị modal hóa đơn
    setInvoiceVisible(true);
  };

  // Hàm lấy menu items dựa trên trạng thái của record
  const getActionMenuItems = (record) => {
    const items = [];

    if (record.status === "CONFIRMED") {
      items.push({
        key: "pendingResult",
        label: "Chờ kết quả",
        icon: <ClockCircleOutlined />,
      });
      items.push({
        key: "noShow",
        label: "Không đến",
        icon: <CloseCircleOutlined />,
      });
      if (record.paymentStatus === "UNPAID" && record.paymentMethod === "cash") {
        items.push({
          key: "confirm-payment",
          label: "Xác nhận thanh toán",
          icon: <CheckCircleOutlined />,
        });
      }
    }

    if (record.status === "PENDING") {
      items.push({
        key: "confirm",
        label: "Xác nhận",
        icon: <CheckCircleOutlined />,
      });
      items.push({
        key: "deny",
        label: "Từ chối",
        icon: <CloseCircleOutlined />,
      });
    }

    if (record.status === "PENDING_TEST_RESULT") {
      items.push({
        key: "enterResult",
        label: "Nhập kết quả",
        icon: <EditOutlined />,
      });
    }

    return items;
  };

  // Hàm xử lý khi chọn menu item
  const handleMenuClick = (key, record) => {
    switch (key) {
      case "confirm":
        handleConfirm(record.id);
        break;
      case "deny":
        handleDenied(record.id);
        break;
      case "pendingResult":
        handleResultPending(record.id);
        break;
      case "noShow":
        handleNoShow(record.id);
        break;
      case "enterResult":
        handleEnterResultStis(record);
        break;
      case "confirm-payment":
        handleConfirmPayment(record);
        break;
      default:
        break;
    }
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
      render: (price, record) => {
        // Kiểm tra có giảm giá không
        const hasDiscount = record.discount && record.discount > 0;
        const discountedPrice = hasDiscount
          ? price * (1 - record.discount / 100)
          : price;

        return (
          <div>
            {/* Giá đã giảm */}
            <span className="font-medium">
              {formatPrice(discountedPrice)}
            </span>
          </div>
        );
      },
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
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          {/* Nút xem chi tiết luôn hiển thị */}
          <Button
            type="primary"
            size="small"
            onClick={() => handleViewBooking(record)}
          >
            Chi tiết
          </Button>

          {/* Nút hóa đơn chỉ hiển thị khi đã thanh toán */}
          {record.paymentStatus === "PAID" && (
            <Button
              type="default"
              size="small"
              onClick={() => handleViewInvoice(record)}
            >
              Hóa đơn
            </Button>
          )}

          {/* Nếu đã hoàn thành, hiển thị nút xem kết quả */}
          {record.status === "COMPLETED" ? (
            <Button
              type="default"
              size="small"
              onClick={() => handleViewResultStis(record)}
            >
              Xem kết quả
            </Button>
          ) : (
            // Dropdown menu cho các hành động cập nhật trạng thái
            getActionMenuItems(record).length > 0 && (
              <Dropdown
                menu={{
                  items: getActionMenuItems(record),
                  onClick: ({ key }) => handleMenuClick(key, record),
                }}
                placement="bottomRight"
                arrow
              >
                <Button type="default" size="small">
                  Cập nhật <DownOutlined />
                </Button>
              </Dropdown>
            )
          )}
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
              <Option value="NO_SHOW">Không đến</Option>
              <Option value="PENDING_TEST_RESULT">Chờ kết quả</Option>
              <Option value="">Tất cả</Option>
            </Select>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pagination) => setPagination(pagination)}
          scroll={{ x: "max-content" }}
          size="middle"
        />

        {/* Modals */}
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
          serviceData={serviceData}
          onSave={() => {
            loadData();
          }}
        />

        <ViewResultStisModal
          open={isViewResultModal}
          onCancel={() => setIsViewResultModal(false)}
          booking={selectedBooking}
          customer={customer}
          serviceData={serviceData}
          resultData={resultData}
          attachmentUrl={attachmentUrl}
        />

        <InvoiceModal
          visible={invoiceVisible}
          onCancel={() => setInvoiceVisible(false)}
          invoice={invoiceData}
          customer={customer}
          booking={selectedBooking}
        />
      </Card>
    </div>
  );
};

export default ManageBookingStis;
