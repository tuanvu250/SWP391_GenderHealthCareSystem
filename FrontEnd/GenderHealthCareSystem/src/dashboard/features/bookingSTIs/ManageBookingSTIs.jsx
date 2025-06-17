import React, { useState, useEffect } from 'react';
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
  Modal 
} from 'antd';
import { 
  SearchOutlined, 
  EditOutlined,
  CalendarOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const ManageBookingStis = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [updateModal, setUpdateModal] = useState({
    visible: false,
    booking: null,
    status: '',
  });

  // Mock data cho đặt lịch xét nghiệm STIs
  const mockBookings = [
    {
      id: "STI-001",
      customerId: 1,
      customerName: "Nguyễn Văn A",
      customerPhone: "0987654321",
      serviceName: "Gói xét nghiệm STI cơ bản",
      packageId: 1,
      price: 899000,
      paymentStatus: "paid",
      paymentMethod: "vnpay",
      bookingStatus: "confirmed",
      bookingDate: "2023-06-18",
      bookingTime: "09:00 - 10:00",
      createdAt: "2023-06-15T10:30:00",
      notes: "Khách hàng đề nghị kết quả gấp",
    },
    {
      id: "STI-002",
      customerId: 2,
      customerName: "Trần Thị B",
      customerPhone: "0912345678",
      serviceName: "Gói xét nghiệm STI tổng quát",
      packageId: 2,
      price: 1599000,
      paymentStatus: "unpaid",
      paymentMethod: "cash",
      bookingStatus: "pending",
      bookingDate: "2023-06-19",
      bookingTime: "14:30 - 15:30",
      createdAt: "2023-06-16T08:45:00",
      notes: "",
    },
    {
      id: "STI-003",
      customerId: 3,
      customerName: "Phạm Văn C",
      customerPhone: "0978123456",
      serviceName: "Gói xét nghiệm STI cơ bản",
      packageId: 1,
      price: 899000,
      paymentStatus: "paid",
      paymentMethod: "vnpay",
      bookingStatus: "completed",
      bookingDate: "2023-06-17",
      bookingTime: "10:00 - 11:00",
      createdAt: "2023-06-14T15:20:00",
      notes: "Kết quả đã được gửi qua email",
    },
    {
      id: "STI-004",
      customerId: 4,
      customerName: "Lê Thị D",
      customerPhone: "0965432109",
      serviceName: "Gói xét nghiệm STI tổng quát",
      packageId: 2,
      price: 1599000,
      paymentStatus: "paid",
      paymentMethod: "vnpay",
      bookingStatus: "cancelled",
      bookingDate: "2023-06-20",
      bookingTime: "08:00 - 09:00",
      createdAt: "2023-06-16T09:10:00",
      cancelReason: "Khách hàng có việc đột xuất",
      notes: "",
    },
    {
      id: "STI-005",
      customerId: 5,
      customerName: "Hoàng Văn E",
      customerPhone: "0943215678",
      serviceName: "Gói xét nghiệm STI cơ bản",
      packageId: 1,
      price: 899000,
      paymentStatus: "unpaid",
      paymentMethod: "cash",
      bookingStatus: "confirmed",
      bookingDate: "2023-06-21",
      bookingTime: "13:30 - 14:30",
      createdAt: "2023-06-17T11:05:00",
      notes: "",
    },
    {
      id: "STI-006",
      customerId: 6,
      customerName: "Đỗ Thị F",
      customerPhone: "0932145678",
      serviceName: "Gói xét nghiệm STI tổng quát",
      packageId: 2,
      price: 1599000,
      paymentStatus: "paid",
      paymentMethod: "vnpay",
      bookingStatus: "pending",
      bookingDate: "2023-06-22",
      bookingTime: "15:30 - 16:30",
      createdAt: "2023-06-18T08:30:00",
      notes: "",
    },
    {
      id: "STI-007",
      customerId: 7,
      customerName: "Nguyễn Thị G",
      customerPhone: "0954321876",
      serviceName: "Gói xét nghiệm STI cơ bản",
      packageId: 1,
      price: 899000,
      paymentStatus: "unpaid",
      paymentMethod: "cash",
      bookingStatus: "no_show",
      bookingDate: "2023-06-16",
      bookingTime: "09:00 - 10:00",
      createdAt: "2023-06-14T14:40:00",
      notes: "Khách hàng không đến theo lịch hẹn",
    },
    {
      id: "STI-008",
      customerId: 8,
      customerName: "Trần Văn H",
      customerPhone: "0923456789",
      serviceName: "Gói xét nghiệm STI tổng quát",
      packageId: 2,
      price: 1599000,
      paymentStatus: "paid",
      paymentMethod: "vnpay",
      bookingStatus: "completed",
      bookingDate: "2023-06-15",
      bookingTime: "10:00 - 11:00",
      createdAt: "2023-06-13T10:15:00",
      notes: "Khách hàng đề nghị giữ bí mật thông tin",
    },
    {
      id: "STI-009",
      customerId: 9,
      customerName: "Phạm Thị I",
      customerPhone: "0934567891",
      serviceName: "Gói xét nghiệm STI cơ bản",
      packageId: 1,
      price: 899000,
      paymentStatus: "unpaid",
      paymentMethod: "cash",
      bookingStatus: "confirmed",
      bookingDate: "2023-06-23",
      bookingTime: "14:30 - 15:30",
      createdAt: "2023-06-18T16:50:00",
      notes: "",
    },
    {
      id: "STI-010",
      customerId: 10,
      customerName: "Lê Văn K",
      customerPhone: "0945678912",
      serviceName: "Gói xét nghiệm STI tổng quát",
      packageId: 2,
      price: 1599000,
      paymentStatus: "paid",
      paymentMethod: "vnpay",
      bookingStatus: "pending",
      bookingDate: "2023-06-24",
      bookingTime: "08:00 - 09:00",
      createdAt: "2023-06-19T09:25:00",
      notes: "",
    },
  ];

  // Cấu hình trạng thái đặt lịch
  const bookingStatusConfig = {
    pending: {
      text: "Chờ xác nhận",
      color: "blue",
      icon: <ClockCircleOutlined />,
    },
    confirmed: {
      text: "Đã xác nhận",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    completed: {
      text: "Hoàn thành",
      color: "purple",
      icon: <CheckCircleOutlined />,
    },
    cancelled: {
      text: "Đã hủy",
      color: "red",
      icon: <CloseCircleOutlined />,
    },
    no_show: {
      text: "Không đến",
      color: "orange",
      icon: <CloseCircleOutlined />,
    },
  };

  // Cấu hình trạng thái thanh toán
  const paymentStatusConfig = {
    paid: {
      text: "Đã thanh toán",
      color: "green",
    },
    unpaid: {
      text: "Chưa thanh toán",
      color: "orange",
    },
    refunded: {
      text: "Đã hoàn tiền",
      color: "blue",
    },
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý lọc theo ngày
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
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
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Mô phỏng API call với delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Lọc dữ liệu theo các điều kiện
        let filteredData = [...mockBookings];
        
        // Lọc theo tên khách hàng hoặc ID
        if (searchText) {
          const searchLower = searchText.toLowerCase();
          filteredData = filteredData.filter(
            booking => 
              booking.customerName.toLowerCase().includes(searchLower) || 
              booking.id.toLowerCase().includes(searchLower)
          );
        }
        
        // Lọc theo trạng thái đặt lịch
        if (statusFilter && statusFilter.length > 0) {
          filteredData = filteredData.filter(booking => 
            statusFilter.includes(booking.bookingStatus)
          );
        }
        
        // Lọc theo trạng thái thanh toán
        if (paymentFilter && paymentFilter.length > 0) {
          filteredData = filteredData.filter(booking => 
            paymentFilter.includes(booking.paymentStatus)
          );
        }
        
        // Lọc theo khoảng ngày
        if (dateRange && dateRange[0] && dateRange[1]) {
          const startDate = dateRange[0].startOf('day');
          const endDate = dateRange[1].endOf('day');
          
          filteredData = filteredData.filter(booking => {
            const bookingDate = dayjs(booking.bookingDate);
            return bookingDate.isAfter(startDate) && bookingDate.isBefore(endDate);
          });
        }
        
        // Phân trang
        const { current, pageSize } = pagination;
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        
        const paginatedData = filteredData.slice(start, end);
        
        setBookings(paginatedData);
        setPagination({
          ...pagination,
          total: filteredData.length
        });
      } catch (error) {
        console.error("Error loading bookings:", error);
        message.error("Không thể tải dữ liệu đặt lịch");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [pagination.current, searchText, statusFilter, paymentFilter, dateRange]);

  // Xử lý cập nhật trạng thái đặt lịch
  const handleUpdateStatus = (booking) => {
    setUpdateModal({
      visible: true,
      booking,
      status: booking.bookingStatus,
    });
  };

  // Xác nhận cập nhật trạng thái
  const confirmUpdateStatus = async () => {
    setLoading(true);
    
    try {
      // Mô phỏng API call với delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cập nhật trạng thái trong danh sách
      const updatedBookings = bookings.map(b => {
        if (b.id === updateModal.booking.id) {
          return {
            ...b,
            bookingStatus: updateModal.status
          };
        }
        return b;
      });
      
      setBookings(updatedBookings);
      setUpdateModal({ visible: false, booking: null, status: '' });
      message.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Cập nhật trạng thái thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180,
      render: (text, record) => (
        <Tooltip title={`SĐT: ${record.customerPhone}`}>
          <span className="font-medium">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 250,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price) => <span className="font-medium">{formatPrice(price)}</span>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 170,
      render: (status) => {
        const config = paymentStatusConfig[status];
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Đã thanh toán', value: 'paid' },
        { text: 'Chưa thanh toán', value: 'unpaid' },
        { text: 'Đã hoàn tiền', value: 'refunded' },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
    {
      title: 'Trạng thái đặt lịch',
      dataIndex: 'bookingStatus',
      key: 'bookingStatus',
      width: 180,
      render: (status) => {
        const config = bookingStatusConfig[status];
        return (
          <Badge
            status={status === 'confirmed' ? 'processing' : 'default'}
            text={
              <Tag icon={config.icon} color={config.color}>
                {config.text}
              </Tag>
            }
          />
        );
      },
      filters: [
        { text: 'Chờ xác nhận', value: 'pending' },
        { text: 'Đã xác nhận', value: 'confirmed' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
        { text: 'Không đến', value: 'no_show' },
      ],
      onFilter: (value, record) => record.bookingStatus === value,
    },
    {
      title: 'Ngày đặt lịch',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      width: 130,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.bookingDate).unix() - dayjs(b.bookingDate).unix(),
    },
    {
      title: 'Giờ đặt lịch',
      dataIndex: 'bookingTime',
      key: 'bookingTime',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Cập nhật trạng thái">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleUpdateStatus(record)}
              disabled={['completed', 'cancelled', 'no_show'].includes(record.bookingStatus)}
            />
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
              placeholder="Tìm kiếm theo tên hoặc ID"
              allowClear
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
            
            <RangePicker
              onChange={handleDateRangeChange}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              mode="multiple"
              placeholder="Lọc trạng thái đặt lịch"
              style={{ minWidth: 200 }}
              allowClear
              onChange={handleStatusFilterChange}
            >
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
              <Option value="no_show">Không đến</Option>
            </Select>
            
            <Select
              mode="multiple"
              placeholder="Lọc trạng thái thanh toán"
              style={{ minWidth: 200 }}
              allowClear
              onChange={handlePaymentFilterChange}
            >
              <Option value="paid">Đã thanh toán</Option>
              <Option value="unpaid">Chưa thanh toán</Option>
              <Option value="refunded">Đã hoàn tiền</Option>
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
          scroll={{ x: 1300 }}
          size="middle"
        />
      </Card>

      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái đặt lịch"
        open={updateModal.visible}
        onCancel={() => setUpdateModal({ visible: false, booking: null, status: '' })}
        footer={[
          <Button 
            key="cancel"
            onClick={() => setUpdateModal({ visible: false, booking: null, status: '' })}
          >
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary"
            loading={loading}
            onClick={confirmUpdateStatus}
          >
            Cập nhật
          </Button>
        ]}
      >
        {updateModal.booking && (
          <div>
            <p className="mb-4">
              <strong>ID đặt lịch:</strong> {updateModal.booking.id}
            </p>
            <p className="mb-4">
              <strong>Khách hàng:</strong> {updateModal.booking.customerName}
            </p>
            <p className="mb-4">
              <strong>Dịch vụ:</strong> {updateModal.booking.serviceName}
            </p>
            <p className="mb-4">
              <strong>Thời gian:</strong> {dayjs(updateModal.booking.bookingDate).format('DD/MM/YYYY')} {updateModal.booking.bookingTime}
            </p>
            
            <div className="mb-4">
              <Text strong>Chọn trạng thái mới:</Text>
              <Select
                value={updateModal.status}
                onChange={(value) => setUpdateModal({ ...updateModal, status: value })}
                style={{ width: '100%', marginTop: 8 }}
              >
                <Option value="pending">
                  <ClockCircleOutlined className="mr-2 text-blue-500" /> Chờ xác nhận
                </Option>
                <Option value="confirmed">
                  <CheckCircleOutlined className="mr-2 text-green-500" /> Đã xác nhận
                </Option>
                <Option value="completed">
                  <CheckCircleOutlined className="mr-2 text-purple-500" /> Hoàn thành
                </Option>
                <Option value="cancelled">
                  <CloseCircleOutlined className="mr-2 text-red-500" /> Đã hủy
                </Option>
                <Option value="no_show">
                  <CloseCircleOutlined className="mr-2 text-orange-500" /> Không đến
                </Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageBookingStis;