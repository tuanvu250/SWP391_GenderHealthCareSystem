import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../components/provider/AuthProvider";
import { message } from "antd";

const OauthRedirect = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [processed, setProcessed] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    const handleRedirect = async () => {
      if (token && !processed) {
        try {
          sessionStorage.setItem("token", token);
          await auth.refreshUserProfile();

          if (auth.user) {
            setProcessed(true);
            // Kiểm tra nếu cần điền thêm thông tin
            if (
              !auth.user.phone ||
              !auth.user.address ||
              !auth.user.birthDate
            ) {
              navigate("/google-signup-complete");
            } else {
              message.success("Đăng nhập thành công!");
              navigate("/home"); 
              return;
            }
          }
        } catch (error) {
          console.error("Error processing OAuth redirect:", error);
          navigate("/login");
        }
      } else if (!token) {
        console.error("No authorization token found in the URL.");
      }
    };

    handleRedirect();
  }, [auth.user]); // Chỉ phụ thuộc vào token và processed

  // Hiển thị loading hoặc thông báo
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Đang xử lý đăng nhập...</h2>
        <p>Vui lòng đợi trong giây lát.</p>
      </div>
    </div>
  );
};

export default OauthRedirect;
