import { Form, Input, Button, Divider, Select, DatePicker } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import imgLogin from "../assets/login.png";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${imgLogin})` }}
    >
      <div className="absolute top-6 left-6">
        <Button
          type="primary"
          shape="round"
          icon={<ArrowLeftOutlined />}
          onClick={() => handleNavigation("/home")}
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

      {/* Form đăng ký */}
      <div className="mt-12 mb-12 bg-opacity-95 mx-auto w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-lg backdrop-blur-sm">
        <div className="bg-[#2196F3] px-8 py-6">
          <h2 className="text-center text-2xl font-bold text-white">
            Đăng ký tài khoản
          </h2>
        </div>

        <div className="p-8">
          <Form layout="vertical" size="large">
            <div className="flex gap-4">
              <Form.Item
                name="lastName"
                label="Họ"
                className="w-1/2"
                rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
              >
                <Input placeholder="Nguyễn" />
              </Form.Item>
              <Form.Item
                name="firstName"
                label="Tên"
                className="w-1/2"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Văn A" />
              </Form.Item>
            </div>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="0123456789" />
            </Form.Item>
            <div className="flex justify-between gap-4">
              <Form.Item
              className="w-1/2"
                name="birthDate"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  suffixIcon={
                    <CalendarOutlined className="text-gray-400" />}/>
              </Form.Item>
              <Form.Item
              className="w-1/2"
                name="gender"
                label="Giới tính"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="example@gmail.com"
              />
            </Form.Item>

            <Form.Item name="address" label="Địa chỉ">
              <Input
                prefix={<HomeOutlined />}
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
              />
            </Form.Item>

            <div className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                className="h-12 w-full rounded-md bg-[#7AC943] font-bold text-white hover:bg-[#6BB234]"
              >
                ĐĂNG KÝ
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              Đã có tài khoản?
              <a
                onClick={() => handleNavigation("/login")}
                className="ml-1 font-medium text-[#7AC943] hover:text-[#6BB234] cursor-pointer"
              >
                Đăng nhập
              </a>
            </div>

            <Divider plain className="text-gray-400">
              Hoặc
            </Divider>

            <div className="flex justify-center gap-4">
              <Button
                icon={<GoogleOutlined />}
                className="flex-1 border border-gray-300 hover:border-gray-400"
              >
                Đăng nhập với Google
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
