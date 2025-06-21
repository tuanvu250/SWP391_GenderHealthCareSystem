import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Space,
  Select,
  Divider,
  Typography,
  Upload,
  message,
  Card,
  Row,
  Col,
} from "antd";
import {
  SaveOutlined,
  UploadOutlined,
  FileTextOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ResultStisModal = ({ open, onCancel, booking, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [testDetails, setTestDetails] = useState("");

  // Danh sách các STIs phổ biến
  const stisList = [
    { label: "Chlamydia", value: "chlamydia" },
    { label: "Lậu (Gonorrhea)", value: "gonorrhea" },
    { label: "Giang mai (Syphilis)", value: "syphilis" },
    { label: "HIV", value: "hiv" },
    { label: "HPV (Human Papillomavirus)", value: "hpv" },
    { label: "Herpes sinh dục", value: "herpes" },
    { label: "Trichomonas", value: "trichomonas" },
    { label: "Viêm gan B", value: "hepatitis_b" },
    { label: "Viêm gan C", value: "hepatitis_c" },
    { label: "Mycoplasma genitalium", value: "mycoplasma" },
  ];

  // Xử lý khi nhập editor chi tiết xét nghiệm
  const handleEditorChange = (content) => {
    setTestDetails(content.target.value);
  };

  // Xử lý khi tải file lên
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Xử lý khi submit form
  const handleSubmit = async () => {
    try {
      // Validate form
      const values = await form.validateFields();
      setLoading(true);

      // Chuẩn bị dữ liệu kết quả với các bệnh đã phát hiện
      const detectedStis =
        values.detectedStis?.map((item) => ({
          disease: item.disease,
          result: item.result,
          notes: item.notes,
        })) || [];

      // Format lại dữ liệu kết quả
      const resultData = {
        bookingId: booking.id || booking.bookingId,
        testDate: values.testDate.format("YYYY-MM-DD"),
        performedBy: values.performedBy,
        facility: values.facility,
        conclusion: values.conclusion,
        recommendation: values.recommendation,
        detectedDiseases: detectedStis,
        details: testDetails,
        attachments: fileList.map((file) => file.originFileObj),
      };

      // Gọi function onSave được truyền từ component cha
      await onSave(resultData);

      message.success("Lưu kết quả xét nghiệm thành công!");
      form.resetFields();
      setTestDetails("");
      setFileList([]);
      onCancel(); // Đóng modal sau khi lưu
    } catch (error) {
      console.error("Error saving test results:", error);
      message.error("Không thể lưu kết quả xét nghiệm, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={<Title level={4}>Nhập kết quả xét nghiệm STIs</Title>}
      width={800}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          testDate: dayjs(),
          detectedStis: [{}],
        }}
      >
        {/* Thông tin cơ bản về dịch vụ */}
        <Card className="mb-4">
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Text type="secondary">Mã đặt lịch:</Text>{" "}
              <Text strong>{booking?.id || booking?.bookingId}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">Dịch vụ:</Text>{" "}
              <Text strong>{booking?.serviceName}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Text type="secondary">Khách hàng:</Text>{" "}
              <Text strong>{booking?.customerName}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">Số điện thoại:</Text>{" "}
              <Text strong>{booking?.customerPhone}</Text>
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="testDate"
              label="Ngày xét nghiệm"
              rules={[
                { required: true, message: "Vui lòng chọn ngày xét nghiệm!" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="facility"
              label="Cơ sở thực hiện xét nghiệm"
              rules={[
                { required: true, message: "Vui lòng nhập cơ sở xét nghiệm!" },
              ]}
            >
              <Input placeholder="Nhập tên cơ sở xét nghiệm" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="performedBy"
          label="Người thực hiện"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập người thực hiện xét nghiệm!",
            },
          ]}
        >
          <Input placeholder="Nhập tên người thực hiện xét nghiệm" />
        </Form.Item>

        <Divider>Kết quả xét nghiệm</Divider>

        <Form.List name="detectedStis">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} className="mb-3" size="small">
                  <Row gutter={16} align="middle">
                    <Col span={22}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "disease"]}
                            label="Bệnh lý / Chỉ số xét nghiệm"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn bệnh lý!",
                              },
                            ]}
                          >
                            <Select placeholder="Chọn bệnh lý">
                              {stisList.map((sti) => (
                                <Option key={sti.value} value={sti.value}>
                                  {sti.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "result"]}
                            label="Kết quả"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập kết quả!",
                              },
                            ]}
                          >
                            <Select placeholder="Chọn kết quả">
                              <Option value="positive">Dương tính</Option>
                              <Option value="negative">Âm tính</Option>
                              <Option value="inconclusive">
                                Không xác định
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        {...restField}
                        name={[name, "notes"]}
                        label="Ghi chú"
                      >
                        <Input placeholder="Nhập ghi chú (nếu có)" />
                      </Form.Item>
                    </Col>
                    <Col span={2} className="flex justify-center">
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          className="mt-8"
                        />
                      )}
                    </Col>
                  </Row>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm kết quả xét nghiệm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          name="conclusion"
          label="Kết luận"
          rules={[{ required: true, message: "Vui lòng nhập kết luận!" }]}
        >
          <TextArea
            placeholder="Nhập kết luận xét nghiệm"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Form.Item name="recommendation" label="Lời khuyên / Hướng dẫn">
          <TextArea
            placeholder="Nhập lời khuyên cho khách hàng"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Form.Item label="Chi tiết kết quả xét nghiệm">
          <TextArea
            value={testDetails}
            onChange={handleEditorChange}
            placeholder="Nhập chi tiết kết quả xét nghiệm"
            autoSize={{ minRows: 6, maxRows: 10 }}
          />
        </Form.Item>

        <Form.Item label="Tài liệu đính kèm">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Không upload ngay lập tức
            maxCount={5}
          >
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
          <Text type="secondary" className="mt-2 block">
            Định dạng hỗ trợ: JPG, PNG, PDF. Tối đa 5 file.
          </Text>
        </Form.Item>

        <Divider />

        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            <Button onClick={onCancel}>Hủy</Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              icon={<SaveOutlined />}
            >
              Lưu kết quả
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResultStisModal;
