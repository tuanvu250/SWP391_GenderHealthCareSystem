import React, { useState, useEffect } from "react";
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
import {
  enterResultStisAPI,
  markCompletedBookingStisAPI,
  uploadStisAttachmentsAPI,
} from "../../../components/api/BookingTesting.api";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ResultStisModal = ({
  open,
  onCancel,
  booking,
  onSave,
  customer,
  serviceData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [testDetails, setTestDetails] = useState("");
  const [stisList, setStisList] = useState([]);

  // Cập nhật stisList mỗi khi serviceData thay đổi
  useEffect(() => {
    if (serviceData?.tests) {
      const newStisList = serviceData.tests.split(", ").map((sti) => ({
        value: sti.trim(),
        label: sti.trim(),
      }));
      setStisList(newStisList);
    } else {
      setStisList([]);
    }
  }, [serviceData]);

  // Xử lý khi nhập editor chi tiết xét nghiệm
  const handleEditorChange = (content) => {
    setTestDetails(content.target.value);
  };

  // Xử lý khi tải file lên
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
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
          testCode: item.disease,
          resultText: item.result,
          notes: item.notes,
        })) || [];

      await enterResultStisAPI(booking.bookingId, detectedStis);

      await uploadStisAttachmentsAPI(
        booking.bookingId,
        fileList[0].originFileObj
      );

      await markCompletedBookingStisAPI(booking.bookingId);

      message.success("Lưu kết quả xét nghiệm thành công!");
      form.resetFields();
      setTestDetails("");
      setFileList([]);
      onSave();
      onCancel(); // Đóng modal sau khi lưu
    } catch (error) {
      console.error("Error saving test results:", error);
      message.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi lưu kết quả xét nghiệm. Vui lòng thử lại."
      );
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
              <Text strong>{customer?.phone}</Text>
            </Col>
          </Row>
        </Card>

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

        <Form.Item label="Tài liệu đính kèm">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Không upload ngay lập tức
            maxCount={1}
            accept=".jpg,.jpeg,.png,.pdf"
            onRemove={() => setFileList([])}
          >
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
          <Text type="secondary" className="mt-2 block">
            Định dạng hỗ trợ: JPG, PNG, PDF.
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
