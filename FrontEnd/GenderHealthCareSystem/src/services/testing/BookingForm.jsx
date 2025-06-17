// src/services/STIBooking/BookingForm.jsx
import React from "react";
import {
  Form,
  Card,
  Alert,
  Radio,
  DatePicker,
  Select,
  Row,
  Col,
  Input,
  Divider,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const BookingForm = ({ 
  form, 
  testingPackages, 
  workingHours,
  disabledDate, 
  handlePackageSelect,
  formatPrice 
}) => {
  return (
    <div>
      <Alert
        message="Chọn gói xét nghiệm và thời gian phù hợp với bạn"
        type="info"
        showIcon
        className="mb-8"
      />
      
      {/* Chọn gói xét nghiệm */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Chọn gói xét nghiệm</h3>
        <Form.Item
          name="package"
          rules={[
            { required: true, message: "Vui lòng chọn gói xét nghiệm!" },
          ]}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testingPackages.map((pkg) => {
              const isSelected = form.getFieldValue("package") === pkg.id;
              
              return (
                <div
                  key={pkg.id}
                  className="relative"
                  onClick={() => handlePackageSelect(pkg)}
                >
                  <Card
                    className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg p-[24px] ${
                      isSelected
                        ? "border-2 border-[#0099CF] shadow-md"
                        : "border border-gray-200"
                    }`}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute -right-2 -top-2 bg-[#0099CF] rounded-full w-7 h-7 flex items-center justify-center">
                        <CheckCircleOutlined className="text-white text-lg" />
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h3
                        className={`text-lg font-bold mb-2 ${
                          isSelected ? "text-[#0099CF]" : "text-gray-800"
                        }`}
                      >
                        {pkg.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {pkg.description}
                      </p>

                      <div className="mb-3">
                        <span className="text-2xl font-bold text-[#0099CF]">
                          {formatPrice(pkg.price)}
                        </span>
                        <span className="text-gray-500 line-through ml-2 text-sm">
                          {formatPrice(pkg.originalPrice)}
                        </span>
                        <div className="text-green-600 text-sm font-medium">
                          Tiết kiệm{" "}
                          {(() => {
                            const originalPrice = parseInt(pkg.originalPrice);
                            const currentPrice = parseInt(pkg.price);
                            const discount = Math.round(
                              ((originalPrice - currentPrice) / originalPrice) * 100
                            );
                            return discount;
                          })()}
                          %
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                        <ClockCircleOutlined />
                        <span>Kết quả trong {pkg.duration}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-center">
                        Bao gồm:
                      </h4>
                      <ul className="space-y-1">
                        {pkg.tests.map((test, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircleOutlined className="text-green-500" />
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>

                  {/* Hidden radio button for form validation */}
                  <div className="hidden">
                    <Radio value={pkg.id} checked={isSelected} />
                  </div>
                </div>
              );
            })}
          </div>
        </Form.Item>
      </div>

      {/* Phân cách */}
      <Divider />
      
      {/* Thông tin thời gian và ghi chú */}
      <h3 className="text-lg font-semibold mb-4">Thời gian xét nghiệm</h3>
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="appointmentDate"
            label="Ngày xét nghiệm"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker
              className="w-full"
              placeholder="Chọn ngày xét nghiệm"
              size="large"
              disabledDate={disabledDate}
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="appointmentTime"
            label="Giờ xét nghiệm"
            rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
          >
            <Select placeholder="Chọn giờ xét nghiệm" size="large">
              {workingHours.map((hour) => (
                <Option key={hour.value} value={hour.value}>
                  {hour.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        
        {/* Thêm phương thức thanh toán */}
        <Col xs={24}>
          <Divider />
          <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
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
                        <div className="text-gray-500 text-sm">Thanh toán trực tiếp tại cơ sở khi đến xét nghiệm</div>
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
                        <div className="font-medium">Chuyển khoản ngân hàng</div>
                        <div className="text-gray-500 text-sm">Thanh toán bằng VNPay (ATM/Visa/MasterCard/QR Code)</div>
                      </div>
                    </div>
                  </Radio>
                </Card>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="notes" label="Ghi chú thêm">
            <TextArea
              rows={3}
              placeholder="Có thông tin gì đặc biệt bạn muốn chúng tôi biết? Tiểu sử bệnh hoặc các triệu chứng bất thường bạn đang gặp phải (nếu có)"
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default BookingForm;