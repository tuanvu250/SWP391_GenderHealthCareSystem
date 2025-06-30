import React, { useEffect, useState } from "react";
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
  Divider,
  List,
  Tag,
  Card,
  Row,
  Col,
  Badge,
  Upload,
} from "antd";
import {
  UserOutlined,
  CameraOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { useAuth } from "../../../components/provider/AuthProvider";
import {
  getConsultantProfile,
  updateConsultantProfile,
  updateUserAvatarAPI,
} from "../../../components/api/UserProfile.api";

export default function ConsultantProfile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getConsultantProfile();
      const { details, ...rest } = res;
      rest.location = "Thành phố Hồ Chí Minh";
      setProfileData({ ...res, location: "Thành phố Hồ Chí Minh" });
      setTimeout(() => {
        form.setFieldsValue(rest);
      }, 0);
    } catch (err) {
      message.error("Không thể tải hồ sơ tư vấn!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        location: "Thành phố Hồ Chí Minh",
        details: profileData.details || [],
      };
      await updateConsultantProfile(payload);
      message.success("Cập nhật hồ sơ thành công!");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      message.error("Lỗi khi cập nhật hồ sơ.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async ({ file, onSuccess, onError }) => {
    setAvatarLoading(true);
    try {
      const response = await updateUserAvatarAPI(file);
      if (response && response.data) {
        updateUser({ ...user, userImageUrl: response.data.userImageUrl });
        setProfileData((prev) => ({
          ...prev,
          userImageUrl: response.data.userImageUrl,
        }));
        message.success("Cập nhật ảnh thành công!");
        onSuccess();
      }
    } catch (error) {
      message.error("Lỗi khi tải ảnh.");
      onError(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "auto", padding: 32 }}>
      <h2 style={{ marginBottom: 32, fontSize: 28 }}>Hồ sơ tư vấn viên</h2>

      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Card variant="outlined" style={{ marginBottom: 32, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <Row gutter={[32, 24]} align="middle">
              <Col xs={24} sm={6} style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Badge offset={[-5, 5]}>
                    <Avatar
                      size={120}
                      src={user?.userImageUrl || "https://via.placeholder.com/120"}
                      icon={<UserOutlined />}
                      className={avatarLoading ? "opacity-60" : ""}
                      style={{ border: "3px solid #1890ff" }}
                    />
                  </Badge>
                  <ImgCrop cropShape="round">
                    <Upload
                      customRequest={handleAvatarUpload}
                      showUploadList={false}
                      accept="image/png,image/jpeg"
                      beforeUpload={(file) => {
                        const isValidSize = file.size / 1024 / 1024 < 24;
                        if (!isValidSize) {
                          message.error("Kích thước ảnh phải nhỏ hơn 24MB!");
                        }
                        return isValidSize || Upload.LIST_IGNORE;
                      }}
                      style={{ position: "absolute", bottom: 0, right: 0 }}
                    >
                      <Button
                        type="primary"
                        shape="circle"
                        icon={avatarLoading ? <LoadingOutlined /> : <CameraOutlined />}
                        size="medium"
                        disabled={avatarLoading}
                      />
                    </Upload>
                  </ImgCrop>
                </div>
              </Col>
              <Col xs={24} sm={18}>
                <h2 style={{ marginBottom: 4, fontSize: 24 }}>{profileData.jobTitle}</h2>
                <p style={{ margin: 0, fontSize: 16, color: "#666" }}>
                  {profileData.languages} • {profileData.specialization}
                </p>
              </Col>
            </Row>
          </Card>

          {editing ? (
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Chức danh" name="jobTitle">
                    <Input placeholder="VD: Tiến sĩ Tâm lý học..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Chuyên ngành" name="specialization">
                    <Input placeholder="VD: Tâm lý học, Sức khỏe giới tính..." />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Ngôn ngữ sử dụng" name="languages">
                    <Input placeholder="VD: Tiếng Việt, English..." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Địa điểm làm việc" name="location">
                    <Input disabled value="Thành phố Hồ Chí Minh" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Số năm kinh nghiệm" name="experienceYears">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Mức phí theo giờ (VNĐ)" name="hourlyRate">
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Giới thiệu" name="introduction">
                <Input.TextArea rows={4} placeholder="Tóm tắt kinh nghiệm, định hướng, phong cách tư vấn..." />
              </Form.Item>

              <Form.Item label="Đang nhận lịch tư vấn" name="isAvailable" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Space>
                <Button type="primary" htmlType="submit" loading={saving}>
                  Lưu thay đổi
                </Button>
                <Button onClick={() => setEditing(false)}>Hủy</Button>
              </Space>
            </Form>
          ) : (
            <>
              <Descriptions
                bordered
                column={2}
                layout="horizontal"
                size="middle"
                styles={{ label: { fontWeight: 600 } }}
              >
                <Descriptions.Item label="Giới thiệu" span={2}>
                  {profileData.introduction}
                </Descriptions.Item>
                <Descriptions.Item label="Địa điểm">Thành phố Hồ Chí Minh</Descriptions.Item>
                <Descriptions.Item label="Ngôn ngữ">
                  {profileData.languages}
                </Descriptions.Item>
                <Descriptions.Item label="Kinh nghiệm">
                  {profileData.experienceYears} năm
                </Descriptions.Item>
                <Descriptions.Item label="Mức phí">
                  {profileData.hourlyRate?.toLocaleString()} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Đang tư vấn">
                  {profileData.isAvailable ? "Có" : "Không"}
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left" style={{ marginTop: 40 }}>
                Chi tiết hồ sơ
              </Divider>

              <List
                dataSource={profileData.details || []}
                bordered
                itemLayout="vertical"
                renderItem={(item) => (
                  <List.Item>
                    <Card size="small" variant="outlined" style={{ width: "100%" }}>
                      <Tag
                        color={
                          item.detailType === "Education"
                            ? "blue"
                            : item.detailType === "Experience"
                            ? "green"
                            : "orange"
                        }
                      >
                        {item.detailType}
                      </Tag>
                      <h4>{item.title}</h4>
                      <p style={{ margin: 0 }}>{item.organization}</p>
                      <p style={{ margin: 0, fontStyle: "italic" }}>
                        {item.fromDate || item.issuedDate} → {item.toDate || "Nay"}
                      </p>
                      {item.description && (
                        <p style={{ marginTop: 8, color: "#555" }}>{item.description}</p>
                      )}
                    </Card>
                  </List.Item>
                )}
              />

              <Button
                type="primary"
                style={{ marginTop: 32 }}
                onClick={() => setEditing(true)}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
