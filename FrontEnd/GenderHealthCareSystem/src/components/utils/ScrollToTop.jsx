import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang mỗi khi đường dẫn thay đổi
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  }, [pathname]);

  return null; // Component này không render bất kỳ thứ gì
}

export default ScrollToTop;