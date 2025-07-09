import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Divider, Tag } from "antd";
import { 
  CheckCircleOutlined, 
  StopOutlined, 
  LockOutlined,
  DeleteOutlined 
} from "@ant-design/icons";

const { Option } = Select;

const UserFormModal = ({ visible, onCancel, onSubmit, userData, isAdmin, mode = "add" }) => {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  // Thiết lập giá trị form khi userData thay đổi (chế độ chỉnh sửa)
  useEffect(() => {
    if (userData && visible && isEdit) {
      form.setFieldsValue({
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        role: userData.roleId || userData.role,
        status: userData.status,
        specialization: userData.specialization,
        description: userData.description,
      });
    } else if (!isEdit) {
      // Reset form khi mở modal thêm mới và thiết lập giá trị mặc định
      form.resetFields();
      form.setFieldsValue({
        status: "ACTIVE" // Trạng thái mặc định khi thêm mới
      });
    }
  }, [userData, visible, isEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values, isEdit ? userData?.userId : undefined);
      
      if (!isEdit) {
        form.resetFields();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Hàm render các tùy chọn trạng thái với icon và màu sắc
  const renderStatusOptions = () => {
    const options = [
      {
        value: "ACTIVE",
        label: "Hoạt động",
        color: "green",
        icon: <CheckCircleOutlined />
      },
      {
        value: "SUSPENDED",
        label: "Tạm khóa",
        color: "orange",
        icon: <StopOutlined />
      },
      {
        value: "BANNED",
        label: "Vô hiệu vĩnh viễn",
        color: "red",
        icon: <LockOutlined />
      }
    ];

    // Chỉ hiển thị tùy chọn DELETED nếu người dùng hiện tại đã ở trạng thái DELETED
    if (userData?.status === "DELETED") {
      options.push({
        value: "DELETED",
        label: "Đã xóa",
        color: "default",
        icon: <DeleteOutlined />
      });
    }

    return options.map(option => (
      <Option key={option.value} value={option.value}>
        <div className="flex items-center">
          <Tag color={option.color} icon={option.icon} className="mr-2">
            {option.label}
          </Tag>
        </div>
      </Option>
    ));
  };

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={true}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="fullName"
          label="Họ tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nhập họ tên người dùng" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập" },
            { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
            { 
              pattern: /^[a-zA-Z0-9_]+$/, 
              message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới" 
            }
          ]}
        >
          <Input 
            placeholder="Nhập tên đăng nhập" 
            disabled={isEdit} // Vô hiệu hóa trường username khi chỉnh sửa
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input 
            placeholder="Nhập địa chỉ email" 
            disabled={isEdit} // Vô hiệu hóa trường email khi chỉnh sửa
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        {/* Chỉ hiển thị trường mật khẩu khi thêm mới */}
        {!isEdit && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cho phép Admin thay đổi role */}
          {isAdmin && (
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Select placeholder="Chọn vai trò">
                <Option value="Staff">Nhân viên</Option>
                <Option value="Consultant">Tư vấn viên</Option>
                <Option value="Customer">Khách hàng</Option>
                {isAdmin && <Option value="Manager">Quản lý</Option>}
                {isAdmin && isEdit && <Option value="Admin">Quản trị</Option>}
              </Select>
            </Form.Item>
          )}

          {/* Hiển thị trạng thái chỉ khi chỉnh sửa */}
          {isEdit && (
            <Form.Item 
              name="status" 
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                {renderStatusOptions()}
              </Select>
            </Form.Item>
          )}
        </div>

        {/* Các trường thông tin bổ sung theo role */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.role !== currentValues.role
          }
        >
          {({ getFieldValue }) => {
            const role = getFieldValue("role");
            if (role === "5") { // Tư vấn viên
              return (
                <>
                  <Divider orientation="left" plain>Thông tin chuyên môn</Divider>
                  <Form.Item
                    name="specialization"
                    label="Chuyên môn"
                    rules={[
                      { required: true, message: "Vui lòng nhập chuyên môn" },
                    ]}
                  >
                    <Input placeholder="Nhập chuyên môn" />
                  </Form.Item>

                  <Form.Item name="description" label="Mô tả">
                    <Input.TextArea
                      placeholder="Mô tả về chuyên môn và kinh nghiệm"
                      rows={3}
                    />
                  </Form.Item>
                </>
              );
            }
            return null;
          }}
        </Form.Item>

        <div className="flex justify-end mt-4">
          <Button className="mr-2" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {isEdit ? "Lưu thay đổi" : "Thêm người dùng"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserFormModal;