import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Switch,
  InputNumber,
  Skeleton,
  Descriptions,
  Space,
  Avatar,
  List,
  Tag,
  Card,
  Row,
  Col,
  Upload,
  Typography,
  Badge,
  Tooltip,
  Empty,
  Steps,
  Divider,
  Select,
  DatePicker,
  Modal,
  Popconfirm,
} from "antd";
import dayjs from "dayjs"; // Thêm dayjs để xử lý ngày tháng
import {
  UserOutlined,
  CameraOutlined,
  LoadingOutlined,
  SaveOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EditOutlined,
  PlusCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  TeamOutlined,
  DeleteOutlined,
  BookOutlined,
  BankOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { useAuth } from "../../../components/provider/AuthProvider";
import {
  getConsultantProfile,
  updateConsultantProfile,
  updateUserAvatarAPI,
} from "../../../components/api/UserProfile.api";
import { createConsultantProfileAPI } from "../../../components/api/Consultant.api";
import ConsultantDetailModal from "../../components/modal/ConsultantDetailModal";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;

export default function ConsultantProfile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detailSaving, setDetailSaving] = useState(false); // State cho việc lưu detail
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(true); // Trạng thái có profile hay chưa
  const { user, updateUser } = useAuth();

  // States cho modal thêm/sửa detail
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingDetailIndex, setEditingDetailIndex] = useState(-1); // -1 là thêm mới, >= 0 là sửa
  const [editingDetail, setEditingDetail] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getConsultantProfile();

      // Kiểm tra nếu profile chưa được tạo hoặc thiếu thông tin cần thiết
      if (!res || !res.jobTitle || !res.specialization) {
        setHasProfile(false);
        setEditing(true); // Tự động bật chế độ chỉnh sửa

        // Set giá trị mặc định cho form
        const defaultValues = {
          jobTitle: "",
          specialization: "",
          languages: "Tiếng Việt",
          location: "Thành phố Hồ Chí Minh",
          experienceYears: 0,
          hourlyRate: 0,
          introduction: "",
          employmentStatus: true,
        };

        setProfileData({
          ...defaultValues,
          userImageUrl: user?.userImageUrl || "/placeholder.svg",
          details: [],
        });
        form.setFieldsValue(defaultValues);
      } else {
        const finalData = {
          ...res,
          userImageUrl:
            res.userImageUrl || user?.userImageUrl || "/placeholder.svg",
          location: res.location || "Thành phố Hồ Chí Minh",
        };
        setProfileData(finalData);
        form.setFieldsValue(finalData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setHasProfile(false);
      setEditing(true);

      // Set giá trị mặc định nếu có lỗi
      const defaultValues = {
        jobTitle: "",
        specialization: "",
        languages: "Tiếng Việt",
        location: "Thành phố Hồ Chí Minh",
        experienceYears: 0,
        hourlyRate: 0,
        introduction: "",
        employmentStatus: true, 
      };

      setProfileData({
        ...defaultValues,
        userImageUrl: user?.userImageUrl || "/placeholder.svg",
        details: [],
      });
      form.setFieldsValue(defaultValues);

      message.warning("Bạn cần tạo hồ sơ tư vấn viên để bắt đầu nhận tư vấn");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        location: values.location || "Thành phố Hồ Chí Minh",
        details: profileData.details || [],
      };

      if (hasProfile) {
        await updateConsultantProfile(payload);
        message.success("Cập nhật hồ sơ thành công!");
      } else {
        await createConsultantProfileAPI(payload);
        message.success("Tạo hồ sơ thành công!");
        setHasProfile(true);
      }

      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(
        hasProfile ? "Lỗi khi cập nhật hồ sơ." : "Lỗi khi tạo hồ sơ."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddUpdateDetail = async (values) => {
    setDetailSaving(true);
    try {
      // Xử lý định dạng ngày tháng trước khi lưu
      const formattedDetail = {
        ...values,
        // Chuyển đổi đối tượng dayjs thành chuỗi ngày
        fromDate: values.fromDate ? values.fromDate.format("YYYY-MM-DD") : null,
        toDate: values.toDate ? values.toDate.format("YYYY-MM-DD") : null,
        issuedDate: values.issuedDate
          ? values.issuedDate.format("YYYY-MM-DD")
          : null,
      };

      let updatedDetails = [...(profileData.details || [])];

      if (editingDetailIndex >= 0) {
        // Cập nhật chi tiết hiện có
        updatedDetails[editingDetailIndex] = formattedDetail;
      } else {
        // Thêm chi tiết mới
        updatedDetails.push(formattedDetail);
      }

      // Cập nhật profile với chi tiết mới
      const updatedProfileData = {
        ...profileData,
        details: updatedDetails,
      };

      delete updatedProfileData.userImageUrl;

      // Cập nhật vào API
      await updateConsultantProfile(updatedProfileData);

      // Cập nhật state và hiển thị
      setProfileData(updatedProfileData);
      message.success(
        editingDetailIndex >= 0
          ? "Đã cập nhật thông tin chi tiết"
          : "Đã thêm thông tin chi tiết"
      );
      setDetailModalVisible(false);
    } catch (error) {
      console.error("Error updating detail:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật thông tin chi tiết"
      );
    } finally {
      setDetailSaving(false);
    }
  };

  // Xóa thông tin chi tiết
  const handleDeleteDetail = async (index) => {
    try {
      // Xóa chi tiết khỏi mảng
      const updatedDetails = [...profileData.details];
      updatedDetails.splice(index, 1);

      // Cập nhật profile với chi tiết mới
      const updatedProfileData = {
        ...profileData,
        details: updatedDetails,
      };

      // Cập nhật vào API
      await updateConsultantProfile({
        ...form.getFieldsValue(),
        details: updatedDetails,
      });

      // Cập nhật state và hiển thị
      setProfileData(updatedProfileData);
      message.success("Đã xóa thông tin chi tiết");
    } catch (error) {
      console.error("Error deleting detail:", error);
      message.error("Lỗi khi xóa thông tin chi tiết");
    }
  };

  // Mở modal thêm thông tin chi tiết
  const showAddDetailModal = () => {
    setEditingDetailIndex(-1); // -1 là thêm mới
    setEditingDetail(null);
    setDetailModalVisible(true);
  };

  // Mở modal sửa thông tin chi tiết
  const showEditDetailModal = (detail, index) => {
    setEditingDetailIndex(index);
    setEditingDetail(detail);

    // Format ngày tháng trước khi điền vào form
    const formattedDetail = {
      ...detail,
      fromDate: detail.fromDate ? dayjs(detail.fromDate) : null,
      toDate: detail.toDate ? dayjs(detail.toDate) : null,
      issuedDate: detail.issuedDate ? dayjs(detail.issuedDate) : null,
    };

    form.setFieldsValue(formattedDetail);
    setDetailModalVisible(true);
  };

  const handleAvatarUpload = async ({ file, onSuccess, onError }) => {
    setAvatarLoading(true);
    try {
      const res = await updateUserAvatarAPI(file);
      if (res?.data?.userImageUrl) {
        updateUser({ ...user, userImageUrl: res.data.userImageUrl });
        setProfileData((prev) => ({
          ...prev,
          userImageUrl: res.data.userImageUrl,
        }));
        message.success("Cập nhật ảnh thành công!");
        onSuccess();
      }
    } catch (err) {
      message.error("Lỗi khi tải ảnh.");
      onError(err);
    } finally {
      setAvatarLoading(false);
    }
  };

  const getTagColor = (type) => {
    switch (type) {
      case "Education":
      case "EDUCATION":
        return "#1890ff";
      case "Experience":
      case "EXPERIENCE":
        return "#52c41a";
      case "Certification":
      case "CERTIFICATION":
        return "#722ed1";
      default:
        return "#d9d9d9";
    }
  };

  const getTagText = (type) => {
    switch (type) {
      case "Education":
      case "EDUCATION":
        return "Học vấn";
      case "Experience":
      case "EXPERIENCE":
        return "Kinh nghiệm";
      case "Certification":
      case "CERTIFICATION":
        return "Chứng chỉ";
      default:
        return type;
    }
  };

  const renderCreateProfileView = () => {
    return (
      <div style={{ padding: 16 }}>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <PlusCircleOutlined
                style={{ marginRight: 8, color: "#1890ff" }}
              />
              <span>Tạo hồ sơ tư vấn viên</span>
            </div>
          }
          style={{ marginBottom: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}
        >
          <Steps
            current={0}
            direction="horizontal"
            style={{ marginBottom: 40 }}
          >
            <Step title="Tạo hồ sơ" description="Bạn đang ở bước này" />
            <Step
              title="Bổ sung thông tin"
              description="Thêm chứng chỉ, kinh nghiệm"
            />
            <Step title="Hoàn thành" description="Bắt đầu nhận tư vấn" />
          </Steps>

          <div
            style={{
              background: "#f9f9f9",
              padding: 16,
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <InfoCircleOutlined
                style={{ color: "#1890ff", marginRight: 8 }}
              />
              <Text strong>Lưu ý khi tạo hồ sơ:</Text>
            </div>
            <Text>
              Hồ sơ tư vấn viên đầy đủ sẽ giúp người dùng có thêm thông tin để
              lựa chọn tư vấn viên phù hợp. Bạn cần điền đầy đủ các thông tin cơ
              bản như chức danh, chuyên môn và kinh nghiệm. Sau khi tạo hồ sơ
              thành công, bạn có thể tiếp tục bổ sung thêm các thông tin chi
              tiết.
            </Text>
          </div>

          {renderProfileForm()}
        </Card>
      </div>
    );
  };

  const renderProfileForm = () => {
    return (
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="jobTitle"
              label="Chức danh"
              rules={[{ required: true, message: "Vui lòng nhập chức danh" }]}
            >
              <Input placeholder="Ví dụ: Bác sĩ chuyên khoa sản phụ khoa" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="specialization"
              label="Chuyên ngành"
              rules={[
                { required: true, message: "Vui lòng nhập chuyên ngành" },
              ]}
            >
              <Input placeholder="Ví dụ: Sức khỏe sinh sản, Kế hoạch hóa gia đình" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="languages"
              label="Ngôn ngữ"
              rules={[{ required: true, message: "Vui lòng nhập ngôn ngữ" }]}
            >
              <Input placeholder="Ví dụ: Tiếng Việt, Tiếng Anh" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="location"
              label="Địa điểm"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="experienceYears"
              label="Số năm kinh nghiệm"
              rules={[
                { required: true, message: "Vui lòng nhập số năm kinh nghiệm" },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Ví dụ: 5"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="hourlyRate"
              label="Phí tư vấn (VNĐ/giờ)"
              rules={[{ required: true, message: "Vui lòng nhập phí tư vấn" }]}
            >
              <InputNumber
                min={0}
                step={50000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                style={{ width: "100%" }}
                placeholder="Ví dụ: 200,000"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="introduction"
          label="Giới thiệu"
          rules={[{ required: true, message: "Vui lòng nhập giới thiệu" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Giới thiệu về bản thân, kinh nghiệm và chuyên môn của bạn..."
            showCount
            maxLength={500}
          />
        </Form.Item>
        <Form.Item
          name="employmentStatus"
          label="Trạng thái"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Đang nhận tư vấn"
            unCheckedChildren="Tạm ngưng"
          />
        </Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={hasProfile ? <SaveOutlined /> : <PlusOutlined />}
            loading={saving}
            size="large"
          >
            {hasProfile ? "Lưu thay đổi" : "Tạo hồ sơ"}
          </Button>
          {hasProfile && (
            <Button onClick={() => setEditing(false)} icon={<CloseOutlined />}>
              Hủy
            </Button>
          )}
        </Space>
      </Form>
    );
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "auto", padding: 32 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  // Nếu chưa có profile, hiển thị chế độ tạo profile
  if (!hasProfile) {
    return (
      <div style={{ maxWidth: 1200, margin: "auto", padding: 32 }}>
        <Title level={2}>Tạo hồ sơ tư vấn viên</Title>
        {renderCreateProfileView()}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 32 }}>
      <Title level={2}>Hồ sơ tư vấn viên</Title>

      <Card
        style={{ marginBottom: 32, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
      >
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} sm={6} style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Badge
                dot
                status={profileData.employmentStatus ? "success" : "default"}
                offset={[-8, 8]}
              >
                <Avatar
                  size={140}
                  src={
                    profileData.userImageUrl ||
                    user?.userImageUrl ||
                    "/placeholder.svg"
                  }
                  icon={<UserOutlined />}
                  style={{ border: "3px solid #1890ff" }}
                />
              </Badge>
              <ImgCrop cropShape="round">
                <Upload
                  customRequest={handleAvatarUpload}
                  showUploadList={false}
                  accept="image/png,image/jpeg"
                  beforeUpload={(file) => {
                    const isValid = file.size / 1024 / 1024 < 24;
                    if (!isValid) message.error("Ảnh phải nhỏ hơn 24MB!");
                    return isValid || Upload.LIST_IGNORE;
                  }}
                >
                  <Tooltip title="Đổi ảnh đại diện">
                    <Button
                      icon={
                        avatarLoading ? <LoadingOutlined /> : <CameraOutlined />
                      }
                      shape="circle"
                      size="large"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "#1890ff",
                        color: "#fff",
                      }}
                      disabled={avatarLoading}
                    />
                  </Tooltip>
                </Upload>
              </ImgCrop>
            </div>
          </Col>
          <Col xs={24} sm={18}>
            <Title level={3}>{profileData.jobTitle}</Title>
            <Paragraph>{profileData.specialization}</Paragraph>
            <Space wrap>
              <Tag icon={<EnvironmentOutlined />} color="blue">
                {profileData.location}
              </Tag>
              <Tag icon={<GlobalOutlined />} color="green">
                {profileData.languages}
              </Tag>
              <Tag icon={<ClockCircleOutlined />} color="orange">
                {profileData.experienceYears} năm
              </Tag>
              <Tag icon={<DollarOutlined />} color="purple">
                {profileData.hourlyRate?.toLocaleString()} VNĐ/giờ
              </Tag>
              <Tag
                icon={
                  profileData.employmentStatus ? (
                    <CheckCircleOutlined />
                  ) : (
                    <StopOutlined />
                  )
                }
                color={profileData.employmentStatus ? "success" : "default"}
              >
                {profileData.employmentStatus ? "Đang nhận tư vấn" : "Tạm ngưng"}
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={editing ? 24 : 16}>
          {editing ? (
            <Card title="Chỉnh sửa thông tin">{renderProfileForm()}</Card>
          ) : (
            <>
              <Card title="Giới thiệu" style={{ marginBottom: 24 }}>
                <Paragraph>{profileData.introduction}</Paragraph>
              </Card>

              <Card
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Chi tiết chuyên môn</span>
                    <Button
                      type="primary"
                      onClick={showAddDetailModal}
                      icon={<PlusOutlined />}
                    >
                      Thêm thông tin
                    </Button>
                  </div>
                }
              >
                {profileData.details && profileData.details.length > 0 ? (
                  <List
                    dataSource={profileData.details}
                    split={false}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: 0, marginBottom: 16 }}>
                        <Card
                          size="small"
                          style={{
                            width: "100%",
                            borderRadius: 12,
                            border: "1px solid #e0e0e0",
                            background: "#fafcff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          }}
                          bodyStyle={{ padding: 20 }}
                          actions={[
                            <Button
                              key="edit"
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => showEditDetailModal(item, index)}
                            >
                              Sửa
                            </Button>,
                            <Popconfirm
                              key="delete"
                              title="Xóa thông tin chi tiết"
                              description="Bạn có chắc chắn muốn xóa thông tin này?"
                              onConfirm={() => handleDeleteDetail(index)}
                              okText="Xóa"
                              cancelText="Hủy"
                            >
                              <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                              >
                                Xóa
                              </Button>
                            </Popconfirm>,
                          ]}
                        >
                          <div style={{ marginBottom: 12 }}>
                            <Tag
                              color={getTagColor(item.detailType)}
                              icon={
                                item.detailType === "Education" ||
                                item.detailType === "EDUCATION" ? (
                                  <GlobalOutlined />
                                ) : item.detailType === "Experience" ||
                                  item.detailType === "EXPERIENCE" ? (
                                  <ClockCircleOutlined />
                                ) : (
                                  <CheckCircleOutlined />
                                )
                              }
                              style={{
                                fontWeight: 600,
                                borderRadius: 8,
                                padding: "4px 12px",
                                fontSize: 12,
                                backgroundColor: "#f0f5ff",
                                color: getTagColor(item.detailType),
                              }}
                            >
                              {getTagText(item.detailType)}
                            </Tag>
                          </div>
                          <Title
                            level={4}
                            style={{ marginBottom: 4, color: "#1f1f1f" }}
                          >
                            {item.title}
                          </Title>
                          <Text strong style={{ color: "#1890ff" }}>
                            {item.organization}
                          </Text>
                          <div style={{ margin: "8px 0" }}>
                            <Text
                              type="secondary"
                              style={{ fontStyle: "italic", color: "#888" }}
                            >
                              {item.fromDate || item.issuedDate} →{" "}
                              {item.toDate || "Nay"}
                            </Text>
                          </div>
                          {item.description && (
                            <Paragraph style={{ marginTop: 8, color: "#555" }}>
                              {item.description}
                            </Paragraph>
                          )}
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div>
                        <Text>Bạn chưa có thông tin chi tiết nào</Text>
                        <br />
                        <Button
                          type="primary"
                          size="small"
                          icon={<PlusCircleOutlined />}
                          style={{ marginTop: 12 }}
                          onClick={showAddDetailModal}
                        >
                          Thêm thông tin chi tiết
                        </Button>
                      </div>
                    }
                  />
                )}
              </Card>
            </>
          )}
        </Col>

        {!editing && (
          <Col xs={24} lg={8}>
            <Card title="Thông tin cơ bản">
              <Descriptions column={1}>
                <Descriptions.Item label="Địa điểm">
                  {profileData.location}
                </Descriptions.Item>
                <Descriptions.Item label="Ngôn ngữ">
                  {profileData.languages}
                </Descriptions.Item>
                <Descriptions.Item label="Kinh nghiệm">
                  {profileData.experienceYears} năm
                </Descriptions.Item>
                <Descriptions.Item label="Phí tư vấn">
                  {profileData.hourlyRate?.toLocaleString()} VNĐ/giờ
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {profileData.employmentStatus ? "Đang nhận tư vấn" : "Tạm ngưng"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ marginTop: 24 }}
              onClick={() => setEditing(true)}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </Col>
        )}
      </Row>

      <ConsultantDetailModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        onSubmit={handleAddUpdateDetail}
        editingDetail={editingDetail}
        editingDetailIndex={editingDetailIndex}
        loading={detailSaving}
      />
    </div>
  );
}
