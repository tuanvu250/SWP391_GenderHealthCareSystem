import imgLogin from "../assets/login.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { forgotPasswordAPI, verifyOTPAPI } from "../components/api/Auth.api";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSendOTP = async (values) => {
    setLoading(true);
    try {
      const response = await forgotPasswordAPI(values.usernameOrEmail);
      setOtpSent(false);
      if (response.status == 200) {
        message.success("Mã OTP đã được gửi đến email của bạn!");
        setEmail(response.data.email);
        setOtpSent(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        message.error("Tên đăng nhập hoặc email không tồn tại!");
      } else {
        message.error("Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại sau.");
      }
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xác thực mã OTP
  const handleVerifyOTP = async (values) => {
    setLoading(true);
    try {
      const input = {
        usernameOrEmail: email,
        otp: values.otp,
      };
      const response = await verifyOTPAPI(input);

      if (response.status === 200) {
        message.success("Mã OTP xác thực thành công!");
        sessionStorage.setItem("email", email);
        navigate("/reset-password");
      } else {
        message.error("Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.");
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error("Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.");
      } else {
        message.error(
          "Có lỗi xảy ra khi xác thực mã OTP. Vui lòng thử lại sau."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value) => {
    setOtpValue(value);
    if (form && otpSent) {
      form.setFieldsValue({ otp: value });
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      message.error("Không tìm thấy thông tin email. Vui lòng thử lại.");
      return;
    }

    await handleSendOTP({ usernameOrEmail: email });
    form.setFieldsValue({ otp: "" });
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
                Mã OTP đã được gửi đến email {email} của bạn
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
                    onClick={handleResendOTP}
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
