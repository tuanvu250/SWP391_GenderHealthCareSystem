import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Tag, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { formatDateTime, getTagColor } from "../components/utils/format";
import { blogHomeAPI } from "../components/api/Blog.api";

const HomeBlog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch latest blog posts from API
    const fetchBlogPosts = async () => {
      try {
        const response = await blogHomeAPI();

        // Truy cập đúng mảng blog posts
        if (response && response.data && Array.isArray(response.data.data)) {
          // Chuyển đổi dữ liệu từ API để phù hợp với cấu trúc dự kiến
          const formattedPosts = response.data.data.map((post) => {
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
        } else {
          //console.error("Invalid data format:", response);
          setBlogPosts([]); // Đặt mảng rỗng nếu không có dữ liệu hợp lệ
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]); // Khởi tạo mảng rỗng trong trường hợp lỗi
      }
    };
    fetchBlogPosts();
  }, []);
  //Thêm state cho blog posts

  return (
    <div className="py-16 px-16 bg-white">
      <div className="mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-[#0099CF] uppercase tracking-wider">
            Kiến thức sức khỏe
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Bài viết mới nhất
          </h2>
          <div className="w-20 h-1 bg-[#0099CF] mx-auto mt-4"></div>
          <p className="text-gray-600 max-w-xl mx-auto mt-6">
            Khám phá kiến thức mới nhất về sức khỏe giới tính và chủ đề liên
            quan
          </p>
        </div>

        {/* Blog Posts Grid - 4 posts in one row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {blogPosts.map((post) => (
            <Card
              onClick={() => navigate(`/blog/${post.postId}`)}
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

        {/* See All Blog Posts Button */}
        <div className="mt-12 text-center">
          <Button
            size="large"
            className="h-12 px-8 rounded-full border-[#0099CF] text-[#0099CF] hover:text-[#0088bb] hover:border-[#0088bb] shadow-sm"
            onClick={() => navigate("/blog")}
          >
            Xem tất cả bài viết <ArrowRightOutlined />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeBlog;
