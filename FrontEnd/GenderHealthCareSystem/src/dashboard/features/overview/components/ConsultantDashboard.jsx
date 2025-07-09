import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  List,
  Avatar,
  Tag,
  Button,
  Typography,
  Space,
  message,
} from "antd";
import {
  ArrowUpOutlined,
  MessageOutlined,
  StarOutlined,
  DollarOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  StarFilled,
} from "@ant-design/icons";
import ChartComponent from "../../../components/chart/ChartComponent";
import { pieChartOptions, ratingBarChartOptions } from "../utils/chartConfig";
import { viewMyBlogsAPI } from "../../../../components/api/Blog.api";
import { useNavigate } from "react-router-dom";
import ViewBlogModal from "../../../components/modal/ViewBlogModal";
import { formatDateTime } from "../../../../components/utils/format";
import BlogModal from "../../../components/modal/BlogModal";

const { Title, Text } = Typography;

const ConsultantDashboard = ({ stats }) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [blogList, setBlogList] = useState([]);
  const [viewBlogModalVisible, setViewBlogModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const fetchBlogList = async () => {
    setLoading(true);
    try {
      const response = await viewMyBlogsAPI({
        page: pagination.current - 1,
        size: pagination.pageSize,
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
          setBlogList(formattedPosts);
          setPagination({
            ...pagination,
            total: response.data.data.totalElements,
          });
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error fetching blog list:", error);
      message.error("Không thể tải danh sách bài viết");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogList();
  }, [pagination.current, pagination.pageSize]);

    // Xử lý khi modal thành công (thêm hoặc cập nhật)
  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchBlogList();
  };

  const handleEditBlog = (blog) => {
    setModalVisible(true);
    setSelectedBlog(blog);
  }

  const handleViewBlog = (blog) => {
    if (blog) {
      setSelectedBlog(blog);
      setViewBlogModalVisible(true);
    } else {
      message.error("Không tìm thấy thông tin bài viết");
    }
  };

  // Biểu đồ thống kê loại hình tư vấn (giữ nguyên)
  const consultationTypesChart = stats.consultationTypes
    ? {
        labels: stats.consultationTypes.map((d) => d.type),
        datasets: [
          {
            label: "Số lượng",
            data: stats.consultationTypes.map((d) => d.count),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Tính tổng số đánh giá
  const calculateTotalRatings = () => {
    if (!stats.ratings) return 0;
    return (
      (stats.ratings.five || 0) +
      (stats.ratings.four || 0) +
      (stats.ratings.three || 0) +
      (stats.ratings.two || 0) +
      (stats.ratings.one || 0)
    );
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Thu nhập tháng này"
              value={stats.monthlyEarnings || 0}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
            <div className="mt-1">
              {stats.monthlyEarningsChange > 0 ? (
                <Text type="success">
                  <ArrowUpOutlined /> {stats.monthlyEarningsChange}% so với
                  tháng trước
                </Text>
              ) : (
                <Text type="danger">
                  <ArrowUpOutlined style={{ transform: "rotate(180deg)" }} />{" "}
                  {Math.abs(stats.monthlyEarningsChange || 0)}% so với tháng
                  trước
                </Text>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Câu hỏi chưa trả lời"
              value={stats.unansweredQuestions || 0}
              valueStyle={{ color: "#1677ff" }}
              prefix={<QuestionCircleOutlined />}
            />
            {stats.unansweredQuestions > 0 && (
              <div className="mt-2">
                <Button size="small" type="primary">
                  Trả lời ngay
                </Button>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Đánh giá mới"
              value={stats.newReviews || 0}
              valueStyle={{ color: stats.newReviews > 0 ? "#faad14" : "" }}
              prefix={<StarOutlined />}
            />
            {stats.newReviews > 0 && (
              <div className="mt-2">
                <Button size="small" type="default">
                  Xem đánh giá
                </Button>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Lịch hẹn tuần này"
              value={stats.weeklyAppointments || 0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={16}>
          <Card
            title="Đánh giá từ người dùng"
            extra={
              <span>
                <StarFilled style={{ color: "#faad14" }} />{" "}
                {stats.averageRating || 0}/5
              </span>
            }
            className="h-full"
          >
            <Row>
              <Col span={24}>
                <ChartComponent
                  data={{
                    labels: ["5 ★", "4 ★", "3 ★", "2 ★", "1 ★"],
                    datasets: [
                      {
                        type: "bar",
                        label: "Phần trăm đánh giá",
                        data: [
                          stats.ratings?.five || 0,
                          stats.ratings?.four || 0,
                          stats.ratings?.three || 0,
                          stats.ratings?.two || 0,
                          stats.ratings?.one || 0,
                        ],
                        backgroundColor: [
                          "rgba(82, 196, 26, 0.8)", // 5 sao
                          "rgba(82, 196, 26, 0.6)", // 4 sao
                          "rgba(250, 173, 20, 0.6)", // 3 sao
                          "rgba(250, 140, 22, 0.6)", // 2 sao
                          "rgba(245, 34, 45, 0.6)", // 1 sao
                        ],
                        barThickness: 15,
                      },
                    ],
                  }}
                  options={ratingBarChartOptions}
                  type="bar"
                  height="180px"
                />
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Statistic
                title="Đánh giá trung bình"
                value={stats.averageRating || 0}
                precision={1}
                valueStyle={{ color: "#faad14", fontSize: "28px" }}
                suffix=" / 5"
              />
              <Text type="secondary">
                Dựa trên {calculateTotalRatings()} đánh giá
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Loại hình tư vấn" className="h-full">
            {consultationTypesChart ? (
              <ChartComponent
                data={consultationTypesChart}
                options={pieChartOptions}
                type="pie"
                height="300px"
              />
            ) : (
              <div className="text-center p-6">Không có dữ liệu biểu đồ</div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Câu hỏi mới nhất" className="h-full">
            <List
              dataSource={stats.recentQuestions || []}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="answer" size="small" type="primary">
                      Trả lời
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.avatarUrl || "https://via.placeholder.com/32"}
                      />
                    }
                    title={<a href="#">{item.question}</a>}
                    description={
                      <>
                        <Text type="secondary">
                          {item.userName} · {item.time}
                        </Text>
                        <div className="mt-1">
                          <Tag color="blue">{item.category}</Tag>
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
              pagination={{
                pageSize: 3,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Bài viết của tôi" className="h-full">
            <List
              dataSource={blogList}
              loading={loading}
              rowKey="blogId"
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="view"
                      size="small"
                      type="default"
                      onClick={() => handleViewBlog(item)}
                    >
                      Xem
                    </Button>,
                    <Button key="edit" size="small" type="primary"
                      onClick={() => handleEditBlog(item)}>
                      Chỉnh sửa
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <FileTextOutlined
                        style={{ fontSize: "24px", color: "#1677ff" }}
                      />
                    }
                    title={<a href="#">{item.title}</a>}
                    description={
                      <>
                        <Text type="secondary">
                          Đăng lúc {formatDateTime(item.createdAt)}
                        </Text>
                      </>
                    }
                  />
                  <div>
                    {item.status === "PUBLISHED" ? (
                      <Tag color="green">Đã đăng</Tag>
                    ) : item.status === "PENDING" ? (
                      <Tag color="orange">Chờ duyệt</Tag>
                    ) : (
                      <Tag color="red">Từ chối</Tag>
                    )}
                  </div>
                </List.Item>
              )}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: (page, pageSize) => {
                  setPagination({ current: page, pageSize });
                },
              }}
            />
          </Card>
          <ViewBlogModal
            visible={viewBlogModalVisible}
            open={viewBlogModalVisible}
            onClose={() => setViewBlogModalVisible(false)}
            blog={selectedBlog}
          />
          <BlogModal
            visible={modalVisible}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            onSuccess={handleModalSuccess}
            blog={selectedBlog}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Lịch hẹn sắp tới" className="h-full">
            <Table
              dataSource={stats.upcomingAppointments || []}
              rowKey="id"
              columns={[
                {
                  title: "Thời gian",
                  dataIndex: "time",
                  key: "time",
                  render: (text) => <Text strong>{text}</Text>,
                },
                {
                  title: "Khách hàng",
                  dataIndex: "customer",
                  key: "customer",
                },
                {
                  title: "Loại tư vấn",
                  dataIndex: "type",
                  key: "type",
                  render: (text) => <Tag color="blue">{text}</Tag>,
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => {
                    let color = "default";
                    if (status === "confirmed") color = "green";
                    if (status === "pending") color = "orange";
                    return (
                      <Tag color={color}>
                        {status === "confirmed"
                          ? "Đã xác nhận"
                          : status === "pending"
                          ? "Chờ xác nhận"
                          : status}
                      </Tag>
                    );
                  },
                },
                {
                  title: "Hành động",
                  key: "action",
                  render: (_, record) => (
                    <Space>
                      <Button size="small" type="primary">
                        Chi tiết
                      </Button>
                      {record.status === "pending" && (
                        <Button
                          size="small"
                          type="primary"
                          className="bg-green-600"
                        >
                          Xác nhận
                        </Button>
                      )}
                    </Space>
                  ),
                },
              ]}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ConsultantDashboard;
