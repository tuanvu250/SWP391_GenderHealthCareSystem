import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Steps,
  Card,
  Modal,
  message,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Import components
import BookingForm from "./BookingForm";
import ConfirmBooking from "./ConfirmBooking";

const STIBooking = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Thông tin người dùng đã đăng nhập
  const userInfo = {
    fullName: "Nguyễn Văn A",
    phone: "0987654321",
    email: "nguyenvana@example.com",
    birthDate: dayjs("1990-01-01"),
  };

  // Định nghĩa các steps (giảm còn 2 bước)
  const steps = [
    {
      title: "Chọn gói & thời gian",
      status: "process",
      icon: <MedicineBoxOutlined />,
    },
    {
      title: "Xác nhận",
      status: "wait",
      icon: <CheckOutlined />,
    }
  ];

  // Các gói xét nghiệm STI
  const testingPackages = [
    {
      id: 1,
      name: "Gói cơ bản",
      serviceName: "Gói xét nghiệm STI cơ bản",
      price: "899000",
      originalPrice: "1200000",
      description: "Gói xét nghiệm cơ bản cho các STI phổ biến nhất",
      tests: ["HIV", "Giang mai (Syphilis)", "Lậu (Gonorrhea)", "Chlamydia"],
      duration: "2-3 ngày",
    },
    {
      id: 2,
      name: "Gói tổng quát",
      serviceName: "Gói xét nghiệm STI tổng quát",
      price: "1599000",
      originalPrice: "2100000",
      description: "Gói xét nghiệm toàn diện nhất, kiểm tra đầy đủ các STI",
      tests: [
        "HIV 1&2",
        "Hepatitis B & C",
        "Giang mai (Syphilis)",
        "Lậu (Gonorrhea)",
        "Chlamydia",
        "Herpes HSV 1&2",
        "HPV",
      ],
      duration: "3-5 ngày",
    },
  ];

  // Các khung giờ làm việc
  const workingHours = [
    { value: "08:00 - 09:00", label: "08:00 - 09:00" },
    { value: "09:00 - 10:00", label: "09:00 - 10:00" },
    { value: "10:00 - 11:00", label: "10:00 - 11:00" },
    { value: "13:30 - 14:30", label: "13:30 - 14:30" },
    { value: "14:30 - 15:30", label: "14:30 - 15:30" },
    { value: "15:30 - 16:30", label: "15:30 - 16:30" },
  ];

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Tính tổng tiền
  useEffect(() => {
    if (selectedPackage) {
      const total = parseInt(selectedPackage.price);      
      setTotalPrice(total);
    }
  }, [selectedPackage]);

  // Disable các ngày trong quá khứ
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Xử lý khi chọn gói xét nghiệm
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    form.setFieldsValue({ package: pkg.id });
    const packagePrice = parseInt(pkg.price);
    setTotalPrice(packagePrice);
  };

  // Di chuyển đến bước trước
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Di chuyển đến bước tiếp theo
  const nextStep = () => {
    form
      .validateFields()
      .then(() => {
        // Nếu đang ở bước đầu tiên (chọn gói), kiểm tra xem đã chọn gói chưa
        if (currentStep === 0) {
          const packageId = form.getFieldValue("package");
          if (!packageId) {
            message.error("Vui lòng chọn gói xét nghiệm!");
            return;
          }
          
          // Kiểm tra nếu chưa set selectedPackage
          if (!selectedPackage) {
            const pkg = testingPackages.find((p) => p.id === packageId);
            if (pkg) {
              setSelectedPackage(pkg);
            }
          }
        }
        
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  // Xử lý submit form
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Xử lý submit form ở đây
      console.log("Form values:", values);
      setIsConfirmModalOpen(true);
    });
  };

  // Xác nhận đặt lịch
  const confirmBooking = () => {
    setConfirmLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      setConfirmLoading(false);
      setIsConfirmModalOpen(false);
      
      // Hiển thị thông báo thành công
      Modal.success({
        title: "Đặt lịch thành công!",
        content: "Chúng tôi đã nhận được thông tin đặt lịch của bạn và sẽ liên hệ sớm để xác nhận.",
        onOk: () => navigate("/dashboard"),
      });
    }, 1500);
  };

  // Render nội dung các bước
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BookingForm 
            form={form}
            testingPackages={testingPackages}
            workingHours={workingHours}
            disabledDate={disabledDate}
            handlePackageSelect={handlePackageSelect}
            formatPrice={formatPrice}
          />
        );

      case 1:
        return (
          <ConfirmBooking 
            form={form}
            userInfo={userInfo}
            selectedPackage={selectedPackage}
            totalPrice={totalPrice}
            formatPrice={formatPrice}
          />
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
                <h1 className="text-2xl font-bold text-gray-800">
                  Đặt lịch xét nghiệm STI
                </h1>
                <p className="text-gray-600">
                  Quy trình đặt lịch đơn giản và bảo mật
                </p>
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
          <Steps current={currentStep} items={steps} className="mb-6" />
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
                    >
                      Tiếp tục
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => handleSubmit()}
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
              <Card>
                <h3 className="font-bold text-lg mb-4">Tóm tắt đặt lịch</h3>
                
                {selectedPackage ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-600 mb-1">Gói xét nghiệm:</div>
                      <div className="font-medium">{selectedPackage.name}</div>
                    </div>
                    
                    {form.getFieldValue("appointmentDate") && (
                      <div>
                        <div className="text-gray-600 mb-1">Ngày xét nghiệm:</div>
                        <div className="font-medium">
                          {form.getFieldValue("appointmentDate").format("DD/MM/YYYY")}
                        </div>
                      </div>
                    )}

                    {form.getFieldValue("appointmentTime") && (
                      <div>
                        <div className="text-gray-600 mb-1">Giờ xét nghiệm:</div>
                        <div className="font-medium">{form.getFieldValue("appointmentTime")}</div>
                      </div>
                    )}
                    
                    <Divider />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng cộng:</span>
                      <span className="text-xl font-bold text-[#0099CF]">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-6">
                    Vui lòng chọn gói xét nghiệm
                  </div>
                )}
              </Card>
              
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" />
                    <span className="text-gray-700">Bảo mật thông tin 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" />
                    <span className="text-gray-700">Kết quả chính xác tuyệt đối</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500" />
                    <span className="text-gray-700">Tư vấn miễn phí sau khi có kết quả</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal xác nhận đặt lịch */}
      <Modal
        title="Xác nhận đặt lịch xét nghiệm STI"
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsConfirmModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={confirmBooking}
            className="bg-green-600 hover:bg-green-700"
          >
            Xác nhận đặt lịch
          </Button>,
        ]}
      >
        <p>Bạn đã chắc chắn với thông tin đặt lịch này?</p>
        <p>
          Sau khi xác nhận, hệ thống sẽ gửi thông tin chi tiết qua email và SMS
          đến số điện thoại của bạn.
        </p>
      </Modal>
    </div>
  );
};

export default STIBooking;
