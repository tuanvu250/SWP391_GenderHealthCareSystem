import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Avatar, Badge, Button, Dropdown, Space } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  HeartOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import LogoSign from "../../../assets/logo-sign.svg";
import LogoText from "../../../assets/logo-text.svg";
import { useAuth } from "../../../components/provider/AuthProvider";

const { Header } = Layout;

const HeaderDashboard = ({ user = {} }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const auth= useAuth();
  // User menu items

  const handleLogout = () => {
    return () => {
      auth.logoutAction();
      navigate("/home");
    };
  }

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => navigate("/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout(),
      danger: true,
    },
  ];


  return (
    <header className="bg-white py-2.5 z-50 px-4 md:px-8 text-gray-800 shadow-sm sticky top-0 border-b border-gray-100">
      <div className="mx-auto flex justify-between items-center w-full">
        {/* Logo */}
        <a
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img src={LogoSign} alt="LogoSign" className="h-10" />
          <img src={LogoText} alt="LogoText" className="h-9" />
        </a>

        {/* Search and Login - Desktop and Tablet */}
        <div className="flex items-center gap-3">
          {/* Search Bar - Desktop */}
          <div className="relative hidden md:block">
            <div className="flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-200 hover:border-gray-300 shadow-sm transition-all">
              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="bg-transparent px-4 py-2 focus:outline-none text-sm w-44"
              />
              <button
                type="submit"
                className="text-gray-500 hover:text-[#0099CF] px-3 py-2 transition-colors"
              >
                <SearchOutlined />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Notifications */}
            <Badge count={5} className="mr-5 text-2xl">
              <button className="bg-transparent border-0 shadow-none flex items-center justify-center">
                <BellOutlined className=" text-xl" />
              </button>
            </Badge>

            {/* User name and Avatar */}
            <div className="flex items-center">
              {/* User name */}
              <div className="mr-3 text-right hidden sm:block">
                <div className=" font-medium">
                  {user.fullName || "Người dùng"}
                </div>
                <div className=" text-opacity-80 text-xs">
                  {user.role === "Consultant" && "Tư vấn viên"}
                  {user.role === "Staff" && "Nhân viên"}
                  {user.role === "Manager" && "Quản lý"}
                  {user.role === "Admin" && "Quản trị viên"}
                </div>
              </div>

              {/* User Avatar */}
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Avatar
                  size={40}
                  className="cursor-pointer bg-white text-[#0099CF]"
                  src={user.userImageUrl}
                >
                  {!user.avatar &&
                    (user.name ? user.name[0].toUpperCase() : "U")}
                </Avatar>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
