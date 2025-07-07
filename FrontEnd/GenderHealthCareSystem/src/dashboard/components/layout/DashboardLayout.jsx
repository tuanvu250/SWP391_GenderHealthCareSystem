import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useAuth } from "../../../components/provider/AuthProvider";
import HeaderDashboard from "./HeaderDashboard";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const DashboardLayout = ({ userRole }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setCollapsed(true);
  }, [location.pathname]);

  return (
    <Layout className="min-h-screen">
      <Layout>
        <Sidebar
          collapsed={collapsed}
          onCollapse={setCollapsed}
          selectedMenu={selectedMenu}
          onMenuSelect={setSelectedMenu}
          userRole={userRole}
        />
        <Layout.Content className="bg-gray-50">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
