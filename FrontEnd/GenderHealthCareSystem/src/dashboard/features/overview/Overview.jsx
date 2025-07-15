import React, { useState, useEffect } from 'react';
import { Alert, Button, Spin, Typography } from 'antd';
import { useAuth } from '../../../components/provider/AuthProvider';
import ConsultantDashboard from './components/ConsultantDashboard';
import StaffDashboard from './components/StaffDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import { getDashboardStats } from './utils/fetchData';

const { Title } = Typography;

// Overview component
const Overview = () => {
  const { user } = useAuth();
  const role = user?.role || "Staff"; // Fallback role
  
  // State cho dữ liệu dashboard
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  
  // Fetch dữ liệu dashboard dựa vào role
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const mockData = await getDashboardStats(role);
        console.log(">>> Mock data for role:", role, mockData);
        setStats(mockData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [role]);
  
  // Render dashboard dựa vao role
  const renderDashboardByRole = () => {
    switch(role) {
      case "Consultant":
        return <ConsultantDashboard stats={stats} />;
      case "Staff":
        return <StaffDashboard stats={stats} />;
      case "Manager":
        return <ManagerDashboard stats={stats} />;
      case "Admin":
        return <AdminDashboard stats={stats} />;
      default:
        return (
          <Alert
            message="Không có dữ liệu dashboard"
            description="Không tìm thấy dữ liệu dashboard cho vai trò của bạn."
            type="warning"
            showIcon
          />
        );
    }
  };
  
  // Render page title dựa vao role
  const renderPageTitle = () => {
    let title = "Tổng quan";
    
    switch(role) {
      case "Admin":
        title = "Tổng quan hệ thống";
        break;
      case "Manager":
        title = "Tổng quan quản lý";
        break;
      case "Staff":
        title = "Tổng quan vận hành";
        break;
      case "Consultant":
        title = "Tổng quan tư vấn viên";
        break;
    }
    
    return (
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">{title}</Title>
        <div>
          <Button type="default" onClick={() => window.location.reload()}>Làm mới</Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      {renderPageTitle()}
      
      {/* Common components shared by all roles */}
      {/* <CommonStats stats={stats} /> */}
      
      {/* Role-specific sections */}
      {loading ? (
        <div className="text-center p-8">
          <Spin size="large" />
        </div>
      ) : (
        renderDashboardByRole()
      )}
    </div>
  );
};

export default Overview;