import React, { useEffect, useState } from "react";
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Divider, 
  Tag, 
  InputNumber,
  DatePicker,
  Switch,
  Space,
  Typography,
  Tabs,
  Tooltip,
  Collapse
} from "antd";
import { 
  CheckCircleOutlined, 
  StopOutlined, 
  LockOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  BookOutlined,
  BankOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const detailTypes = [
  { value: "EDUCATION", label: "Học vấn", icon: <BookOutlined /> },
  { value: "EXPERIENCE", label: "Kinh nghiệm làm việc", icon: <BankOutlined /> },
  { value: "CERTIFICATION", label: "Chứng chỉ", icon: <TrophyOutlined /> },
  { value: "OTHER", label: "Thông tin khác", icon: <FileTextOutlined /> }
];

const UserFormModal = ({ visible, onCancel, onSubmit, userData, isAdmin, mode = "add" }) => {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";
  const [activeTab, setActiveTab] = useState("basic");

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
        // Thông tin tư vấn viên
        jobTitle: userData.jobTitle,
        introduction: userData.introduction,
        specialization: userData.specialization,
        languages: userData.languages,
        experienceYears: userData.experienceYears,
        hourlyRate: userData.hourlyRate,
        location: userData.location,
        isAvailable: userData.isAvailable,
        employmentStatus: userData.employmentStatus,
        details: userData.details || [],
      });
    } else if (!isEdit) {
      // Reset form khi mở modal thêm mới và thiết lập giá trị mặc định
      form.resetFields();
      form.setFieldsValue({
        status: "ACTIVE", // Trạng thái mặc định khi thêm mới
        isAvailable: true,
        employmentStatus: true,
        details: []
      });
    }
  }, [userData, visible, isEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Nếu là tư vấn viên, chuyển đổi các giá trị ngày tháng trong details
      if (values.role === "Consultant" || values.role === "5") {
        if (values.details && values.details.length > 0) {
          values.details = values.details.map(detail => ({
            ...detail,
            fromDate: detail.fromDate ? detail.fromDate.format('YYYY-MM-DD') : null,
            toDate: detail.toDate ? detail.toDate.format('YYYY-MM-DD') : null,
            issuedDate: detail.issuedDate ? detail.issuedDate.format('YYYY-MM-DD') : null,
          }));
        }
      }
      
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

  // Render form thông tin cơ bản
  const renderBasicInfo = () => (
    <>
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
            <Select 
              placeholder="Chọn vai trò"
              onChange={(value) => {
                if (value === "Consultant" || value === "5") {
                  setActiveTab("consultant");
                }
              }}
            >
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
    </>
  );

  // Render form thông tin tư vấn viên
  const renderConsultantInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="jobTitle"
          label="Chức danh"
          rules={[{ required: true, message: "Vui lòng nhập chức danh" }]}
        >
          <Input placeholder="Ví dụ: Chuyên gia tư vấn sức khỏe sinh sản" />
        </Form.Item>

        <Form.Item
          name="specialization"
          label="Chuyên môn"
          rules={[{ required: true, message: "Vui lòng nhập chuyên môn" }]}
        >
          <Input placeholder="Ví dụ: Sức khỏe sinh sản, Kế hoạch hóa gia đình" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item
          name="experienceYears"
          label="Số năm kinh nghiệm"
          rules={[{ required: true, message: "Vui lòng nhập số năm kinh nghiệm" }]}
        >
          <InputNumber 
            min={0} 
            max={50} 
            className="w-full"
            placeholder="Ví dụ: 5" 
          />
        </Form.Item>

        <Form.Item
          name="hourlyRate"
          label={
            <span>
              Phí tư vấn (giờ) 
              <Tooltip title="Mức phí cho mỗi giờ tư vấn">
                <InfoCircleOutlined className="ml-1" />
              </Tooltip>
            </span>
          }
          rules={[{ required: true, message: "Vui lòng nhập phí tư vấn" }]}
        >
          <InputNumber 
            min={0}
            step={50000}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            className="w-full"
            placeholder="VNĐ/giờ"
            addonAfter="VNĐ" 
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Địa điểm"
          rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
        >
          <Input placeholder="Ví dụ: Hà Nội" />
        </Form.Item>
      </div>

      <Form.Item
        name="languages"
        label="Ngôn ngữ"
        rules={[{ required: true, message: "Vui lòng nhập ngôn ngữ" }]}
      >
        <Input placeholder="Ví dụ: Tiếng Việt, Tiếng Anh" />
      </Form.Item>

      <Form.Item
        name="introduction"
        label="Giới thiệu"
        rules={[{ required: true, message: "Vui lòng nhập giới thiệu" }]}
      >
        <Input.TextArea 
          rows={4} 
          placeholder="Giới thiệu ngắn gọn về bản thân và kinh nghiệm làm việc"
          showCount
          maxLength={500}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item 
          name="isAvailable" 
          label="Trạng thái hoạt động" 
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Có thể nhận tư vấn" 
            unCheckedChildren="Không nhận tư vấn" 
          />
        </Form.Item>

        <Form.Item 
          name="employmentStatus" 
          label="Trạng thái làm việc" 
          valuePropName="checked"
        >
          <Switch 
            checkedChildren="Đang làm việc" 
            unCheckedChildren="Đã nghỉ việc" 
          />
        </Form.Item>
      </div>

      <Divider orientation="left">Thông tin chi tiết</Divider>

      <Form.List name="details">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <Text strong>Thông tin #{name + 1}</Text>
                  <Button 
                    type="text" 
                    danger
                    onClick={() => remove(name)} 
                    icon={<MinusCircleOutlined />} 
                  >
                    Xóa
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    {...restField}
                    name={[name, "detailType"]}
                    label="Loại thông tin"
                    rules={[{ required: true, message: "Vui lòng chọn loại thông tin" }]}
                  >
                    <Select placeholder="Chọn loại thông tin">
                      {detailTypes.map(type => (
                        <Option key={type.value} value={type.value}>
                          <Space>
                            {type.icon}
                            {type.label}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "title"]}
                    label="Tiêu đề"
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                  >
                    <Input placeholder="Ví dụ: Bác sĩ Y khoa, Chứng chỉ tư vấn..." />
                  </Form.Item>
                </div>

                <Form.Item
                  {...restField}
                  name={[name, "organization"]}
                  label="Tổ chức/Đơn vị"
                  rules={[{ required: true, message: "Vui lòng nhập tên tổ chức" }]}
                >
                  <Input placeholder="Ví dụ: Đại học Y Hà Nội, Bệnh viện Bạch Mai..." />
                </Form.Item>

                <Form.Item 
                  noStyle 
                  shouldUpdate={(prevValues, currentValues) => {
                    const prevType = prevValues.details?.[name]?.detailType;
                    const currentType = currentValues.details?.[name]?.detailType;
                    return prevType !== currentType;
                  }}
                >
                  {({ getFieldValue }) => {
                    const detailType = getFieldValue(['details', name, 'detailType']);
                    
                    if (detailType === 'CERTIFICATION') {
                      return (
                        <Form.Item
                          {...restField}
                          name={[name, "issuedDate"]}
                          label="Ngày cấp"
                        >
                          <DatePicker 
                            className="w-full" 
                            placeholder="Chọn ngày" 
                            format="DD/MM/YYYY" 
                          />
                        </Form.Item>
                      );
                    }

                    if (detailType === 'EDUCATION' || detailType === 'EXPERIENCE') {
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Form.Item
                            {...restField}
                            name={[name, "fromDate"]}
                            label="Từ ngày"
                          >
                            <DatePicker 
                              className="w-full" 
                              placeholder="Chọn ngày bắt đầu" 
                              format="DD/MM/YYYY" 
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "toDate"]}
                            label="Đến ngày"
                          >
                            <DatePicker 
                              className="w-full" 
                              placeholder="Chọn ngày kết thúc" 
                              format="DD/MM/YYYY" 
                            />
                          </Form.Item>
                        </div>
                      );
                    }

                    return null;
                  }}
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "description"]}
                  label="Mô tả"
                >
                  <Input.TextArea rows={2} placeholder="Mô tả chi tiết..." />
                </Form.Item>
              </div>
            ))}

            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                block 
                icon={<PlusOutlined />}
                className="mt-2"
              >
                Thêm thông tin chi tiết
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );

  return (
    <Modal
      title={isEdit ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={true}
      width={800}
    >
      <Form 
        form={form} 
        layout="vertical"
        initialValues={{
          details: [],
          isAvailable: true,
          employmentStatus: true
        }}
      >
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.role !== currentValues.role
          }
        >
          {({ getFieldValue }) => {
            const role = getFieldValue("role");
            const isConsultant = role === "Consultant" || role === "5";
            
            if (isConsultant) {
              return (
                <Tabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab}
                  className="mb-4"
                >
                  <TabPane tab="Thông tin cơ bản" key="basic">
                    {renderBasicInfo()}
                  </TabPane>
                  <TabPane tab="Thông tin tư vấn viên" key="consultant">
                    {renderConsultantInfo()}
                  </TabPane>
                </Tabs>
              );
            }
            
            return renderBasicInfo();
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