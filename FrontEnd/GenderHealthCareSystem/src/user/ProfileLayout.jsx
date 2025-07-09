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

  useEffect(() => {
    const activeTab = getActiveTabFromPath();
    setActiveTab(activeTab);
  }, [location.pathname]);

  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes("/user/history-testing")) return "2";
    if (path.includes("/user/history-feedback")) return "4";
    if (path.includes("/user/history-consultation")) return "3";
    if (path.includes("/user/account-settings")) return "5";
    return "1"; // Default tab - profile
  };

  // Cập nhật tabItems với logic chỉnh sửa mới
  const tabItems = [
    {
      key: "1",
      label: (
        <span onClick={() => navigate("/user/profile")}>Thông tin cá nhân</span>
      ),
    },
    {
      key: "2",
      label: (
        <span onClick={() => navigate("/user/history-testing")}>
          Lịch sử xét nghiệm
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span onClick={() => navigate("/user/history-consultation")}>
          Lịch sử đặt lịch tư vấn
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span onClick={() => navigate("/user/history-feedback")}>
          Lịch sử đánh giá xét nghiệm
        </span>
      ),
    },
    {
      key: "5",
      label: (
        <span onClick={() => navigate("/user/account-settings")}>
          Cài đặt tài khoản
        </span>
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
