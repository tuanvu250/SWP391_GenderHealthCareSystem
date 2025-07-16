import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import {
  Typography,
  Avatar,
  Tag,
  Space,
  Divider,
  Button,
  Dropdown,
  Breadcrumb,
  Spin,
  message,
  Modal,
  Form,
  Input,
  List,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  EllipsisOutlined,
  MessageOutlined,
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDateTime, getTagColor } from "../components/utils/format";
import { useAuth } from "../components/provider/AuthProvider";
import { blogDetailAPI, deleteCommentBlogAPI, editCommentBlogAPI, getCommentsBlogAPI, likeBlogAPI, postCommentBlogAPI, relatedBlogsByIdAPI } from "../components/api/Blog.api";
import RelatedBlog from "./RelatedBlog"; 

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BlogDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog?.likeCount || 0);
  const [shareMenuVisible, setShareMenuVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentInputValue, setCommentInputValue] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState("");

  const fetchBlog = async () => {
    setLoading(true);
    const response = await blogDetailAPI(postId);
    if (response && response.data) {
      const post = response.data.data;
      const tagArray = post.tags
        ? post.tags.split(", ").map((tag) => ({
            text: tag.trim(),
            color: getTagColor(tag.trim()), 
          }))
        : [];

      setBlog({
        ...post,
        tags: tagArray,
        thumbnailUrl:
          post.thumbnailUrl && !post.thumbnailUrl.includes("example.com")
            ? post.thumbnailUrl
            : "https://placehold.co/600x400/0099CF/white?text=Gender+Healthcare",
      });
      setLikeCount(post.likeCount || 0);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getCommentsBlogAPI(postId);
      const data = response.data.data.content;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error.message);
      message.error("Không thể tải bình luận, vui lòng thử lại sau.");
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await relatedBlogsByIdAPI(postId);
      if(response && response.data) {
        const posts = response.data.data.map((post) => ({
          ...post,
          tags: post.tags
            ? post.tags.split(", ").map((tag) => ({
                text: tag.trim(),
                color: getTagColor(tag.trim()),
              }))
            : [],
            })
        );
        setRelatedPosts(posts);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error.message);
      message.error("Không thể tải bài viết liên quan, vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchComments();
    fetchRelatedPosts();
    window.scrollTo(0, 0);
  }, [postId]);

  const handleGoBack = () => {
    navigate(-1); 
  };

  const handleLike = async () => {
    try {
      if (!liked) {
        await likeBlogAPI(postId);
        setLikeCount(likeCount + 1);
      }
      setLiked(true);
    } catch (error) {
      console.error("Error liking blog post:", error.message);
    }
  };

  // Hàm xử lý modal comment
  const handleComment = () => {
    setCommentModalOpen(true);
  };

  // Hàm xử lý chia sẻ
  const handleShare = () => {
    setShareMenuVisible(!shareMenuVisible);
  };

  // Hàm xử lý gửi bình luận từ modal
  const handleSubmitModalComment = async () => {
    if (!commentInputValue.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }
    try {
      await postCommentBlogAPI(postId, commentInputValue);
      fetchComments();
      setCommentInputValue(""); 
      message.success("Đã đăng bình luận thành công!");
      setCommentModalOpen(false);
    } catch (error) {
      console.error("Error submitting comment:", error.message);
      message.error("Không thể đăng bình luận, vui lòng thử lại sau.");
    }
  };

  // Hàm bắt đầu chỉnh sửa comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditCommentValue(comment.content);
  };

  // Hàm lưu comment đã chỉnh sửa
  const handleSaveComment = async (commentId) => {
    if (!editCommentValue.trim()) {
      message.warning("Bình luận không được để trống");
      return;
    }

    try {
      await editCommentBlogAPI(commentId, editCommentValue);
      message.success("Đã cập nhật bình luận");
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error.message);
      message.error("Không thể cập nhật bình luận");
    }
  };

  // Hàm hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentValue("");
  };

  // Hàm xóa comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentBlogAPI(commentId);
      message.success("Đã xóa bình luận");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error.response.message);
      message.error("Không thể xóa bình luận");
    }
  };

  // Hàm kiểm tra xem comment có phải của người đang đăng nhập không
  const isCommentOwner = (comment) => {
    return user && user.userId === comment.userID;
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

        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            className="w-full h-[300px] sm:h-[400px] object-cover"
          />
        </div>

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
                <span
                  className={`text-sm ${
                    liked ? "text-white" : "text-gray-500"
                  }`}
                >
                  {likeCount}
                </span>
              </Button>

              <Button
                icon={<CommentOutlined />}
                onClick={handleComment}
                type="default"
                size="middle"
                className="flex items-center gap-2"
              >
                Bình luận
                <span className="text-sm text-gray-500">{comments.length}</span>
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

        <RelatedBlog posts={relatedPosts} />

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
          styles={{
            maxHeight: "70vh",
            overflowY: "auto",
          }}
          centered
        >
          {comments.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item
                  key={comment.commentId}
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

                    // Nút 3 chấm chỉ hiển thị cho comment của mình
                    isCommentOwner(comment) && (
                      <Dropdown
                        key="more"
                        menu={{
                          items: [
                            {
                              key: "edit",
                              icon: <EditOutlined />,
                              label: "Chỉnh sửa",
                              onClick: () => handleEditComment(comment),
                            },
                            {
                              key: "delete",
                              icon: <DeleteOutlined />,
                              label: "Xóa",
                              danger: true,
                              onClick: () => {
                                Modal.confirm({
                                  title: "Xóa bình luận",
                                  content:
                                    "Bạn có chắc chắn muốn xóa bình luận này không?",
                                  okText: "Xóa",
                                  okType: "danger",
                                  cancelText: "Hủy",
                                  onOk: () =>
                                    handleDeleteComment(comment.commentId),
                                });
                              },
                            },
                          ],
                        }}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <Button
                          type="text"
                          icon={<EllipsisOutlined />}
                          size="small"
                        />
                      </Dropdown>
                    ),
                  ].filter(Boolean)} // Lọc bỏ các giá trị false
                >
                  <List.Item.Meta
                    avatar={<Avatar src={comment.userImageUrl} />}
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {comment.userFullName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(
                            comment.updatedAt || comment.createdAt
                          )}
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
                      editingCommentId === comment.commentId ? (
                        <div className="mt-2">
                          <Input.TextArea
                            value={editCommentValue}
                            onChange={(e) =>
                              setEditCommentValue(e.target.value)
                            }
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            className="mb-2"
                          />
                          <Space className="mt-2">
                            <Button
                              size="small"
                              type="primary"
                              onClick={() =>
                                handleSaveComment(comment.commentId)
                              }
                            >
                              Lưu
                            </Button>
                            <Button size="small" onClick={handleCancelEdit}>
                              Hủy
                            </Button>
                          </Space>
                        </div>
                      ) : (
                        <div>{comment.content}</div>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center text-gray-500">
              <Text>Chưa có bình luận nào.</Text>
            </div>
          )}
          {/* Bình luận */}
          {user && (
          <div className="flex items-center gap-4 mt-4 sticky bottom-0 bg-white p-2 rounded-lg shadow-lg m-0">
            <Avatar src={user.userImageUrl} size="large" />
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
          </div> )}
        </Modal>
      </div>
    </div>
  );
};

export default BlogDetail;
