import { Form, Input, Button, Divider, Checkbox, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import imgLogin from "../assets/login.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../components/provider/AuthProvider";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await auth.loginAction(values);
      if (response.success) {
        message.success(response.message);
        setTimeout(() => {      
          if (response.role === "Customer") {
            navigate("/home");
          } else navigate(`/${response.role.toLowerCase()}/dashboard`);
        }, 500) ;
      } else {
        message.error(response.message);
        form.setFieldValue("password", ""); // Clear password field on error
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Đăng nhập không thành công, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    setLoading(true);
    
    // Frontend URL để Google callback lại
    const redirectUri = encodeURIComponent('http://localhost:5173/login/oauth2/');
    
    // URL OAuth của backend
    const googleAuthUrl = `http://localhost:8080/oauth2/authorization/google?redirect_uri=${redirectUri}`;
    
    // Chuyển hướng browser đến trang xác thực Google
    window.location.href = googleAuthUrl;
  }

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
          onClick={() => navigate("/home")}
          className="flex items-center shadow-md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "transparent",
            color: "#0099CF",
          }}
        >
          Quay lại trang chủ
        </Button>
      </div>

      <div className="bg-opacity-95 mx-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg backdrop-blur-sm">
        {/* Header */}
        <div className="bg-[#0099CF] px-8 py-6">
          <h2 className="text-center text-2xl font-bold text-white">
            Đăng nhập
          </h2>
          <p className="mt-1 text-center text-blue-50">
            Chào mừng bạn quay trở lại
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            size="large"
            className="space-y-4"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="mr-2 text-gray-400" />}
                placeholder="Tên đăng nhập hoặc Email"
                className="rounded-md py-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="mr-2 text-gray-400" />}
                placeholder="Mật khẩu"
                className="rounded-md py-2"
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <a
                className="text-sm font-medium text-[#0099CF] hover:text-[#0088bb]"
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </a>
            </div>

            <div className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-12 w-full rounded-md bg-[#7AC943] font-bold text-white hover:bg-[#6BB234]"
              >
                ĐĂNG NHẬP
              </Button>
            </div>

            <Divider plain className="text-gray-400">
              Hoặc đăng nhập với
            </Divider>

            <div className="flex space-x-4">
              <Button
                icon={<GoogleOutlined />}
                className="flex h-12 flex-1 items-center justify-center rounded-md border border-gray-300 hover:border-gray-400"
                onClick={() => loginWithGoogle()}
              >
                Google
              </Button>
            </div>

            <div className="mt-6 text-center text-gray-600">
              Chưa có tài khoản?
              <span
                onClick={() => navigate("/register")}
                className="ml-1 font-medium text-[#0099CF] hover:text-[#0088bb]"
              >
                Đăng ký ngay
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
