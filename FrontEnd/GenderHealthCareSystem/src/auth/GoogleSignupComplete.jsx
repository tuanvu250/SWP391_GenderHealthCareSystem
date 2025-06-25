import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Card,
  Steps,
} from "antd";
import {
  ArrowLeftOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/provider/AuthProvider";
import dayjs from "dayjs";
import imgBackground from "../assets/login.png";
import { updateUserProfileAPI } from "../components/api/UserProfile.api";

const { Option } = Select;
const { Step } = Steps;

const GoogleSignupComplete = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateUserProfileAPI(values);

      updateUser({
        ...user,
        phone: values.phone,
        birthDate: values.birthDate.format("YYYY-MM-DD"),
        gender: values.gender,
        address: values.address,
      });

      message.success("Cập nhật thông tin thành công!");

      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      console.error("Error completing Google signup:", error);
      message.error(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center py-10"
      style={{ backgroundImage: `url(${imgBackground})` }}
    >
      <div className="bg-opacity-95 mx-auto w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-lg backdrop-blur-sm">
        {/* Header */}
        <div className="bg-[#0099CF] px-8 py-6">
          <h2 className="text-center text-2xl font-bold text-white">
            Thông tin bổ sung
          </h2>
          <p className="mt-1 text-center text-blue-50">
            Vui lòng cung cấp thêm thông tin để hoàn tất đăng nhập bằng Google
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <Form form={form} onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
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
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                  suffixIcon={<CalendarOutlined className="text-gray-400" />}
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Giới tính"
                className="w-1/2"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
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
        </div>
      </div>
    </div>
  );
};

export default GoogleSignupComplete;
