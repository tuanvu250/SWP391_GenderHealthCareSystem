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
  message,
  Tooltip,
  Modal,
  Form,
  Input,
  List,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  CopyOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { blogDetailAPI } from "../components/utils/api";
import { formatDateTime } from "../components/utils/formatTime";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BlogDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog?.likeCount || 0);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [shareMenuVisible, setShareMenuVisible] = useState(false);
  const [commentForm] = Form.useForm();
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      content: "Bài viết rất hữu ích, cảm ơn tác giả đã chia sẻ thông tin!",
      date: "2025-06-18T09:12:00Z",
      likes: 5,
      liked: false,
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
      content:
        "Tôi đã áp dụng những kiến thức này và thấy rất hiệu quả. Mong tác giả chia sẻ thêm về chủ đề này.",
      date: "2025-06-17T14:30:00Z",
      likes: 3,
      liked: false,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content:
        "Bài viết rất dễ hiểu. Tôi còn có thắc mắc là việc kiểm tra sức khỏe thường xuyên nên thực hiện theo định kỳ như thế nào?",
      date: "2025-06-15T08:45:00Z",
      likes: 2,
      liked: false,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content:
        "Bài viết rất dễ hiểu. Tôi còn có thắc mắc là việc kiểm tra sức khỏe thường xuyên nên thực hiện theo định kỳ như thế nào?",
      date: "2025-06-15T08:45:00Z",
      likes: 2,
      liked: false,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content:
        "Bài viết rất dễ hiểu. Tôi còn có thắc mắc là việc kiểm tra sức khỏe thường xuyên nên thực hiện theo định kỳ như thế nào?",
      date: "2025-06-15T08:45:00Z",
      likes: 2,
      liked: false,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content:
        "Bài viết rất dễ hiểu. Tôi còn có thắc mắc là việc kiểm tra sức khỏe thường xuyên nên thực hiện theo định kỳ như thế nào?",
      date: "2025-06-15T08:45:00Z",
      likes: 2,
      liked: false,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content:
        "Bài viết rất dễ hiểu. Tôi còn có thắc mắc là việc kiểm tra sức khỏe thường xuyên nên thực hiện theo định kỳ như thế nào?",
      date: "2025-06-15T08:45:00Z",
      likes: 2,
      liked: false,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content:
        "Bài viết rất dễ hiểu. Tôi còn có thắc mắc là việc kiểm tra sức khỏe thường xuyên nên thực hiện theo định kỳ như thế nào?",
      date: "2025-06-15T08:45:00Z",
      likes: 2,
      liked: false,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content:
        "Bài viết rất dễ hiểu. Tôi còn có thắc mắc là việc kiểm tra sức khỏe thường xuyên nên thực hiện theo định kỳ như thế nào?",
      date: "2025-06-15T08:45:00Z",
      likes: 2,
      liked: false,
    },
    {
      id: 3,
      name: "Phạm Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content:
        "Bài viết rất dễ hiểu. Tôi còn có thắc mắc là việc kiểm tra sức khỏe thường xuyên nên thực hiện theo định kỳ như thế nào?",
      date: "2025-06-15T08:45:00Z",
      likes: 2,
      liked: false,
    }
  ]);
  const [commentText, setCommentText] = useState("");
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentInputValue, setCommentInputValue] = useState("");

  // Dữ liệu mẫu cho bài viết chi tiết
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

          setBlog({
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

  const handleLike = () => {
    // Trong thực tế, bạn sẽ gọi API để like/unlike
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    // Giả lập API call
    // api.likePost(blog.id, !liked)
  };

  // Hàm xử lý comment
  const handleComment = () => {
    setCommentModalOpen(true);
  };

  // Hàm xử lý chia sẻ
  const handleShare = () => {
    setShareMenuVisible(!shareMenuVisible);
  };

  // Hàm xử lý gửi comment
  const handleSubmitComment = (values) => {
    // Trong thực tế, bạn sẽ gọi API để gửi comment
    console.log("Comment submitted:", values);
    message.success("Bình luận của bạn đã được gửi!");
    commentForm.resetFields();
    setCommentModalVisible(false);
  };

  // Hàm xử lý sao chép link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      function () {
        message.success("Đã sao chép liên kết!");
        setShareMenuVisible(false);
      },
      function () {
        message.error("Không thể sao chép liên kết!");
      }
    );
  };

  // Thêm hàm xử lý gửi comment
  const handleSubmitCommentText = () => {
    if (!commentText.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    // Tạo comment mới
    const newComment = {
      id: comments.length + 1,
      name: "User", // Trong thực tế lấy từ thông tin đăng nhập
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      content: commentText,
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
    };

    // Thêm comment vào danh sách
    setComments([newComment, ...comments]);
    setCommentText(""); // Reset input
    message.success("Đã đăng bình luận thành công!");
  };

  // Thêm hàm xử lý like comment
  const handleLikeComment = (commentId) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  // Hàm xử lý gửi bình luận từ modal
  const handleSubmitModalComment = () => {
    if (!commentInputValue.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    // Tạo comment mới
    const newComment = {
      id: comments.length + 1,
      name: "User", // Trong thực tế lấy từ thông tin đăng nhập
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      content: commentInputValue,
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
    };

    // Thêm comment vào danh sách
    setComments([newComment, ...comments]);
    setCommentInputValue(""); // Reset input
    message.success("Đã đăng bình luận thành công!");
    setCommentModalOpen(false);
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
          <div className="prose max-w-none mt-8 blog-content">
            {" "}
            <Markdown>{blog.content}</Markdown>
          </div>

          {/* Thích, bình luận và chia sẻ bài viết */}
          <Divider />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center gap-4">
              <Button
                icon={liked ? <LikeFilled /> : <LikeOutlined />}
                onClick={handleLike}
                type={liked ? "primary" : "default"}
                size="middle"
                className="flex items-center gap-2"
              >
                {liked ? "Đã thích" : "Thích"}{" "}
                <span className="text-sm text-gray-500">{likeCount}</span>
              </Button>

              <Button
                icon={<CommentOutlined />}
                onClick={handleComment}
                type="default"
                size="middle"
                className="flex items-center gap-2"
              >
                Bình luận
              </Button>
            </div>

            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button
                icon={<FacebookOutlined />}
                shape="circle"
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/sharer/sharer.php?u=" +
                      window.location.href,
                    "_blank"
                  )
                }
              />
              <Button
                icon={<TwitterOutlined />}
                shape="circle"
                onClick={() =>
                  window.open(
                    "https://twitter.com/intent/tweet?url=" +
                      window.location.href,
                    "_blank"
                  )
                }
              />
              <Button
                icon={<ShareAltOutlined />}
                shape="circle"
                onClick={handleShare}
              />
            </div>
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

        {/* Modal bình luận */}
        <Modal
          title={
            <div className="text-xl font-bold">
              Bình luận ({comments.length})
            </div>
          }
          open={commentModalOpen}
          onCancel={() => setCommentModalOpen(false)}
          className="comment-modal"
          width={800}
          footer={null}
          bodyStyle={{
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          {/* Danh sách bình luận */}
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item
                key={comment.id}
                actions={[
                  <Button
                    key="reply"
                    type="text"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={() => message.info("Chức năng sắp ra mắt!")}
                  >
                    Trả lời
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={comment.avatar} />}
                  title={
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(comment.date)}
                      </span>
                    </div>
                  }
                  description={comment.content}
                />
              </List.Item>
            )}
          />
          {/* Bình luận */}
          <div
            className="flex items-center gap-4 mt-4 sticky bottom-0 bg-white pt-4 rounded-lg shadow-lg m-0"
          >
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
            <div className="flex-1 flex items-center">
              <Input.TextArea
                placeholder="Viết bình luận..."
                value={commentInputValue}
                onChange={(e) => setCommentInputValue(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 3 }}
                style={{ flex: 1, marginRight: "8px" }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSubmitModalComment();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmitModalComment}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BlogDetail;
