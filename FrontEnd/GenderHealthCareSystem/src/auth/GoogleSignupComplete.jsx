import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, message, Card, Steps } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";
import dayjs from "dayjs";
import imgBackground from "../assets/login.png";

const { Option } = Select;
const { Step } = Steps;

const GoogleSignupComplete = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { completeGoogleSignup, getCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Lấy thông tin người dùng từ localStorage hoặc URL params
  useEffect(() => {
    // Thử lấy dữ liệu từ state của react-router
    const userData = location.state?.googleUser;
    
    // Thử lấy từ localStorage nếu không có trong state
    const storedUserData = localStorage.getItem('googleUserData');

    if (userData) {
      setGoogleUser(userData);
      
      // Pre-fill email và name từ Google
      form.setFieldsValue({
        email: userData.email,
        fullName: userData.name || '',
      });
    } else if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setGoogleUser(parsedUserData);
        
        // Pre-fill email và name từ Google
        form.setFieldsValue({
          email: parsedUserData.email,
          fullName: parsedUserData.name || '',
        });
      } catch (error) {
        console.error("Lỗi khi parse dữ liệu người dùng:", error);
      }
    } else {
      // Không có dữ liệu người dùng, chuyển hướng về trang login
      message.error("Không tìm thấy thông tin đăng nhập Google");
      navigate("/login");
    }
  }, [location.state, form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Chuyển đổi ngày sinh thành string format YYYY-MM-DD
      const formattedValues = {
        ...values,
        birthDate: values.birthDate.format("YYYY-MM-DD"),
      };

      // Lấy token từ Google user data
      const googleToken = googleUser?.token || localStorage.getItem('googleToken');
      
      if (!googleToken) {
        message.error("Không tìm thấy token xác thực Google");
        navigate("/login");
        return;
      }

      const response = await completeGoogleSignup({
        ...formattedValues,
        googleToken
      });

      if (response.success) {
        setCurrentStep(1);
        setTimeout(async () => {
          // Khi hoàn thành, xóa dữ liệu tạm từ localStorage
          localStorage.removeItem('googleUserData');
          localStorage.removeItem('googleToken');
          
          // Cập nhật thông tin người dùng hiện tại
          await getCurrentUser();
          
          // Thông báo thành công
          message.success("Cập nhật thông tin thành công!");
          
          // Chuyển hướng về trang chủ
          navigate("/home");
        }, 1500);
      } else {
        message.error(response.message || "Cập nhật thông tin không thành công");
      }
    } catch (error) {
      console.error("Error completing Google signup:", error);
      message.error("Cập nhật thông tin không thành công, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center py-10"
      style={{ backgroundImage: `url(${imgBackground})` }}
    >
      <Card className="w-full md:max-w-lg shadow-xl bg-white bg-opacity-95 rounded-xl">
        <div className="mb-6">
          <Steps current={currentStep} className="max-w-md mx-auto">
            <Step title="Thông tin" description="Bổ sung thông tin cá nhân" />
            <Step title="Hoàn tất" description="Đăng ký thành công" icon={<CheckCircleOutlined />} />
          </Steps>
        </div>

        {currentStep === 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-center text-2xl font-bold text-gray-800">
                Thông tin bổ sung
              </h2>
              <p className="text-center text-gray-600 mt-2">
                Vui lòng cung cấp thêm một số thông tin để hoàn tất đăng ký
              </p>
            </div>

            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" }
                ]}
              >
                <Input prefix={<MailOutlined />} disabled placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                    message: "Số điện thoại không hợp lệ!"
                  }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="VD: 0912345678" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input
                  prefix={<HomeOutlined />}
                  placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                />
              </Form.Item>

              <div className="flex gap-4">
                <Form.Item
                  name="birthDate"
                  label="Ngày sinh"
                  className="w-1/2"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh!" }
                  ]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn ngày sinh"
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                    suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label="Giới tính"
                  className="w-1/2"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính!" }
                  ]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Option value="Male">Nam</Option>
                    <Option value="Female">Nữ</Option>
                    <Option value="Other">Khác</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item className="mb-0 mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="h-12 w-full bg-[#0099CF] hover:bg-[#007DA8]"
                >
                  Hoàn tất đăng ký
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="inline-block p-4 rounded-full bg-green-100 mb-6">
              <CheckCircleOutlined className="text-4xl text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Đăng ký thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã hoàn tất thông tin đăng ký. <br />
              Bạn sẽ được chuyển hướng đến trang chủ.
            </p>
            <div className="animate-pulse">
              <div className="h-2 w-24 bg-gray-300 rounded mx-auto"></div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GoogleSignupComplete;