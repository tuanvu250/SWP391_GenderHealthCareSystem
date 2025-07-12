import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Typography,
  Form,
  Input,
  Select,
  Upload,
  message,
  Tabs,
  DatePicker,
  Divider,
  Space,
  Skeleton,
} from "antd";
import {
  UserOutlined,
  CameraOutlined,
  EditOutlined,
  LoadingOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  SecurityScanOutlined,
  IdcardOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useState } from "react";
import { useAuth } from "../components/provider/AuthProvider";
import { updateUserProfileAPI, updateUserAvatarAPI } from "../components/api/UserProfile.api";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = Form.useForm();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const userProfile = {
    name: user?.fullName || "Chưa cập nhật",
    email: user?.email || "Chưa cập nhật",
    phone: user?.phone || "Chưa cập nhật",
    dob: user?.birthDate || null,
    gender: user?.gender || "Other",
    address: user?.address || "Chưa cập nhật",
    joinDate: user?.createdAt ? dayjs(user?.createdAt).format("DD/MM/YYYY") : "Không xác định",
    avatar: user?.userImageUrl,
  };

  const handleEditProfile = () => {
    editForm.setFieldsValue({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      birthDate: user?.birthDate ? dayjs(user?.birthDate) : null,
      gender: user?.gender || "Other",
      address: user?.address || "",
    });
    setIsEditing(true);
  };

  const customUploadRequest = async (options) => {
    const { file, onSuccess, onError } = options;
    setAvatarLoading(true);

    try {
      const response = await updateUserAvatarAPI(file);
      if (response && response.data) {
        message.success("Cập nhật ảnh đại diện thành công!");
        onSuccess(response, file);
        updateUser({
          ...user,
          userImageUrl: response.data.userImageUrl,
        });
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      message.error("Không thể cập nhật ảnh đại diện. Vui lòng thử lại!");
      onError(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const values = await editForm.validateFields();
      const response = await updateUserProfileAPI(values);

      if (response && response.data) {
        message.success("Cập nhật hồ sơ thành công!");
        setIsEditing(false);
        updateUser({
          ...user,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : user?.birthDate,
          gender: values.gender,
          address: values.address,
        });
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật hồ sơ không thành công!");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Dịch giới tính sang tiếng Việt
  const translateGender = (gender) => {
    if (!gender) return "Chưa cập nhật";
    switch (gender) {
      case "Male":
        return "Nam";
      case "Female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  // Format date hoặc hiển thị thông báo nếu không có
  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";
    return dayjs(date).format("DD/MM/YYYY");
  };

  // Render từng mục thông tin cá nhân
  const InfoItem = ({ icon, label, value }) => (
    <div className="mb-5">
      <div className="flex items-center mb-1">
        <span className="mr-2 text-gray-500">{icon}</span>
        <Text type="secondary">{label}</Text>
      </div>
      <div className="ml-6">
        <Text strong className="text-base">{value}</Text>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg overflow-hidden ${user?.role !== "Customer" ? 'm-8 p-8 shadow-sm' : ''}`}>
      {/* Header với background và thông tin cơ bản */}
      <div className="relative p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <Avatar
              size={120}
              src={userProfile.avatar}
              icon={!userProfile.avatar && <UserOutlined />}
              className={`border-4 ${avatarLoading ? "opacity-60" : ""}`}
            />
            
            {/* Nút cập nhật ảnh đại diện */}
            <div className="absolute bottom-0 right-0">
              <ImgCrop
                cropShape="round"
                modalTitle="Chỉnh sửa ảnh đại diện"
                modalOk="Cập nhật"
                modalCancel="Hủy"
              >
                <Upload
                  customRequest={customUploadRequest}
                  showUploadList={false}
                  accept="image/png,image/jpeg"
                  beforeUpload={(file) => {
                    const isValidSize = file.size / 1024 / 1024 < 24;
                    if (!isValidSize) {
                      message.error("Kích thước ảnh phải nhỏ hơn 24MB!");
                    }
                    return isValidSize || Upload.LIST_IGNORE;
                  }}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={avatarLoading ? <LoadingOutlined /> : <CameraOutlined />}
                    size="large"
                    className="bg-white text-blue-500 hover:bg-blue-50 hover:text-blue-600 border-2 border-white shadow-md"
                  />
                </Upload>
              </ImgCrop>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <Title level={3} style={{marginBottom: "4px" }}>
              {userProfile.name}
            </Title>
            <Text>
              {userProfile.email}
            </Text>
            <div className="mt-2 mb-3">
              <div className="inline-flex items-center bg-[#0099CF] bg-opacity-30 rounded-full px-3 py-1">
                <CheckCircleFilled style={{ color: '#52c41a' }} className="mr-1" />
                <Text style={{ color: "white" }}>Thành viên từ {userProfile.joinDate}</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Nút chỉnh sửa hồ sơ */}
        <div className="absolute top-4 right-4">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={handleEditProfile}
            disabled={isEditing}
            className="flex items-center hover:bg-blue-50"
          >
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Tabs nội dung */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="px-6 pt-4"
        items={[
          {
            key: "basic",
            label: (
              <span className="flex items-center">
                <IdcardOutlined className="mr-2" />
                Thông tin cá nhân
              </span>
            ),
            children: (
              <div className="px-2 py-4">
                {isEditing ? (
                  // Form chỉnh sửa
                  <Form
                    form={editForm}
                    layout="vertical"
                    initialValues={{
                      fullName: user?.fullName || "",
                      email: user?.email || "",
                      phone: user?.phone || "",
                      birthDate: user?.birthDate ? dayjs(user?.birthDate) : null,
                      gender: user?.gender || "Other",
                      address: user?.address || "",
                    }}
                  >
                    <Row gutter={[24, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="fullName"
                          label="Họ và tên"
                          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                        >
                          <Input className="py-2" />
                        </Form.Item>

                        <Form.Item name="birthDate" label="Ngày sinh">
                          <DatePicker
                            className="w-full py-2"
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày sinh"
                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                          />
                        </Form.Item>

                        <Form.Item name="gender" label="Giới tính">
                          <Select className="py-1">
                            <Option value="Female">Nữ</Option>
                            <Option value="Male">Nam</Option>
                            <Option value="Other">Khác</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                          ]}
                        >
                          <Input className="py-2" />
                        </Form.Item>

                        <Form.Item
                          name="phone"
                          label="Số điện thoại"
                          rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                          ]}
                        >
                          <Input className="py-2" />
                        </Form.Item>

                        <Form.Item name="address" label="Địa chỉ">
                          <Input.TextArea rows={2} className="py-2" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} className="text-right mt-4">
                        <Space>
                          <Button 
                            onClick={handleCancelEdit}
                            size="middle"
                          >
                            Hủy
                          </Button>
                          <Button 
                            type="primary"
                            onClick={handleSaveProfile}
                            size="middle"
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Lưu thay đổi
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Form>
                ) : (
                  // Hiển thị thông tin
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <InfoItem 
                        icon={<UserOutlined />} 
                        label="Họ và tên" 
                        value={userProfile.name} 
                      />
                      <InfoItem 
                        icon={<CalendarOutlined />} 
                        label="Ngày sinh" 
                        value={formatDate(userProfile.dob)} 
                      />
                      <InfoItem 
                        icon={<UserOutlined />} 
                        label="Giới tính" 
                        value={translateGender(userProfile.gender)} 
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <InfoItem 
                        icon={<MailOutlined />} 
                        label="Email" 
                        value={userProfile.email} 
                      />
                      <InfoItem 
                        icon={<PhoneOutlined />} 
                        label="Số điện thoại" 
                        value={userProfile.phone} 
                      />
                      <InfoItem 
                        icon={<HomeOutlined />} 
                        label="Địa chỉ" 
                        value={userProfile.address} 
                      />
                    </Col>
                  </Row>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Profile;
