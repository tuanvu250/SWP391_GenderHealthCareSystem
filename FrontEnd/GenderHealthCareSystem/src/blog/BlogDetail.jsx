import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import {
  Typography,
  Avatar,
  Tag,
  Space,
  Divider,
  Button,
  Card,
  Row,
  Col,
  Breadcrumb,
  Spin,
  Image,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { blogDetailAPI } from "../components/utils/api";
import { formatDateTime } from "../components/utils/formatTime";

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Dữ liệu mẫu cho bài viết chi tiết
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

  useEffect(() => {
    // Giả lập API call
    const fetchBlog = () => {
      setLoading(true);
      // Trong thực tế, bạn sẽ gọi API với ID từ params
      setTimeout(async () => {
        const response = await blogDetailAPI(postId);
        if (response && response.data) {
          const post = response.data.data;
          const tagArray = post.tags
            ? post.tags.split(", ").map((tag) => ({
                text: tag.trim(),
                color: getTagColor(tag.trim()), // Hàm helper để gán màu cho tag
              }))
            : [];

          setBlog( {
            ...post,
            tags: tagArray,
            // Đặt URL hình ảnh mặc định nếu thumbnailUrl không hợp lệ
            thumbnailUrl:
              post.thumbnailUrl && !post.thumbnailUrl.includes("example.com")
                ? post.thumbnailUrl
                : "https://placehold.co/600x400/0099CF/white?text=Gender+Healthcare",
          });
          setLoading(false);
        }
        // Scroll to top when page loads
        window.scrollTo(0, 0);
      }, 500);
    };

    fetchBlog();
  }, [postId]);

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
        >
          Quay lại
        </Button>
        <div className="text-center mt-8">
          <Title level={3}>Không tìm thấy bài viết</Title>
          <Button type="primary" onClick={() => navigate("/blog")}>
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb và nút quay lại */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <Breadcrumb
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/blog">Blog</Link> },
              { title: blog.title },
            ]}
          />

          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="mt-2 sm:mt-0"
          >
            Quay lại
          </Button>
        </div>

        {/* Ảnh bìa bài viết */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            className="w-full h-[300px] sm:h-[400px] object-cover"
          />
        </div>

        {/* Tiêu đề và thông tin bài viết */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <Tag color={tag.color} key={index}>
                {tag.text}
              </Tag>
            ))}
          </div>

          {/* Tiêu đề */}
          <Title level={1} className="text-2xl sm:text-3xl md:text-4xl mb-6">
            {blog.title}
          </Title>

          {/* Thông tin tác giả và ngày đăng */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200">
            <Space size="large">
              <Space>
                <Avatar src={blog.consultantImageUrl} size={40} />
                <div>
                  <Text strong>{blog.consultantName}</Text>
                  {/* <div className="text-gray-500 text-sm">{blog.author.bio}</div> */}
                </div>
              </Space>
            </Space>

            <Space className="mt-4 sm:mt-0 text-gray-500">
              <Space>
                <CalendarOutlined />
                <span>{formatDateTime(blog.publishedAt)}</span>
              </Space>
            </Space>
          </div>

          {/* Nội dung bài viết */}
          <div
            className="prose max-w-none mt-8 blog-content"
          > <Markdown>{blog.content}</Markdown></div>

          {/* Chia sẻ bài viết */}
          <Divider />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <Text strong>Chia sẻ bài viết này:</Text>
            <Space className="mt-2 sm:mt-0">
              <Button icon={<FacebookOutlined />} shape="circle" />
              <Button icon={<TwitterOutlined />} shape="circle" />
              <Button icon={<LinkedinOutlined />} shape="circle" />
              <Button icon={<ShareAltOutlined />} shape="circle" />
            </Space>
          </div>
        </div>

        {/* Bài viết liên quan */}
        {/* <div className="mb-12">
          <Title level={3} className="mb-6">
            Bài viết liên quan
          </Title>
          <Row gutter={[16, 16]}>
            {relatedPosts.map((post) => (
              <Col xs={24} sm={12} lg={8} key={post.id}>
                <Card
                  hoverable
                  cover={
                    <div className="h-40 overflow-hidden">
                      <img
                        alt={post.title}
                        src={post.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  }
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <Title level={5} className="mb-2 line-clamp-2">
                    {post.title}
                  </Title>
                  <Paragraph className="text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </Paragraph>
                  <div className="flex justify-between items-center">
                    <Space>
                      <Avatar src={post.author.avatar} size="small" />
                      <Text className="text-xs">{post.author.name}</Text>
                    </Space>
                    <Text className="text-xs text-gray-500">{post.date}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div> */}

        {/* Nút quay lại cuối trang */}
        <div className="text-center mb-8">
          <Button type="primary" onClick={() => navigate("/blog")}>
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
