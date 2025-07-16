import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";
import { Spin } from "antd"; // Import Spin từ Ant Design

/**
 * Component bảo vệ route, kiểm tra đăng nhập và vai trò người dùng
 * @param {Object} props
 * @param {ReactNode} props.children - Component con cần được bảo vệ
 * @param {Array} props.allowedRoles - Mảng các role được phép truy cập
 * @returns {ReactNode}
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Lấy thông tin xác thực
  const { user, isAuthenticated, loading} = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin tip="Đang xác thực..." size="large">
          <div className="p-12"></div>
        </Spin>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }


  const userRole = user?.role;
  const hasPermission = userRole && allowedRoles.includes(userRole);

  if (!hasPermission) {
    console.log("Không đủ quyền truy cập");
    return <Navigate to="/" replace />;
  }

  // Đã đăng nhập và có đủ quyền
  return children;
};

export default ProtectedRoute;
