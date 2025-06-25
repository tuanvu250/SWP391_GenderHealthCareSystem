import {
  Card,
  Row,
  Col,
  Avatar,
  Badge,
  Button,
  Typography,
  Form,
  Input,
  Select,
  Upload,
  message,
  List,
  Divider,
  Space,
  DatePicker,
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
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { useState } from "react";
import { useAuth } from "../components/provider/AuthProvider";
import { updateUserProfileAPI, updateUserAvatarAPI } from "../components/api/UserProfile.api";


const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = Form.useForm();
  const [avatarLoading, setAvatarLoading] = useState(false);

  const userProfile = {
    name: user?.fullName,
    email: user?.email,
    phone: user?.phone,
    dob: user?.birthDate,
    gender: user?.gender,
    address: user?.address,
    joinDate: dayjs(user?.createdAt).format("DD/MM/YYYY"),
    avatar: user?.userImageUrl,
  };

  const handleEditProfile = () => {
    // Đặt giá trị ban đầu cho form chỉnh sửa
    editForm.setFieldsValue({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      birthDate: user?.birthDate ? dayjs(user?.birthDate) : null,
      gender: user?.gender || "",
      address: user?.address || "",
    });

    // Bật chế độ chỉnh sửa và đảm bảo tab thông tin cá nhân được chọn
    setIsEditing(true);
  };

  const customUploadRequest = async (options) => {
    const { file, onSuccess, onError } = options;

    // Kiểm tra file trước khi tải lên (không cần kiểm tra nữa vì ImgCrop đã xử lý)
    setAvatarLoading(true);

    try {
      // Gọi API để cập nhật avatar
      const response = await updateUserAvatarAPI(file);

      // Nếu API trả về thành công
      if (response && response.data) {
        // Cập nhật URL avatar mới
        message.success("Cập nhật ảnh đại diện thành công!");
        onSuccess(response, file);

        updateUser({
          ...user,
          userImageUrl: response.data.userImageUrl,
        });
        return;
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      message.error("Không thể cập nhật ảnh đại diện. Vui lòng thử lại!");
      onError(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  // Thêm hàm cập nhật và hủy chỉnh sửa
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
          birthDate: values.birthDate
            ? values.birthDate.format("YYYY-MM-DD")
            : user?.birthDate,
          gender: values.gender,
          address: values.address,
        });
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Cập nhật hồ sơ không thành công!"
      );
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <Card bordered={false}>
      <Row xs={24} className="text-center">
        <Col md={4} xs={24}>
          <div className="relative inline-block">
            <Badge offset={[-5, 5]}>
              <Avatar
                size={120}
                src={userProfile.avatar}
                icon={<UserOutlined />}
                className={avatarLoading ? "opacity-60" : ""}
              />
            </Badge>

            {/* Thay thế Upload bằng ImgCrop */}
            <ImgCrop
              cropShape="round"
              modalTitle="Chỉnh sửa ảnh đại diện"
              modalOk="Cập nhật"
              modalCancel="Hủy"
              className="rounded-full"
            >
              <Upload
                customRequest={customUploadRequest}
                showUploadList={false}
                accept="image/png,image/jpeg"
                className="absolute bottom-0 right-0"
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
                  icon={
                    avatarLoading ? <LoadingOutlined /> : <CameraOutlined />
                  }
                  size="medium"
                  className="bg-blue-500"
                  disabled={avatarLoading}
                />
              </Upload>
            </ImgCrop>
          </div>
        </Col>
        <Col md={4} xs={24}>
          <Title level={3} className="mt-4 mb-1">
            {userProfile.name}
          </Title>
          <Text type="secondary">Thành viên từ {userProfile.joinDate}</Text>
          <Button
            type="primary"
            icon={<EditOutlined />}
            block
            onClick={handleEditProfile}
            disabled={isEditing}
            className="mt-4"
          >
            Chỉnh sửa hồ sơ
          </Button>
        </Col>
      </Row>
      <Divider />
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
            gender: user.gender || "",
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
                <Input />
              </Form.Item>

              <Form.Item name="birthDate" label="Ngày sinh">
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current > dayjs()}
                />
              </Form.Item>

              <Form.Item name="gender" label="Giới tính">
                <Select>
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
                <Input />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="address" label="Địa chỉ">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>

            <Col xs={24} className="text-right">
              <Space>
                <Button onClick={handleCancelEdit}>Hủy</Button>
                <Button type="primary" onClick={handleSaveProfile}>
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
            <List>
              <List.Item>
                <List.Item.Meta
                  avatar={<UserOutlined />}
                  title="Họ và tên"
                  description={userProfile.name}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<CalendarOutlined />}
                  title="Ngày sinh"
                  description={dayjs(userProfile.dob).format("DD/MM/YYYY")}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<UserOutlined />}
                  title="Giới tính"
                  description={userProfile.gender === "Male" ? "Nam" : "Nữ"}
                />
              </List.Item>
            </List>
          </Col>
          <Col xs={24} md={12}>
            <List>
              <List.Item>
                <List.Item.Meta
                  avatar={<MailOutlined />}
                  title="Email"
                  description={userProfile.email}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<PhoneOutlined />}
                  title="Điện thoại"
                  description={userProfile.phone}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<HomeOutlined />}
                  title="Địa chỉ"
                  description={userProfile.address}
                />
              </List.Item>
            </List>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default Profile;
