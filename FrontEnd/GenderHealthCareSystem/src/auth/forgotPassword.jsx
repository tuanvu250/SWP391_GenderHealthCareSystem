import imgLogin from "../assets/login.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";


const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("OTP Code:", values.otp);
    setLoading(true);
  }

  const handlleOtpChange = (value) => {
    setOtpValue(value);
    form.setFieldsValue({ otp: value });
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
          onClick={() => navigate("/login")}
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
      {/* Form nhập mã OTP */}
      <div>
        <div className="mt-12 mb-12 bg-opacity-95 mx-auto w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-lg backdrop-blur-sm">
          <div className="bg-[#2196F3] px-8 py-6">
            <h2 className="text-center text-2xl font-bold text-white">
              Nhập mã OTP
            </h2>
          </div>

          <div className="p-6">
            <h3 className="text-center text-lg text-gray-700 mb-4">
              Mã OTP đã được gửi đến số điện email của bạn. Vui lòng nhập mã để
              tiếp tục.
            </h3>
            <Form layout="vertical" size="large" form={form} onFinish={onFinish}>
              <Form.Item
                className="mb-4 text-center"
                name="otp"
                label="Mã OTP"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
              >
                <Input.OTP
                  value={otpValue}
                  onChange={handlleOtpChange}
                  formatter={(value) =>
                    value.replace(/\D/g, "")
                  }
                  maxLength={6}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  loading={loading}
                  disabled={loading}
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  style={{ backgroundColor: "#2196F3" }}
                >
                  Xác nhận
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type="link"
                  onClick={() => navigate("/reset-password")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Gửi lại mã OTP
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
