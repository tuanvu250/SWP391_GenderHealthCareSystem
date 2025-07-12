import React, { useState } from "react";
import {
  Card,
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  message,
  Popconfirm,
  Modal,
  Space,
  Divider,
  Alert,
} from "antd";
import {
  LockOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  KeyOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../components/provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { changePasswordAPI } from "../components/api/Auth.api";
import { pathStatusUserAPI } from "../components/api/Users.api";

const { Title, Text } = Typography;

const AccountSetting = () => {
  const { user, logoutAction} = useAuth();
  //const useAuth = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleteForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('password');
  const navigate = useNavigate();

  // Xử lý đổi mật khẩu
  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      await changePasswordAPI({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      message.error(error?.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa tài khoản
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await pathStatusUserAPI(user.accountId, "DELETED");
      
      message.success("Tài khoản đã được xóa thành công!");
      setIsModalVisible(false);
      
      // Đăng xuất sau khi xóa tài khoản
      logoutAction();
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      message.error(error?.response?.data?.message || "Không thể xóa tài khoản. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Nội dung bên phải */}
        <div className="w-full">
          <Card>
            <Title level={4} className="mb-6">Cài đặt tài khoản</Title>
            
            <div className="mb-6">
              <div className="flex border-b">
                <div 
                  className={`py-2 px-4 cursor-pointer ${
                    activeTab === 'password' ? 'border-b-2 border-blue-500 text-blue-600' : ''
                  }`}
                  onClick={() => setActiveTab('password')}
                >
                  Đổi mật khẩu
                </div>
                <div 
                  className={`py-2 px-4 cursor-pointer ${
                    activeTab === 'delete' ? 'border-b-2 border-blue-500 text-blue-600' : ''
                  }`}
                  onClick={() => setActiveTab('delete')}
                >
                  Xóa tài khoản
                </div>
              </div>
            </div>

            {activeTab === 'password' && (
              <>
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordChange}
                  requiredMark={false}
                  className="max-w-lg"
                >
                  <Form.Item
                    name="oldPassword"
                    label="Mật khẩu hiện tại"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
                    ]}
                  >
                    <Input.Password
                      iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="py-2"
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                    ]}
                  >
                    <Input.Password
                      iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                      placeholder="Nhập mật khẩu mới"
                      className="py-2"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={["newPassword"]}
                    rules={[
                      { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                      placeholder="Xác nhận mật khẩu mới"
                      className="py-2"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Đổi mật khẩu
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}

            {activeTab === 'delete' && (
              <>
                <Alert
                  message="Cảnh báo: Hành động không thể hoàn tác"
                  description="Khi xóa tài khoản, tất cả dữ liệu cá nhân của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục. Vui lòng cân nhắc kỹ trước khi thực hiện."
                  type="warning"
                  showIcon
                  className="mb-6"
                />

                <Text className="block mb-4">
                  Trước khi xóa tài khoản, vui lòng xem xét các lựa chọn thay thế:
                </Text>
                
                <ul className="list-disc pl-5 mb-6">
                  <li>Cập nhật thông tin cá nhân trong phần hồ sơ</li>
                  <li>Liên hệ hỗ trợ nếu bạn gặp vấn đề với tài khoản</li>
                  <li>Tạm thời ngừng sử dụng dịch vụ thay vì xóa vĩnh viễn</li>
                </ul>

                <Divider />

                <div className="mt-4">
                  <Text strong>Bạn vẫn muốn tiếp tục xóa tài khoản?</Text>
                  <div className="mt-2">
                    <Popconfirm
                      title="Xác nhận xóa tài khoản"
                      description="Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn."
                      okText="Có, xóa tài khoản"
                      cancelText="Không, giữ lại"
                      onConfirm={handleDeleteAccount}
                      okButtonProps={{ danger: true }}
                      icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    >
                      <Button 
                        danger 
                        type="primary" 
                        icon={<DeleteOutlined />}
                      >
                        Xóa tài khoản của tôi
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;