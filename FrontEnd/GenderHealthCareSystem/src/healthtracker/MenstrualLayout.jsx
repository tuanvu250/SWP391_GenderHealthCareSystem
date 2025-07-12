import { Outlet } from "react-router-dom";
import { Layout, Typography, message } from "antd";
import { CalendarOutlined, SafetyOutlined } from "@ant-design/icons";
import RelatedBlog from "../blog/RelatedBlog";
import { useEffect, useState } from "react";
import { relatedBlogsByTagAPI } from "../components/api/Blog.api";
import { getTagColor } from "../components/utils/format";

const { Title, Text } = Typography;

const MenstrualLayout = () => {
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await relatedBlogsByTagAPI("Kinh nguyệt");
        if (response && response.data) {
          const posts = response.data.data.map((post) => ({
            ...post,
            tags: post.tags
              ? post.tags.split(", ").map((tag) => ({
                  text: tag.trim(),
                  color: getTagColor(tag.trim()),
                }))
              : [],
          }));
          setRelatedBlogs(posts);
        }
      } catch (error) {
        console.error("Error fetching related posts:", error.message);
        message.error(
          "Không thể tải bài viết liên quan, vui lòng thử lại sau."
        );
      }
    };
    fetchRelatedPosts();
  }, []);

  return (
    <Layout className="min-h-screen">
      <Layout.Content className="bg-gray-50">
        {/* Banner theo dõi kinh nguyệt với tone hồng - đã giảm kích thước */}
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 py-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-start justify-between">
              {/* Phần nội dung bên trái - đã giảm nội dung */}
              <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-4 lg:mb-0">
                <div className="flex items-center mb-2">
                  <CalendarOutlined className="text-pink-500 mr-2" />
                  <Text className="text-pink-700 font-medium">
                    Theo dõi chu kỳ kinh nguyệt & sức khỏe phụ nữ
                  </Text>
                </div>

                <Title level={3} className="mb-2">
                  <span className="text-gray-800">Theo dõi kinh nguyệt</span>{" "}
                  <span className="text-pink-500">chính xác & tiện lợi</span>
                </Title>

                <Text className="text-gray-600 block">
                  Theo dõi chu kỳ kinh nguyệt, dự đoán thời gian hành kinh tiếp
                  theo và bảo mật 100%.
                </Text>

                {/* Đã bỏ phần buttons */}

                <div className="flex items-center gap-8 mt-4">
                  <div className="flex items-center">
                    <CalendarOutlined className="text-pink-500 mr-2" />
                    <Text>Dự đoán chính xác</Text>
                  </div>
                  <div className="flex items-center">
                    <SafetyOutlined className="text-pink-500 mr-2" />
                    <Text>100% bảo mật</Text>
                  </div>
                </div>
              </div>

              {/* Phần bên phải - Quy trình 4 bước - đã tối giản */}
              <div className="w-full lg:w-5/12 rounded-xl p-4">
                <div className=" mb-3">
                  <div className="items-center justify-center bg-pink-100 mb-2">
                    <Title level={4} className="mb-1">
                      Quy trình đơn giản
                    </Title>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <Text className="font-medium block text-sm">
                        Ghi ngày kinh nguyệt
                      </Text>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <Text className="font-medium block text-sm">
                        Dự đoán chu kỳ
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <Outlet />

        {/* Blog liên quan */}
        <div className="container mx-auto max-w-5xl py-8">
          <Title level={3} className="text-center mb-6">
            Bài viết liên quan
          </Title>
          <Text className="text-gray-600 text-center block mb-4">
            Tìm hiểu thêm về sức khỏe phụ nữ và các vấn đề liên quan đến kinh
            nguyệt.
          </Text>
          <RelatedBlog posts={relatedBlogs} />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default MenstrualLayout;
