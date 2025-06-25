import React, { use } from "react";
import Markdown from "react-markdown";
import {
  Typography,
  Avatar,
  Tag,
  Space,
  Divider,
  Button,
  Modal,
  List,
  message
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { formatDateTime } from "../../../components/utils/format";
import { useState, useEffect } from "react";
import { deleteCommentBlogAPI, getCommentsBlogAPI } from "../../../components/api/Blog.api";

const { Title, Text, Paragraph } = Typography;

const ViewBlogModal = ({ visible, onClose, blog }) => {
  // Hàm lấy màu cho tag
  const [comments, setComments] = useState([]);

  const getTagColor = (tag) => {
    const tagColors = {
      "Sức khỏe": "green",
      "Giới tính": "blue",
      "Tư vấn": "purple",
      STIs: "red",
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

  const fetchComments = async () => {
    try {
      const response = await getCommentsBlogAPI(blog.postId);
      const data = response.data.data.content;
      setComments(data || []);
    } catch (error) {
      //console.error("Error fetching comments:", error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blog]);

  const handleDeleteComment = async (commentId) => {
      try {
        console.log(">>> ID: ", commentId)
        await deleteCommentBlogAPI(commentId);
        // Cập nhật lại danh sách comments
        message.success("Đã xóa bình luận");
        fetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error.message);
        message.error("Không thể xóa bình luận");
      }
    };  

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

        {/* Bình luận */}
        <Divider className="my-6" />
        <Title level={4} className="mb-4">
          Bình luận ({comments.length})
        </Title>
        {comments.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item
                key={comment.commentId}
                actions={[
                  <Button
                    type="text"
                    onClick={() => handleDeleteComment(comment.commentId)}
                    danger
                    size="small" 
                  >
                    Ẩn bình luận
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={comment.userImageUrl} />}
                  title={
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {comment.userFullName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(comment.updatedAt || comment.createdAt)}
                      </span>
                      {comment.updatedAt &&
                        comment.updatedAt !== comment.createdAt && (
                          <span className="text-xs text-gray-400 italic">
                            (đã chỉnh sửa)
                          </span>
                        )}
                    </div>
                  }
                  description={
                    <Paragraph className="mb-0">{comment.content}</Paragraph>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">Chưa có bình luận nào.</Text>
        )}
      </div>
    );
  };

  return (
    <Modal
      title={<div className="text-xl font-bold">Chi tiết bài viết</div>}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose} size="large">
          Đóng
        </Button>,
      ]}
      centered
    >
      {renderModalContent()}
    </Modal>
  );
};

export default ViewBlogModal;
