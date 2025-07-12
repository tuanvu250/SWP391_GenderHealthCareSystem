import React, { use, useEffect, useState } from "react";
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
  LineChartOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import ChartComponent from "../../../components/chart/ChartComponent";
import {
  appointmentsChartOptions,
  ratingBarChartOptions,
} from "../utils/chartConfig";
import { viewMyBlogsAPI } from "../../../../components/api/Blog.api";
import { useNavigate } from "react-router-dom";
import ViewBlogModal from "../../../components/modal/ViewBlogModal";
import {
  formatDateTime,
  getTagColor,
} from "../../../../components/utils/format";
import BlogModal from "../../../components/modal/BlogModal";
import { getConsultantSchedule, updateBookingStatus } from "../../../../components/api/ConsultantBooking.api";
import dayjs from "dayjs";

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
  const [newestAppointments, setNewestAppointments] = useState([]);

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

  const fetchAppointments = async () => {
    try {
      const response = await getConsultantSchedule({
        size: 100,
        status: "SCHEDULED",
        startDate: dayjs(new Date()).format("YYYY-MM-DDT00:00"),
        endDate: dayjs(new Date()).add(2, "day").format("YYYY-MM-DDT00:00"),
      });
      const data = response.data.content.map((item) => ({
        ...item,
        bookingTimeStart: dayjs(item.bookingDate).format("HH:mm"),
        bookingTimeEnd: dayjs(item.bookingDate).add(1, "hour").format("HH:mm"),
      }));
      setNewestAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchBlogList();
    fetchAppointments();
  }, [pagination.current, pagination.pageSize]);

  // Xử lý khi modal thành công (thêm hoặc cập nhật)
  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchBlogList();
  };

  const handleEditBlog = (blog) => {
    setModalVisible(true);
    setSelectedBlog(blog);
  };

  const handleViewBlog = (blog) => {
    if (blog) {
      setSelectedBlog(blog);
      setViewBlogModalVisible(true);
    } else {
      message.error("Không tìm thấy thông tin bài viết");
    }
  };

  const last7DaysAppointments = stats.Appointments;

  // Chuẩn bị dữ liệu cho biểu đồ đường
  const appointmentsChartData = {
    labels: last7DaysAppointments.labels,
    datasets: [
      {
        label: "Lịch hẹn",
        data: last7DaysAppointments.data,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

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

  const openMeetLink = (meetLink) => {
    if (meetLink) {
      window.open(meetLink, "_blank");
    } else {
      message.warning("Không có link cuộc họp cho lịch hẹn này");
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      message.success(`Cập nhật trạng thái thành công: ${status}`);
      fetchAppointments();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err?.response?.data || err);
      message.error("Không thể cập nhật trạng thái.");
    }
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
                <Button size="small" type="primary"
                  onClick={() => navigate("/consultant/dashboard/consultant-answer")}>
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
                <Button size="small" type="default"
                  onClick={() => navigate("/consultant/dashboard/manage-feedback")}>
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
              value={newestAppointments.length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
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
                  height="200px"
                />
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Statistic
                title="Đánh giá trung bình"
                value={stats.averageRating || 0}
                precision={1}
                valueStyle={{ color: "#faad14", fontSize: "24px" }}
                suffix=" / 5"
              />
              <Text type="secondary">
                Dựa trên {calculateTotalRatings()} đánh giá
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          {/* Biểu đồ lịch hẹn 7 ngày gần nhất */}
          <Card
            title="Lịch hẹn 7 ngày gần nhất"
            className="h-full"
            extra={<LineChartOutlined style={{ color: "#1677ff" }} />}
          >
            <div style={{ height: "200px", width: "100%" }}>
              <ChartComponent
                data={appointmentsChartData}
                options={appointmentsChartOptions}
                type="line"
                height="200px"
              />
            </div>
            <div className="text-center mt-4">
              <Statistic
                title="Tổng lịch hẹn"
                value={last7DaysAppointments.data.reduce((a, b) => a + b, 0)}
                valueStyle={{ color: "#1677ff", fontSize: "24px" }}
              />
              <Text type="secondary">Trong 7 ngày gần đây</Text>
            </div>
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
                    <Button
                      key="edit"
                      size="small"
                      type="primary"
                      onClick={() => handleEditBlog(item)}
                    >
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
              dataSource={newestAppointments}
              rowKey="bookingId"
              columns={[
                {
                  title: "Ngày hẹn",
                  dataIndex: "bookingDate",
                  key: "bookingDate",
                  render: (date) => dayjs(date).format("DD/MM/YYYY"),
                },
                {
                  title: "Thời gian",
                  dataIndex: "bookingTimeStart",
                  key: "bookingTimeStart",
                  render: (time, record) => (
                    <span>
                      {record.bookingTimeStart} - {record.bookingTimeEnd}
                    </span>
                  ),
                },
                {
                  title: "Khách hàng",
                  dataIndex: "customerName",
                  key: "customerName",
                },
                {
                  title: "Hành động",
                  key: "action",
                  render: (_, record) => (
                    <Space>
                      <Tooltip title="Tham gia cuộc họp">
                        <Button
                          type="primary"
                          icon={<VideoCameraOutlined />}
                          size="small"
                          onClick={() => openMeetLink(record.meetLink)}
                        >
                          Tham gia
                        </Button>
                      </Tooltip>
                      <>
                        <Popconfirm
                          title="Xác nhận hoàn thành lịch hẹn này?"
                          onConfirm={() =>
                            handleUpdateStatus(record.bookingId, "COMPLETED")
                          }
                          okText="Hoàn thành"
                          cancelText="Hủy"
                        >
                          <Button
                            type="primary"
                            size="small"
                            className="bg-green-600"
                          >
                            Hoàn thành
                          </Button>
                        </Popconfirm>
                        <Popconfirm
                          title="Xác nhận hủy lịch hẹn này?"
                          onConfirm={() =>
                            handleUpdateStatus(record.bookingId, "CANCELLED")
                          }
                          okText="Đồng ý"
                          cancelText="Không"
                        >
                          <Button danger size="small">
                            Hủy
                          </Button>
                        </Popconfirm>
                      </>
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

      {/* Modal - giữ nguyên */}
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
    </>
  );
};

export default ConsultantDashboard;
