import React, { useState } from "react";
import { Layout } from "antd";
import { useAuth } from "../../../components/provider/AuthProvider";
import HeaderDashboard from "./HeaderDashboard";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, userRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const { user} = useAuth();

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
        
        <Layout.Content className="p-6 bg-gray-50">
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;