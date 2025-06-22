import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  StarOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  BankOutlined,
  SecurityScanOutlined,
  ApiOutlined,
  ToolOutlined,
  AuditOutlined,
  SafetyOutlined,
  BugOutlined,
  DatabaseOutlined,
  EditOutlined,
  CheckCircleOutlined,
  SendOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { FaUserMd, FaUserTie, FaUserShield, FaCrown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const { Sider } = Layout;

const Sidebar = ({
  collapsed,
  onCollapse,
  selectedMenu,
  onMenuSelect,
  userRole,
}) => {
  // Menu items cho từng role
  const getMenuItems = (role) => {
    switch (role) {
      case "Consultant":
        return [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Tổng quan",
          },
          {
            key: "profile",
            icon: <UserOutlined />,
            label: "Hồ sơ tư vấn viên",
          },
          {
            key: "appointments",
            icon: <CalendarOutlined />,
            label: "Lịch hẹn tư vấn",
          },
          {
            key: "questions",
            icon: <MessageOutlined />,
            label: "Câu hỏi chuyên môn",
          },
          {
            key: "reviews",
            icon: <StarOutlined />,
            label: "Đánh giá và phản hồi",
          },
          {
            key: "blog-management",
            icon: <EditOutlined />,
            label: (
              <Link to={"/consultant/dashboard/manage-blog"}>Quản lý Blog</Link>
            ),
          },
          {
            key: "availability",
            icon: <CalendarOutlined />,
            label: "Lịch làm việc",
          },
          {
            key: "earnings",
            icon: <BankOutlined />,
            label: "Thu nhập",
          },
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Cài đặt",
          },
        ];

      case "Staff":
        return [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Tổng quan",
          },
          {
            key: "appointments",
            icon: <CalendarOutlined />,
            label: "Quản lý lịch hẹn",
          },
          {
            key: "patients",
            icon: <TeamOutlined />,
            label: "Quản lý bệnh nhân",
          },
          {
            key: "sti-test-management",
            icon: <MedicineBoxOutlined />,
            label: <Link to={"/staff/dashboard/manage-booking-stis"}>Quản lý xét nghiệm STI</Link>,
          },
          {
            key: "customer-support",
            icon: <MessageOutlined />,
            label: "Hỗ trợ khách hàng",
            children: [
              {
                key: "general-questions",
                label: "Câu hỏi thường gặp",
              },
              {
                key: "technical-support",
                label: "Hỗ trợ kỹ thuật",
              },
              {
                key: "forward-questions",
                label: "Chuyển câu hỏi chuyên môn",
              },
              {
                key: "chat-support",
                label: "Chat trực tuyến",
              },
            ],
          },
          {
            key: "reports",
            icon: <FileTextOutlined />,
            label: "Báo cáo",
          },
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Cài đặt",
          },
        ];

      case "Manager":
        return [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Tổng quan",
          },
          {
            key: "analytics",
            icon: <BarChartOutlined />,
            label: "Phân tích dữ liệu",
          },
          {
            key: "staff-management",
            icon: <TeamOutlined />,
            label: "Quản lý nhân viên",
          },
          {
            key: "consultant-management",
            icon: <UserOutlined />,
            label: "Quản lý consultant",
          },
          {
            key: "service-management",
            icon: <MedicineBoxOutlined />,
            label: <Link to={"/manager/dashboard/manage-service"}>Quản lý dịch vụ</Link>,
          },
          {
            key: "blog-oversight",
            icon: <BookOutlined />,
            label: <Link to={"/manager/dashboard/manage-blog"}>Giám sát Blog</Link>,
          },
          {
            key: "booking-management",
            icon: <CalendarOutlined />,
            label: <Link to={"/manager/dashboard/manage-booking-stis"}>Quản lý đặt lịch</Link>,
          },
          {
            key: "financial",
            icon: <BankOutlined />,
            label: "Tài chính",
          },
          {
            key: "quality-control",
            icon: <StarOutlined />,
            label: "Kiểm soát chất lượng",
          },
          {
            key: "reports",
            icon: <FileTextOutlined />,
            label: "Báo cáo quản lý",
          },
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Cài đặt",
          },
        ];

      case "Admin":
        return [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Tổng quan hệ thống",
          },
          {
            key: "user-management",
            icon: <TeamOutlined />,
            label: "Quản lý người dùng",
            children: [
              {
                key: "all-users",
                label: "Tất cả người dùng",
              },
              {
                key: "consultants",
                label: "Consultant",
              },
              {
                key: "staff",
                label: "Nhân viên",
              },
              {
                key: "managers",
                label: "Quản lý",
              },
              {
                key: "customers",
                label: "Khách hàng",
              },
            ],
          },
          {
            key: "content-management",
            icon: <BookOutlined />,
            label: "Quản lý nội dung",
            children: [
              {
                key: "blog-administration",
                label: "Quản trị Blog",
              },
              {
                key: "content-moderation",
                label: "Kiểm duyệt nội dung",
              },
              {
                key: "seo-management",
                label: "Quản lý SEO",
              },
            ],
          },
          {
            key: "system-config",
            icon: <SettingOutlined />,
            label: "Cấu hình hệ thống",
            children: [
              {
                key: "general-settings",
                label: "Cài đặt chung",
              },
              {
                key: "payment-settings",
                label: "Cài đặt thanh toán",
              },
              {
                key: "notification-settings",
                label: "Cài đặt thông báo",
              },
            ],
          },
          {
            key: "security",
            icon: <SecurityScanOutlined />,
            label: "Bảo mật",
            children: [
              {
                key: "access-logs",
                label: "Nhật ký truy cập",
              },
              {
                key: "permissions",
                label: "Phân quyền",
              },
              {
                key: "audit-trail",
                label: "Kiểm toán",
              },
            ],
          },
          {
            key: "system-monitoring",
            icon: <BarChartOutlined />,
            label: "Giám sát hệ thống",
            children: [
              {
                key: "performance",
                label: "Hiệu suất",
              },
              {
                key: "error-logs",
                label: "Nhật ký lỗi",
              },
              {
                key: "api-monitoring",
                label: "Giám sát API",
              },
            ],
          },
          {
            key: "database",
            icon: <DatabaseOutlined />,
            label: "Quản lý database",
            children: [
              {
                key: "backup",
                label: "Sao lưu",
              },
              {
                key: "maintenance",
                label: "Bảo trì",
              },
              {
                key: "migrations",
                label: "Migration",
              },
            ],
          },
          {
            key: "integrations",
            icon: <ApiOutlined />,
            label: "Tích hợp",
            children: [
              {
                key: "third-party",
                label: "Bên thứ 3",
              },
              {
                key: "apis",
                label: "API Management",
              },
              {
                key: "webhooks",
                label: "Webhooks",
              },
            ],
          },
          {
            key: "maintenance",
            icon: <ToolOutlined />,
            label: "Bảo trì hệ thống",
          },
          {
            key: "compliance",
            icon: <SafetyOutlined />,
            label: "Tuân thủ & Quy định",
          },
        ];

      default:
        return [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Tổng quan",
          },
        ];
    }
  };

  // Title cho từng role
  const getRoleTitle = (role) => {
    switch (role) {
      case "Consultant":
        return "Trang Tư Vấn Viên";
      case "Staff":
        return "Trang Nhân Viên";
      case "Manager":
        return "Trang Quản Lý";
      case "Admin":
        return "Trang Quản Trị";
      default:
        return "Bảng Điều Khiển";
    }
  };

  const siderStyle = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "none",
    scrollbarGutter: "stable",
    msOverFlowStyle: "none",
  };

  const menuItems = getMenuItems(userRole);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      width={280}
      style={siderStyle}
      className="shadow-sm"
    >
      {/* Header */}
      <div className="p-4 text-center border-b border-gray-200">
        {!collapsed && (
          <div className="text-lg font-bold text-gray-800">
            {getRoleTitle(userRole)}
          </div>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedMenu]}
        items={menuItems}
        onClick={({ key }) => onMenuSelect(key)}
        className="border-r-0 h-full"
        style={{
          fontSize: "14px",
        }}
      />
    </Sider>
  );
};

export default Sidebar;
