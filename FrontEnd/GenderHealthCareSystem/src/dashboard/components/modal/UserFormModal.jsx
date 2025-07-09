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
  Collapse,
  Spin
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
import { getConsultantProfileAPI } from "../../../components/api/Consultant.api";
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
  const [dataDetails, setDataDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset form và dataDetails khi visible hoặc mode thay đổi
  useEffect(() => {
    // Khi modal mở, kiểm tra nếu là mode thêm mới thì reset hoàn toàn
    if (visible && !isEdit) {
      form.resetFields();
      setDataDetails(null);  // Reset dataDetails để tránh tự động điền
      setActiveTab("basic");
      
      // Set giá trị mặc định cho form thêm mới
      form.setFieldsValue({
        status: "ACTIVE",
        isAvailable: true,
        employmentStatus: true,
        details: []
      });
    }
    
    // Khi modal đóng, reset form và data
    if (!visible) {
      setActiveTab("basic");
      setDataDetails(null);
    }
  }, [visible, isEdit, form]);

  // Tách việc gọi API ra riêng
  useEffect(() => {
    if (userData && visible && isEdit && (userData.role === "Consultant" || userData.roleId === "5")) {
      getInfoConsultant(userData.userId);
    }
  }, [userData, visible, isEdit]);

  // Cập nhật form sau khi có dữ liệu
  useEffect(() => {
    if (!userData || !visible) return;

    if (isEdit) {
      // Cập nhật thông tin cơ bản
      const basicValues = {
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        role: userData.roleId || userData.role,
        status: userData.status,
      };

      // Nếu là tư vấn viên và đã có dữ liệu chi tiết
      if ((userData.role === "Consultant" || userData.roleId === "5") && dataDetails) {
        // Chuyển đổi các trường ngày tháng trong details
        const formattedDetails = dataDetails.details?.map(detail => ({
          ...detail,
          // Chuyển đổi các chuỗi ngày thành đối tượng dayjs
          fromDate: detail.fromDate ? dayjs(detail.fromDate) : null,
          toDate: detail.toDate ? dayjs(detail.toDate) : null,
          issuedDate: detail.issuedDate ? dayjs(detail.issuedDate) : null,
        })) || [];

        form.setFieldsValue({
          ...basicValues,
          // Thông tin tư vấn viên
          jobTitle: dataDetails.jobTitle || "",
          specialization: dataDetails.specialization || "",
          languages: dataDetails.languages || "",
          experienceYears: dataDetails.experienceYears || 0,
          hourlyRate: dataDetails.hourlyRate || 0,
          location: dataDetails.location || "",
          introduction: dataDetails.introduction || "",
          isAvailable: dataDetails.isAvailable ?? true,
          employmentStatus: dataDetails.employmentStatus ?? true,
          details: formattedDetails,
        });
      } else {
        // Chỉ set thông tin cơ bản nếu chưa có dữ liệu chi tiết
        form.setFieldsValue(basicValues);
      }
    }
    // Không cần else ở đây vì đã xử lý trong useEffect khác
  }, [userData, visible, isEdit, dataDetails, form]);

  const getInfoConsultant = async (consultantId) => {
    setLoading(true);
    try {
      const response = await getConsultantProfileAPI(consultantId);
      setDataDetails(response.data);
    } catch (error) {
      console.error("Error fetching consultant profile:", error);
      // Set mặc định để tránh lỗi khi không lấy được dữ liệu
      setDataDetails({
        jobTitle: "",
        specialization: "",
        languages: "",
        experienceYears: 0,
        hourlyRate: 0,
        location: "",
        introduction: "",
        isAvailable: true,
        employmentStatus: true,
        details: []
      });
    } finally {
      setLoading(false);
    }
  }
  
  const handleSubmit = async () => {
    try {
      // Chỉ validate tab thông tin cơ bản khi thêm mới
      const allFieldNames = form.getFieldsValue(true);
      const fieldsToValidate = isEdit 
        ? Object.keys(allFieldNames) 
        : ['fullName', 'username', 'email', 'phone', 'password', 'role'];
      
      // Validate các field dựa theo mode
      await form.validateFields(fieldsToValidate);
      
      // Lấy tất cả giá trị form
      const values = form.getFieldsValue(true);
      
      // Nếu là tư vấn viên và đang ở chế độ edit, chuyển đổi các giá trị ngày tháng trong details
      if (isEdit && (values.role === "Consultant" || values.role === "5") && values.details) {
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
          rules={[{ required: isEdit, message: "Vui lòng nhập chức danh" }]}
        >
          <Input placeholder="Ví dụ: Chuyên gia tư vấn sức khỏe sinh sản" 
           disabled/>
        </Form.Item>

        <Form.Item
          name="specialization"
          label="Chuyên môn"
          rules={[{ required: isEdit, message: "Vui lòng nhập chuyên môn" }]}
        >
          <Input placeholder="Ví dụ: Sức khỏe sinh sản, Kế hoạch hóa gia đình" disabled />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item
          name="experienceYears"
          label="Số năm kinh nghiệm"
          rules={[{ required: isEdit, message: "Vui lòng nhập số năm kinh nghiệm" }]}
        >
          <InputNumber 
            min={0} 
            max={50} 
            className="w-full"
            placeholder="Ví dụ: 5"  disabled
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
          rules={[{ required: isEdit, message: "Vui lòng nhập phí tư vấn" }]}
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
          rules={[{ required: isEdit, message: "Vui lòng nhập địa điểm" }]}
        >
          <Input placeholder="Ví dụ: Hà Nội" disabled />
        </Form.Item>
      </div>

      <Form.Item
        name="languages"
        label="Ngôn ngữ"
        rules={[{ required: isEdit, message: "Vui lòng nhập ngôn ngữ" }]}
      >
        <Input placeholder="Ví dụ: Tiếng Việt, Tiếng Anh" disabled/>
      </Form.Item>

      <Form.Item
        name="introduction"
        label="Giới thiệu"
        rules={[{ required: isEdit, message: "Vui lòng nhập giới thiệu" }]}
      >
        <Input.TextArea 
          rows={4} 
          placeholder="Giới thiệu ngắn gọn về bản thân và kinh nghiệm làm việc"
          showCount
          maxLength={500} disabled
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
            unCheckedChildren="Không nhận tư vấn" disabled
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

      {isEdit && (
        <>
          <Divider orientation="left">Thông tin chi tiết</Divider>

          <Form.List name="details">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <Text strong>Thông tin #{name + 1}</Text>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, "detailType"]}
                        label="Loại thông tin"
                        rules={[{ required: isEdit, message: "Vui lòng chọn loại thông tin" }]}
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
                        rules={[{ required: isEdit, message: "Vui lòng nhập tiêu đề" }]}
                      >
                        <Input placeholder="Ví dụ: Bác sĩ Y khoa, Chứng chỉ tư vấn..." disabled />
                      </Form.Item>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "organization"]}
                      label="Tổ chức/Đơn vị"
                      rules={[{ required: isEdit, message: "Vui lòng nhập tên tổ chức" }]}
                    >
                      <Input placeholder="Ví dụ: Đại học Y Hà Nội, Bệnh viện Bạch Mai..." disabled />
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
                                format="DD/MM/YYYY"  disabled
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
                                  format="DD/MM/YYYY" disabled
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
                                  format="DD/MM/YYYY" disabled
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
                      <Input.TextArea rows={2} placeholder="Mô tả chi tiết..." disabled/>
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </>
      )}
    </div>
  );

  // Cập nhật phần render Tab với thông báo chỉ dẫn cho người dùng
  return (
    <Modal
      title={isEdit ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={true}
      width={800}
      confirmLoading={loading}
    >
      {loading && isEdit && (userData?.role === "Consultant" || userData?.roleId === "5") ? (
        <div className="flex justify-center py-8">
          <Spin tip="Đang tải thông tin tư vấn viên..." />
        </div>
      ) : (
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
                if (isEdit) {
                  // Hiển thị tab đầy đủ khi là chế độ edit
                  return (
                    <Tabs 
                      activeKey={activeTab} 
                      onChange={setActiveTab}
                      className="mb-4"
                    >
                      <TabPane tab="Thông tin cơ bản" key="basic" forceRender={true}>
                        {renderBasicInfo()}
                      </TabPane>
                      <TabPane tab="Thông tin tư vấn viên" key="consultant" forceRender={true}>
                        {renderConsultantInfo()}
                      </TabPane>
                    </Tabs>
                  );
                } else {
                  // Chỉ hiển thị thông tin cơ bản với thông báo khi thêm mới
                  return (
                    <>
                      {renderBasicInfo()}
                      <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                        <div className="flex items-center">
                          <InfoCircleOutlined className="text-blue-500 text-lg mr-2" />
                          <Text strong>Bạn đã chọn thêm tài khoản tư vấn viên</Text>
                        </div>
                        <Text className="block mt-2">
                          Thông tin chi tiết của tư vấn viên sẽ được bổ sung sau khi tạo tài khoản thành công. Hãy điền đầy đủ các thông tin cơ bản trước.
                        </Text>
                      </div>
                    </>
                  );
                }
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
      )}
    </Modal>
  );
};

export default UserFormModal;