import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useAuth } from "../../../components/provider/AuthProvider";
import HeaderDashboard from "./HeaderDashboard";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ userRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const { user} = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      // 768px là breakpoint md của Tailwind CSS
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <Layout className="min-h-screen">
      <HeaderDashboard 
        user={user}
      />
      
      <Layout>
        <Sidebar
          collapsed={collapsed}
          onCollapse={setCollapsed}
          selectedMenu={selectedMenu}
          onMenuSelect={setSelectedMenu}
          userRole={userRole}
        />
        
        <Layout.Content className="md:p-6 bg-gray-50">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;