import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Space,
  Empty,
  Spin,
  Select,
  Input,
  Tooltip,
  Popconfirm,
  Rate,
  message,
  Statistic,
  Col,
  Row,
  Avatar,
} from "antd";

import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  StarFilled,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  StarOutlined,
} from "@ant-design/icons";

import FeedbackModal from "../../components/modal/FeedbackModal";
import { formatDateTime } from "../../../components/utils/format";
import { getAllFeedbackTestingAPI, hideFeedbackTestingAPI } from "../../../components/api/FeedbackTesting.api";

const { Title } = Typography;
const { Option } = Select;

const ManageFeedbackService = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
  });

  // Mock data cho các dịch vụ
  const mockServices = [
    { id: 1, name: "Xét nghiệm HIV" },
    { id: 2, name: "Xét nghiệm Giang mai" },
    { id: 3, name: "Xét nghiệm Chlamydia" },
    { id: 4, name: "Gói xét nghiệm STI cơ bản" },
    { id: 5, name: "Gói xét nghiệm STI toàn diện" },
  ];

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await getAllFeedbackTestingAPI({
        page: pagination.current - 1,
        size: pagination.pageSize,
        rating: ratingFilter,
      });
      setPagination({
        ...pagination,
        total: response.data.totalElements,
      });

      setFeedbacks(response.data.data.content);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      message.error(
        error.response?.data?.message ||
          "Không thể tải đánh giá. Vui lòng thử lại."
      );
      setLoading(false);
    }
  };

  // Fetching data (giả lập)
  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.current, pagination.pageSize, ratingFilter]);

  // Handle view feedback details
  const handleViewFeedback = (record) => {
    setSelectedFeedback(record);
    setViewModalVisible(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setViewModalVisible(false);
  };

  // Handle delete feedback
  const handleDeleteFeedback = async (id) => {
    try {
      setLoading(true);
      await hideFeedbackTestingAPI(id);
      fetchFeedbacks(); 
      setLoading(false);
      message.success("Đã ẩn đánh giá thành công");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      message.error("Không thể xóa đánh giá. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "userFullName",
      key: "userFullName",  
      render: (_, record) => (
        <div className="flex items-center gap-0.5">
          <div>
            <Typography.Text strong>{record.userFullName}</Typography.Text>
            <div className="text-gray-500 text-xs">
              {formatDateTime(record.updateAt) || formatDateTime(record.createdAt)}
            </div>
          </div>  
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Rate
          disabled
          defaultValue={rating}
          character={<StarFilled />}
          className="text-yellow-400 text-sm"
        />
      ),
    },
    {
      title: "Nhận xét",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      width: "40%",
    },
    {
      title: "Hành động",
      key: "action",
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
            title="Ẩn đánh giá"
            description="Bạn có chắc chắn muốn ẩn đánh giá này?"
            onConfirm={() => handleDeleteFeedback(record.feedbackId)}
            okText="Ẩn"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Ẩn">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
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
              valueStyle={{ color: "#1890ff" }}
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
              valueStyle={{ color: "#fa8c16" }}
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
                setSearchText("");
              }
            }}
          />

          <Select
            placeholder="Lọc theo dịch vụ"
            style={{ width: "100%" }}
            value={serviceFilter}
            onChange={setServiceFilter}
            allowClear
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả dịch vụ</Option>
            {mockServices.map((service) => (
              <Option key={service.id} value={service.id.toString()}>
                {service.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Lọc theo số sao"
            style={{ width: "100%" }}
            value={ratingFilter}
            onChange={setRatingFilter}
            allowClear
            suffixIcon={<StarFilled />}
          >
            <Option value="">Tất cả số sao</Option>
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
        ) : feedbacks.length > 0 ? (
          <Table
            dataSource={feedbacks}
            columns={columns}
            rowKey="feedbackId"
            pagination={pagination}
          />
        ) : (
          <Empty description="Không tìm thấy đánh giá nào phù hợp với điều kiện lọc" />
        )}
      </Card>

      {/* Sử dụng modal đánh giá đa năng */}
      <FeedbackModal
        visible={viewModalVisible}
        feedback={selectedFeedback}
        type="service"
        onClose={handleCloseModal}
        onDelete={handleDeleteFeedback}
      />
    </div>
  );
};

export default ManageFeedbackService;
