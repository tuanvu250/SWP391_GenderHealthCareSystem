import React from 'react';
import { Card, Row, Col, Statistic, Table, Space, Button, Typography } from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, UserOutlined, DollarOutlined, 
  FileTextOutlined, StarOutlined, TeamOutlined, BarChartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import ChartComponent from '../../../components/chart/ChartComponent';
import { 
  userAppointmentsChartOptions,
  chartOptions,
  ratingBarChartOptions,
} from '../utils/chartConfig';

const { Text } = Typography;

const ManagerDashboard = ({ stats }) => {
  // Biểu đồ đánh giá dịch vụ thay thế biểu đồ doanh thu consultant
  const serviceRatingsChart = stats.serviceRatings ? {
    labels: ['5 ★', '4 ★', '3 ★', '2 ★', '1 ★'],
    datasets: [
      {
        label: 'Xét nghiệm',
        data: [
          stats.serviceRatings.testing?.five || 0,
          stats.serviceRatings.testing?.four || 0,
          stats.serviceRatings.testing?.three || 0,
          stats.serviceRatings.testing?.two || 0,
          stats.serviceRatings.testing?.one || 0,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tư vấn',
        data: [
          stats.serviceRatings.consulting?.five || 0,
          stats.serviceRatings.consulting?.four || 0,
          stats.serviceRatings.consulting?.three || 0,
          stats.serviceRatings.consulting?.two || 0,
          stats.serviceRatings.consulting?.one || 0,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  } : null;
  
  // Biểu đồ đường cho users & appointments (giữ nguyên)
  const usersAndAppointmentsChart = stats.usersAndAppointments ? {
    labels: stats.usersAndAppointments.map(d => d.date),
    datasets: [
      {
        label: 'Người dùng mới',
        data: stats.usersAndAppointments.map(d => d.users),
        borderColor: '#1677ff',
        backgroundColor: 'rgba(22, 119, 255, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Lịch hẹn xét nghiệm',
        data: stats.usersAndAppointments.map(d => d.testAppointments ?? 0),
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'Lịch hẹn tư vấn',
        data: stats.usersAndAppointments.map(d => d.consultAppointments ?? 0),
        borderColor: '#faad14',
        backgroundColor: 'rgba(250, 173, 20, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  } : null;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu tháng"
              value={stats.monthlyRevenue || 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
            <div className="mt-1">
              {stats.monthlyRevenue > stats.previousMonthRevenue ? (
                <Text type="success">
                  <ArrowUpOutlined /> {Math.round((stats.monthlyRevenue - stats.previousMonthRevenue) / stats.previousMonthRevenue * 100)}% so với tháng trước
                </Text>
              ) : (
                <Text type="danger">
                  <ArrowDownOutlined /> {Math.round((stats.previousMonthRevenue - stats.monthlyRevenue) / stats.previousMonthRevenue * 100)}% so với tháng trước
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
              valueStyle={{ color: '#1677ff' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Bài viết chờ duyệt"
              value={stats.pendingPosts || 0}
              valueStyle={{ color: stats.pendingPosts > 5 ? '#faad14' : '' }}
              prefix={<FileTextOutlined />}
            />
            {stats.pendingPosts > 0 && (
              <div className="mt-2">
                <Button size="small" type="primary">
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
              valueStyle={{ color: '#3f8600' }}
              prefix={<StarOutlined />}
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>

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
          <Card title="Người dùng mới & Lịch hẹn theo ngày" className="h-full">
            <ChartComponent
              data={usersAndAppointmentsChart}
              options={userAppointmentsChartOptions}
              type="line"
              height="300px"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Bài viết cần duyệt">
            <Table
              dataSource={stats.pendingContent || []}
              columns={[
                {
                  title: 'Tiêu đề',
                  dataIndex: 'title',
                  key: 'title',
                },
                {
                  title: 'Tác giả',
                  dataIndex: 'author',
                  key: 'author',
                },
                {
                  title: 'Ngày gửi',
                  dataIndex: 'submitted',
                  key: 'submitted',
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_, record) => (
                    <Space>
                      <Button size="small" type="primary">Xem</Button>
                      <Button size="small" type="primary" className="bg-green-600">Duyệt</Button>
                      <Button size="small" danger>Từ chối</Button>
                    </Space>
                  ),
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Hành động nhanh" className="text-center">
            <Space wrap>
              <Button icon={<FileTextOutlined />} type="primary">
                Xem báo cáo chi tiết
              </Button>
              <Button icon={<CheckCircleOutlined />}>
                Tới trang duyệt nội dung
              </Button>
              <Button icon={<TeamOutlined />}>
                Quản lý nhân viên
              </Button>
              <Button icon={<BarChartOutlined />}>
                Báo cáo doanh thu
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ManagerDashboard;