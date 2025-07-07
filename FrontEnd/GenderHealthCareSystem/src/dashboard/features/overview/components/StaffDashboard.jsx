import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, List, Typography, Progress } from 'antd';
import { 
  CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined,
  MedicineBoxOutlined, FileDoneOutlined, UserOutlined
} from '@ant-design/icons';
import ChartComponent from '../../../components/chart/ChartComponent';

const { Text } = Typography;

const StaffDashboard = ({ stats }) => {
  // Biểu đồ đường cho số lượng các loại lịch hẹn theo ngày
  const appointmentTypeChart = stats.appointmentTypeData ? {
    labels: stats.appointmentTypeData.map(d => d.date),
    datasets: [
      {
        label: 'Xét nghiệm STIs',
        data: stats.appointmentTypeData.map(d => d.testAppointments),
        borderColor: '#1677ff',
        backgroundColor: 'rgba(22, 119, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Tư vấn',
        data: stats.appointmentTypeData.map(d => d.consultAppointments),
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        tension: 0.4,
      }
    ],
  } : null;

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Ngày'
        }
      }
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Lịch hẹn chờ xác nhận"
              value={stats.pendingAppointments || 0}
              valueStyle={{ color: stats.pendingAppointments > 5 ? '#faad14' : '' }}
              prefix={<ClockCircleOutlined />}
            />
            {stats.pendingAppointments > 0 && (
              <div className="mt-2">
                <Button size="small" type="primary">
                  Xem tất cả
                </Button>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Khách đến xét nghiệm hôm nay"
              value={stats.todayTestings || 0}
              valueStyle={{ color: '#1677ff' }}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Khách đến tư vấn hôm nay"
              value={stats.todayConsultations || 0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Kết quả cần cập nhật"
              value={stats.pendingResults || 0}
              valueStyle={{ color: stats.pendingResults > 0 ? '#f5222d' : '' }}
              prefix={<FileDoneOutlined />}
            />
            {stats.pendingResults > 0 && (
              <div className="mt-2">
                <Button size="small" danger>
                  Cập nhật ngay
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} md={16}>
          <Card title="Số lượng lịch hẹn theo loại" className="h-full">
            {appointmentTypeChart ? (
              <ChartComponent
                data={appointmentTypeChart}
                options={chartOptions}
                type="line"
                height="300px"
              />
            ) : (
              <div className="text-center p-6">Không có dữ liệu biểu đồ</div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Công việc của tôi hôm nay" className="h-full">
            <List
              dataSource={stats.todayTasks || []}
              renderItem={item => (
                <List.Item>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <div className="font-medium">{item.task}</div>
                      <Text type="secondary">{item.description}</Text>
                    </div>
                    <div>
                      <Tag color={item.completed ? 'green' : 'default'}>
                        {item.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
                      </Tag>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <Text>Tiến độ công việc</Text>
                <Text>{stats.taskCompletion || 0}%</Text>
              </div>
              <Progress percent={stats.taskCompletion || 0} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Lịch hẹn hôm nay">
            <Table
              dataSource={stats.todayAppointmentList || []}
              rowKey="id"
              columns={[
                {
                  title: 'Giờ hẹn',
                  dataIndex: 'time',
                  key: 'time',
                  render: text => <Text strong>{text}</Text>,
                },
                {
                  title: 'Khách hàng',
                  dataIndex: 'customerName',
                  key: 'customerName',
                  render: (text, record) => (
                    <div className="flex items-center">
                      <UserOutlined className="mr-2" />
                      {text}
                    </div>
                  ),
                },
                {
                  title: 'Loại dịch vụ',
                  dataIndex: 'serviceType',
                  key: 'serviceType',
                  render: text => {
                    const color = text === 'Xét nghiệm' ? 'blue' : 'green';
                    return <Tag color={color}>{text}</Tag>;
                  },
                },
                {
                  title: 'Tên dịch vụ',
                  dataIndex: 'serviceName',
                  key: 'serviceName',
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: status => {
                    let color = 'default';
                    let text = '';
                    switch(status) {
                      case 'confirmed':
                        color = 'green';
                        text = 'Đã xác nhận';
                        break;
                      case 'completed':
                        color = 'blue';
                        text = 'Hoàn thành';
                        break;
                      case 'cancelled':
                        color = 'red';
                        text = 'Đã hủy';
                        break;
                      case 'pending':
                        color = 'orange';
                        text = 'Chờ xác nhận';
                        break;
                      case 'no_show':
                        color = 'gray';
                        text = 'Không đến';
                        break;
                      default:
                        text = status;
                    }
                    return <Tag color={color}>{text}</Tag>;
                  },
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_, record) => (
                    <div>
                      <Button size="small" type="primary" className="mr-1">Chi tiết</Button>
                      
                      {record.status === 'pending' && (
                        <Button size="small" type="primary" className="bg-green-600 mr-1">Xác nhận</Button>
                      )}
                      
                      {record.status === 'confirmed' && (
                        <Button size="small" type="primary" className="bg-blue-600 mr-1">Check-in</Button>
                      )}
                      
                      {(record.status === 'confirmed' || record.status === 'pending') && (
                        <Button size="small" danger>Hủy</Button>
                      )}
                    </div>
                  ),
                },
              ]}
              size="small"
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StaffDashboard;