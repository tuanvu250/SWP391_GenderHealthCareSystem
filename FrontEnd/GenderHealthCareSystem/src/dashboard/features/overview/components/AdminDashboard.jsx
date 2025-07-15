import React from 'react';
import { Card, Row, Col, Statistic, Button, Typography, Alert, Tabs, Tag } from 'antd';
import { 
  UserOutlined, TeamOutlined, SafetyOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';
import ChartComponent from '../../../components/chart/ChartComponent';
import { 
  chartOptions,
  pieChartOptions,
} from '../utils/chartConfig';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = ({ stats }) => {
  // Các biểu đồ liên quan đến người dùng
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
      }
    ],
  } : null;

  return (
    <>
      {/* THỐNG KÊ NGƯỜI DÙNG */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
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
                      options={chartOptions}
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
    </>
  );
};

export default AdminDashboard;