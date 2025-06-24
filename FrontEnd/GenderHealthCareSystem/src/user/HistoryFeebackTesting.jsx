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
  Modal,
  Form,
  Input,
  Rate,
  Popconfirm,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StarFilled,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { formatDateTime } from "../components/utils/format";
import {
  deleteFeedbackTestingAPI,
  editFeedbackTestingAPI,
  getMyFeedbackTestingAPI,
} from "../components/utils/api";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const HistoryFeedbackTesting = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editForm] = Form.useForm();
  const [editRating, setEditRating] = useState(5);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await getMyFeedbackTestingAPI({
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      setPagination({
        ...pagination,
        total: response.data.data.totalElements,
      });

      setFeedbacks(response.data.data.content);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback history:", error);
      message.error(
        error.response?.data?.message || "Không thể tải lịch sử đánh giá"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.current, pagination.pageSize]);

  // Xử lý chỉnh sửa đánh giá
  const handleEditFeedback = (record) => {
    setSelectedFeedback(record);
    setEditRating(record.rating);
    editForm.setFieldsValue({
      content: record.content,
    });
    setEditModalVisible(true);
  };

  // Xử lý cập nhật đánh giá
  const handleUpdateFeedback = async () => {
    try {
      setSubmitting(true);
      const values = await editForm.validateFields();

      await editFeedbackTestingAPI(
        selectedFeedback.feedbackId,
        editRating,
        values.content
      );

      fetchFeedbacks();
      setEditModalVisible(false);
      setSubmitting(false);
      message.success("Đánh giá đã được cập nhật thành công!");
    } catch (error) {
      setSubmitting(false);
      console.error("Error updating feedback:", error);
      message.error(error.response?.data?.message || "Không thể cập nhật đánh giá");
    }
  };

  // Xử lý xoá đánh giá
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      setLoading(true);

      await deleteFeedbackTestingAPI(feedbackId);
      fetchFeedbacks();
      message.success("Đánh giá đã được xóa thành công!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting feedback:", error);
      message.error(error.response?.data?.message || "Không thể xóa đánh giá");
    }
  };

  // Định nghĩa cột cho bảng
  const columns = [
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
      dataIndex: "createdAt || updatedAt",
      key: "createdAt || updatedAt",
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
            onClick={() => handleEditFeedback(record)}
          />
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn chắc chắn muốn xóa đánh giá này?"
            onConfirm={() => handleDeleteFeedback(record.feedbackId)}
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

  // Modal chỉnh sửa đánh giá
  const renderEditModal = () => (
    <Modal
      title={<span className="text-lg">Chỉnh sửa đánh giá</span>}
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setEditModalVisible(false)}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleUpdateFeedback}
        >
          Cập nhật
        </Button>,
      ]}
      width={500}
    >
      {selectedFeedback && (
        <div className="space-y-6">
          <div className="pb-4 border-b">
            <div className="font-medium mb-2">
              {selectedFeedback.serviceName}
            </div>
            <Text type="secondary">
              Ngày sử dụng: {formatDateTime(selectedFeedback.bookingDate)}
            </Text>
          </div>

          <Form form={editForm} layout="vertical">
            <div className="space-y-4">
              <div className="text-center">
                <Text strong>Mức độ hài lòng:</Text>
                <div className="mt-2">
                  <Rate
                    value={editRating}
                    onChange={setEditRating}
                    character={<StarFilled />}
                    className="text-2xl text-yellow-400"
                    allowClear={false}
                  />
                  <div className="mt-2">
                    {editRating === 5 && (
                      <Text type="success">Rất hài lòng</Text>
                    )}
                    {editRating === 4 && <Text type="success">Hài lòng</Text>}
                    {editRating === 3 && <Text>Bình thường</Text>}
                    {editRating === 2 && (
                      <Text type="warning">Không hài lòng</Text>
                    )}
                    {editRating === 1 && (
                      <Text type="danger">Rất không hài lòng</Text>
                    )}
                  </div>
                </div>
              </div>

              <Form.Item
                name="content"
                label="Nhận xét của bạn:"
                initialValue={selectedFeedback.comment}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nhận xét của bạn",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ của chúng tôi..."
                  rows={4}
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <div className="border-t pt-4 text-gray-500 text-sm">
                <p className="mb-1">
                  <InfoCircleOutlined className="mr-1" />
                  Sau khi chỉnh sửa, đánh giá của bạn sẽ được gửi đi phê duyệt
                  lại.
                </p>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  return (
    <Card className="shadow-sm">
      <div className="mb-6">
        <Title level={4}>Lịch sử đánh giá xét nghiệm</Title>
        <Text type="secondary">
          Quản lý các đánh giá dịch vụ xét nghiệm của bạn
        </Text>
      </div>

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
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <div className="text-gray-500 mb-2">Bạn chưa có đánh giá nào</div>
              <p className="text-gray-400">
                Các đánh giá sau khi sử dụng dịch vụ sẽ xuất hiện ở đây
              </p>
            </div>
          }
        />
      )}

      {renderEditModal()}
    </Card>
  );
};

export default HistoryFeedbackTesting;
