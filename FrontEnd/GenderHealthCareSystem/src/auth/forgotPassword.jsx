import imgLogin from "../assets/login.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { forgotPasswordAPI, resetPasswordAPI } from "../util/api";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Xử lý gửi yêu cầu lấy mã OTP
  
  const handleSendOTP = async (values) => {
    setLoading(true);
    try {
      // Giả lập API call
      const response = await forgotPasswordAPI(values.usernameOrEmail);
      console.log("Response from forgotPasswordAPI:", response);

      if (response.status == 200) {
        message.success("Mã OTP đã được gửi đến email của bạn!");
        setEmail(values.usernameOrEmail);
        setOtpSent(true);
      } else {
        message.error(
          "Không tìm thấy tài khoản với tên đăng nhập hoặc email này."
        );
        setOtpSent(false);
        return;
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      message.error("Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại sau.");
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  }, [otpSent]);

  // Xử lý xác thực mã OTP
  const handleVerifyOTP = async (values) => {
    setLoading(true);
    try {
      // Giả lập API call
      const userData = {  
        usernameOrEmail: email,
        otp: values.otp,
      }
      // Giả sử xác thực OTP thành công
      message.success("Xác thực mã OTP thành công!");
      navigate("/reset-password");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      message.error("Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value) => {
    setOtpValue(value);
    form.setFieldsValue({ otp: value });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${imgLogin})` }}
    >
      {/* Nút quay lại */}
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

      {/* Container chính */}
      <div className="mt-12 mb-12 bg-opacity-95 mx-auto w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-lg backdrop-blur-sm">
        <div className="bg-[#0099CF] px-8 py-6">
          <h2 className="text-center text-2xl font-bold text-white">
            {otpSent ? "Xác thực OTP" : "Quên mật khẩu"}
          </h2>
        </div>

        <div className="p-8">
          {!otpSent ? (
            // Form nhập email hoặc username
            <>
              <h3 className="text-center text-lg text-gray-700 mb-6">
                Vui lòng nhập tên đăng nhập hoặc email đã đăng ký để nhận mã xác
                thực
              </h3>
              <Form layout="vertical" size="large" onFinish={handleSendOTP}>
                <Form.Item
                  name="usernameOrEmail"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên đăng nhập hoặc email!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400 mr-2" />}
                    placeholder="Nhập tên đăng nhập hoặc email"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loading}
                    disabled={loading}
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 text-lg mt-4"
                  >
                    Gửi mã xác thực
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            // Form nhập mã OTP
            <>
              <h3 className="text-center text-lg text-gray-700 mb-4">
                Mã OTP đã được gửi đến email của bạn
                <br />
                Vui lòng nhập mã để tiếp tục.
              </h3>
              <Form
                layout="vertical"
                size="large"
                form={form}
                onFinish={handleVerifyOTP}
              >
                <Form.Item
                  className="mb-4 text-center"
                  name="otp"
                  label="Mã xác thực OTP"
                  rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
                >
                  <Input.OTP
                    value={otpValue}
                    onChange={handleOtpChange}
                    formatter={(value) => value.replace(/\D/g, "")}
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
                  >
                    Xác nhận
                  </Button>
                </Form.Item>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    type="link"
                    onClick={handleSendOTP}
                    className="text-blue-500 hover:text-blue-700"
                    disabled={loading}
                  >
                    Gửi lại mã OTP
                  </Button>
                  <Button
                    type="link"
                    onClick={() => setOtpSent(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Thay đổi thông tin
                  </Button>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
