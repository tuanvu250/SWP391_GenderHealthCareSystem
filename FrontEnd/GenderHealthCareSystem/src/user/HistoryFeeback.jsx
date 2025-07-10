import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Typography,
  Tag,
  Button,
  Space,
  Empty,
  Spin,
  Tabs,
  Popconfirm,
  message,
  Rate,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StarFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { formatDateTime } from "../components/utils/format";
import {
  deleteFeedbackTestingAPI,
  editFeedbackTestingAPI,
  getMyFeedbackTestingAPI,
} from "../components/api/FeedbackTesting.api";
import {
  editFeedbackConsultantAPI,
  getHistoryFeedbackConsultantAPI,
  getMyFeedbackConsultantAPI,
} from "../components/api/FeedbackConsultant.api";
import FeedbackModal from "./FeedbackModal";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const HistoryFeedback = () => {
  // State chung
  const [activeTab, setActiveTab] = useState("testing");
  const [loading, setLoading] = useState(false);

  // State cho đánh giá xét nghiệm
  const [testingFeedbacks, setTestingFeedbacks] = useState([]);
  const [testingPagination, setTestingPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // State cho đánh giá tư vấn viên
  const [consultantFeedbacks, setConsultantFeedbacks] = useState([]);
  const [consultantPagination, setConsultantPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // State cho modal chỉnh sửa
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackType, setFeedbackType] = useState("service"); // "service" hoặc "consultant"

  // Fetch đánh giá xét nghiệm
  const fetchTestingFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await getMyFeedbackTestingAPI({
        page: testingPagination.current - 1,
        size: testingPagination.pageSize,
      });

      setTestingPagination({
        ...testingPagination,
        total: response.data.data.totalElements,
      });

      setTestingFeedbacks(response.data.data.content);
    } catch (error) {
      console.error("Error fetching testing feedback:", error);
      message.error(
        error.response?.data?.message ||
          "Không thể tải lịch sử đánh giá xét nghiệm"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch đánh giá tư vấn viên
  const fetchConsultantFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await getHistoryFeedbackConsultantAPI({
        page: consultantPagination.current - 1,
        size: consultantPagination.pageSize,
      });

      setConsultantPagination({
        ...consultantPagination,
        total: response.data.data.totalElements,
      });

      setConsultantFeedbacks(response.data.data.content);
    } catch (error) {
      console.error("Error fetching consultant feedback:", error);
      message.error(
        error.response?.data?.message ||
          "Không thể tải lịch sử đánh giá tư vấn viên"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu dựa trên tab active
  useEffect(() => {
    if (activeTab === "testing") {
      fetchTestingFeedbacks();
    } else {
      fetchConsultantFeedbacks();
    }
  }, [activeTab, testingPagination.current, consultantPagination.current]);

  // Xử lý chỉnh sửa đánh giá
  const handleEditFeedback = (record, type) => {
    setSelectedFeedback(record);
    setFeedbackType(type);
    setEditModalVisible(true);
  };

  // Xử lý cập nhật đánh giá
  const handleUpdateFeedback = async (feedback) => {
    try {
      setSubmitting(true);

      if (feedbackType === "service") {
        await editFeedbackTestingAPI(
          feedback.reviewId || selectedFeedback.feedbackId,
          feedback.rating,
          feedback.content
        );
        // Refresh dữ liệu
        fetchTestingFeedbacks();
      } else {
        await editFeedbackConsultantAPI(
          feedback.reviewId || selectedFeedback.feedbackId,
          feedback.rating,
          feedback.content,
          feedback.consultantId,
          feedback.bookingId
        );
        // Refresh dữ liệu
        fetchConsultantFeedbacks();
      }

      setEditModalVisible(false);
      setSubmitting(false);
      message.success("Đánh giá đã được cập nhật thành công!");
    } catch (error) {
      setSubmitting(false);
      console.error("Error updating feedback:", error);
      message.error(
        error.response?.data?.message || "Không thể cập nhật đánh giá"
      );
    }
  };

  // Xử lý xoá đánh giá
  const handleDeleteFeedback = async (feedbackId, type) => {
    try {
      setLoading(true);

      if (type === "service") {
        await deleteFeedbackTestingAPI(feedbackId);
        // Refresh dữ liệu
        fetchTestingFeedbacks();
      } else {
        //await deleteFeedbackConsultantAPI(feedbackId);
        // Refresh dữ liệu
        fetchConsultantFeedbacks();
      }

      message.success("Đánh giá đã được xóa thành công!");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      message.error(error.response?.data?.message || "Không thể xóa đánh giá");
    } finally {
      setLoading(false);
    }
  };

  // Cột cho bảng đánh giá xét nghiệm
  const testingColumns = [
    {
      title: "Dịch vụ đã đánh giá",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            Ngày sử dụng: {formatDateTime(record.bookingDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: "15%",
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
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      width: "35%",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditFeedback(record, "service")}
          />
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn chắc chắn muốn xóa đánh giá này?"
            onConfirm={() => handleDeleteFeedback(record.feedbackId, "service")}
            okText="Xóa"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Cột cho bảng đánh giá tư vấn viên
  const consultantColumns = [
    {
      title: "Tư vấn viên đã đánh giá",
      dataIndex: "consultantName",
      key: "consultantName",
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            Ngày tư vấn: {formatDateTime(record.bookingDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: "15%",
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
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      width: "35%",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditFeedback(record, "consultant")}
          />
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn chắc chắn muốn xóa đánh giá này?"
            onConfirm={() =>
              handleDeleteFeedback(record.feedbackId, "consultant")
            }
            okText="Xóa"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Xử lý thay đổi trang trong bảng
  const handleTestingTableChange = (pagination) => {
    setTestingPagination({
      ...testingPagination,
      current: pagination.current,
    });
  };

  const handleConsultantTableChange = (pagination) => {
    setConsultantPagination({
      ...consultantPagination,
      current: pagination.current,
    });
  };

  // Xử lý thay đổi tab
  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
  };

  // Render nội dung cho tab đánh giá xét nghiệm
  const renderTestingContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      );
    }

    if (testingFeedbacks.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <div className="text-gray-500 mb-2">
                Bạn chưa có đánh giá dịch vụ xét nghiệm nào
              </div>
              <p className="text-gray-400">
                Các đánh giá sau khi sử dụng dịch vụ xét nghiệm sẽ xuất hiện ở
                đây
              </p>
            </div>
          }
        />
      );
    }

    return (
      <Table
        dataSource={testingFeedbacks}
        columns={testingColumns}
        rowKey="feedbackId"
        pagination={testingPagination}
        onChange={handleTestingTableChange}
        scroll={{ x: "max-content" }}
      />
    );
  };

  // Render nội dung cho tab đánh giá tư vấn viên
  const renderConsultantContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      );
    }

    if (consultantFeedbacks.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <div className="text-gray-500 mb-2">
                Bạn chưa có đánh giá tư vấn viên nào
              </div>
              <p className="text-gray-400">
                Các đánh giá sau khi sử dụng dịch vụ tư vấn sẽ xuất hiện ở đây
              </p>
            </div>
          }
        />
      );
    }

    return (
      <Table
        dataSource={consultantFeedbacks}
        columns={consultantColumns}
        rowKey="feedbackId"
        pagination={consultantPagination}
        onChange={handleConsultantTableChange}
        scroll={{ x: "max-content" }}
      />
    );
  };

  return (
    <Card className="shadow-sm">
      <div className="mb-6">
        <Title level={4}>Lịch sử đánh giá</Title>
        <Text type="secondary">
          Quản lý các đánh giá dịch vụ và tư vấn viên của bạn
        </Text>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab={<span>Đánh giá dịch vụ xét nghiệm</span>} key="testing">
          {renderTestingContent()}
        </TabPane>
        <TabPane tab={<span>Đánh giá tư vấn viên</span>} key="consultant">
          {renderConsultantContent()}
        </TabPane>
      </Tabs>

      {/* Sử dụng FeedbackModal cho chỉnh sửa đánh giá */}
      <FeedbackModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleUpdateFeedback}
        data={
          selectedFeedback
            ? {
                id: selectedFeedback.feedbackId,
                serviceName: selectedFeedback.serviceName,
                consultantName: selectedFeedback.consultantName,
                appointmentDate: formatDateTime(selectedFeedback.bookingDate),
                consultationType: "Trực tuyến",
                consultantId: selectedFeedback.consultantId,
                bookingId: selectedFeedback.bookingId,
              }
            : null
        }
        type={feedbackType}
        mode="edit"
        loading={submitting}
        existingReview={
          selectedFeedback
            ? {
                reviewId: selectedFeedback.feedbackId,
                rating: selectedFeedback.rating,
                comment: selectedFeedback.comment,
                createdAt: formatDateTime(selectedFeedback.createdAt),
              }
            : null
        }
      />
    </Card>
  );
};

export default HistoryFeedback;
