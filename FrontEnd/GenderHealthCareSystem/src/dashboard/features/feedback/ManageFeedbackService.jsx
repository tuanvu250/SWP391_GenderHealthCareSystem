import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Typography,
  Button,
  Space,
  Modal,
  Empty,
  Spin,
  Select,
  Input,
  Tooltip,
  Popconfirm,
  Rate,
  message,
  Divider,
  Statistic,
  Col,
  Row
} from 'antd';

import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  StarFilled,
  UserOutlined,
  CalendarOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  StarOutlined,
} from '@ant-design/icons';

import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ManageFeedbackService = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0
  });

  // Mock data cho các dịch vụ 
  const mockServices = [
    { id: 1, name: 'Xét nghiệm HIV' },
    { id: 2, name: 'Xét nghiệm Giang mai' },
    { id: 3, name: 'Xét nghiệm Chlamydia' },
    { id: 4, name: 'Gói xét nghiệm STI cơ bản' },
    { id: 5, name: 'Gói xét nghiệm STI toàn diện' },
  ];

  // Fetching data (giả lập)
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        // Giả lập API call
        setTimeout(() => {
          const mockFeedbacks = [
            {
              id: 1,
              userId: 101,
              userName: 'Nguyễn Văn A',
              serviceId: 1,
              serviceName: 'Xét nghiệm HIV',
              bookingId: 501,
              appointmentDate: '15/05/2023',
              rating: 5,
              content: 'Dịch vụ tuyệt vời, nhân viên rất chuyên nghiệp và tư vấn tận tình. Kết quả được trả nhanh chóng và chính xác.',
              createdAt: '2023-05-20T08:30:00Z'
            },
            {
              id: 2,
              userId: 102,
              userName: 'Trần Thị B',
              serviceId: 4,
              serviceName: 'Gói xét nghiệm STI cơ bản',
              bookingId: 502,
              appointmentDate: '10/06/2023', 
              rating: 4,
              content: 'Dịch vụ tốt, nhưng thời gian chờ đợi hơi lâu. Nhân viên rất thân thiện và giải thích kỹ về các xét nghiệm.',
              createdAt: '2023-06-15T14:20:00Z'
            },
            {
              id: 3,
              userId: 103,
              userName: 'Lê Văn C',
              serviceId: 2,
              serviceName: 'Xét nghiệm Giang mai',
              bookingId: 503,
              appointmentDate: '05/07/2023',
              rating: 3,
              content: 'Dịch vụ ở mức trung bình. Tư vấn khá sơ sài và tôi phải chờ khá lâu để lấy mẫu xét nghiệm. Kết quả thì chính xác.',
              createdAt: '2023-07-10T09:45:00Z'
            },
            {
              id: 4,
              userId: 104,
              userName: 'Phạm Thị D',
              serviceId: 5,
              serviceName: 'Gói xét nghiệm STI toàn diện',
              bookingId: 504,
              appointmentDate: '20/07/2023',
              rating: 5,
              content: 'Tôi rất hài lòng với gói dịch vụ này. Đầy đủ, chi tiết và nhận được tư vấn rất cặn kẽ từ bác sĩ sau khi có kết quả.',
              createdAt: '2023-07-25T16:10:00Z'
            },
            {
              id: 5,
              userId: 105,
              userName: 'Hoàng Văn E',
              serviceId: 3,
              serviceName: 'Xét nghiệm Chlamydia',
              bookingId: 505,
              appointmentDate: '01/08/2023',
              rating: 2,
              content: 'Tôi không hài lòng với dịch vụ này. Nhân viên thiếu chuyên nghiệp và kết quả trả về chậm hơn thời gian hẹn 2 ngày.',
              createdAt: '2023-08-05T11:30:00Z'
            }
          ];
          
          // Calculate stats
          const total = mockFeedbacks.length;
          
          // Calculate average rating
          const avgRating = mockFeedbacks.reduce((sum, item) => sum + item.rating, 0) / total;
          
          // Set the stats
          setStats({
            total,
            avgRating: avgRating.toFixed(1)
          });
          
          setFeedbacks(mockFeedbacks);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        message.error("Không thể tải dữ liệu đánh giá. Vui lòng thử lại.");
        setLoading(false);
      }
    };
    
    fetchFeedbacks();
  }, []);
  
  // Filter feedbacks based on current filters
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Filter by service
    if (serviceFilter !== 'all' && feedback.serviceId !== parseInt(serviceFilter)) {
      return false;
    }
    
    // Filter by rating
    if (ratingFilter !== 'all' && feedback.rating !== parseInt(ratingFilter)) {
      return false;
    }
    
    // Search by content or user name
    if (searchText && !feedback.content.toLowerCase().includes(searchText.toLowerCase()) && 
        !feedback.userName.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return dayjs(timeString).format('HH:mm - DD/MM/YYYY');
  };
  
  // Handle view feedback details
  const handleViewFeedback = (record) => {
    setSelectedFeedback(record);
    setViewModalVisible(true);
  };
  
  // Handle delete feedback
  const handleDeleteFeedback = async (id) => {
    try {
      // In a real app, call API to delete
      // await deleteFeedbackAPI(id);
      
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        const updatedFeedbacks = feedbacks.filter(feedback => feedback.id !== id);
        
        setFeedbacks(updatedFeedbacks);
        
        // Update stats
        const newTotal = updatedFeedbacks.length;
        const newAvg = newTotal > 0 
          ? updatedFeedbacks.reduce((sum, item) => sum + item.rating, 0) / newTotal 
          : 0;
          
        setStats({
          total: newTotal,
          avgRating: newAvg.toFixed(1)
        });
        
        setLoading(false);
        message.success('Đã xóa đánh giá thành công');
      }, 1000);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      message.error("Không thể xóa đánh giá. Vui lòng thử lại.");
      setLoading(false);
    }
  };
  
  // Define table columns
  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
      render: (_, record) => (
        <div>
          <div>{record.userName}</div>
          <div className="text-xs text-gray-500">{formatTime(record.createdAt)}</div>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Rate disabled defaultValue={rating} character={<StarFilled />} className="text-yellow-400 text-sm" />
      ),
    },
    {
      title: 'Nhận xét',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: '40%',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewFeedback(record)} 
            />
          </Tooltip>
          
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn có chắc chắn muốn xóa đánh giá này?"
            onConfirm={() => handleDeleteFeedback(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Tooltip title="Xóa">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={4}>Quản lý đánh giá dịch vụ</Title>
      </div>
      
      {/* Simplified Stats Cards */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} lg={12}>
          <Card bordered={false} className="h-full">
            <Statistic 
              title="Tổng đánh giá" 
              value={stats.total} 
              prefix={<FileTextOutlined />} 
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card bordered={false} className="h-full">
            <Statistic 
              title="Điểm đánh giá trung bình" 
              value={stats.avgRating} 
              prefix={<StarOutlined />} 
              suffix="/ 5"
              precision={1} 
              valueStyle={{ color: '#fa8c16' }} 
            />
          </Card>
        </Col>
      </Row>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input.Search 
            placeholder="Tìm kiếm theo nội dung hoặc tên người dùng" 
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={setSearchText}
            onChange={(e) => {
              if (!e.target.value) {
                setSearchText('');
              }
            }}
          />
          
          <Select
            placeholder="Lọc theo dịch vụ"
            style={{ width: '100%' }}
            value={serviceFilter}
            onChange={setServiceFilter}
            allowClear
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả dịch vụ</Option>
            {mockServices.map(service => (
              <Option key={service.id} value={service.id.toString()}>{service.name}</Option>
            ))}
          </Select>
          
          <Select
            placeholder="Lọc theo số sao"
            style={{ width: '100%' }}
            value={ratingFilter}
            onChange={setRatingFilter}
            allowClear
            suffixIcon={<StarFilled />}
          >
            <Option value="all">Tất cả số sao</Option>
            <Option value="5">5 sao</Option>
            <Option value="4">4 sao</Option>
            <Option value="3">3 sao</Option>
            <Option value="2">2 sao</Option>
            <Option value="1">1 sao</Option>
          </Select>
        </div>
      </Card>
      
      {/* Table */}
      <Card bordered={false}>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : filteredFeedbacks.length > 0 ? (
          <Table 
            dataSource={filteredFeedbacks}
            columns={columns}
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} đánh giá`
            }}
          />
        ) : (
          <Empty description="Không tìm thấy đánh giá nào phù hợp với điều kiện lọc" />
        )}
      </Card>
      
      {/* View Feedback Modal */}
      <Modal
        title="Chi tiết đánh giá"
        open={viewModalVisible}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        onCancel={() => setViewModalVisible(false)}
        width={700}
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <div>
              <div className="mb-2">
                <Text strong className="text-lg">{selectedFeedback.userName}</Text>
                <div className="text-gray-500 mt-1">
                  <CalendarOutlined className="mr-1" /> 
                  {formatTime(selectedFeedback.createdAt)}
                </div>
              </div>
              
              <div className="mt-3">
                <Rate 
                  disabled 
                  defaultValue={selectedFeedback.rating} 
                  character={<StarFilled />}
                  className="text-yellow-400" 
                />
              </div>
              
              <Paragraph className="mt-3">
                {selectedFeedback.content}
              </Paragraph>
            </div>
            
            <Divider />
            
            <div>
              <Text strong>Chi tiết dịch vụ</Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div>
                  <Text type="secondary">Tên dịch vụ:</Text>
                  <div>{selectedFeedback.serviceName}</div>
                </div>
                <div>
                  <Text type="secondary">Mã đặt lịch:</Text>
                  <div>#{selectedFeedback.bookingId}</div>
                </div>
              </div>
              <div className="mt-2">
                <Text type="secondary">Ngày sử dụng dịch vụ:</Text>
                <div>{selectedFeedback.appointmentDate}</div>
              </div>
            </div>
            
            <Divider />
            
            <div className="flex justify-end">
              <Popconfirm
                title="Xóa đánh giá"
                description="Bạn có chắc chắn muốn xóa đánh giá này?"
                onConfirm={() => {
                  setViewModalVisible(false);
                  handleDeleteFeedback(selectedFeedback.id);
                }}
                okText="Xóa"
                cancelText="Hủy"
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageFeedbackService;