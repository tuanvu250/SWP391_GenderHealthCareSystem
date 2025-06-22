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
// Import các API cần thiết (giả định)
// import { getFeedbackHistoryAPI, updateFeedbackAPI, deleteFeedbackAPI } from '../api/feedbackAPI';

const { Title, Text, Paragraph } = Typography;

const HistoryFeedbackTesting = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editForm] = Form.useForm();
  const [editRating, setEditRating] = useState(5);

  // Mock data - thay thế bằng API call thật
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        // Giả lập API call
        setTimeout(() => {
          const mockFeedbacks = [
            {
              id: 1,
              serviceId: 101,
              bookingId: 501,
              serviceName: "Gói xét nghiệm STI cơ bản",
              appointmentDate: "10/06/2023",
              rating: 5,
              content:
                "Dịch vụ rất tốt, nhân viên chuyên nghiệp và thân thiện. Kết quả được trả nhanh chóng và chi tiết.",
              createdAt: "2023-06-15T08:30:00Z",
              updatedAt: "2023-06-15T08:30:00Z",
              status: "published",
            },
            {
              id: 2,
              serviceId: 102,
              bookingId: 502,
              serviceName: "Xét nghiệm HIV",
              appointmentDate: "20/07/2023",
              rating: 4,
              content:
                "Tốt nhưng thời gian chờ hơi lâu. Nhân viên tư vấn rất nhiệt tình.",
              createdAt: "2023-07-25T10:15:00Z",
              updatedAt: "2023-07-25T10:15:00Z",
              status: "published",
            },
            {
              id: 3,
              serviceId: 103,
              bookingId: 503,
              serviceName: "Gói xét nghiệm STI toàn diện",
              appointmentDate: "05/08/2023",
              rating: 5,
              content:
                "Rất hài lòng với dịch vụ, từ đặt lịch đến nhận kết quả đều rất suôn sẻ và tiện lợi.",
              createdAt: "2023-08-10T14:20:00Z",
              updatedAt: "2023-08-10T14:20:00Z",
              status: "published",
            },
          ];
          setFeedbacks(mockFeedbacks);
          setLoading(false);
        }, 1000);

        // Khi có API thật
        // const response = await getFeedbackHistoryAPI();
        // setFeedbacks(response.data);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching feedback history:", error);
        message.error("Không thể tải lịch sử đánh giá. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

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

      // Giả lập API call
      setTimeout(() => {
        // Cập nhật state local
        const updatedFeedbacks = feedbacks.map((feedback) =>
          feedback.id === selectedFeedback.id
            ? {
                ...feedback,
                rating: editRating,
                content: values.content,
                updatedAt: new Date().toISOString(),
              }
            : feedback
        );

        setFeedbacks(updatedFeedbacks);
        setSubmitting(false);
        setEditModalVisible(false);
        message.success("Đã cập nhật đánh giá thành công!");
      }, 1000);

      // Khi có API thật
      // await updateFeedbackAPI(selectedFeedback.id, editRating, values.content);
      // Sau đó fetch lại danh sách đánh giá
      // fetchFeedbacks();
    } catch (error) {
      setSubmitting(false);
      console.error("Error updating feedback:", error);
      message.error("Không thể cập nhật đánh giá. Vui lòng thử lại.");
    }
  };

  // Xử lý xoá đánh giá
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      setLoading(true);

      // Giả lập API call
      setTimeout(() => {
        // Cập nhật state local
        const updatedFeedbacks = feedbacks.filter(
          (feedback) => feedback.id !== feedbackId
        );
        setFeedbacks(updatedFeedbacks);
        setLoading(false);
        message.success("Đã xóa đánh giá thành công!");
      }, 1000);

      // Khi có API thật
      // await deleteFeedbackAPI(feedbackId);
      // Sau đó fetch lại danh sách đánh giá
      // fetchFeedbacks();
    } catch (error) {
      setLoading(false);
      console.error("Error deleting feedback:", error);
      message.error("Không thể xóa đánh giá. Vui lòng thử lại.");
    }
  };

  // Render trạng thái
  const renderStatus = (status) => {
    let color = "default";
    let text = "Chờ duyệt";

    if (status === "published") {
      color = "success";
      text = "Đã đăng";
    } else if (status === "rejected") {
      color = "error";
      text = "Từ chối";
    }

    return <Tag color={color}>{text}</Tag>;
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
            Ngày sử dụng: {record.appointmentDate}
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
      dataIndex: "content",
      key: "content",
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
            onClick={() => handleEditFeedback(record)}
          />
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn chắc chắn muốn xóa đánh giá này?"
            onConfirm={() => handleDeleteFeedback(record.id)}
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
              Ngày sử dụng: {selectedFeedback.appointmentDate}
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
          rowKey="id"
          pagination={{
            pageSize: 5,
            position: ["bottomCenter"],
            showSizeChanger: false,
          }}
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
