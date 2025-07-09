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
  Tag,
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
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import FeedbackModal from "../../components/modal/FeedbackModal";
import { formatDateTime } from "../../../components/utils/format";
import { useAuth } from "../../../components/provider/AuthProvider";
import { getAllFeedbackConsultantAPI, getAverageRatingByConsultantAPI, getAverageRatingConsultantAPI, getMyFeedbackConsultantAPI } from "../../../components/api/FeedbackConsultant.api";
import { getAverageRatingAPI } from "../../../components/api/FeedbackTesting.api";
import { getConsultantProfile } from "../../../components/api/UserProfile.api";
import { getAllConsultants } from "../../../components/api/Consultant.api";

const { Title, Text } = Typography;
const { Option } = Select;

const ManageFeedbackConsultant = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [consultantFilter, setConsultantFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [consultantList, setConsultantList] = useState([]);
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

  // User Role
  const { user } = useAuth();
  const isConsultant = user?.role === "Consultant";
  const isManager = user?.role === "Manager" || user?.role === "Admin";

  // Fetch consultant list (for manager/admin only)
  const fetchConsultantList = async () => {
    if (!isManager) return;

    try {
      //const response = await getAllConsultants();
      //console.log("Consultant list response:", response);
      //setConsultantList(response || []);
    } catch (error) {
      console.error("Error fetching consultant list:", error);
    }
  };

  // Fetch feedbacks based on role
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      let response;

      // Different API calls based on role
      if (isConsultant) {
        // Consultant sees only their own feedback
        response = await getMyFeedbackConsultantAPI({
          page: pagination.current - 1,
          size: pagination.pageSize,
          rating: ratingFilter,
          search: searchText,
        });

        // Get average rating for this consultant
        const avgRating = await getAverageRatingByConsultantAPI(user.userId);

        setStats({
          total: response.data.data.totalElements,
          avgRating: avgRating.data.data.averageRating || 0,
        });
      } else {
        // Manager/Admin sees all feedback or filtered by consultant
        response = await getAllFeedbackConsultantAPI({
          page: pagination.current - 1,
          size: pagination.pageSize,
          rating: ratingFilter,
          consultantId: consultantFilter || "",
          search: searchText,
        });

        // Get overall average rating
        const avgRating = await getAverageRatingConsultantAPI();

        setStats({
          total: response.data.data.totalElements,
          avgRating: avgRating.data.data.totalAverageRating || 0,
        });
      }

      setPagination({
        ...pagination,
        total: response.data.data.totalElements,
      });

      setFeedbacks(response.data.data.content);
    } catch (error) {
      console.error("Error fetching consultant feedbacks:", error);
      message.error(
        error.response?.data?.message ||
          "Không thể tải đánh giá. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load data when filters or pagination changes
  useEffect(() => {
    fetchFeedbacks();
  }, [
    pagination.current,
    pagination.pageSize,
    ratingFilter,
    consultantFilter,
    searchText,
  ]);

  // Fetch consultant list for filter dropdown
  useEffect(() => {
    if (isManager) {
      fetchConsultantList();
    }
  }, [isManager]);

  // Handle view feedback details
  const handleViewFeedback = (record) => {
    setSelectedFeedback(record);
    setViewModalVisible(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setViewModalVisible(false);
  };

  // Handle hide/delete feedback
  const handleDeleteFeedback = async (id) => {
    try {
      setLoading(true);
      await hideFeedbackConsultantAPI(id);
      fetchFeedbacks();
      setViewModalVisible(false);
      message.success("Đã ẩn đánh giá thành công");
    } catch (error) {
      console.error("Error hiding feedback:", error);
      message.error("Không thể ẩn đánh giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Handle table pagination change
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  // Define table columns
  const columns = [
    {
      title: "Người đánh giá",
      dataIndex: "userFullName",
      key: "userFullName",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar  className="bg-blue-500" src={record?.customerImageUrl} />
          <div>
            <Typography.Text strong>{record.customerName}</Typography.Text>
          </div>
        </div>
      ),
    },
    {
      title: "Tư vấn viên",
      dataIndex: "consultantName",
      key: "consultantName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.specialization && (
            <Tag color="blue">{record.specialization}</Tag>
          )}
        </div>
      ),
      // Hide this column for consultants as they only see their own feedback
      hidden: isConsultant,
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
    },
    {
      title: "Thời gian đánh giá",
      dataIndex: "createdAt",     
      key: "createdAt",
      render: (text) => formatDateTime(text),
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

          {/* Only managers/admins can hide feedback */}
          {isManager && (
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
          )}
        </Space>
      ),
    },
  ].filter((column) => !column.hidden);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <Title level={4}>
          {isConsultant ? "Đánh giá của tôi" : "Quản lý đánh giá tư vấn viên"}
        </Title>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="h-full">
            <Statistic
              title="Tổng đánh giá"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
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
        <Col xs={24} sm={24} lg={8}>
          <Card bordered={false} className="h-full">
            <Statistic
              title={
                isConsultant ? "Thứ hạng của tôi" : "Tư vấn viên hoạt động"
              }
              value={isConsultant ? "Đang tính toán..." : consultantList.length}
              prefix={isConsultant ? <StarOutlined /> : <TeamOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input.Search
            placeholder="Tìm kiếm theo nội dung hoặc tên người đánh giá"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={setSearchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPagination({ ...pagination, current: 1 });
            }}
          />

          {/* Only managers/admins can filter by consultant */}
          {isManager && (
            <Select
              placeholder="Lọc theo tư vấn viên"
              style={{ width: "100%" }}
              value={consultantFilter}
              onChange={setConsultantFilter}
              allowClear
              suffixIcon={<UserOutlined />}
              showSearch
              optionFilterProp="children"
            >
              <Option value="">Tất cả tư vấn viên</Option>
              {consultantList.map((consultant) => (
                <Option
                  key={consultant.userId}
                  value={consultant.userId}
                >
                  {consultant.fullName}
                </Option>
              ))}
            </Select>
          )}

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
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
          />
        ) : (
          <Empty
            description={
              <Text type="secondary">
                {searchText || ratingFilter || consultantFilter
                  ? "Không tìm thấy đánh giá nào phù hợp với điều kiện lọc"
                  : isConsultant
                  ? "Bạn chưa nhận được đánh giá nào"
                  : "Không có đánh giá nào trong hệ thống"}
              </Text>
            }
          />
        )}
      </Card>

      {/* Sử dụng modal đánh giá */}
      <FeedbackModal
        visible={viewModalVisible}
        feedback={selectedFeedback}
        type="consultant"
        onClose={handleCloseModal}
        onDelete={isManager ? handleDeleteFeedback : undefined}
      />
    </div>
  );
};

export default ManageFeedbackConsultant;
