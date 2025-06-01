import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";

/**
 * Component bảo vệ route, kiểm tra đăng nhập và vai trò người dùng
 * @param {Object} props
 * @param {ReactNode} props.children - Component con cần được bảo vệ
 * @param {Array} props.allowedRoles - Mảng các role được phép truy cập
 * @returns {ReactNode}
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Lấy thông tin xác thực
  const { user, isAuthenticated } = useAuth();
  
  // Kiểm tra đã đăng nhập chưa
  if (!isAuthenticated) {
    console.log("Chưa đăng nhập, chuyển hướng đến login");
    return <Navigate to="/login" replace />;
  }
  
  // Nếu không cần kiểm tra role hoặc không có role nào được yêu cầu
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }
  
  // Kiểm tra quyền truy cập dựa trên role
  const userRole = user?.roleId; // Giả sử user object có trường roleId
  const hasPermission = userRole && allowedRoles.includes(userRole);
  
  // Nếu không có quyền truy cập, chuyển hướng về trang chủ
  if (!hasPermission) {
    console.log("Không đủ quyền truy cập");
    return <Navigate to="/" replace />;
  }
  
  // Đã đăng nhập và có đủ quyền
  return children;
};

export default ProtectedRoute;