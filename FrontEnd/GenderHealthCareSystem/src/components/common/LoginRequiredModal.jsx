import React from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { LockOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

/**
 * Modal thông báo yêu cầu đăng nhập để sử dụng dịch vụ
 * 
 * @param {boolean} open - Trạng thái hiển thị của modal
 * @param {function} onClose - Hàm xử lý khi đóng modal
 */
const LoginRequiredModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleRegister = () => {
    navigate('/register');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      closable={true}
      maskClosable={true}
    >
      <div className="text-center py-6 flex flex-col items-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <LockOutlined className="text-blue-500 text-3xl" />
        </div>
        
        <Title level={4} className="mb-2">Yêu cầu đăng nhập</Title>
        
        <Text className="text-gray-500 mb-6">
          Bạn cần đăng nhập để sử dụng dịch vụ này
        </Text>
        
        <Space direction="vertical" size="middle" className="w-full">
          <Button 
            type="primary" 
            size="large"
            onClick={handleLogin}
            className="w-full"
          >
            Đăng nhập
          </Button>
          
          <Button
            type="default"
            size="large"
            onClick={handleRegister}
            className="w-full"
          >
            Đăng ký tài khoản mới
          </Button>
          
          <Button 
            type="link" 
            onClick={onClose}
            className="w-full"
          >
            Để sau
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default LoginRequiredModal;