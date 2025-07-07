import React from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, Typography, Alert, Progress, Tabs, Tag } from 'antd';
import { 
  UserOutlined, TeamOutlined, SafetyOutlined, BugOutlined,
  RocketOutlined, LineChartOutlined, SettingOutlined,
  ArrowUpOutlined, ArrowDownOutlined, DollarOutlined,
  DatabaseOutlined, GlobalOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import ChartComponent from '../../../components/chart/ChartComponent';
import { 
  pieChartOptions, 
  lineChartOptions, 
  userGrowthChartOptions,
  barChartOptions
} from '../utils/chartConfig';

const { Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = ({ stats }) => {
  // Các biểu đồ hiện có
  const userRolesChart = stats.userRoles ? {
    labels: Object.keys(stats.userRoles),
    datasets: [
      {
        label: 'Số lượng',
        data: Object.values(stats.userRoles),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',  // Thêm màu cho vai trò khác
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',    // Thêm màu cho vai trò khác
        ],
        borderWidth: 1,
      }
    ],
  } : null;
  
  const systemActivityChart = stats.systemActivity ? {
    labels: stats.systemActivity.map(d => d.date),
    datasets: [
      {
        label: 'API Calls',
        data: stats.systemActivity.map(d => d.apiCalls),
        borderColor: '#1677ff',
        backgroundColor: 'rgba(22, 119, 255, 0.1)',
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Lỗi',
        data: stats.systemActivity.map(d => d.errors),
        borderColor: '#f5222d',
        backgroundColor: 'rgba(245, 34, 45, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  } : null;

  // Biểu đồ tăng trưởng người dùng
  const userGrowthChart = stats.userGrowth ? {
    labels: stats.userGrowth.map(d => d.period),
    datasets: [
      {
        label: 'Người dùng mới',
        data: stats.userGrowth.map(d => d.newUsers),
        type: 'bar',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Tổng người dùng',
        data: stats.userGrowth.map(d => d.totalUsers),
        type: 'line',
        fill: false,
        tension: 0.4,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        yAxisID: 'y1',
      },
    ],
  } : null;

  // Biểu đồ phân bổ doanh thu theo dịch vụ
  const revenueByServiceChart = stats.revenueByService ? {
    labels: Object.keys(stats.revenueByService),
    datasets: [
      {
        label: 'Doanh thu',
        data: Object.values(stats.revenueByService),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      }
    ],
  } : null;

  // Biểu đồ phân tích thời gian sử dụng
  const systemUsageByTimeChart = stats.systemUsageByTime ? {
    labels: stats.systemUsageByTime.map(d => d.hour),
    datasets: [
      {
        label: 'Số lượng người dùng',
        data: stats.systemUsageByTime.map(d => d.users),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Lượt truy cập',
        data: stats.systemUsageByTime.map(d => d.visits),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  // Format giá trị VNĐ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <>
      {stats.systemAlerts && stats.systemAlerts.length > 0 && (
        <Alert
          message={`Có ${stats.systemAlerts.length} cảnh báo hệ thống cần xử lý!`}
          description={
            <ul>
              {stats.systemAlerts.slice(0, 3).map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
              {stats.systemAlerts.length > 3 && (
                <li>...và {stats.systemAlerts.length - 3} cảnh báo khác</li>
              )}
            </ul>
          }
          type="warning"
          showIcon
          action={
            <Button size="small" danger>
              Xem tất cả
            </Button>
          }
          className="mb-4"
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers || 0}
              valueStyle={{ color: '#1677ff' }}
              prefix={<TeamOutlined />}
            />
            <div className="mt-1">
              <Text type="secondary">
                +{stats.newUsersToday || 0} người dùng mới hôm nay
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Uptime"
              value={stats.uptime || 99.9}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<RocketOutlined />}
              suffix="%"
            />
            <div className="mt-1">
              <Text type="success">
                <ArrowUpOutlined /> {stats.uptimeChange || 0.1}% so với tuần trước
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Lỗi hệ thống"
              value={stats.systemErrors || 0}
              valueStyle={{ color: stats.systemErrors > 0 ? '#f5222d' : '#3f8600' }}
              prefix={<BugOutlined />}
            />
            <div className="mt-1">
              {stats.systemErrorsChange > 0 ? (
                <Text type="danger">
                  <ArrowUpOutlined /> {stats.systemErrorsChange}% so với hôm qua
                </Text>
              ) : (
                <Text type="success">
                  <ArrowDownOutlined /> {Math.abs(stats.systemErrorsChange || 0)}% so với hôm qua
                </Text>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Bảo mật"
              value={stats.securityScore || 0}
              valueStyle={{ 
                color: stats.securityScore < 70 ? '#f5222d' : 
                       stats.securityScore < 85 ? '#faad14' : '#3f8600' 
              }}
              prefix={<SafetyOutlined />}
              suffix="/100"
            />
            {stats.securityScore < 80 && (
              <div className="mt-2">
                <Button size="small" type="primary" danger>
                  Kiểm tra bảo mật
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* THÊM HÀNG THỐNG KÊ MỚI */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={formatCurrency(stats.totalRevenue) || 0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
            <div className="mt-1">
              <Text type="success">
                <ArrowUpOutlined /> {stats.revenueGrowth || 0}% tháng này
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Lưu trữ dữ liệu"
              value={stats.storageUsed || 0}
              precision={1}
              valueStyle={{ color: stats.storagePercentage > 80 ? '#faad14' : '#1677ff' }}
              prefix={<DatabaseOutlined />}
              suffix="GB"
            />
            <div className="mt-1">
              <Progress 
                percent={stats.storagePercentage || 0} 
                size="small" 
                status={stats.storagePercentage > 90 ? "exception" : "normal"}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Người dùng trực tuyến"
              value={stats.onlineUsers || 0}
              valueStyle={{ color: '#1677ff' }}
              prefix={<GlobalOutlined />}
            />
            <div className="mt-1">
              <Text type="secondary">
                {stats.onlineUsersPercentage || 0}% người dùng đang hoạt động
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Thời gian phản hồi"
              value={stats.avgResponseTime || 0}
              precision={0}
              valueStyle={{ 
                color: stats.avgResponseTime > 300 ? '#faad14' : 
                      stats.avgResponseTime > 500 ? '#f5222d' : '#3f8600' 
              }}
              prefix={<ClockCircleOutlined />}
              suffix="ms"
            />
            <div className="mt-1">
              {stats.responseTimeChange < 0 ? (
                <Text type="success">
                  <ArrowDownOutlined /> {Math.abs(stats.responseTimeChange || 0)}% so với hôm qua
                </Text>
              ) : (
                <Text type="danger">
                  <ArrowUpOutlined /> {stats.responseTimeChange || 0}% so với hôm qua
                </Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* BIỂU ĐỒ PHÂN TÍCH NGƯỜI DÙNG */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Phân tích người dùng">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card title="Phân bổ vai trò người dùng" bordered={false}>
                  {userRolesChart ? (
                    <ChartComponent
                      data={userRolesChart}
                      options={pieChartOptions}
                      type="pie"
                      height="300px"
                    />
                  ) : (
                    <div className="text-center p-6">Không có dữ liệu biểu đồ</div>
                  )}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Tăng trưởng người dùng" bordered={false}>
                  {userGrowthChart ? (
                    <ChartComponent
                      data={userGrowthChart}
                      options={userGrowthChartOptions}
                      type="bar"
                      height="300px"
                    />
                  ) : (
                    <div className="text-center p-6">Không có dữ liệu biểu đồ</div>
                  )}
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* BIỂU ĐỒ HỆ THỐNG VÀ DOANH THU */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Hoạt động hệ thống" className="h-full">
            {systemActivityChart ? (
              <ChartComponent
                data={systemActivityChart}
                options={lineChartOptions}
                type="line"
                height="300px"
              />
            ) : (
              <div className="text-center p-6">Không có dữ liệu biểu đồ</div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Phân bổ doanh thu theo dịch vụ" className="h-full">
            {revenueByServiceChart ? (
              <ChartComponent
                data={revenueByServiceChart}
                options={pieChartOptions}
                type="doughnut"
                height="300px"
              />
            ) : (
              <div className="text-center p-6">Không có dữ liệu biểu đồ</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* BIỂU ĐỒ THỜI GIAN SỬ DỤNG VÀ TÀI NGUYÊN */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={16}>
          <Card title="Phân tích thời gian sử dụng theo giờ" className="h-full">
            {systemUsageByTimeChart ? (
              <ChartComponent
                data={systemUsageByTimeChart}
                options={barChartOptions}
                type="bar"
                height="300px"
              />
            ) : (
              <div className="text-center p-6">Không có dữ liệu biểu đồ</div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Tài nguyên hệ thống" className="h-full">
            <div>
              <div className="flex justify-between mb-1">
                <Text>CPU</Text>
                <Text>{stats.cpuUsage || 0}%</Text>
              </div>
              <Progress 
                percent={stats.cpuUsage || 0} 
                status={stats.cpuUsage > 80 ? "exception" : "normal"}
              />
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <Text>RAM</Text>
                <Text>{stats.ramUsage || 0}%</Text>
              </div>
              <Progress 
                percent={stats.ramUsage || 0}
                status={stats.ramUsage > 80 ? "exception" : "normal"}
              />
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <Text>Disk</Text>
                <Text>{stats.diskUsage || 0}%</Text>
              </div>
              <Progress 
                percent={stats.diskUsage || 0}
                status={stats.diskUsage > 90 ? "exception" : "normal"}
              />
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <Text>Database connections</Text>
                <Text>{stats.dbConnections || 0}/{stats.maxDbConnections || 100}</Text>
              </div>
              <Progress 
                percent={(stats.dbConnections / stats.maxDbConnections * 100) || 0}
                status={(stats.dbConnections / stats.maxDbConnections) > 0.8 ? "exception" : "normal"}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={16}>
          <Card title="Lưu lượng API" className="h-full">
            <Table
              dataSource={stats.apiUsage || []}
              rowKey="endpoint"
              columns={[
                {
                  title: 'Endpoint',
                  dataIndex: 'endpoint',
                  key: 'endpoint',
                  width: '30%',
                  ellipsis: true,
                },
                {
                  title: 'Lượt gọi (24h)',
                  dataIndex: 'calls',
                  key: 'calls',
                  sorter: (a, b) => a.calls - b.calls,
                },
                {
                  title: 'Thời gian phản hồi',
                  dataIndex: 'responseTime',
                  key: 'responseTime',
                  render: (text) => `${text} ms`,
                  sorter: (a, b) => a.responseTime - b.responseTime,
                },
                {
                  title: 'Lỗi',
                  dataIndex: 'errors',
                  key: 'errors',
                  render: (text) => (
                    <Text type={text > 0 ? "danger" : "success"}>
                      {text}
                    </Text>
                  ),
                  sorter: (a, b) => a.errors - b.errors,
                },
                {
                  title: 'Status',
                  key: 'status',
                  render: (_, record) => {
                    const status = record.errors > 0 ? 'error' : 
                                  record.responseTime > 500 ? 'warning' : 'success';
                    const color = status === 'error' ? 'red' : 
                                 status === 'warning' ? 'orange' : 'green';
                    return <Tag color={color}>{status}</Tag>;
                  },
                },
              ]}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Thống kê đánh giá của người dùng" className="h-full">
            <Row>
              <Col span={24}>
                <ChartComponent
                  data={{
                    labels: ['5 ★', '4 ★', '3 ★', '2 ★', '1 ★'],
                    datasets: [{
                      type: 'bar',
                      label: 'Phần trăm đánh giá',
                      data: [
                        stats.ratings?.five || 0,
                        stats.ratings?.four || 0,
                        stats.ratings?.three || 0,
                        stats.ratings?.two || 0,
                        stats.ratings?.one || 0
                      ],
                      backgroundColor: [
                        'rgba(82, 196, 26, 0.8)',   // 5 sao
                        'rgba(82, 196, 26, 0.6)',   // 4 sao
                        'rgba(250, 173, 20, 0.6)',  // 3 sao
                        'rgba(250, 140, 22, 0.6)',  // 2 sao
                        'rgba(245, 34, 45, 0.6)',   // 1 sao
                      ],
                      barThickness: 15
                    }]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                          display: false
                        }
                      },
                      y: {
                        grid: {
                          display: false
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.raw}%`;
                          }
                        }
                      },
                      datalabels: {
                        display: true,
                        align: 'end',
                        anchor: 'end',
                        formatter: function(value) {
                          return value + '%';
                        },
                        color: '#333',
                        font: {
                          weight: 'bold'
                        }
                      }
                    }
                  }}
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
                valueStyle={{ color: '#faad14', fontSize: '28px' }}
                suffix=" / 5"
              />
              <Text type="secondary">Dựa trên {stats.totalRatings || 0} đánh giá</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={16}>
          <Card title="Tác vụ bảo trì" className="h-full">
            <Table
              dataSource={stats.maintenanceTasks || []}
              rowKey="name"
              columns={[
                {
                  title: 'Tác vụ',
                  dataIndex: 'name',
                  key: 'name',
                  width: '30%',
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => (
                    <Tag color={
                      status === 'completed' ? 'green' : 
                      status === 'pending' ? 'gold' : 
                      status === 'failed' ? 'red' : 'blue'
                    }>
                      {status === 'completed' ? 'Đã hoàn thành' : 
                       status === 'pending' ? 'Đang chờ' : 
                       status === 'failed' ? 'Thất bại' : 'Đang xử lý'}
                    </Tag>
                  )
                },
                {
                  title: 'Lần cuối chạy',
                  dataIndex: 'lastRun',
                  key: 'lastRun',
                },
                {
                  title: 'Tiếp theo',
                  dataIndex: 'nextRun',
                  key: 'nextRun',
                  render: nextRun => (
                    <Space>
                      <ClockCircleOutlined />
                      {nextRun}
                    </Space>
                  )
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_, record) => (
                    <Button size="small" type="primary">
                      Chạy ngay
                    </Button>
                  )
                },
              ]}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Hoạt động hệ thống gần đây" className="h-full">
            <Table
              dataSource={stats.recentActivities || []}
              rowKey={(record, index) => index}
              columns={[
                {
                  title: 'Hoạt động',
                  dataIndex: 'message',
                  key: 'message',
                  render: (text, record) => (
                    <div>
                      <Tag color={
                        record.type === 'warning' ? 'orange' :
                        record.type === 'error' ? 'red' :
                        record.type === 'success' ? 'green' : 'blue'
                      }>
                        {record.type}
                      </Tag>
                      <span className="ml-2">{text}</span>
                    </div>
                  ),
                },
                {
                  title: 'Thời gian',
                  dataIndex: 'time',
                  key: 'time',
                  width: '20%',
                },
                {
                  title: 'Người dùng',
                  dataIndex: 'user',
                  key: 'user',
                  width: '25%',
                }
              ]}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Quản trị hệ thống" className="text-center">
            <Space wrap>
              <Button icon={<UserOutlined />} type="primary">
                Quản lý tài khoản
              </Button>
              <Button icon={<SettingOutlined />}>
                Cấu hình hệ thống
              </Button>
              <Button icon={<SafetyOutlined />}>
                Bảo mật & Quyền
              </Button>
              <Button icon={<LineChartOutlined />}>
                Logs & Analytics
              </Button>
              <Button icon={<DatabaseOutlined />}>
                Quản lý dữ liệu
              </Button>
              <Button icon={<BugOutlined />} danger>
                Debug & Sửa lỗi
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;