import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Typography, Button, Table, Tabs, Alert, Space, Divider, Badge, Spin } from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, CalendarOutlined, MessageOutlined,
  UserOutlined, DollarOutlined, MedicineBoxOutlined, StarOutlined,
  FileTextOutlined, CheckCircleOutlined, WarningOutlined, LineChartOutlined,
  CheckOutlined, CloseOutlined, PlusOutlined, EditOutlined, 
  SettingOutlined, DatabaseOutlined, TeamOutlined, BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../components/provider/AuthProvider';
import { Link } from 'react-router-dom';

import ChartComponent from '../../components/chart/ChartComponent';

const { Title: AntTitle, Text } = Typography;
const { TabPane } = Tabs;

// Overview component
const Overview = () => {
  const { user } = useAuth();
  const role = user?.role || "Staff"; // Fallback role
  
  // State cho dữ liệu dashboard
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  
  // Fetch dữ liệu dashboard dựa vào role
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Thay thế bằng API call thực tế
        // const response = await getDashboardData(role);
        // setStats(response.data);
        
        // Mock data cho từng role
        const mockData = getMockDataForRole(role);
        setStats(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [role]);
  
  // Hàm mock data cho mỗi role - thay thế bằng API thực tế sau
  const getMockDataForRole = (role) => {
    const mockData = {
      common: {
        notifications: 5,
        todayAppointments: 3,
        pendingTasks: 7,
      },
      
      // Dữ liệu riêng cho từng role
      Consultant: {
        unansweredQuestions: 5,
        newReviews: 2,
        monthlyEarnings: 15000000,
        recentAppointments: [
          { id: 1, patientName: 'Nguyễn Văn A', time: '14:00', date: '2025-07-12', status: 'confirmed' },
          { id: 2, patientName: 'Trần Thị B', time: '16:30', date: '2025-07-12', status: 'pending' },
          { id: 3, patientName: 'Phạm Văn C', time: '09:00', date: '2025-07-13', status: 'confirmed' },
        ],
        questionsList: [
          { id: 1, question: 'Tôi nên làm xét nghiệm nào cho các triệu chứng này?', askedBy: 'user123', date: '2025-07-11' },
          { id: 2, question: 'Kết quả này có nghĩa là gì?', askedBy: 'user456', date: '2025-07-10' },
        ],
        earningsData: [
          { date: '01/07', amount: 550000 },
          { date: '02/07', amount: 850000 },
          { date: '03/07', amount: 750000 },
          { date: '04/07', amount: 1000000 },
          { date: '05/07', amount: 650000 },
          { date: '06/07', amount: 850000 },
          { date: '07/07', amount: 950000 },
        ]
      },
      
      Staff: {
        pendingAppointments: 8,
        pendingTests: 12,
        newSupportRequests: 4,
        newPatients: 6,
        appointmentStatusDistribution: [
          { type: 'Đã xác nhận', value: 45, color: '#52c41a' },
          { type: 'Chờ xử lý', value: 30, color: '#1677ff' },
          { type: 'Đã hủy', value: 15, color: '#f5222d' },
          { type: 'Hoàn thành', value: 10, color: '#722ed1' },
        ],
        workQueue: [
          { id: 1, task: 'Nhập kết quả XN cho bệnh nhân Nguyễn Văn A', priority: 'high' },
          { id: 2, task: 'Gọi xác nhận cho khách hàng Trần Thị B', priority: 'medium' },
          { id: 3, task: 'Gửi email nhắc lịch hẹn ngày mai', priority: 'medium' },
        ],
        consultantActivities: [
          { id: 1, consultant: 'BS. Nguyễn Thị X', action: 'đã online', time: '10 phút trước' },
          { id: 2, consultant: 'BS. Trần Văn Y', action: 'đã tạo lịch hẹn mới', time: '30 phút trước' },
        ]
      },
      
      Manager: {
        monthlyRevenue: 250000000,
        previousMonthRevenue: 220000000,
        activeConsultants: 15,
        totalConsultants: 20,
        pendingPosts: 7,
        averageRating: 4.5,
        consultantPerformance: [
          { consultant: 'BS. Nguyễn A', revenue: 35000000 },
          { consultant: 'BS. Trần B', revenue: 28000000 },
          { consultant: 'BS. Lê C', revenue: 25000000 },
          { consultant: 'BS. Phạm D', revenue: 22000000 },
          { consultant: 'BS. Hoàng E', revenue: 18000000 },
        ],
        usersAndAppointments: [
          { date: '01/07', users: 120, appointments: 43 },
          { date: '02/07', users: 132, appointments: 51 },
          { date: '03/07', users: 101, appointments: 39 },
          { date: '04/07', users: 134, appointments: 52 },
          { date: '05/07', users: 90, appointments: 29 },
          { date: '06/07', users: 110, appointments: 37 },
          { date: '07/07', users: 140, appointments: 49 },
        ],
        pendingContent: [
          { id: 1, title: 'Phòng tránh STI ở tuổi vị thành niên', author: 'BS. Nguyễn A', submitted: '2025-07-10' },
          { id: 2, title: 'Các triệu chứng STI thường gặp', author: 'BS. Trần B', submitted: '2025-07-09' },
        ]
      },
      
      Admin: {
        totalUsers: 5280,
        systemErrors: 3,
        criticalErrors: 1,
        cpuLoad: 45,
        newRegistrations: 25,
        userDistribution: [
          { type: 'Khách hàng', value: 4800, color: '#1677ff' },
          { type: 'Consultant', value: 200, color: '#52c41a' },
          { type: 'Staff', value: 250, color: '#faad14' },
          { type: 'Manager', value: 25, color: '#722ed1' },
          { type: 'Admin', value: 5, color: '#f5222d' },
        ],
        hourlyActiveUsers: [
          { hour: '00:00', users: 50 },
          { hour: '01:00', users: 30 },
          { hour: '02:00', users: 20 },
          { hour: '03:00', users: 10 },
          { hour: '04:00', users: 5 },
          { hour: '05:00', users: 10 },
          { hour: '06:00', users: 30 },
          { hour: '07:00', users: 100 },
          { hour: '08:00', users: 250 },
          { hour: '09:00', users: 500 },
        ],
        recentErrors: [
          { id: 1, type: 'Database Connection', severity: 'critical', time: '10:23', date: '2025-07-11' },
          { id: 2, type: 'API Timeout', severity: 'warning', time: '09:15', date: '2025-07-11' },
          { id: 3, type: 'Auth Failure', severity: 'warning', time: '16:42', date: '2025-07-10' },
        ],
        adminActivities: [
          { id: 1, admin: 'Quản trị viên A', action: 'xóa tài khoản Staff C', time: '11:20', date: '2025-07-11' },
          { id: 2, admin: 'Quản trị viên B', action: 'thay đổi quyền của Manager D', time: '10:05', date: '2025-07-11' },
        ]
      }
    };
    
    return {
      ...mockData.common,
      ...(mockData[role] || {})
    };
  };
  
  // Render các thành phần chung cho mọi role
  const renderCommonComponents = () => (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={8} lg={8}>
        <Card>
          <Statistic
            title="Thông báo mới"
            value={stats.notifications || 0}
            valueStyle={{ color: stats.notifications > 0 ? '#1677ff' : '' }}
            prefix={stats.notifications > 0 ? <Badge status="processing" /> : null}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8} lg={8}>
        <Card>
          <Statistic
            title="Lịch hẹn hôm nay" 
            value={stats.todayAppointments || 0}
            prefix={<CalendarOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8} lg={8}>
        <Card>
          <Statistic
            title="Công việc chờ xử lý" 
            value={stats.pendingTasks || 0}
            valueStyle={{ color: stats.pendingTasks > 5 ? '#faad14' : '' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
  
  // Cấu hình các biểu đồ Chart.js
  
  // Biểu đồ đường cho thu nhập của consultant
  const consultantEarningsChart = stats.earningsData ? {
    labels: stats.earningsData.map(d => d.date),
    datasets: [
      {
        label: 'Thu nhập (VNĐ)',
        data: stats.earningsData.map(d => d.amount),
        borderColor: '#1677ff',
        backgroundColor: 'rgba(22, 119, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;
  
  // Biểu đồ tròn cho trạng thái lịch hẹn
  const appointmentStatusChart = stats.appointmentStatusDistribution ? {
    labels: stats.appointmentStatusDistribution.map(d => d.type),
    datasets: [
      {
        data: stats.appointmentStatusDistribution.map(d => d.value),
        backgroundColor: stats.appointmentStatusDistribution.map(d => d.color),
        borderWidth: 1,
      },
    ],
  } : null;
  
  // Biểu đồ cột cho doanh thu consultant
  const consultantPerformanceChart = stats.consultantPerformance ? {
    labels: stats.consultantPerformance.map(d => d.consultant),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: stats.consultantPerformance.map(d => d.revenue),
        backgroundColor: 'rgba(22, 119, 255, 0.6)',
        borderColor: '#1677ff',
        borderWidth: 1,
      },
    ],
  } : null;
  
  // Biểu đồ đường cho users & appointments
  const usersAndAppointmentsChart = stats.usersAndAppointments ? {
    labels: stats.usersAndAppointments.map(d => d.date),
    datasets: [
      {
        label: 'Người dùng',
        data: stats.usersAndAppointments.map(d => d.users),
        borderColor: '#1677ff',
        backgroundColor: 'rgba(22, 119, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Lịch hẹn',
        data: stats.usersAndAppointments.map(d => d.appointments),
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        tension: 0.4,
      },
    ],
  } : null;
  
  // Biểu đồ tròn cho phân bổ người dùng
  const userDistributionChart = stats.userDistribution ? {
    labels: stats.userDistribution.map(d => d.type),
    datasets: [
      {
        data: stats.userDistribution.map(d => d.value),
        backgroundColor: stats.userDistribution.map(d => d.color),
        borderWidth: 1,
      },
    ],
  } : null;
  
  // Biểu đồ đường cho người dùng theo giờ
  const hourlyUsersChart = stats.hourlyActiveUsers ? {
    labels: stats.hourlyActiveUsers.map(d => d.hour),
    datasets: [
      {
        label: 'Người dùng hoạt động',
        data: stats.hourlyActiveUsers.map(d => d.users),
        borderColor: '#1677ff',
        backgroundColor: 'rgba(22, 119, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;
  
  // Cấu hình chung cho Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
  
  // Cấu hình riêng cho biểu đồ cột
  const barChartOptions = {
    ...chartOptions,
    indexAxis: 'y', // Để hiển thị biểu đồ cột ngang
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false, // Ẩn legend vì chỉ có 1 data set
      },
    },
  };
  
  // Render nội dung cho Consultant
  const renderConsultantDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Câu hỏi chưa trả lời"
              value={stats.unansweredQuestions || 0}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<MessageOutlined />}
            />
            <div className="mt-2">
              <Button type="primary" size="small">
                Xem tất cả
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Phản hồi mới"
              value={stats.newReviews || 0}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Thu nhập trong tháng"
              value={stats.monthlyEarnings || 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={16}>
          <Card title="Thu nhập trong 7 ngày qua" className="h-full">
            <ChartComponent 
              data={consultantEarningsChart}
              options={chartOptions}
              type="line"
              height="300px"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Lịch hẹn sắp tới" className="h-full">
            <List
              size="small"
              dataSource={stats.recentAppointments || []}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<UserOutlined style={{ fontSize: '18px' }} />}
                    title={item.patientName}
                    description={`${item.date} ${item.time}`}
                  />
                  <Badge
                    status={item.status === 'confirmed' ? 'success' : 'processing'}
                    text={item.status === 'confirmed' ? 'Xác nhận' : 'Chờ xử lý'}
                  />
                </List.Item>
              )}
            />
            <Button type="link" className="mt-2">Xem tất cả</Button>
          </Card>
        </Col>
      </Row>

      {/* Phần còn lại giữ nguyên */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Câu hỏi chuyên môn cần trả lời">
            <List
              size="small"
              dataSource={stats.questionsList || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button key="answer" type="primary" size="small">Trả lời</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.question}
                    description={`Hỏi bởi: ${item.askedBy} - ${item.date}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Hành động nhanh" className="text-center">
            <Space>
              <Button icon={<CalendarOutlined />}>Cập nhật lịch rảnh</Button>
              <Button icon={<EditOutlined />}>Viết bài blog mới</Button>
              <Button icon={<MessageOutlined />}>Trả lời câu hỏi</Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
  
  // Render nội dung cho Staff
  const renderStaffDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Lịch hẹn cần xác nhận"
              value={stats.pendingAppointments || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<CalendarOutlined />}
            />
            <div className="mt-2">
              <Button size="small" type="primary">
                Xác nhận ngay
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Xét nghiệm chờ xử lý"
              value={stats.pendingTests || 0}
              valueStyle={{ color: stats.pendingTests > 10 ? '#ff4d4f' : '#faad14' }}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Yêu cầu hỗ trợ mới"
              value={stats.newSupportRequests || 0}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Bệnh nhân mới trong ngày"
              value={stats.newPatients || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={16}>
          <Card title="Hàng đợi công việc ưu tiên">
            <List
              size="small"
              dataSource={stats.workQueue || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button key="complete" type="primary" size="small" icon={<CheckOutlined />}>Hoàn thành</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'blue'} 
                      />
                    }
                    title={item.task}
                    description={`Ưu tiên: ${
                      item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'Trung bình' : 'Thấp'
                    }`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Trạng thái lịch hẹn" className="h-full">
            <ChartComponent 
              data={appointmentStatusChart}
              options={chartOptions}
              type="doughnut"
              height="250px"
            />
          </Card>
        </Col>
      </Row>

      {/* Phần còn lại của Staff dashboard */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Hoạt động của Consultant">
            <List
              size="small"
              dataSource={stats.consultantActivities || []}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.consultant}
                    description={`${item.action} - ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Hành động nhanh" className="text-center">
            <Space>
              <Button icon={<CalendarOutlined />} type="primary">
                Quản lý lịch hẹn
              </Button>
              <Button icon={<MedicineBoxOutlined />}>
                Quản lý xét nghiệm
              </Button>
              <Button icon={<MessageOutlined />}>
                Hỗ trợ khách hàng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
  
  // Render nội dung cho Manager
  const renderManagerDashboard = () => (
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
          <Card title="Doanh thu theo Consultant" className="h-full">
            <ChartComponent 
              data={consultantPerformanceChart}
              options={barChartOptions}
              type="bar"
              height="300px"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Người dùng mới & Lịch hẹn theo ngày" className="h-full">
            <ChartComponent 
              data={usersAndAppointmentsChart}
              options={chartOptions}
              type="line"
              height="300px"
            />
          </Card>
        </Col>
      </Row>

      {/* Phần còn lại của Manager dashboard */}
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
  
  // Render nội dung cho Admin
  const renderAdminDashboard = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Lỗi hệ thống (24h qua)"
              value={stats.systemErrors || 0}
              valueStyle={{ color: stats.criticalErrors > 0 ? '#ff4d4f' : '#faad14' }}
              prefix={<WarningOutlined />}
              suffix={stats.criticalErrors > 0 ? `(Nghiêm trọng: ${stats.criticalErrors})` : null}
            />
            {stats.systemErrors > 0 && (
              <div className="mt-2">
                <Button size="small" danger>
                  Xem chi tiết
                </Button>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tải CPU của Server"
              value={stats.cpuLoad || 0}
              suffix="%"
              valueStyle={{ 
                color: stats.cpuLoad > 80 ? '#ff4d4f' : 
                      stats.cpuLoad > 60 ? '#faad14' : '#3f8600' 
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Đăng ký mới hôm nay"
              value={stats.newRegistrations || 0}
              prefix={<PlusOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Phân bổ người dùng theo vai trò" className="h-full">
            <ChartComponent 
              data={userDistributionChart}
              options={chartOptions}
              type="pie"
              height="300px"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Người dùng hoạt động theo giờ" className="h-full">
            <ChartComponent 
              data={hourlyUsersChart}
              options={chartOptions}
              type="line"
              height="300px"
            />
          </Card>
        </Col>
      </Row>

      {/* Phần còn lại của Admin dashboard */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={12}>
          <Card title="Nhật ký lỗi hệ thống">
            <List
              size="small"
              dataSource={stats.recentErrors || []}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button key="view" size="small" type="primary">Xem</Button>,
                    <Button key="fix" size="small">Khắc phục</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        status={item.severity === 'critical' ? 'error' : 'warning'} 
                      />
                    }
                    title={item.type}
                    description={`${item.date} ${item.time} - ${
                      item.severity === 'critical' ? 'Nghiêm trọng' : 'Cảnh báo'
                    }`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Hoạt động quản trị gần đây">
            <List
              size="small"
              dataSource={stats.adminActivities || []}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.admin}
                    description={`${item.action} - ${item.date} ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Hành động nhanh" className="text-center">
            <Space wrap>
              <Button icon={<UserOutlined />} type="primary">
                Quản lý người dùng
              </Button>
              <Button icon={<SettingOutlined />}>
                Cấu hình hệ thống
              </Button>
              <Button icon={<FileTextOutlined />}>
                Xem nhật ký đầy đủ
              </Button>
              <Button icon={<DatabaseOutlined />}>
                Quản lý database
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
  
  // Render dashboard dựa vao role
  const renderDashboardByRole = () => {
    switch(role) {
      case "Consultant":
        return renderConsultantDashboard();
      case "Staff":
        return renderStaffDashboard();
      case "Manager":
        return renderManagerDashboard();
      case "Admin":
        return renderAdminDashboard();
      default:
        return (
          <Alert
            message="Không có dữ liệu dashboard"
            description="Không tìm thấy dữ liệu dashboard cho vai trò của bạn."
            type="warning"
            showIcon
          />
        );
    }
  };
  
  // Render page title dựa vao role
  const renderPageTitle = () => {
    let title = "Tổng quan";
    
    switch(role) {
      case "Admin":
        title = "Tổng quan hệ thống";
        break;
      case "Manager":
        title = "Tổng quan quản lý";
        break;
      case "Staff":
        title = "Tổng quan vận hành";
        break;
      case "Consultant":
        title = "Tổng quan tư vấn viên";
        break;
    }
    
    return (
      <div className="flex justify-between items-center mb-6">
        <AntTitle level={2} className="m-0">{title}</AntTitle>
        <div>
          <Button type="default">Làm mới</Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      {renderPageTitle()}
      
      {/* Common components shared by all roles */}
      {renderCommonComponents()}
      
      {/* Role-specific sections */}
      {loading ? (
        <div className="text-center p-8">
          <Spin size="large" />
        </div>
      ) : (
        renderDashboardByRole()
      )}
    </div>
  );
};

export default Overview;