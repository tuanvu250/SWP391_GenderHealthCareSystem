import React, { useState, useEffect } from 'react';
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
  Card
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  EyeOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { formatDateTime } from '../../../components/utils/formatTime';
import BlogModal from '../../components/modal/BlogModal';

const { Title, Text } = Typography;
const { Search } = Input;

const ManageMyBlog = () => {
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);

  // Danh sách tags
  const tagOptions = [
    { value: 'sức khỏe', label: 'Sức Khỏe', color: 'green' },
    { value: 'giới tính', label: 'Giới Tính', color: 'blue' },
    { value: 'tư vấn', label: 'Tư Vấn', color: 'purple' },
    { value: 'STIs', label: 'STIs', color: 'red' },
    { value: 'kinh nguyệt', label: 'Kinh Nguyệt', color: 'pink' },
  ];

  // Cấu hình trạng thái bài viết - Đã bỏ trạng thái "draft"
  const statusConfig = {
    pending: {
      status: 'processing',
      text: 'Chờ duyệt',
      color: '#1890ff',
      badgeColor: 'blue',
      description: 'Bài viết đang chờ phê duyệt từ quản trị viên'
    },
    approved: {
      status: 'success',
      text: 'Đã duyệt',
      color: '#52c41a',
      badgeColor: 'green',
      description: 'Bài viết đã được phê duyệt và hiển thị công khai'
    },
    rejected: {
      status: 'error',
      text: 'Bị từ chối',
      color: '#f5222d',
      badgeColor: 'red',
      description: 'Bài viết đã bị từ chối, vui lòng chỉnh sửa nội dung'
    }
  };

  // Danh sách status options để lọc - Đã bỏ "draft"
  const statusOptions = [
    { value: 'pending', label: 'Chờ duyệt', color: 'blue' },
    { value: 'approved', label: 'Đã duyệt', color: 'green' },
    { value: 'rejected', label: 'Bị từ chối', color: 'red' },
  ];

  // Lấy màu tương ứng cho tag
  const getTagColor = (tagName) => {
    const tag = tagOptions.find(t => t.value === tagName.toLowerCase());
    return tag ? tag.color : 'default';
  };

  // Fetch danh sách blog
  useEffect(() => {
    fetchBlogList();
  }, [pagination.current, pagination.pageSize, searchText, selectedTags, statusFilter]);

  const fetchBlogList = async () => {
    setLoading(true);
    try {
      // Mock API call - thay thế bằng API thực tế của bạn
      // const response = await axios.get('/api/my-blogs', {
      //   params: {
      //     page: pagination.current - 1,
      //     size: pagination.pageSize,
      //     search: searchText,
      //     tags: selectedTags.join(','),
      //     status: statusFilter.join(',')
      //   }
      // });
      
      // Dữ liệu mẫu với 3 trạng thái (bỏ draft)
      const mockData = Array.from({ length: 15 }, (_, i) => {
        // Phân bổ các trạng thái đều nhau (chỉ 3 trạng thái)
        let status;
        if (i % 3 === 0) status = 'pending';
        else if (i % 3 === 1) status = 'approved';
        else status = 'rejected';

        return {
          id: i + 1,
          title: `Bài viết về sức khỏe ${i + 1}`,
          summary: `Tóm tắt ngắn về bài viết số ${i + 1} liên quan đến sức khỏe giới tính...`,
          content: `Đây là nội dung đầy đủ của bài viết số ${i + 1}. Sẽ có nhiều thông tin chi tiết ở đây...`,
          tags: i % 2 === 0 ? ['sức khỏe', 'STIs'] : ['giới tính', 'tư vấn'],
          thumbnailUrl: `https://placehold.co/600x400/0099CF/white?text=Blog+${i + 1}`,
          publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
          status: status,
          views: Math.floor(Math.random() * 1000),
          rejectionReason: status === 'rejected' ? 'Nội dung không phù hợp với tiêu chuẩn cộng đồng' : null
        };
      });
      
      // Filter theo search text
      const filteredData = mockData.filter(blog => 
        blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchText.toLowerCase())
      );
      
      // Filter theo tags nếu có
      let finalFilteredData = selectedTags.length > 0 
        ? filteredData.filter(blog => 
            selectedTags.some(tag => blog.tags.includes(tag))
          )
        : filteredData;
      
      // Filter theo status nếu có
      if (statusFilter.length > 0) {
        finalFilteredData = finalFilteredData.filter(blog => 
          statusFilter.includes(blog.status)
        );
      }
      
      setTimeout(() => {
        setBlogList(finalFilteredData);
        setPagination({
          ...pagination,
          total: finalFilteredData.length
        });
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error fetching blog list:", error);
      message.error("Không thể tải danh sách bài viết");
      setLoading(false);
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
  const handleModalSuccess = (blogData) => {
    if (currentBlog) {
      // Cập nhật blog trong danh sách
      const updatedList = blogList.map(blog => 
        blog.id === blogData.id ? { ...blog, ...blogData } : blog
      );
      setBlogList(updatedList);
    } else {
      // Thêm blog mới vào đầu danh sách với trạng thái mặc định là pending
      const newBlog = {
        ...blogData,
        status: 'pending', // Bài viết mới sẽ có trạng thái "Chờ duyệt"
        publishedAt: new Date().toISOString(),
        views: 0
      };
      setBlogList([newBlog, ...blogList]);
    }
    
    setModalVisible(false);
  };

  // Xử lý xóa blog
  const handleDelete = async (blogId) => {
    try {
      setLoading(true);
      // API call - thay thế bằng API thực tế của bạn
      // await axios.delete(`/api/blogs/${blogId}`);
      
      // Mock xóa thành công
      setTimeout(() => {
        setBlogList(blogList.filter(blog => blog.id !== blogId));
        message.success("Xóa bài viết thành công!");
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error("Xóa bài viết thất bại");
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
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(nextSelectedTags);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilter = (status) => {
    const nextStatusFilter = statusFilter.includes(status)
      ? statusFilter.filter(s => s !== status)
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
      duration: 5
    });
  };

  // Cột của bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Tooltip title="Xem bài viết">
            <a 
              href={`/blog/${record.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:text-blue-500"
            >
              {text}
            </a>
          </Tooltip>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Tag 
              color={getTagColor(tag)} 
              key={tag}
              className="cursor-pointer"
              onClick={() => handleTagFilter(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 160,
      render: date => formatDateTime(date),
      sorter: (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status, record) => {
        const config = statusConfig[status];
        
        return (
          <div className="flex items-center flex-wrap">
            <Tooltip title={config.description}>
              <Badge
                status={config.status}
                text={<span style={{ color: config.color }}>{config.text}</span>}
              />
            </Tooltip>
            
            {/* Hiện nút xem lý do nếu bài viết bị từ chối */}
            {status === 'rejected' && record.rejectionReason && (
              <Button 
                type="link" 
                size="small" 
                className="ml-2 p-0"
                onClick={() => handleViewRejectionReason(record.rejectionReason)}
              >
                Xem lý do
              </Button>
            )}
          </div>
        );
      },
      filters: [
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Bị từ chối', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => {
        // Thứ tự ưu tiên: Chờ duyệt -> Bị từ chối -> Đã duyệt
        const order = { pending: 0, rejected: 1, approved: 2 };
        return order[a.status] - order[b.status];
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'approved' && (
            <Tooltip title="Xem bài viết">
              <Button 
                icon={<EyeOutlined />}
                href={`/blog/${record.id}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            </Tooltip>
          )}
          <Tooltip title="Chỉnh sửa">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)} 
            />
          </Tooltip>
          <Popconfirm
            title="Xóa bài viết"
            description="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Title level={4} className="mb-1">Quản lý bài viết của tôi</Title>
            <Text type="secondary">Thêm và quản lý nội dung blog của bạn</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Tạo bài viết mới
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <Search
            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />
          
          <div className="flex flex-col gap-4 sm:items-end">
            {/* Lọc theo trạng thái */}
            <div className="flex flex-wrap gap-2 items-center">
              <Text strong>Trạng thái:</Text>
              {statusOptions.map(status => (
                <Tag
                  color={statusFilter.includes(status.value) ? status.color : 'default'}
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
              {tagOptions.map(tag => (
                <Tag
                  color={selectedTags.includes(tag.value) ? tag.color : 'default'}
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
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Modal đa năng cho cả thêm và chỉnh sửa blog */}
      <BlogModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleModalSuccess}
        blog={currentBlog}
      />
    </div>
  );
};

export default ManageMyBlog;