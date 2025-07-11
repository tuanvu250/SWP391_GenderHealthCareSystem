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

const { Title, Text } = Typography;

const AccountSetting = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleteForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('password');

  // Xử lý đổi mật khẩu
  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
    //   await updatePasswordAPI({
    //     oldPassword: values.oldPassword,
    //     newPassword: values.newPassword,
    //   });
      
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
  const handleDeleteAccount = async (values) => {
    try {
      setLoading(true);
    //   await deleteAccountAPI({
    //     password: values.password,
    //     reason: values.reason,
    //   });
      
      message.success("Tài khoản đã được xóa thành công!");
      setIsModalVisible(false);
      
      // Đăng xuất sau khi xóa tài khoản
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      message.error(error?.response?.data?.message || "Không thể xóa tài khoản. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Mở modal xác nhận xóa tài khoản
  const showDeleteConfirm = () => {
    setIsModalVisible(true);
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
                      { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
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

                <div className="mt-6">
                  <div className="text-sm text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Mật khẩu phải có ít nhất 8 ký tự</li>
                      <li>Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt</li>
                      <li>Sau khi đổi mật khẩu, bạn sẽ cần đăng nhập lại</li>
                    </ul>
                  </div>
                </div>
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
                    <Button 
                      danger 
                      type="primary" 
                      icon={<DeleteOutlined />} 
                      onClick={showDeleteConfirm}
                    >
                      Xóa tài khoản của tôi
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Modal xác nhận xóa tài khoản */}
      <Modal
        title={
          <div className="flex items-center text-red-500">
            <ExclamationCircleOutlined className="mr-2" />
            <span>Xác nhận xóa tài khoản</span>
          </div>
        }
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={deleteForm}
          layout="vertical"
          onFinish={handleDeleteAccount}
        >
          <Text className="text-red-500 font-medium block mb-4">
            Hành động này sẽ xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn.
          </Text>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu để xác nhận!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu để xác nhận"
              iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="Lý do xóa tài khoản (không bắt buộc)"
          >
            <Input.TextArea 
              placeholder="Vui lòng cho chúng tôi biết lý do bạn muốn xóa tài khoản"
              rows={3}
            />
          </Form.Item>
          
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setIsModalVisible(false)}
            >
              Hủy
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa tài khoản này không?"
              okText="Có, xóa tài khoản"
              cancelText="Không"
              onConfirm={() => deleteForm.submit()}
            >
              <Button type="primary" danger loading={loading}>
                Xóa tài khoản vĩnh viễn
              </Button>
            </Popconfirm>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountSetting;