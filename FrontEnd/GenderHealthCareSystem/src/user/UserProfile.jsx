import React, { useState } from "react";
import { 
  Typography, Card, Avatar, Tabs, Button, Row, Col, 
  Statistic, Tag, Divider, Space, List, Form, Input, 
  DatePicker, Select, Badge, Modal, Rate
} from 'antd';
import { 
  UserOutlined, EditOutlined, CalendarOutlined,
  PhoneOutlined, MailOutlined, HomeOutlined,
  HeartOutlined, ClockCircleOutlined, FileTextOutlined,
  MedicineBoxOutlined, NotificationOutlined, SettingOutlined,
  CommentOutlined, StarOutlined, LikeOutlined
} from '@ant-design/icons';
import { useAuth } from "../components/provider/AuthProvider";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Giả lập dữ liệu
  const userProfile = {
    name: user?.fullName || "Sarah Johnson",
    email: user?.email || "sarah.johnson@example.com",
    phone: user?.phone || "+84 123 456 789",
    dob: "1990-01-15",
    gender: "Female",
    address: "123 Main Street, District 1, Ho Chi Minh City",
    joinDate: "2023-06-01",
    avatar: user?.avatar || "https://randomuser.me/api/portraits/women/44.jpg",
  };

  const recentAppointments = [
    {
      id: "AP001",
      date: "2023-12-15",
      time: "10:00 AM",
      doctor: "Dr. Emily Chen",
      specialization: "Gynecologist",
      clinic: "Women's Health Center",
      status: "Completed",
    },
    {
      id: "AP002",
      date: "2024-01-10",
      time: "2:30 PM",
      doctor: "Dr. Michael Wang",
      specialization: "General Practitioner",
      clinic: "City Medical Center",
      status: "Upcoming",
    },
    {
      id: "AP003",
      date: "2023-11-22",
      time: "9:15 AM",
      doctor: "Dr. Jessica Lee",
      specialization: "Dermatologist",
      clinic: "Skin Care Clinic",
      status: "Completed",
    },
  ];

  const menstrualCycles = [
    {
      id: "MC001",
      startDate: "2023-12-05",
      endDate: "2023-12-10",
      symptoms: ["Cramps", "Mood swings"],
      notes: "Moderate flow, took pain medication on day 2",
    },
    {
      id: "MC002",
      startDate: "2023-11-08",
      endDate: "2023-11-13",
      symptoms: ["Cramps", "Headache"],
      notes: "Light flow, irregular cycle",
    },
    {
      id: "MC003",
      startDate: "2023-10-10",
      endDate: "2023-10-16",
      symptoms: ["Cramps", "Fatigue", "Bloating"],
      notes: "Heavy flow on days 2-3",
    },
  ];

  // Thêm dữ liệu lịch sử feedback và rating
  const feedbackHistory = [
    {
      id: "FB001",
      date: "2023-12-16",
      doctorName: "Dr. Emily Chen",
      serviceName: "Gynecological Consultation",
      rating: 5,
      comment: "Dr. Chen was extremely professional and caring. She took time to explain my condition thoroughly and answered all my questions patiently. The staff at the Women's Health Center were also very helpful.",
      helpful: 12,
      clinic: "Women's Health Center",
      appointmentId: "AP001"
    },
    {
      id: "FB002",
      date: "2023-11-23",
      doctorName: "Dr. Jessica Lee",
      serviceName: "Skin Examination",
      rating: 4,
      comment: "Dr. Lee was very knowledgeable and provided good advice for my skin condition. The clinic was clean, but I had to wait a bit longer than expected for my appointment.",
      helpful: 8,
      clinic: "Skin Care Clinic",
      appointmentId: "AP003"
    },
    {
      id: "FB003",
      date: "2023-10-05",
      doctorName: "Dr. Robert Smith",
      serviceName: "Annual Physical",
      rating: 3,
      comment: "The examination was thorough but rushed. Dr. Smith could have provided more detailed explanations about my health concerns.",
      helpful: 5,
      clinic: "City Medical Center",
      appointmentId: "AP004"
    },
  ];

  const getStatusTag = (status) => {
    switch (status) {
      case "Completed":
        return <Tag color="success">{status}</Tag>;
      case "Upcoming":
        return <Tag color="processing">{status}</Tag>;
      case "Cancelled":
        return <Tag color="error">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (values) => {
    console.log("Updated profile:", values);
    setIsModalOpen(false);
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <FileTextOutlined />
          Thông tin cá nhân
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <List>
                <List.Item>
                  <List.Item.Meta
                    avatar={<UserOutlined />}
                    title="Họ và tên"
                    description={userProfile.name}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<CalendarOutlined />}
                    title="Ngày sinh"
                    description={userProfile.dob}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<UserOutlined />}
                    title="Giới tính"
                    description={userProfile.gender}
                  />
                </List.Item>
              </List>
            </Col>
            <Col xs={24} md={12}>
              <List>
                <List.Item>
                  <List.Item.Meta
                    avatar={<MailOutlined />}
                    title="Email"
                    description={userProfile.email}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<PhoneOutlined />}
                    title="Điện thoại"
                    description={userProfile.phone}
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    avatar={<HomeOutlined />}
                    title="Địa chỉ"
                    description={userProfile.address}
                  />
                </List.Item>
              </List>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <MedicineBoxOutlined />
          Lịch sử khám bệnh
        </span>
      ),
      children: (
        <List
          itemLayout="vertical"
          dataSource={recentAppointments}
          renderItem={(item) => (
            <Card style={{ marginBottom: 16 }}>
              <List.Item
                key={item.id}
                extra={getStatusTag(item.status)}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Space>
                      <Text strong>{item.doctor}</Text>
                      <Tag color="blue">{item.specialization}</Tag>
                    </Space>
                  }
                  description={item.clinic}
                />
                <Space direction="vertical" style={{ marginTop: 8 }}>
                  <Space>
                    <CalendarOutlined />
                    <Text>{item.date}</Text>
                  </Space>
                  <Space>
                    <ClockCircleOutlined />
                    <Text>{item.time}</Text>
                  </Space>
                </Space>
              </List.Item>
            </Card>
          )}
        />
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <HeartOutlined />
          Chu kỳ kinh nguyệt
        </span>
      ),
      children: (
        <List
          itemLayout="vertical"
          dataSource={menstrualCycles}
          renderItem={(item) => (
            <Card style={{ marginBottom: 16 }}>
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <Space>
                      <CalendarOutlined />
                      <Text>{item.startDate} đến {item.endDate}</Text>
                    </Space>
                  }
                  description={
                    <div style={{ marginTop: 8 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Triệu chứng:</Text>
                        {item.symptoms.map((symptom, index) => (
                          <Tag color="purple" key={index} style={{ marginLeft: 8 }}>
                            {symptom}
                          </Tag>
                        ))}
                      </div>
                      <Text type="secondary">{item.notes}</Text>
                    </div>
                  }
                />
              </List.Item>
            </Card>
          )}
        />
      ),
    },
    {
      key: "4",
      label: (
        <span>
          <CommentOutlined />
          Lịch sử đánh giá
        </span>
      ),
      children: (
        <List
          itemLayout="vertical"
          dataSource={feedbackHistory}
          renderItem={(item) => (
            <Card style={{ marginBottom: 16 }}>
              <List.Item
                key={item.id}
                actions={[
                  <Space key="helpful">
                    <LikeOutlined />
                    <Text>{item.helpful} người thấy hữu ích</Text>
                  </Space>,
                  <Button key="edit" type="link" size="small">
                    Chỉnh sửa đánh giá
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div>
                      <Space align="center">
                        <Text strong>{item.serviceName}</Text>
                        <Text type="secondary">tại {item.clinic}</Text>
                      </Space>
                      <div style={{ marginTop: 4 }}>
                        <Rate disabled defaultValue={item.rating} />
                      </div>
                    </div>
                  }
                  description={
                    <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                      <Space>
                        <UserOutlined />
                        <Text>{item.doctorName}</Text>
                      </Space>
                      <Space>
                        <CalendarOutlined />
                        <Text>{item.date}</Text>
                      </Space>
                    </Space>
                  }
                />
                <div style={{ 
                  background: '#f9f9f9', 
                  padding: 16, 
                  marginTop: 16, 
                  borderRadius: 8,
                  border: '1px solid #e8e8e8' 
                }}>
                  <Paragraph>{item.comment}</Paragraph>
                </div>
              </List.Item>
            </Card>
          )}
        />
      ),
    },
  ];

  return (
    <div className="profile-container" style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="profile-content" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header Card */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              <Badge count={<SettingOutlined style={{ color: '#f56a00' }} />} offset={[-5, 5]}>
                <Avatar 
                  size={120} 
                  src={userProfile.avatar} 
                  icon={<UserOutlined />} 
                />
              </Badge>
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                {userProfile.name}
              </Title>
              <Text type="secondary">
                Thành viên từ {userProfile.joinDate}
              </Text>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Paragraph>
                    Chào mừng bạn đến với trang hồ sơ cá nhân. Tại đây bạn có thể xem và quản lý thông tin cá nhân,
                    theo dõi lịch sử khám bệnh và quản lý chu kỳ kinh nguyệt của mình.
                  </Paragraph>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    block
                    onClick={handleEditProfile}
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button 
                    icon={<StarOutlined />}
                    block
                  >
                    Viết đánh giá mới
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button 
                    icon={<CalendarOutlined />}
                    block
                  >
                    Đặt lịch khám
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Tabs */}
        <Card>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={tabItems}
          />
        </Card>

        {/* Edit Profile Modal */}
        <Modal
          title="Chỉnh sửa hồ sơ"
          open={isModalOpen}
          onCancel={handleModalCancel}
          footer={null}
        >
          <Form
            layout="vertical"
            initialValues={{
              fullName: userProfile.name,
              email: userProfile.email,
              phone: userProfile.phone,
              dob: userProfile.dob,
              gender: userProfile.gender,
              address: userProfile.address,
            }}
            onFinish={handleFormSubmit}
          >
            <Form.Item 
              name="fullName" 
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item 
              name="email" 
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item 
              name="phone" 
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item 
              name="dob" 
              label="Ngày sinh"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item 
              name="gender" 
              label="Giới tính"
            >
              <Select>
                <Option value="Female">Nữ</Option>
                <Option value="Male">Nam</Option>
                <Option value="Other">Khác</Option>
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="address" 
              label="Địa chỉ"
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'end' }}>
                <Button onClick={handleModalCancel}>Hủy</Button>
                <Button type="primary" htmlType="submit">Cập nhật</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserProfile;