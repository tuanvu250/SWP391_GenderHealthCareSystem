import React from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Row,
  Col,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  BookOutlined,
  BankOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

// Định nghĩa các loại thông tin chi tiết
const detailTypes = [
  { value: "EDUCATION", label: "Học vấn", icon: <BookOutlined /> },
  { value: "EXPERIENCE", label: "Kinh nghiệm làm việc", icon: <BankOutlined /> },
  { value: "CERTIFICATION", label: "Chứng chỉ", icon: <TrophyOutlined /> },
  { value: "OTHER", label: "Thông tin khác", icon: <FileTextOutlined /> },
];

const ConsultantDetailModal = ({
  visible,
  onCancel,
  onSubmit,
  editingDetail,
  editingDetailIndex,
  loading,
}) => {
  const [form] = Form.useForm();
  const isEditing = editingDetailIndex >= 0;

  // Khi thông tin chi tiết hoặc trạng thái hiển thị thay đổi
  React.useEffect(() => {
    if (visible) {
      // Reset form khi mở modal
      form.resetFields();
      
      // Nếu đang sửa, set giá trị cho form
      if (isEditing && editingDetail) {
        // Format ngày tháng trước khi điền vào form
        const formattedDetail = {
          ...editingDetail,
          fromDate: editingDetail.fromDate ? dayjs(editingDetail.fromDate) : null,
          toDate: editingDetail.toDate ? dayjs(editingDetail.toDate) : null,
          issuedDate: editingDetail.issuedDate ? dayjs(editingDetail.issuedDate) : null,
        };
        
        form.setFieldsValue(formattedDetail);
      } else {
        // Set giá trị mặc định khi thêm mới
        form.setFieldsValue({
          detailType: "EDUCATION",
        });
      }
    }
  }, [visible, editingDetail, isEditing, form]);

  // Xử lý khi submit form
  const handleSubmit = async (values) => {
    await onSubmit(values);
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa thông tin chi tiết" : "Thêm thông tin chi tiết"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="detailType"
          label="Loại thông tin"
          rules={[{ required: true, message: "Vui lòng chọn loại thông tin" }]}
        >
          <Select placeholder="Chọn loại thông tin">
            {detailTypes.map((type) => (
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
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Ví dụ: Bác sĩ Y khoa, Chứng chỉ tư vấn..." />
        </Form.Item>

        <Form.Item
          name="organization"
          label="Tổ chức/Đơn vị"
          rules={[{ required: true, message: "Vui lòng nhập tên tổ chức" }]}
        >
          <Input placeholder="Ví dụ: Đại học Y Hà Nội, Bệnh viện Bạch Mai..." />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currValues) =>
            prevValues.detailType !== currValues.detailType
          }
        >
          {({ getFieldValue }) => {
            const detailType = getFieldValue("detailType");

            if (detailType === "CERTIFICATION") {
              return (
                <Form.Item
                  name="issuedDate"
                  label="Ngày cấp"
                  rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn ngày"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              );
            }

            if (detailType === "EDUCATION" || detailType === "EXPERIENCE") {
              return (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="fromDate"
                      label="Từ ngày"
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                      ]}
                    >
                      <DatePicker
                        className="w-full"
                        placeholder="Chọn ngày bắt đầu"
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="toDate" label="Đến ngày">
                      <DatePicker
                        className="w-full"
                        placeholder="Để trống nếu hiện tại"
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              );
            }

            return null;
          }}
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết..." />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
          >
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ConsultantDetailModal;