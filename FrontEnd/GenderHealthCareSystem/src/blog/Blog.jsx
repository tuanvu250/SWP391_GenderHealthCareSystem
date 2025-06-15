import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Select,
  Card,
  Tag,
  Avatar,
  Row,
  Col,
  Divider,
  Space,
  Pagination,
  Button,
  Empty,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { blogSearchAPI } from "../components/utils/api";
import { formatDateTime } from "../components/utils/formatTime";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8; // Điều chỉnh số lượng bài hiển thị để chia hết cho 4
  const [blogPosts, setBlogPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allTags, setAllTags] = useState([
    { value: "Sức khỏe", label: "Sức Khỏe", color: "green" },
    { value: "Giới tính", label: "Giới tính", color: "blue" },
    { value: "Tư vấn", label: "Tư vấn", color: "purple" },
    { value: "STIs", label: "STIs", color: "red" },
    { value: "Kinh nguyệt", label: "Kinh nguyệt", color: "pink" },
  ]);

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

  const fetchBlogPosts = async () => {
    try {
      const response = await blogSearchAPI({
        title: searchQuery,
        page: currentPage - 1, // API thường sử dụng chỉ số trang bắt đầu từ 0
        size: postsPerPage,
        tag: selectedTags.join(", "), // Chuyển đổi mảng tags thành chuỗi
        sort: sortOrder,
      });

      if (response && response.data) {
        setTotalPosts(response.data.data.totalElements);
        setTotalPages(response.data.data.totalPages);

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

        setBlogPosts(formattedPosts);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  useEffect(() => {
    // Lấy danh sách bài viết khi component mount
    fetchBlogPosts();
  }, [searchQuery, selectedTags, sortOrder, currentPage]);

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Xử lý thay đổi tags
  const handleTagChange = (values) => {
    setSelectedTags(values);
  };

  // Xử lý thay đổi thứ tự sắp xếp
  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-100vw mx-auto md:px-16 px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Title
            level={1}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Blog Sức Khỏe
          </Title>
          <h2 className="text-gray-600 max-w-2xl mx-auto mt-4">
            Khám phá kiến thức mới nhất về sức khỏe giới tính và chủ đề liên
            quan từ các chuyên gia hàng đầu
          </h2>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={10}>
              <Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                enterButton={
                  <>
                    <SearchOutlined /> Tìm kiếm
                  </>
                }
                size="large"
                onSearch={handleSearch}
              />
            </Col>

            <Col xs={24} md={8}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Lọc theo chủ đề"
                onChange={handleTagChange}
                size="large"
                optionLabelProp="label"
              >
                {allTags.map((tag) => (
                  <Option key={tag.value} value={tag.value} label={tag.label}>
                    <Space>
                      <Tag color={tag.color}>{tag.label}</Tag>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="Sắp xếp theo"
                onChange={handleSortChange}
                defaultValue="newest"
                size="large"
              >
                <Option value="desc">Mới nhất trước</Option>
                <Option value="asc">Cũ nhất trước</Option>
              </Select>
            </Col>
          </Row>

          {selectedTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Text strong className="mr-2">
                Chủ đề đã chọn:
              </Text>
              {selectedTags.map((tagValue) => {
                const tag = allTags.find((t) => t.value === tagValue);
                return (
                  <Tag
                    key={tagValue}
                    color={tag?.color}
                    closable
                    onClose={() =>
                      setSelectedTags(
                        selectedTags.filter((t) => t !== tagValue)
                      )
                    }
                  >
                    {tag?.label}
                  </Tag>
                );
              })}
              <Button
                type="link"
                onClick={() => setSelectedTags([])}
                size="small"
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <Text className="text-gray-600">
            Hiển thị {totalPosts} bài viết
            {searchQuery && (
              <span>
                {" "}
                với từ khóa "<strong>{searchQuery}</strong>"
              </span>
            )}
          </Text>
        </div>

        {/* Blog Posts Grid - Thay đổi thành 4 cột */}
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {blogPosts.map((post) => (
              <Card
                key={post.postId}
                hoverable
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                cover={
                  <div className="h-40 md:h-36 lg:h-32 xl:h-40 overflow-hidden">
                    <img
                      alt={post.title}
                      src={post.thumbnailUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                }
                onClick={() => navigate(`/blog/${post.postId}`)}
              >
                <div className="flex flex-col flex-grow p-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.map((tag, index) => (
                      <Tag key={index} color={tag.color} className="text-xs">
                        {tag.text}
                      </Tag>
                    ))}
                  </div>
                  <h3 className="text-base font-bold mb-1 text-gray-800 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                    {post.content
                      ? post.content.slice(0, 100) + "..."
                      : "No content available."}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                      <Avatar src={post.consultantImageUrl} size="large" />
                      <span className="ml-2 text-gray-500 text-xs">
                        {post.consultantName}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {formatDateTime(post.publishedAt)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            description={<span>Không tìm thấy bài viết phù hợp</span>}
            className="my-12"
          />
        )}

        {/* Pagination */}

        <div className="mt-12 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={postsPerPage}
            total={totalPages * postsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Blog;
