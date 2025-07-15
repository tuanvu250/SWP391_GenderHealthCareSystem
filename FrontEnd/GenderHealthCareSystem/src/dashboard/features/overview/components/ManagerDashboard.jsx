import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Space,
  Button,
  Typography,
  message,
  Tag,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  StarOutlined,
  TeamOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ChartComponent from "../../../components/chart/ChartComponent";
import {
  userAppointmentsChartOptions,
  ratingBarChartOptions,
  revenueChartOptions,
} from "../utils/chartConfig";
import { useNavigate } from "react-router-dom";
import {
  approveBlogAPI,
  rejectBlogAPI,
  viewAllBlogsAPI,
} from "../../../../components/api/Blog.api";
import ViewBlogModal from "../../../components/modal/ViewBlogModal";
import {
  formatDateTime,
  getTagColor,
} from "../../../../components/utils/format";

const { Text } = Typography;

const ManagerDashboard = ({ stats }) => {
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

  const fetchBlogList = async () => {
    setLoading(true);
    try {
      const response = await viewAllBlogsAPI({
        page: pagination.current - 1,
        size: pagination.pageSize,
        status: "PENDING",
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
          stats.pendingPosts = response.data.data.totalElements;  
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

  const serviceRatingsChart = stats.serviceRatings
    ? {
        labels: ["5 ★", "4 ★", "3 ★", "2 ★", "1 ★"],
        datasets: [
          {
            label: "Xét nghiệm",
            data: [
              stats.serviceRatings.testing?.five || 0,
              stats.serviceRatings.testing?.four || 0,
              stats.serviceRatings.testing?.three || 0,
              stats.serviceRatings.testing?.two || 0,
              stats.serviceRatings.testing?.one || 0,
            ],
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Tư vấn",
            data: [
              stats.serviceRatings.consulting?.five || 0,
              stats.serviceRatings.consulting?.four || 0,
              stats.serviceRatings.consulting?.three || 0,
              stats.serviceRatings.consulting?.two || 0,
              stats.serviceRatings.consulting?.one || 0,
            ],
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Biểu đồ đường cho users & appointments (giữ nguyên)
  const usersAndAppointmentsChart = stats.usersAndAppointments
    ? {
        labels: stats.usersAndAppointments.map((d) => d.date),
        datasets: [
          {
            label: "Người dùng mới",
            data: stats.usersAndAppointments.map((d) => d.users),
            borderColor: "#1677ff",
            backgroundColor: "rgba(22, 119, 255, 0.1)",
            tension: 0.4,
            yAxisID: "y",
          },
          {
            label: "Lịch hẹn xét nghiệm",
            data: stats.usersAndAppointments.map(
              (d) => d.testAppointments ?? 0
            ),
            borderColor: "#52c41a",
            backgroundColor: "rgba(82, 196, 26, 0.1)",
            tension: 0.4,
            yAxisID: "y1",
          },
          {
            label: "Lịch hẹn tư vấn",
            data: stats.usersAndAppointments.map(
              (d) => d.consultAppointments ?? 0
            ),
            borderColor: "#faad14",
            backgroundColor: "rgba(250, 173, 20, 0.1)",
            tension: 0.4,
            yAxisID: "y1",
          },
        ],
      }
    : null;

  // Thêm dữ liệu biểu đồ doanh thu
  const revenueChart = stats.monthlyRevenue
    ? {
        labels: stats.revenueStats?.map((item) => item.months) || [],
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: stats.revenueStats?.map((item) => item.values) || [],
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleViewBlog = (blog) => {
    if (blog) {
      setSelectedBlog(blog);
      setViewBlogModalVisible(true);
    } else {
      message.error("Không tìm thấy thông tin bài viết");
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

  // Hàm xử lý từ chối bài viết
  const handleReject = async (blogId) => {
    try {
      setLoading(true);
      await rejectBlogAPI(blogId);
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

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Người đăng",
      dataIndex: "consultantName",
      key: "consultantName",
    },
    {
      title: "Ngày đăng",
      dataIndex: "publishedAt",
      key: "publishedAt",
      render: (date) => formatDateTime(date),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => handleViewBlog(record)}
          >
            Xem
          </Button>
          <Button
            size="small"
            type="primary"
            className="bg-green-600"
            onClick={() => handleApprove(record.postId)}
          >
            Duyệt
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleReject(record.postId)}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  // Tính tổng số liệu từ stats.usersAndAppointments
  const calculateTotals = () => {
    if (
      !stats.usersAndAppointments ||
      !Array.isArray(stats.usersAndAppointments)
    ) {
      return {
        totalUsers: 0,
        totalTestAppointments: 0,
        totalConsultAppointments: 0,
      };
    }

    return stats.usersAndAppointments.reduce(
      (acc, day) => {
        return {
          totalUsers: acc.totalUsers + (day.users || 0),
          totalTestAppointments:
            acc.totalTestAppointments + (day.testAppointments || 0),
          totalConsultAppointments:
            acc.totalConsultAppointments + (day.consultAppointments || 0),
        };
      },
      { totalUsers: 0, totalTestAppointments: 0, totalConsultAppointments: 0 }
    );
  };

  const weeklyTotals = calculateTotals();

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu tháng"
              value={stats.monthlyRevenue || 0}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
            <div className="mt-1">
              {stats.monthlyRevenue > stats.previousMonthRevenue ? (
                <Text type="success">
                  <ArrowUpOutlined />{" "}
                  {Math.round(
                    ((stats.monthlyRevenue - stats.previousMonthRevenue) /
                      stats.previousMonthRevenue) *
                      100
                  )}
                  % so với tháng trước
                </Text>
              ) : (
                <Text type="danger">
                  <ArrowDownOutlined />{" "}
                  {Math.round(
                    ((stats.previousMonthRevenue - stats.monthlyRevenue) /
                      stats.previousMonthRevenue) *
                      100
                  )}
                  % so với tháng trước
                </Text>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Consultant hoạt động"
              value={stats.activeConsultants || 0}
              suffix={`/${stats.totalConsultants || 0}`}
              valueStyle={{ color: "#1677ff" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Bài viết chờ duyệt"
              value={stats.pendingPosts || 0}
              valueStyle={{ color: stats.pendingPosts > 5 ? "#faad14" : "" }}
              prefix={<FileTextOutlined />}
            />
            {stats.pendingPosts > 0 && (
              <div className="mt-2">
                <Button
                  size="small"
                  type="primary"
                  onClick={() =>
                    navigate("/manager/dashboard/manage-blog?status=PENDING")
                  }
                >
                  Duyệt ngay
                </Button>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Đánh giá trung bình"
              value={stats.averageRating || 0}
              precision={1}
              valueStyle={{ color: "#3f8600" }}
              prefix={<StarOutlined />}
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>

      {/* Thêm hàng mới hiển thị tổng 7 ngày */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Người dùng mới (7 ngày)"
              value={weeklyTotals.totalUsers}
              valueStyle={{ color: "#1677ff" }}
              prefix={<UserOutlined />}
            />
            <div className="mt-2">
              <Text type="secondary">
                Trung bình {Math.round(weeklyTotals.totalUsers / 7)} người/ngày
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Xét nghiệm đã đặt (7 ngày)"
              value={weeklyTotals.totalTestAppointments}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
            <div className="mt-2">
              <Text type="secondary">
                Trung bình {Math.round(weeklyTotals.totalTestAppointments / 7)}{" "}
                lịch/ngày
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tư vấn đã đặt (7 ngày)"
              value={weeklyTotals.totalConsultAppointments}
              valueStyle={{ color: "#faad14" }}
              prefix={<TeamOutlined />}
            />
            <div className="mt-2">
              <Text type="secondary">
                Trung bình{" "}
                {Math.round(weeklyTotals.totalConsultAppointments / 7)}{" "}
                lịch/ngày
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Hàng thứ ba: Biểu đồ người dùng & lịch hẹn + Biểu đồ doanh thu (đã thay đổi) */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Người dùng mới & Lịch hẹn theo ngày" className="h-full">
            <ChartComponent
              data={usersAndAppointmentsChart}
              options={userAppointmentsChartOptions}
              type="line"
              height="300px"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Doanh thu 6 tháng gần nhất"
            className="h-full"
            extra={
              <div>
                <Text strong>Tổng: </Text>
                <Text>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    revenueChart?.datasets[0].data.reduce((a, b) => a + b, 0) ||
                      0
                  )}
                </Text>
              </div>
            }
          >
            {revenueChart ? (
              <ChartComponent
                data={revenueChart}
                options={revenueChartOptions}
                type="line"
                height="300px"
              />
            ) : (
              <div className="text-center p-6">Không có dữ liệu doanh thu</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Hàng thứ tư: Biểu đồ đánh giá + Bài viết cần duyệt (đã thay đổi) */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card
            title="Đánh giá dịch vụ"
            className="h-full"
            extra={
              <div>
                <Text strong>Xét nghiệm: </Text>
                <Text>{stats.serviceRatings?.testingAvg || 0}/5</Text>
                <span className="mx-2">|</span>
                <Text strong>Tư vấn: </Text>
                <Text>{stats.serviceRatings?.consultingAvg || 0}/5</Text>
              </div>
            }
          >
            {serviceRatingsChart ? (
              <ChartComponent
                data={serviceRatingsChart}
                options={ratingBarChartOptions}
                type="bar"
                height="300px"
              />
            ) : (
              <div className="text-center p-6">Không có dữ liệu đánh giá</div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Bài viết cần duyệt" className="h-full">
            <Table
              dataSource={blogList}
              columns={columns}
              rowKey="postId"
              loading={loading}
              pagination={pagination}
              size="small"
              onChange={handleTableChange}
              scroll={{ x: true }}
              locale={{
                emptyText: "Không có bài viết nào cần duyệt",
              }}
            />
          </Card>
        </Col>
      </Row>

      <ViewBlogModal
        visible={viewBlogModalVisible}
        open={viewBlogModalVisible}
        onClose={() => setViewBlogModalVisible(false)}
        blog={selectedBlog}
      />

      {/* Giữ nguyên hàng cuối (hành động nhanh) */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Hành động nhanh" className="text-center">
            <Space wrap>
              <Button icon={<FileTextOutlined />} type="primary"
              onClick={() => navigate("/manager/dashboard/report")}>
                Xem báo cáo chi tiết
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={() =>
                  navigate("/manager/dashboard/manage-blog?status=PENDING")
                }
              >
                Tới trang duyệt bài viết
              </Button>
              <Button
                icon={<TeamOutlined />}
                onClick={() => navigate("/manager/dashboard/manage-users")}
              >
                Quản lý nhân sự
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ManagerDashboard;
