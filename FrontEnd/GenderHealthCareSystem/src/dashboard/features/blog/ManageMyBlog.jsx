import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Input,
  Tag,
  Typography,
  Tooltip,
  Badge,
  Card,
  Modal,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { formatDateTime } from "../../../components/utils/format";
import BlogModal from "../../components/modal/BlogModal";
import ViewBlogModal from "../../components/modal/ViewBlogModal";
import { useAuth } from "../../../components/provider/AuthProvider";
import { approveBlogAPI, deleteBlogAPI, viewAllBlogsAPI, viewMyBlogsAPI } from "../../../components/api/Blog.api";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const ManageMyBlog = () => {
  const { user } = useAuth(); // Lấy thông tin user hiện tại
  const isConsultant = user?.role === "Consultant";

  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);
  const [viewBlogModalVisible, setViewBlogModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // State cho modal từ chối
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [blogToReject, setBlogToReject] = useState(null);

  // Danh sách tags
  const tagOptions = [
    { value: "Sức khỏe", label: "Sức khỏe", color: "green" },
    { value: "Giới tính", label: "Giới tính", color: "blue" },
    { value: "Tư vấn", label: "Tư vấn", color: "purple" },
    { value: "STIs", label: "STIs", color: "red" },
    { value: "Kinh nguyệt", label: "Kinh nguyệt", color: "pink" },
  ];

  // Cấu hình trạng thái bài viết - Đã bỏ trạng thái "draft"
  const statusConfig = {
    PENDING: {
      status: "pending",
      text: "Chờ duyệt",
      color: "#1890ff",
      badgeColor: "blue",
      description: "Bài viết đang chờ phê duyệt từ quản trị viên",
    },
    PUBLISHED: {
      status: "success",
      text: "Đã duyệt",
      color: "#52c41a",
      badgeColor: "green",
      description: "Bài viết đã được phê duyệt và hiển thị công khai",
    },
    rejected: {
      status: "error",
      text: "Bị từ chối",
      color: "#f5222d",
      badgeColor: "red",
      description: "Bài viết đã bị từ chối, vui lòng chỉnh sửa nội dung",
    },
  };

  // Danh sách status options để lọc - Đã bỏ "draft"
  const statusOptions = [
    { value: "pending", label: "Chờ duyệt", color: "blue" },
    { value: "approved", label: "Đã duyệt", color: "green" },
    { value: "rejected", label: "Bị từ chối", color: "red" },
  ];

  // Lấy màu tương ứng cho tag
  const getTagColor = (tagName) => {
    const tag = tagOptions.find((t) => t.value === tagName);
    return tag ? tag.color : "default";
  };

  // Fetch danh sách blog
  useEffect(() => {
    fetchBlogList();
  }, [pagination.current, searchText, selectedTags, statusFilter]);

  const fetchBlogList = async () => {
    setLoading(true);
    try {
      const response = isConsultant
        ? await viewMyBlogsAPI({
            page: pagination.current - 1,
            size: pagination.pageSize,
            title: searchText,
            tag: selectedTags.join(", "),
            //status: statusFilter.join(', ')
          })
        : await viewAllBlogsAPI({
            page: pagination.current - 1,
            size: pagination.pageSize,
            title: searchText,
            tag: selectedTags.join(", "),
            //status: statusFilter.join(', ')
          });
      if (response && response.data) {
        setTimeout(() => {
          const formattedPosts = response.data.data.content.map((post) => {
            // Chuyển đổi trường tags từ chuỗi thành mảng objects
            const tagArray = post.tags
              ? post.tags.split(",").map((tag) => ({
                  text: tag.trim(),
                  color: getTagColor(tag.trim()), // Hàm helper để gán màu cho tag
                }))
              : [];

            return {
              ...post,
              tags: tagArray,
              // Đặt URL hình ảnh mặc định nếu thumbnailUrl không hợp lệ
              thumbnailUrl:
                post.thumbnailUrl && !post.thumbnailUrl.includes("example.com")
                  ? post.thumbnailUrl
                  : "https://placehold.co/600x400/0099CF/white?text=Gender+Healthcare",
            };
          });
          console.log(">>> Formatted Posts:", formattedPosts);
          setBlogList(formattedPosts);
          setPagination({
            ...pagination,
            total: response.data.data.totalElements,
          });
          setLoading(false);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 500);
      }
    } catch (error) {
      console.error("Error fetching blog list:", error);
      message.error("Không thể tải danh sách bài viết");
      setLoading(false);
    }
  };

  // Mở modal xem chi tiết blog
  const handleViewBlog = (postId) => {
    const blog = blogList.find((blog) => blog.postId === postId);
    if (blog) {
      setSelectedBlog(blog);
      setViewBlogModalVisible(true);
    } else {
      message.error("Không tìm thấy thông tin bài viết");
    }
  };

  // Mở modal thêm blog mới
  const handleAddNew = () => {
    setCurrentBlog(null);
    setModalVisible(true);
  };

  // Mở modal chỉnh sửa blog
  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setModalVisible(true);
  };

  // Xử lý khi modal thành công (thêm hoặc cập nhật)
  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchBlogList();
  };

  // Xử lý xóa blog
  const handleDelete = async (blogId) => {
    try {
      setLoading(true);
      await deleteBlogAPI(blogId);
      setTimeout(() => {
        fetchBlogList();
        message.success("Xóa bài viết thành công!");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error("Xóa bài viết thất bại");
      setLoading(false);
    }
  };

  // Hàm xử lý duyệt bài viết
  const handleApprove = async (blogId) => {
    try {
      setLoading(true);
      await approveBlogAPI(blogId);
      setTimeout(() => {
        fetchBlogList();
        message.success("Duyệt bài viết thành công!");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error approving blog:", error);
      message.error("Duyệt bài viết thất bại");
      setLoading(false);
    }
  };

  // Hàm mở modal từ chối bài viết
  const openRejectModal = (blog) => {
    setBlogToReject(blog);
    setRejectionReason("");
    setRejectionModalVisible(true);
  };

  // Hàm xử lý từ chối bài viết
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      setLoading(true);
      // Gọi API từ chối bài viết
      //await rejectBlogAPI(blogToReject.postId, rejectionReason);
      setRejectionModalVisible(false);
      setTimeout(() => {
        fetchBlogList();
        message.success("Đã từ chối bài viết");
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error rejecting blog:", error);
      message.error("Từ chối bài viết thất bại");
      setLoading(false);
    }
  };

  // Xử lý phân trang
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý lọc theo tag
  const handleTagFilter = (tag) => {
    const nextSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(nextSelectedTags);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilter = (status) => {
    const nextStatusFilter = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status];

    setStatusFilter(nextStatusFilter);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý xem lý do từ chối
  const handleViewRejectionReason = (reason) => {
    message.info({
      content: (
        <div>
          <strong>Lý do từ chối:</strong>
          <p>{reason || "Không có lý do cụ thể được cung cấp."}</p>
        </div>
      ),
      duration: 5,
    });
  };

  // Cột của bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "postId",
      key: "postId",
      width: 60,
    },
    ...(!isConsultant ? [
      {
        title: "Người đăng",
        dataIndex: "consultantName",
        key: "consultantName",
        width: 150,
        render: (text, record) => (
          <Tooltip title={text}>
            <Avatar
              src={record.consultantImageUrl || "https://placehold.co/40x40/0099CF/white?text=Consultant"}
              size="medium"
              className="mr-2"
            />
            <span className="font-medium ml-2">{text}</span>
          </Tooltip>
        ),
      },
    ] : []),
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "300px",
      render: (text, record) => (
        <div className="">
          <a
            onClick={() => handleViewBlog(record.postId)}
            className="font-medium hover:text-blue-500"
            title={text} // Sử dụng HTML title thay vì Tooltip
          >
            {text}
          </a>
        </div>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: 200,
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Tag
              color={tag.color}
              key={tag.text}
              className="cursor-pointer"
              onClick={() => handleTagFilter(tag.text)}
            >
              {tag.text}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status, record) => {
        const config = statusConfig[status];

        return (
          <div className="flex flex-wrap gap-2">
            <div
              className="inline-flex items-center"
              title={config.description}
            >
              <span style={{ color: config.color }}>{config.text}</span>
            </div>
            {status === "rejected" && record.rejectionReason && (
              <Button
                type="link"
                size="small"
                className="p-0"
                onClick={() =>
                  handleViewRejectionReason(record.rejectionReason)
                }
              >
                Xem lý do
              </Button>
            )}
          </div>
        );
      },
      filters: [
        { text: "Chờ duyệt", value: "pending" },
        { text: "Đã duyệt", value: "approved" },
        { text: "Bị từ chối", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => {
        // Thứ tự ưu tiên: Chờ duyệt -> Bị từ chối -> Đã duyệt
        const order = { pending: 0, rejected: 1, approved: 2 };
        return order[a.status] - order[b.status];
      },
    },
    {
      title: "Ngày đăng",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 160,
      render: (date) => formatDateTime(date),
      sorter: (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt),
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: "Lượt thích",
      dataIndex: "likeCount",
      key: "likeCount",
      width: 100,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {/* Hiển thị button xem bài viết cho tất cả */}
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewBlog(record.postId)}
            title="Xem bài viết"
          />

          {/* Chỉ hiển thị chức năng duyệt/từ chối cho người không phải Consultant */}
          {!isConsultant && record.status === "PENDING" && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.postId)}
                title="Duyệt bài viết"
              />
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => openRejectModal(record)}
                title="Từ chối bài viết"
              />
            </>
          )}

          {/* Chỉ hiển thị chức năng sửa/xóa cho Consultant */}
          {isConsultant && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                title="Chỉnh sửa"
              />
              <Popconfirm
                title="Xóa bài viết"
                description="Bạn có chắc chắn muốn xóa bài viết này?"
                onConfirm={() => handleDelete(record.postId)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />} title="Xóa" />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Title level={4} className="mb-1">
              Quản lý bài viết {isConsultant ? "của tôi" : ""}
            </Title>
            <Text type="secondary">
              {isConsultant
                ? "Thêm và quản lý nội dung blog của bạn"
                : "Quản lý và phê duyệt nội dung blog"}
            </Text>
          </div>

          {/* Chỉ hiển thị nút "Tạo bài viết mới" cho Consultant */}
          {isConsultant && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Tạo bài viết mới
            </Button>
          )}
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <Search
            placeholder="Tìm kiếm theo tiêu đề"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />

          <div className="flex flex-col gap-4 sm:items-end">
            {/* Lọc theo trạng thái */}
            <div className="flex flex-wrap gap-2 items-center">
              <Text strong>Trạng thái:</Text>
              {statusOptions.map((status) => (
                <Tag
                  color={
                    statusFilter.includes(status.value)
                      ? status.color
                      : "default"
                  }
                  key={status.value}
                  className="cursor-pointer"
                  onClick={() => handleStatusFilter(status.value)}
                >
                  {status.label}
                </Tag>
              ))}
              {statusFilter.length > 0 && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => setStatusFilter([])}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Lọc theo tag */}
            <div className="flex flex-wrap gap-2 items-center">
              <Text strong>Chủ đề:</Text>
              {tagOptions.map((tag) => (
                <Tag
                  color={
                    selectedTags.includes(tag.value) ? tag.color : "default"
                  }
                  key={tag.value}
                  className="cursor-pointer"
                  onClick={() => handleTagFilter(tag.value)}
                >
                  {tag.label}
                </Tag>
              ))}
              {selectedTags.length > 0 && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => setSelectedTags([])}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={blogList}
          rowKey="postId"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          size="middle"
          scroll={{ x: "max-content" }}
          className="break-words"
        />
      </Card>

      {/* Modal đa năng cho cả thêm và chỉnh sửa blog - chỉ hiển thị cho Consultant */}
      {isConsultant && (
        <BlogModal
          visible={modalVisible}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSuccess={handleModalSuccess}
          blog={currentBlog}
        />
      )}

      {/* Modal xem chi tiết blog */}
      <ViewBlogModal
        visible={viewBlogModalVisible}
        open={viewBlogModalVisible}
        onClose={() => setViewBlogModalVisible(false)}
        blog={selectedBlog}
      />

      {/* Modal từ chối bài viết */}
      <Modal
        title="Từ chối bài viết"
        open={rejectionModalVisible}
        onCancel={() => setRejectionModalVisible(false)}
        onOk={handleReject}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <div className="mb-2">
          <Text>Vui lòng nhập lý do từ chối bài viết này:</Text>
        </div>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Nhập lý do từ chối..."
        />
      </Modal>
    </div>
  );
};

export default ManageMyBlog;
