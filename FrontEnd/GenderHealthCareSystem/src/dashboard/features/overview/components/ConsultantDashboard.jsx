import React from "react";
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

const { Title, Text } = Typography;

const ConsultantDashboard = ({ stats }) => {
  // Biểu đồ đánh giá của consultant (thay thế biểu đồ doanh thu)
  const consultantRatingsChart = stats.ratings
    ? {
        labels: ["5 ★", "4 ★", "3 ★", "2 ★", "1 ★"],
        datasets: [
          {
            label: "Số lượng đánh giá",
            data: [
              stats.ratings.five || 0,
              stats.ratings.four || 0,
              stats.ratings.three || 0,
              stats.ratings.two || 0,
              stats.ratings.one || 0,
            ],
            backgroundColor: [
              "rgba(82, 196, 26, 0.6)", // 5 sao - xanh lá
              "rgba(22, 119, 255, 0.6)", // 4 sao - xanh dương
              "rgba(250, 173, 20, 0.6)", // 3 sao - vàng
              "rgba(245, 106, 0, 0.6)", // 2 sao - cam
              "rgba(245, 34, 45, 0.6)", // 1 sao - đỏ
            ],
            borderColor: [
              "rgba(82, 196, 26, 1)",
              "rgba(22, 119, 255, 1)",
              "rgba(250, 173, 20, 1)",
              "rgba(245, 106, 0, 1)",
              "rgba(245, 34, 45, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

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
              dataSource={stats.myArticles || []}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="view" size="small" type="default">
                      Xem
                    </Button>,
                    <Button key="edit" size="small" type="primary">
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
                          Đăng ngày {item.publishDate}
                        </Text>
                        <div className="mt-1">
                          <Text type="secondary">
                            <MessageOutlined /> {item.comments} bình luận ·
                            <StarOutlined className="ml-2 mr-1" /> {item.likes}{" "}
                            lượt thích
                          </Text>
                        </div>
                      </>
                    }
                  />
                  <div>
                    {item.status === "published" ? (
                      <Tag color="green">Đã đăng</Tag>
                    ) : item.status === "pending" ? (
                      <Tag color="orange">Chờ duyệt</Tag>
                    ) : (
                      <Tag color="default">Bản nháp</Tag>
                    )}
                  </div>
                </List.Item>
              )}
              pagination={{
                pageSize: 3,
              }}
            />
          </Card>
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
