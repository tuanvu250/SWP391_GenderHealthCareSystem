import React from "react";
import { Typography, Avatar, Card, Row, Col, Space, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../components/utils/format";

const { Title, Text, Paragraph } = Typography;

/**
 * Component hiển thị các bài viết liên quan
 * @param {Array} posts - Danh sách bài viết liên quan
 */
const RelatedBlog = ({ posts = [] }) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return null; // Không hiển thị gì nếu không có bài viết liên quan
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      {posts.map((post) => (
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
          <div className="flex flex-col flex-grow">
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
  );
};

export default RelatedBlog;
