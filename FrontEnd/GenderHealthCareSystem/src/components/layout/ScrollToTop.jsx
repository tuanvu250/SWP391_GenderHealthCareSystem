import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { UpOutlined } from "@ant-design/icons";

/**
 * Component ScrollToTop kết hợp:
 * 1. Tự động cuộn lên đầu trang khi đường dẫn thay đổi
 * 2. Hiển thị nút để cuộn lên đầu trang khi người dùng đã cuộn xuống
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Tự động cuộn lên đầu trang khi đường dẫn thay đổi
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  // Hiển thị nút khi cuộn xuống
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility(); // Kiểm tra trạng thái ban đầu

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Hàm xử lý cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
      <Button
        type="primary"
        shape="circle"
        icon={<UpOutlined />}
        size="large"
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 99,
          opacity: isVisible ? 1 : 0,
          visibility: isVisible ? "visible" : "hidden",
          transition: "all 0.3s",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      />
  );
}

export default ScrollToTop;