import React from "react";
import Markdown from "react-markdown";
import {
  Typography,
  Avatar,
  Tag,
  Space,
  Divider,
  Button,
  Modal,
  Spin,
} from "antd";
import {
  CalendarOutlined,
} from "@ant-design/icons";
import { formatDateTime } from "../../../components/utils/formatTime";

const { Title, Text, Paragraph } = Typography;

const ViewBlogModal = ({ visible, onClose, blog }) => {
  // Hàm lấy màu cho tag
  const getTagColor = (tag) => {
    const tagColors = {
      "Sức khỏe": "green",
      "Giới tính": "blue",
      "Tư vấn": "purple",
      "STIs": "red",
      "Kinh nguyệt": "pink",
    };

    return tagColors[tag] || "cyan"; // Trả về màu mặc định nếu không tìm thấy
  };

  // Xử lý dữ liệu blog để hiển thị
  const processedBlog = blog
    ? {
        ...blog,
        tags: blog.tags
          ? typeof blog.tags === "string"
            ? blog.tags.split(", ").map((tag) => ({
                text: tag.trim(),
                color: getTagColor(tag.trim()),
              }))
            : blog.tags // Nếu đã là mảng objects thì giữ nguyên
          : [],
        thumbnailUrl:
          blog.thumbnailUrl && !blog.thumbnailUrl.includes("example.com")
            ? blog.thumbnailUrl
            : "https://placehold.co/600x400/0099CF/white?text=Gender+Healthcare",
      }
    : null;

  // Render nội dung modal
  const renderModalContent = () => {
    if (!processedBlog) {
      return (
        <div className="text-center p-8">
          <Title level={4}>Không tìm thấy bài viết</Title>
          <Button type="primary" onClick={onClose} className="mt-4">
            Đóng
          </Button>
        </div>
      );
    }

    return (
      <div className="overflow-y-auto pr-2" style={{ maxHeight: "70vh" }}>
        {/* Ảnh bìa bài viết */}
        <div className="mb-6 rounded-xl overflow-hidden">
          <img
            src={processedBlog.thumbnailUrl}
            alt={processedBlog.title}
            className="w-full h-[200px] object-cover"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(processedBlog.tags) &&
            processedBlog.tags.map((tag, index) => (
              <Tag
                color={typeof tag === "object" ? tag.color : getTagColor(tag)}
                key={index}
              >
                {typeof tag === "object" ? tag.text : tag}
              </Tag>
            ))}
        </div>

        {/* Tiêu đề */}
        <Title level={2} className="mb-4">
          {processedBlog.title}
        </Title>

        {/* Thông tin tác giả và ngày đăng */}
        <div className="flex flex-wrap justify-between items-center pb-4 border-b border-gray-200">
          <Space size="middle">
            <Avatar src={processedBlog.consultantImageUrl} size={36} />
            <Text strong>{processedBlog.consultantName}</Text>
          </Space>

          <Space className="text-gray-500">
            <CalendarOutlined />
            <span>{formatDateTime(processedBlog.publishedAt)}</span>
          </Space>
        </div>

        {/* Nội dung bài viết */}
        <div className="prose max-w-none mt-6 blog-content">
          <Markdown>{processedBlog.content}</Markdown>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="text-xl font-bold">Chi tiết bài viết</div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose} size="large">
          Đóng
        </Button>,
      ]}
      centered
      bodyStyle={{ padding: "20px" }}
      destroyOnClose={true}
    >
      {renderModalContent()}
    </Modal>
  );
};

export default ViewBlogModal;