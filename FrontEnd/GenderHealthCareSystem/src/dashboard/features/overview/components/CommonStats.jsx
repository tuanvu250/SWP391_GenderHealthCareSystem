import React from 'react';
import { Row, Col, Card, Statistic, Badge } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, BellOutlined } from '@ant-design/icons';

const CommonStats = ({ stats }) => {
  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={24} sm={8} lg={8}>
        <Card>
          <Statistic
            title="Thông báo mới"
            value={stats.notifications || 0}
            valueStyle={{ color: stats.notifications > 0 ? '#1677ff' : '' }}
            prefix={<BellOutlined />}
            suffix={stats.notifications > 0 ? <Badge status="processing" /> : null}
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
};

export default CommonStats;