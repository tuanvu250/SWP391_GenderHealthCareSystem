import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Avatar,
  Menu,
  Button,
  Divider,
  Badge,
  Space,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  LikeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";

const { Title } = Typography;

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedKey, setSelectedKey] = useState("1");

  useEffect(() => {
    const activeKey = getActiveKeyFromPath();
    setSelectedKey(activeKey);
  }, [location.pathname]);

  const getActiveKeyFromPath = () => {
    const path = location.pathname;
    if (path.includes("/user/history-testing")) return "2";
    if (path.includes("/user/history-feedback")) return "4";
    if (path.includes("/user/history-consultation")) return "3";
    if (path.includes("/user/account-settings")) return "5";
    return "1"; // Default - profile
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case "1":
        navigate("/user/profile");
        break;
      case "2":
        navigate("/user/history-testing");
        break;
      case "3":
        navigate("/user/history-consultation");
        break;
      case "4":
        navigate("/user/history-feedback");
        break;
      case "5":
        navigate("/user/account-settings");
        break;
      default:
        navigate("/user/profile");
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "2",
      icon: <ClockCircleOutlined />,
      label: "Lịch sử xét nghiệm",
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Lịch sử đặt lịch tư vấn",
    },
    {
      key: "4",
      icon: <LikeOutlined />,
      label: "Lịch sử đánh giá",
    },
    {
      key: "5",
      icon: <SettingOutlined />,
      label: "Cài đặt tài khoản",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4">
            <Card className="mb-4">
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  src={user?.userImageUrl}
                  className="mb-2"
                />
                <Title level={4} className="m-0">
                  {user?.fullName || "Người dùng"}
                </Title>
                <div className="text-gray-500">
                  {user?.email || "email@example.com"}
                </div>

                <Button
                  type="link"
                  className="mt-2"
                  onClick={() => navigate("/user/profile")}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
            </Card>

            <Card>
              <Menu
                mode="vertical"
                selectedKeys={[selectedKey]}
                items={menuItems}
                onClick={({ key }) => handleMenuClick(key)}
                className="border-none"
              />
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <Card className="w-full">
              <Outlet />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
