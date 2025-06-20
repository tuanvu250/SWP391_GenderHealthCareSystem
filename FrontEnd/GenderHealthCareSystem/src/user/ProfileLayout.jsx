import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Typography,
  Card,
  Avatar,
  Tabs,
  Button,
  Row,
  Col,
  Tag,
  Space,
  List,
  Form,
  Input,
  Upload,
  DatePicker,
  Select,
  Badge,
  Modal,
  Rate,
  message,
  Popconfirm,
  Slider,
  Divider,
} from "antd";
import ImgCrop from "antd-img-crop";
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LikeOutlined,
  LockOutlined,
  WarningOutlined,
  CameraOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const UserProfile = () => {
  // Giữ nguyên các state hiện tại
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();
  const location = useLocation();


  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/user/history-testing')) return "2";
    return "1"; // Default tab - profile
  };

  useEffect(() => {
    const activeTab = getActiveTabFromPath();
    setActiveTab(activeTab);
  }, [location.pathname]);



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
      comment:
        "Dr. Chen was extremely professional and caring. She took time to explain my condition thoroughly and answered all my questions patiently. The staff at the Women's Health Center were also very helpful.",
      helpful: 12,
      clinic: "Women's Health Center",
      appointmentId: "AP001",
    },
    {
      id: "FB002",
      date: "2023-11-23",
      doctorName: "Dr. Jessica Lee",
      serviceName: "Skin Examination",
      rating: 4,
      comment:
        "Dr. Lee was very knowledgeable and provided good advice for my skin condition. The clinic was clean, but I had to wait a bit longer than expected for my appointment.",
      helpful: 8,
      clinic: "Skin Care Clinic",
      appointmentId: "AP003",
    },
    {
      id: "FB003",
      date: "2023-10-05",
      doctorName: "Dr. Robert Smith",
      serviceName: "Annual Physical",
      rating: 3,
      comment:
        "The examination was thorough but rushed. Dr. Smith could have provided more detailed explanations about my health concerns.",
      helpful: 5,
      clinic: "City Medical Center",
      appointmentId: "AP004",
    },
  ];

  // Cập nhật tabItems với logic chỉnh sửa mới
  const tabItems = [
    {
      key: "1",
      label: <span onClick={() =>  navigate('/user/profile')}>Thông tin cá nhân</span>,
    },
    {
      key: "2",
      label: <span onClick={() =>  navigate('/user/history-testing')}>Lịch sử xét nghiệm</span>,
    },
    {
      key: "3",
      label: <span>Chu kỳ kinh nguyệt</span>,
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
                      <Text>
                        {item.startDate} đến {item.endDate}
                      </Text>
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
      label: <span>Lịch sử đánh giá</span>,
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
                  </Button>,
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
        {/* Tabs */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </Card>
      <Outlet />
      </div>
    </div>
  );
};

export default UserProfile;
