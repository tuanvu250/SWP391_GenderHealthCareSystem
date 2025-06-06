import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Typography,
  Card,
  Avatar,
  Tabs,
  Button,
  Row,
  Col,
  Tag,
  Space,
  List,
  Form,
  Input,
  Upload,
  DatePicker,
  Select,
  Badge,
  Modal,
  Rate,
  message,
  Popconfirm,
  Slider,
} from "antd";
import ImgCrop from "antd-img-crop";
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  NotificationOutlined,
  SettingOutlined,
  CommentOutlined,
  LikeOutlined,
  LockOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CameraOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  getUserProfile,
  updateUserAvatarAPI,
  updateUserProfileAPI,
} from "../components/utils/api";
import { useAuth } from "../components/provider/AuthProvider"; // Import hook useAuth từ AuthProvider

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const UserProfile = () => {
  // Giữ nguyên các state hiện tại
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [user, setUser] = useState();
  const [activeTab, setActiveTab] = useState("1");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingTab, setSettingTab] = useState("password");
  const [passwordForm] = Form.useForm();

  // Thêm state mới cho chỉnh sửa trực tiếp
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = Form.useForm();

  const { updateUser } = useAuth();

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res && res.data) {
          setUser(res.data);
          // Cập nhật avatarUrl khi nhận dữ liệu từ server
          if (res.data.userImageUrl) {
            setAvatarUrl(res.data.userImageUrl);
          }
          //console.log(">>> User profile data:", res.data);
        } else {
          console.error("No user profile data found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Xử lý tải lên và cập nhật avatar
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
        setAvatarUrl(response.data.userImageUrl);
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

  // Hàm xử lý khi mở modal chỉnh sửa
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
    setActiveTab("1");
  };

  // Thêm hàm cập nhật và hủy chỉnh sửa
  const handleSaveProfile = async () => {
    try {
      const values = await editForm.validateFields();

      const response = await updateUserProfileAPI(values);

      if (response && response.data) {
        message.success("Cập nhật hồ sơ thành công!");
        setIsEditing(false);

        // Cập nhật state user với thông tin mới
        setUser({
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
      console.error("Validation failed:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
    setSettingTab("password"); // Mặc định mở tab đổi mật khẩu
  };
  const handleSettingsModalCancel = () => {
    setIsSettingsModalOpen(false);
    setSettingTab("password"); // Reset tab về đổi mật khẩu khi đóng modal
  };

  const userProfile = {
    name: user?.fullName,
    email: user?.email,
    phone: user?.phone,
    dob: user?.birthDate,
    gender: user?.gender,
    address: user?.address,
    joinDate: formatDate(user?.createdAt),
    avatar:
      avatarUrl || user?.userImageUrl || "https://www.gravatar.com/avatar",
  };

  const recentAppointments = [
    {
      id: "AP001",
      date: "2023-12-15",
      time: "10:00 AM",
      doctor: "Dr. Emily Chen",
      specialization: "Gynecologist",
      clinic: "Women's Health Center",
      status: "Completed",
    },
    {
      id: "AP002",
      date: "2024-01-10",
      time: "2:30 PM",
      doctor: "Dr. Michael Wang",
      specialization: "General Practitioner",
      clinic: "City Medical Center",
      status: "Upcoming",
    },
    {
      id: "AP003",
      date: "2023-11-22",
      time: "9:15 AM",
      doctor: "Dr. Jessica Lee",
      specialization: "Dermatologist",
      clinic: "Skin Care Clinic",
      status: "Completed",
    },
  ];

  const menstrualCycles = [
    {
      id: "MC001",
      startDate: "2023-12-05",
      endDate: "2023-12-10",
      symptoms: ["Cramps", "Mood swings"],
      notes: "Moderate flow, took pain medication on day 2",
    },
    {
      id: "MC002",
      startDate: "2023-11-08",
      endDate: "2023-11-13",
      symptoms: ["Cramps", "Headache"],
      notes: "Light flow, irregular cycle",
    },
    {
      id: "MC003",
      startDate: "2023-10-10",
      endDate: "2023-10-16",
      symptoms: ["Cramps", "Fatigue", "Bloating"],
      notes: "Heavy flow on days 2-3",
    },
  ];

  const feedbackHistory = [
    {
      id: "FB001",
      date: "2023-12-16",
      doctorName: "Dr. Emily Chen",
      serviceName: "Gynecological Consultation",
      rating: 5,
      comment:
        "Dr. Chen was extremely professional and caring. She took time to explain my condition thoroughly and answered all my questions patiently. The staff at the Women's Health Center were also very helpful.",
      helpful: 12,
      clinic: "Women's Health Center",
      appointmentId: "AP001",
    },
    {
      id: "FB002",
      date: "2023-11-23",
      doctorName: "Dr. Jessica Lee",
      serviceName: "Skin Examination",
      rating: 4,
      comment:
        "Dr. Lee was very knowledgeable and provided good advice for my skin condition. The clinic was clean, but I had to wait a bit longer than expected for my appointment.",
      helpful: 8,
      clinic: "Skin Care Clinic",
      appointmentId: "AP003",
    },
    {
      id: "FB003",
      date: "2023-10-05",
      doctorName: "Dr. Robert Smith",
      serviceName: "Annual Physical",
      rating: 3,
      comment:
        "The examination was thorough but rushed. Dr. Smith could have provided more detailed explanations about my health concerns.",
      helpful: 5,
      clinic: "City Medical Center",
      appointmentId: "AP004",
    },
  ];

  const getStatusTag = (status) => {
    switch (status) {
      case "Completed":
        return <Tag color="success">{status}</Tag>;
      case "Upcoming":
        return <Tag color="processing">{status}</Tag>;
      case "Cancelled":
        return <Tag color="error">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Cập nhật tabItems với logic chỉnh sửa mới
  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <FileTextOutlined />
          Thông tin cá nhân
        </span>
      ),
      children: (
        <Card bordered={false}>
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
                gender: user?.gender || "",
                address: user?.address || "",
              }}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
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
                      description={userProfile.dob}
                    />
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<UserOutlined />}
                      title="Giới tính"
                      description={userProfile.gender}
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
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <MedicineBoxOutlined />
          Lịch sử khám bệnh
        </span>
      ),
      children: (
        <List
          itemLayout="vertical"
          dataSource={recentAppointments}
          renderItem={(item) => (
            <Card className="mb-4">
              <List.Item key={item.id} extra={getStatusTag(item.status)}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Space>
                      <Text strong>{item.doctor}</Text>
                      <Tag color="blue">{item.specialization}</Tag>
                    </Space>
                  }
                  description={item.clinic}
                />
                <Space direction="vertical" className="mt-2">
                  <Space>
                    <CalendarOutlined />
                    <Text>{item.date}</Text>
                  </Space>
                  <Space>
                    <ClockCircleOutlined />
                    <Text>{item.time}</Text>
                  </Space>
                </Space>
              </List.Item>
            </Card>
          )}
        />
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <HeartOutlined />
          Chu kỳ kinh nguyệt
        </span>
      ),
      children: (
        <List
          itemLayout="vertical"
          dataSource={menstrualCycles}
          renderItem={(item) => (
            <Card className="mb-4">
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <Space>
                      <CalendarOutlined />
                      <Text>
                        {item.startDate} đến {item.endDate}
                      </Text>
                    </Space>
                  }
                  description={
                    <div className="mt-2">
                      <div className="mb-2">
                        <Text strong>Triệu chứng:</Text>
                        {item.symptoms.map((symptom, index) => (
                          <Tag color="purple" key={index} className="ml-2">
                            {symptom}
                          </Tag>
                        ))}
                      </div>
                      <Text type="secondary">{item.notes}</Text>
                    </div>
                  }
                />
              </List.Item>
            </Card>
          )}
        />
      ),
    },
    {
      key: "4",
      label: (
        <span>
          <CommentOutlined />
          Lịch sử đánh giá
        </span>
      ),
      children: (
        <List
          itemLayout="vertical"
          dataSource={feedbackHistory}
          renderItem={(item) => (
            <Card className="mb-4">
              <List.Item
                key={item.id}
                actions={[
                  <Space key="helpful">
                    <LikeOutlined />
                    <Text>{item.helpful} người thấy hữu ích</Text>
                  </Space>,
                  <Button key="edit" type="link" size="small">
                    Chỉnh sửa đánh giá
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div>
                      <Space align="center">
                        <Text strong>{item.serviceName}</Text>
                        <Text type="secondary">tại {item.clinic}</Text>
                      </Space>
                      <div className="mt-1">
                        <Rate disabled defaultValue={item.rating} />
                      </div>
                    </div>
                  }
                  description={
                    <Space direction="vertical" className="w-full mt-2">
                      <Space>
                        <UserOutlined />
                        <Text>{item.doctorName}</Text>
                      </Space>
                      <Space>
                        <CalendarOutlined />
                        <Text>{item.date}</Text>
                      </Space>
                    </Space>
                  }
                />
                <div className="bg-gray-50 p-4 mt-4 rounded-lg border border-gray-200">
                  <Paragraph>{item.comment}</Paragraph>
                </div>
              </List.Item>
            </Card>
          )}
        />
      ),
    },
  ];

  const renderSettingsContent = () => {};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8} className="text-center">
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
              <Title level={3} className="mt-4 mb-1">
                {userProfile.name}
              </Title>
              <Text type="secondary">Thành viên từ {userProfile.joinDate}</Text>
            </Col>

            <Col xs={24} md={16}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Paragraph>
                    Chào mừng bạn đến với trang hồ sơ cá nhân. Tại đây bạn có
                    thể xem và quản lý thông tin cá nhân, theo dõi lịch sử khám
                    bệnh và quản lý chu kỳ kinh nguyệt của mình.
                  </Paragraph>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    block
                    onClick={handleEditProfile}
                    disabled={isEditing} // Disable nút khi đang ở chế độ chỉnh sửa
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button
                    icon={<SettingOutlined />}
                    block
                    onClick={handleOpenSettings}
                  >
                    Cài đặt tài khoản
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button icon={<CalendarOutlined />} block>
                    Đặt lịch khám
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Tabs */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </Card>

        {/* Giữ nguyên Modal cài đặt tài khoản */}
        <Modal
          title={
            <Space>
              <SettingOutlined />
              <span>Cài đặt tài khoản</span>
            </Space>
          }
          open={isSettingsModalOpen}
          onCancel={handleSettingsModalCancel}
          footer={null}
          width={600}
          destroyOnHidden
        >
          <Tabs
            activeKey={settingTab}
            onChange={setSettingTab}
            items={[
              {
                key: "password",
                label: (
                  <span>
                    <LockOutlined />
                    Đổi mật khẩu
                  </span>
                ),
              },
              {
                key: "deactivate",
                label: (
                  <span>
                    <WarningOutlined />
                    Vô hiệu hóa tài khoản
                  </span>
                ),
              },
            ]}
          />
          <div className="mt-4">{renderSettingsContent()}</div>
        </Modal>
      </div>
    </div>
  );
};

export default UserProfile;
