// src/services/STIBooking/BookingForm.jsx
import React, { useEffect } from "react";
import {
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Card,
  Radio,
  Form,
  Typography,
  Divider,
  Alert,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  BankOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../components/provider/AuthProvider";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const BookingForm = ({
  form,
  testingPackages,
  workingHours,
  disabledDate,
  handlePackageSelect,
  formatPrice,
}) => {
  const { user } = useAuth();

  // Tự động điền thông tin người dùng từ context khi component được tạo
  useEffect(() => {
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate ? dayjs(user.birthDate) : null,
      gender: user.gender || "male",
    });
  }, [form, user]);

  return (
    <div>

      <Divider />

      {/* Chọn gói xét nghiệm */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Chọn gói xét nghiệm</h3>
        <Form.Item
          name="package"
          rules={[{ required: true, message: "Vui lòng chọn gói xét nghiệm!" }]}
        >
          <div className="space-y-4">
            {testingPackages.map((pkg) => {
              // Kiểm tra xem gói này có được chọn không
              const isSelected = form.getFieldValue("package") === pkg.id;

              return (
                <Card
                  key={pkg.id}
                  className="border hover:border-[#0099CF] cursor-pointer transition-all "
                  onClick={() => handlePackageSelect(pkg)}
                >
                  <div className="hidden">
                    <Radio value={pkg.id} checked={isSelected} />
                  </div>

                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MedicineBoxOutlined className="text-[#0099CF]" />
                        <h4 className="font-bold text-lg m-0">{pkg.name}</h4>
                        {/* Thêm badge "Đã chọn" bên cạnh tên gói */}
                        {isSelected && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                            <CheckCircleOutlined className="mr-1" /> Đã chọn
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 mb-4">{pkg.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pkg.tests.map((test, index) => (
                          <div
                            key={index}
                            className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
                          >
                            {test}
                          </div>
                        ))}
                      </div>
                      <div className="text-gray-600">
                        <span className="text-gray-500">Thời gian có kết quả:</span>{" "}
                        {pkg.duration}
                      </div>
                    </div>

                    <div className="md:text-right mt-4 md:mt-0 md:ml-4">
                      <div className="text-xl font-bold text-[#0099CF]">
                        {formatPrice(pkg.price)}
                      </div>
                      {pkg.originalPrice && (
                        <div className="line-through text-gray-500">
                          {formatPrice(pkg.originalPrice)}
                        </div>
                      )}
                      {/* Thêm nút chọn khi chưa được chọn */}
                      {!isSelected ? (
                        <button 
                          className="mt-2 bg-[#0099CF] text-white px-3 py-1 rounded hover:bg-[#007BA7] transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePackageSelect(pkg);
                          }}
                        >
                          Chọn gói này
                        </button>
                      ) : (
                        <div className="mt-2 text-green-600 font-medium flex items-center justify-end">
                          <CheckCircleOutlined className="mr-1" /> Đã chọn
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Form.Item>

        {/* Hidden field to store full package details */}
        <Form.Item name="packageDetails" hidden>
          <Input />
        </Form.Item>
      </div>

      <Divider />

      {/* Chọn thời gian xét nghiệm */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Chọn thời gian xét nghiệm</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="appointmentDate"
              label="Ngày xét nghiệm"
              rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabledDate={disabledDate}
                placeholder="Chọn ngày xét nghiệm"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="appointmentTime"
              label="Giờ xét nghiệm"
              rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
            >
              <Select placeholder="Chọn giờ xét nghiệm">
                {workingHours.map((hour) => (
                  <Option key={hour.value} value={hour.value}>
                    {hour.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Thông tin bổ sung */}
      <div>
        <h3 className="text-lg font-medium mb-4">Thông tin bổ sung (không bắt buộc)</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item name="notes" label="Ghi chú thêm">
              <TextArea
                rows={3}
                placeholder="Có thông tin gì đặc biệt bạn muốn chúng tôi biết? Các bệnh nền hoặc các triệu chứng bất thường bạn đang gặp phải (nếu có)"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Phương thức thanh toán */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Chọn phương thức thanh toán</h3>
        <Form.Item
          name="paymentMethod"
          rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán!" }]}
        >
          <Radio.Group className="w-full">
            <Space direction="vertical" className="w-full">
              <Card
                className="w-full cursor-pointer hover:border-blue-500 mb-2 p-[16px]"
              >
                <Radio value="cash" className="w-full">
                  <div className="flex items-center">
                    <DollarCircleOutlined className="mr-2 text-lg text-green-600" />
                    <div>
                      <div className="font-medium">Thanh toán tiền mặt</div>
                      <div className="text-gray-500 text-sm">
                        Thanh toán trực tiếp tại cơ sở khi đến xét nghiệm
                      </div>
                    </div>
                  </div>
                </Radio>
              </Card>

              <Card
                className="w-full cursor-pointer hover:border-blue-500 p-[16px]"
              >
                <Radio value="vnpay" className="w-full">
                  <div className="flex items-center">
                    <BankOutlined className="mr-2 text-lg text-blue-600" />
                    <div>
                      <div className="font-medium">Thanh toán trực tuyến</div>
                      <div className="text-gray-500 text-sm">
                        Thanh toán bằng VNPay (ATM/Visa/MasterCard/QR Code)
                      </div>
                    </div>
                  </div>
                </Radio>
              </Card>
            </Space>
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};

export default BookingForm;
