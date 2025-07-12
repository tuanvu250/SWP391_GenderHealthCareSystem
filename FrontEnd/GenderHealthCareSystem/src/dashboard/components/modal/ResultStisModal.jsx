import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Tag,
  Space,
  Select,
  Divider,
  Typography,
  Upload,
  message,
  Card,
  Row,
  Col,
  Alert,
} from "antd";
import {
  SaveOutlined,
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  enterResultStisAPI,
  markCompletedBookingStisAPI,
  markResultAtStisAPI,
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
  
  // Xác định nếu là gói xét nghiệm đơn lẻ
  const isSingleTest = serviceData?.type === "single";

  // Cập nhật stisList và form khi serviceData thay đổi
  useEffect(() => {
    if (serviceData?.tests) {
      const newStisList = serviceData.tests.split(", ").map((sti) => ({
        value: sti.trim(),
        label: sti.trim(),
      }));
      setStisList(newStisList);
      
      // Nếu là xét nghiệm đơn lẻ và chỉ có một bệnh, tự động chọn bệnh đó
      if (isSingleTest && newStisList.length === 1) {
        form.setFieldsValue({
          detectedStis: [
            {
              disease: newStisList[0].value,
            }
          ]
        });
      }
    } else {
      setStisList([]);
    }
  }, [serviceData, form, isSingleTest]);

  // Lấy danh sách các bệnh đã chọn để lọc ra khỏi options
  const getSelectedDiseases = () => {
    const values = form.getFieldsValue();
    return values.detectedStis
      ?.filter(item => item && item.disease)
      .map(item => item.disease) || [];
  };

  // Lọc danh sách bệnh đã chọn cho một field cụ thể
  const getAvailableDiseases = (currentFieldName) => {
    const selectedDiseases = getSelectedDiseases();
    const currentValue = form.getFieldValue(['detectedStis', currentFieldName, 'disease']);
    
    // Trả về toàn bộ danh sách nếu là xét nghiệm đơn lẻ
    if (isSingleTest) return stisList;
    
    // Nếu không, lọc ra những bệnh chưa được chọn và bệnh đang được chọn ở field hiện tại
    return stisList.filter(
      disease => !selectedDiseases.includes(disease.value) || disease.value === currentValue
    );
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

      if (fileList.length > 0) {
        await uploadStisAttachmentsAPI(
          booking.bookingId,
          fileList[0].originFileObj
        );
      }

      await markCompletedBookingStisAPI(booking.bookingId);

      await markResultAtStisAPI(booking.bookingId);

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
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <Text type="secondary">Khách hàng:</Text>{" "}
              <Text strong>{booking?.customerName}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">Số điện thoại:</Text>{" "}
              <Text strong>{customer?.phone}</Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Text type="secondary">Email:</Text>{" "}
              <Text strong>{customer?.email}</Text>
            </Col>
          </Row>
        </Card>

        {/* Thêm cảnh báo cho xét nghiệm đơn lẻ */}
        {isSingleTest && (
          <Alert
            message="Xét nghiệm đơn lẻ"
            description="Đây là xét nghiệm đơn lẻ, chỉ được nhập kết quả cho một loại bệnh."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className="mb-4"
          />
        )}

        <Divider>Kết quả xét nghiệm</Divider>

        <Form.List name="detectedStis">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} className="mb-3" size="small">
                  <Row gutter={16} align="middle">
                    <Col span={isSingleTest ? 24 : 22}>
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
                            <Select 
                              placeholder="Chọn bệnh lý" 
                              disabled={isSingleTest && stisList.length === 1}
                              options={getAvailableDiseases(name)}
                              onChange={() => {
                                // Force re-render để cập nhật danh sách lựa chọn cho các field khác
                                form.setFields([{ name: 'detectedStis', errors: [] }]);
                              }}
                            />
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
                    {/* Chỉ hiển thị nút xóa khi không phải là xét nghiệm đơn lẻ */}
                    {!isSingleTest && (
                      <Col span={2} className="flex justify-center">
                        {fields.length > 1 && (
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => {
                              remove(name);
                              // Force re-render để cập nhật danh sách lựa chọn
                              setTimeout(() => {
                                form.setFields([{ name: 'detectedStis', errors: [] }]);
                              }, 0);
                            }}
                            className="mt-8"
                          />
                        )}
                      </Col>
                    )}
                  </Row>
                </Card>
              ))}
              
              {/* Chỉ hiển thị nút thêm khi không phải là xét nghiệm đơn lẻ và còn bệnh để chọn */}
              {!isSingleTest && stisList.length > getSelectedDiseases().length && (
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
              )}
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
