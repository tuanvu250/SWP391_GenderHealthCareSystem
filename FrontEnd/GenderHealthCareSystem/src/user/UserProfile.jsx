import React, { useEffect, useState } from "react";
import { 
  Typography, Card, Avatar, Tabs, Button, Row, Col, 
  Tag, Space, List, Form, Input, 
  DatePicker, Select, Badge, Modal, Rate
} from 'antd';
import { 
  UserOutlined, EditOutlined, CalendarOutlined,
  PhoneOutlined, MailOutlined, HomeOutlined,
  HeartOutlined, ClockCircleOutlined, FileTextOutlined,
  MedicineBoxOutlined, NotificationOutlined, SettingOutlined,
  CommentOutlined, StarOutlined, LikeOutlined
} from '@ant-design/icons';
import { getUserProfile } from "../util/Api";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const UserProfile = () => {
  const [user, setUser] = useState();
  const [activeTab, setActiveTab] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = date => date ? new Date(date).toISOString().split('T')[0] : '';


  const fetchUserProfile = async() => {
    try {
      const res = await getUserProfile();
      if (res && res.data) {
        setUser(res.data);
      }
      else {
        console.error("No user profile data found");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const userProfile = {
    name: user?.fullName,
    email: user?.email,
    phone: user?.phone,
    dob: user?.birthDate,
    gender: user?.gender,
    address: user?.address,
    joinDate: formatDate(user?.createdAt),
    avatar: user?.userImageUrl || "https://www.gravatar.com/avatarr",
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
            <Card className="mb-4">
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
                <Space direction="vertical" className="mt-2">
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
            <Card className="mb-4">
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <Space>
                      <CalendarOutlined />
                      <Text>{item.startDate} đến {item.endDate}</Text>
                    </Space>
                  }
                  description={
                    <div className="mt-2">
                      <div className="mb-2">
                        <Text strong>Triệu chứng:</Text>
                        {item.symptoms.map((symptom, index) => (
                          <Tag color="purple" key={index} className="ml-2">
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
            <Card className="mb-4">
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
                      <div className="mt-1">
                        <Rate disabled defaultValue={item.rating} />
                      </div>
                    </div>
                  }
                  description={
                    <Space direction="vertical" className="w-full mt-2">
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
                <div className="bg-gray-50 p-4 mt-4 rounded-lg border border-gray-200">
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8} className="text-center">
              <Badge count={<SettingOutlined className="text-orange-500" />} offset={[-5, 5]}>
                <Avatar 
                  size={120} 
                  src={userProfile.avatar} 
                  icon={<UserOutlined />} 
                />
              </Badge>
              <Title level={3} className="mt-4 mb-1">
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
              <DatePicker className="w-full" />
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
              <Space className="w-full justify-end">
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