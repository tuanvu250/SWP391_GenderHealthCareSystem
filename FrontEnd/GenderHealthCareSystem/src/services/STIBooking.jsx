import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Card,
  Button,
  Row,
  Col,
  Steps,
  Typography,
  Divider,
  Radio,
  Checkbox,
  Alert,
  Modal,
  message,
  Space,
  Tag,
  Tooltip
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { FaVial, FaMicroscope, FaShieldAlt } from "react-icons/fa";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const STIBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // STI Testing packages từ trang STITesting
  const testingPackages = [
    {
      id: 1,
      name: "Gói cơ bản",
      price: 899000,
      originalPrice: 1200000,
      tests: [
        "HIV",
        "Giang mai (Syphilis)",
        "Lậu (Gonorrhea)",
        "Chlamydia"
      ],
      duration: "2-3 ngày",
      popular: false,
      description: "Gói xét nghiệm cơ bản cho các STI phổ biến nhất",
      discount: 25
    },
    {
      id: 2,
      name: "Gói toàn diện",
      price: 1599000,
      originalPrice: 2100000,
      tests: [
        "HIV 1&2",
        "Hepatitis B & C",
        "Giang mai (Syphilis)",
        "Lậu (Gonorrhea)",
        "Chlamydia",
        "Herpes HSV 1&2",
        "HPV"
      ],
      duration: "3-5 ngày",
      popular: true,
      description: "Gói xét nghiệm toàn diện nhất, kiểm tra đầy đủ các STI",
      discount: 24
    },
    {
      id: 3,
      name: "Gói nâng cao",
      price: 1299000,
      originalPrice: 1700000,
      tests: [
        "HIV",
        "Hepatitis B",
        "Giang mai (Syphilis)",
        "Lậu (Gonorrhea)",
        "Chlamydia",
        "Herpes HSV 1&2"
      ],
      duration: "2-4 ngày",
      popular: false,
      description: "Gói xét nghiệm nâng cao với các STI quan trọng",
      discount: 24
    }
  ];

  // Dịch vụ thêm
  const additionalServices = [
    {
      id: "home_sampling",
      name: "Lấy mẫu tại nhà",
      price: 100000,
      description: "Nhân viên y tế đến tận nhà lấy mẫu"
    },
    {
      id: "express_result",
      name: "Xét nghiệm khẩn cấp (24h)",
      price: 200000,
      description: "Nhận kết quả trong vòng 24 giờ"
    },
    {
      id: "doctor_consultation",
      name: "Tư vấn bác sĩ trực tiếp",
      price: 150000,
      description: "Giải thích kết quả và tư vấn điều trị"
    }
  ];

  // Các bước đặt lịch
  const steps = [
    {
      title: "Chọn gói",
      description: "Chọn gói xét nghiệm phù hợp"
    },
    {
      title: "Thông tin",
      description: "Điền thông tin cá nhân"
    },
    {
      title: "Thời gian",
      description: "Chọn ngày giờ xét nghiệm"
    },
    {
      title: "Xác nhận",
      description: "Xem lại và xác nhận"
    }
  ];

  // Giờ làm việc
  const workingHours = [
    { value: "08:00", label: "08:00" },
    { value: "08:30", label: "08:30" },
    { value: "09:00", label: "09:00" },
    { value: "09:30", label: "09:30" },
    { value: "10:00", label: "10:00" },
    { value: "10:30", label: "10:30" },
    { value: "11:00", label: "11:00" },
    { value: "13:30", label: "13:30" },
    { value: "14:00", label: "14:00" },
    { value: "14:30", label: "14:30" },
    { value: "15:00", label: "15:00" },
    { value: "15:30", label: "15:30" },
    { value: "16:00", label: "16:00" },
    { value: "16:30", label: "16:30" }
  ];

  // Địa điểm
  const locations = [
    {
      value: "hanoi_center",
      label: "Trung tâm Hà Nội",
      address: "123 Phố Huế, Hai Bà Trưng, Hà Nội"
    },
    {
      value: "hcm_center",
      label: "Trung tâm TP.HCM",
      address: "456 Nguyễn Thị Minh Khai, Quận 3, TP.HCM"
    },
    {
      value: "danang_center",
      label: "Trung tâm Đà Nẵng",
      address: "789 Lê Duẩn, Hải Châu, Đà Nẵng"
    }
  ];

  useEffect(() => {
    // Nếu có package được chọn từ trang trước
    const searchParams = new URLSearchParams(location.search);
    const packageId = searchParams.get('package');
    if (packageId) {
      const pkg = testingPackages.find(p => p.id === parseInt(packageId));
      if (pkg) {
        setSelectedPackage(pkg);
        setTotalPrice(pkg.price);
        form.setFieldsValue({ package: pkg.id });
      }
    }
  }, [location.search]);

  const handlePackageSelect = (packageId) => {
    const pkg = testingPackages.find(p => p.id === packageId);
    setSelectedPackage(pkg);
    calculateTotal(pkg, form.getFieldValue('additionalServices') || []);
  };

  const handleAdditionalServicesChange = (selectedServices) => {
    calculateTotal(selectedPackage, selectedServices);
  };

  const calculateTotal = (pkg, additionalServiceIds) => {
    if (!pkg) return;
    
    let total = pkg.price;
    additionalServiceIds.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) {
        total += service.price;
      }
    });
    setTotalPrice(total);
  };

  const nextStep = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setFormData(values);
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const confirmBooking = async () => {
    try {
      // Gọi API đặt lịch ở đây
      console.log('Booking data:', formData);
      
      message.success({
        content: 'Đặt lịch xét nghiệm STI thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 2 giờ.',
        duration: 5
      });
      
      setIsConfirmModalOpen(false);
      navigate('/booking-success', { 
        state: { 
          bookingData: formData, 
          package: selectedPackage,
          totalPrice: totalPrice
        }
      });
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const disabledDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ và chủ nhật
    return current && (current < dayjs().endOf('day') || current.day() === 0);
  };

  // Render từng bước
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Alert
              message="Chọn gói xét nghiệm phù hợp với nhu cầu của bạn"
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Form.Item
              name="package"
              rules={[{ required: true, message: 'Vui lòng chọn gói xét nghiệm!' }]}
            >
              <Radio.Group 
                className="w-full"
                onChange={(e) => handlePackageSelect(e.target.value)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {testingPackages.map((pkg) => (
                    <div key={pkg.id} className="relative">
                      <Radio value={pkg.id} className="w-full">
                        <Card 
                          className={`h-full cursor-pointer transition-all duration-300 ${
                            selectedPackage?.id === pkg.id 
                              ? 'border-2 border-[#0099CF] shadow-lg' 
                              : 'border border-gray-200 hover:shadow-md'
                          } ${pkg.popular ? 'ring-2 ring-blue-100' : ''}`}
                        >
                          {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Tag color="blue" className="px-3 py-1">Phổ biến nhất</Tag>
                            </div>
                          )}
                          
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-bold mb-2">{pkg.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                            
                            <div className="mb-3">
                              <span className="text-2xl font-bold text-[#0099CF]">
                                {formatPrice(pkg.price)}
                              </span>
                              <span className="text-gray-500 line-through ml-2 text-sm">
                                {formatPrice(pkg.originalPrice)}
                              </span>
                              <div className="text-green-600 text-sm font-medium">
                                Tiết kiệm {pkg.discount}%
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                              <ClockCircleOutlined />
                              <span>Kết quả trong {pkg.duration}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 text-center">Bao gồm:</h4>
                            <ul className="space-y-1">
                              {pkg.tests.map((test, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircleOutlined className="text-green-500" />
                                  <span>{test}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Card>
                      </Radio>
                    </div>
                  ))}
                </div>
              </Radio.Group>
            </Form.Item>

            {/* Dịch vụ thêm */}
            <Card title="Dịch vụ bổ sung (tùy chọn)" className="mt-6">
              <Form.Item name="additionalServices">
                <Checkbox.Group 
                  className="w-full"
                  onChange={handleAdditionalServicesChange}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <Checkbox value={service.id} className="w-full">
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-gray-600 mb-2">{service.description}</div>
                            <div className="text-[#0099CF] font-bold">+{formatPrice(service.price)}</div>
                          </div>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </Checkbox.Group>
              </Form.Item>
            </Card>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Alert
              message="Vui lòng cung cấp thông tin chính xác để chúng tôi có thể liên hệ và hỗ trợ bạn tốt nhất"
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ tên!' },
                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Nhập họ và tên đầy đủ"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="0123456789"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="example@email.com"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="birthDate"
                  label="Ngày sinh"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                >
                  <DatePicker 
                    className="w-full"
                    placeholder="Chọn ngày sinh"
                    size="large"
                    disabledDate={(current) => current && current > dayjs()}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                  <Select placeholder="Chọn giới tính" size="large">
                    <Option value="female">Nữ</Option>
                    <Option value="male">Nam</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                  <TextArea 
                    rows={3} 
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24}>
                <Form.Item name="medicalHistory" label="Tiền sử bệnh (nếu có)">
                  <TextArea 
                    rows={3} 
                    placeholder="Mô tả các bệnh lý, dị ứng thuốc hoặc thông tin y tế quan trọng khác"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Alert
              message="Chọn thời gian và địa điểm thuận tiện nhất cho bạn"
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="appointmentDate"
                  label="Ngày xét nghiệm"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                  <DatePicker 
                    className="w-full"
                    placeholder="Chọn ngày xét nghiệm"
                    size="large"
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="appointmentTime"
                  label="Giờ xét nghiệm"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                >
                  <Select placeholder="Chọn giờ xét nghiệm" size="large">
                    {workingHours.map(hour => (
                      <Option key={hour.value} value={hour.value}>
                        {hour.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col xs={24}>
                <Form.Item
                  name="location"
                  label="Địa điểm lấy mẫu"
                  rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                >
                  <Radio.Group className="w-full">
                    <div className="space-y-4">
                      {locations.map(location => (
                        <Radio key={location.value} value={location.value} className="w-full">
                          <Card className="ml-6 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center">
                              <EnvironmentOutlined className="text-[#0099CF] text-lg mr-3" />
                              <div>
                                <div className="font-medium">{location.label}</div>
                                <div className="text-gray-600 text-sm">{location.address}</div>
                              </div>
                            </div>
                          </Card>
                        </Radio>
                      ))}
                    </div>
                  </Radio.Group>
                </Form.Item>
              </Col>
              
              <Col xs={24}>
                <Form.Item name="notes" label="Ghi chú thêm">
                  <TextArea 
                    rows={3} 
                    placeholder="Có thông tin gì đặc biệt bạn muốn chúng tôi biết?"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Alert
              message="Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt lịch"
              type="warning"
              showIcon
              className="mb-6"
            />
            
            {/* Tóm tắt đặt lịch */}
            <Card title="Thông tin đặt lịch" className="mb-6">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <div className="space-y-3">
                    <div><strong>Họ tên:</strong> {form.getFieldValue('fullName')}</div>
                    <div><strong>Điện thoại:</strong> {form.getFieldValue('phone')}</div>
                    <div><strong>Email:</strong> {form.getFieldValue('email')}</div>
                    <div><strong>Ngày sinh:</strong> {form.getFieldValue('birthDate')?.format('DD/MM/YYYY')}</div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="space-y-3">
                    <div><strong>Ngày xét nghiệm:</strong> {form.getFieldValue('appointmentDate')?.format('DD/MM/YYYY')}</div>
                    <div><strong>Giờ xét nghiệm:</strong> {form.getFieldValue('appointmentTime')}</div>
                    <div><strong>Địa điểm:</strong> {locations.find(l => l.value === form.getFieldValue('location'))?.label}</div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Chi tiết gói xét nghiệm */}
            {selectedPackage && (
              <Card title="Chi tiết gói xét nghiệm">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{selectedPackage.name}</h4>
                      <p className="text-gray-600">{selectedPackage.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#0099CF]">
                        {formatPrice(selectedPackage.price)}
                      </div>
                      <div className="text-gray-500 line-through text-sm">
                        {formatPrice(selectedPackage.originalPrice)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    {selectedPackage.tests.map((test, index) => (
                      <Tag key={index} color="blue" className="mb-1">{test}</Tag>
                    ))}
                  </div>
                </div>

                {/* Dịch vụ bổ sung */}
                {form.getFieldValue('additionalServices')?.length > 0 && (
                  <div className="border-t pt-4">
                    <h5 className="font-semibold mb-2">Dịch vụ bổ sung:</h5>
                    {form.getFieldValue('additionalServices').map(serviceId => {
                      const service = additionalServices.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between mb-1">
                          <span>{service.name}</span>
                          <span className="text-[#0099CF]">+{formatPrice(service.price)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                <Divider />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-[#0099CF] text-xl">{formatPrice(totalPrice)}</span>
                </div>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                className="flex items-center"
              >
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Đặt lịch xét nghiệm STI</h1>
                <p className="text-gray-600">Quy trình đặt lịch đơn giản và bảo mật</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <SafetyCertificateOutlined className="text-green-500" />
              <span className="text-sm text-gray-600">100% bảo mật</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Steps */}
        <Card className="mb-8">
          <Steps
            current={currentStep}
            items={steps}
            className="mb-6"
          />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form Content */}
          <div className="lg:col-span-3">
            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
              >
                {renderStepContent()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    size="large"
                  >
                    Quay lại
                  </Button>
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="primary"
                      onClick={nextStep}
                      size="large"
                      icon={<ArrowRightOutlined />}
                    >
                      Tiếp tục
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      size="large"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Xác nhận đặt lịch
                    </Button>
                  )}
                </div>
              </Form>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Package Summary */}
              {selectedPackage && (
                <Card title="Tóm tắt đơn hàng" size="small">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">{selectedPackage.name}</div>
                      <div className="text-sm text-gray-600">{selectedPackage.tests.length} xét nghiệm</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Giá gói:</span>
                      <span className="font-medium">{formatPrice(selectedPackage.price)}</span>
                    </div>
                    
                    {form.getFieldValue('additionalServices')?.map(serviceId => {
                      const service = additionalServices.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="flex justify-between text-sm">
                          <span>{service.name}:</span>
                          <span>+{formatPrice(service.price)}</span>
                        </div>
                      ) : null;
                    })}
                    
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng:</span>
                      <span className="text-[#0099CF]">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Contact Info */}
              <Card title="Hỗ trợ" size="small">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <PhoneOutlined className="text-[#0099CF]" />
                    <span>1900 xxxx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-[#0099CF]" />
                    <span>support@healthcare.com</span>
                  </div>
                  <div className="text-gray-600 mt-2">
                    Hỗ trợ 24/7 cho mọi thắc mắc về xét nghiệm
                  </div>
                </div>
              </Card>

              {/* Security Info */}
              <Card size="small">
                <div className="text-center">
                  <FaShieldAlt className="text-2xl text-green-500 mb-2" />
                  <div className="text-sm text-gray-600">
                    Thông tin của bạn được mã hóa và bảo mật tuyệt đối
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Xác nhận đặt lịch xét nghiệm STI"
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsConfirmModalOpen(false)}>
            Kiểm tra lại
          </Button>,
          <Button key="confirm" type="primary" onClick={confirmBooking}>
            Xác nhận đặt lịch
          </Button>
        ]}
        width={600}
      >
        <div className="space-y-4">
          <Alert
            message="Bạn có chắc chắn muốn đặt lịch với thông tin trên?"
            description="Sau khi xác nhận, chúng tôi sẽ liên hệ với bạn trong vòng 2 giờ để xác nhận lại thông tin."
            type="info"
            showIcon
          />
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Gói xét nghiệm:</strong> {selectedPackage?.name}</div>
              <div><strong>Tổng chi phí:</strong> <span className="text-[#0099CF] font-bold">{formatPrice(totalPrice)}</span></div>
              <div><strong>Ngày hẹn:</strong> {form.getFieldValue('appointmentDate')?.format('DD/MM/YYYY')}</div>
              <div><strong>Giờ hẹn:</strong> {form.getFieldValue('appointmentTime')}</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default STIBooking;