import imgLogin from "../assets/login.png";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${imgLogin})` }}
    >
      {/* Nút quay lại đã cải tiến */}
      <div className="absolute top-6 left-6">
        <Button
          type="primary"
          shape="round"
          icon={<ArrowLeftOutlined />}
          onClick={() => handleNavigation("/login")}
          className="flex items-center shadow-md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "transparent",
            color: "#0099CF",
          }}
        >
          Quay lại đăng nhập
        </Button>
      </div>
      <div>
        <div className="mt-12 mb-12 bg-opacity-95 mx-auto w-full min-w-lg overflow-hidden rounded-xl bg-white shadow-lg backdrop-blur-sm">
          <div className="bg-[#2196F3] px-8 py-6">
            <h2 className="text-center text-2xl font-bold text-white">
              Đặt lại mật khẩu
            </h2>
          </div>

          <div className="p-6">
            <Form layout="vertical" size="large">
                <p className="text-center text-lg text-gray-700 mb-4">
                  Nhập mật khẩu mới của bạn
                </p>
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập mật khẩu mới"
                  />

                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full"
                  >
                    Đặt lại mật khẩu
                  </Button>
                </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
