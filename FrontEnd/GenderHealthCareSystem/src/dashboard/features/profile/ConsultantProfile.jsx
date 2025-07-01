"use client"

import { useEffect, useState } from "react"
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
} from "antd"
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
} from "@ant-design/icons"
import ImgCrop from "antd-img-crop"
import { useAuth } from "../../../components/provider/AuthProvider"
import {
  getConsultantProfile,
  updateConsultantProfile,
  updateUserAvatarAPI,
} from "../../../components/api/UserProfile.api"

const { Title, Text, Paragraph } = Typography

export default function ConsultantProfile() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const { user, updateUser } = useAuth()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await getConsultantProfile()
      const finalData = {
        ...res,
        userImageUrl: res.userImageUrl || user?.userImageUrl || "/placeholder.svg",
        location: "Thành phố Hồ Chí Minh",
      }
      setProfileData(finalData)
      form.setFieldsValue(finalData)
    } catch {
      message.error("Không thể tải hồ sơ tư vấn!")
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async (values) => {
    setSaving(true)
    try {
      const payload = {
        ...values,
        location: "Thành phố Hồ Chí Minh",
        details: profileData.details || [],
      }
      await updateConsultantProfile(payload)
      message.success("Cập nhật hồ sơ thành công!")
      setEditing(false)
      fetchProfile()
    } catch {
      message.error("Lỗi khi cập nhật hồ sơ.")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async ({ file, onSuccess, onError }) => {
    setAvatarLoading(true)
    try {
      const res = await updateUserAvatarAPI(file)
      if (res?.data?.userImageUrl) {
        updateUser({ ...user, userImageUrl: res.data.userImageUrl })
        setProfileData((prev) => ({
          ...prev,
          userImageUrl: res.data.userImageUrl,
        }))
        message.success("Cập nhật ảnh thành công!")
        onSuccess()
      }
    } catch (err) {
      message.error("Lỗi khi tải ảnh.")
      onError(err)
    } finally {
      setAvatarLoading(false)
    }
  }

  const getTagColor = (type) => {
    switch (type) {
      case "Education": return "#1890ff"
      case "Experience": return "#52c41a"
      case "Certification": return "#722ed1"
      default: return "#d9d9d9"
    }
  }

  const getTagText = (type) => {
    switch (type) {
      case "Education": return "Học vấn"
      case "Experience": return "Kinh nghiệm"
      case "Certification": return "Chứng chỉ"
      default: return type
    }
  }

  if (loading || !profileData) {
    return (
      <div style={{ maxWidth: 1200, margin: "auto", padding: 32 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 32 }}>
      <Title level={2}>Hồ sơ tư vấn viên</Title>

      <Card style={{ marginBottom: 32, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} sm={6} style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Badge dot status={profileData.isAvailable ? "success" : "default"} offset={[-8, 8]}>
                <Avatar
                  size={140}
                  src={profileData.userImageUrl || user?.userImageUrl || "/placeholder.svg"}
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
                    const isValid = file.size / 1024 / 1024 < 24
                    if (!isValid) message.error("Ảnh phải nhỏ hơn 24MB!")
                    return isValid || Upload.LIST_IGNORE
                  }}
                >
                  <Tooltip title="Đổi ảnh đại diện">
                    <Button
                      icon={avatarLoading ? <LoadingOutlined /> : <CameraOutlined />}
                      shape="circle"
                      size="large"
                      style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#1890ff", color: "#fff" }}
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
              <Tag icon={<EnvironmentOutlined />} color="blue">{profileData.location}</Tag>
              <Tag icon={<GlobalOutlined />} color="green">{profileData.languages}</Tag>
              <Tag icon={<ClockCircleOutlined />} color="orange">{profileData.experienceYears} năm</Tag>
              <Tag icon={<DollarOutlined />} color="purple">{profileData.hourlyRate?.toLocaleString()} VNĐ/giờ</Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={editing ? 24 : 16}>
          {editing ? (
            <Card title="Chỉnh sửa thông tin">
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item name="jobTitle" label="Chức danh" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="specialization" label="Chuyên ngành" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item name="languages" label="Ngôn ngữ">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="location" label="Địa điểm">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item name="experienceYears" label="Kinh nghiệm">
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="hourlyRate" label="Phí tư vấn (VNĐ/giờ)">
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="introduction" label="Giới thiệu">
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item name="isAvailable" label="Trạng thái" valuePropName="checked">
                  <Switch checkedChildren="Đang nhận" unCheckedChildren="Tạm ngưng" />
                </Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                    Lưu thay đổi
                  </Button>
                  <Button onClick={() => setEditing(false)} icon={<CloseOutlined />}>
                    Hủy
                  </Button>
                </Space>
              </Form>
            </Card>
          ) : (
            <>
              <Card title="Giới thiệu" style={{ marginBottom: 24 }}>
                <Paragraph>{profileData.introduction}</Paragraph>
              </Card>

              <Card title="Chi tiết chuyên môn">
                <List
                  dataSource={profileData.details || []}
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
                      >
                        <div style={{ marginBottom: 12 }}>
                          <Tag
                            color={getTagColor(item.detailType)}
                            icon={
                              item.detailType === "Education" ? <GlobalOutlined /> :
                                item.detailType === "Experience" ? <ClockCircleOutlined /> :
                                  <CheckCircleOutlined />
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
                        <Title level={4} style={{ marginBottom: 4, color: "#1f1f1f" }}>
                          {item.title}
                        </Title>
                        <Text strong style={{ color: "#1890ff" }}>{item.organization}</Text>
                        <div style={{ margin: "8px 0" }}>
                          <Text type="secondary" style={{ fontStyle: "italic", color: "#888" }}>
                            {item.fromDate || item.issuedDate} → {item.toDate || "Nay"}
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

              </Card>
            </>
          )}
        </Col>

        {!editing && (
          <Col xs={24} lg={8}>
            <Card title="Thông tin cơ bản">
              <Descriptions column={1}>
                <Descriptions.Item label="Địa điểm">{profileData.location}</Descriptions.Item>
                <Descriptions.Item label="Ngôn ngữ">{profileData.languages}</Descriptions.Item>
                <Descriptions.Item label="Kinh nghiệm">{profileData.experienceYears} năm</Descriptions.Item>
                <Descriptions.Item label="Phí tư vấn">{profileData.hourlyRate?.toLocaleString()} VNĐ/giờ</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {profileData.isAvailable ? "Đang nhận tư vấn" : "Tạm ngưng"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Button
              type="primary"
              style={{ marginTop: 24 }}
              onClick={() => setEditing(true)}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </Col>
        )}
      </Row>
    </div>
  )
}
