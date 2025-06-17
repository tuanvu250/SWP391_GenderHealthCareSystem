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
  Alert,
  Radio,
  Space,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
  CheckOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Import components
import BookingForm from "./BookingForm";
import ConfirmBooking from "./ConfirmBooking";
import { useAuth } from "../../components/provider/AuthProvider";

const STIBooking = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Thêm state cho modal thành công và hàm hiển thị thông báo thành công
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [successType, setSuccessType] = useState("cash");

  // Thông tin người dùng đã đăng nhập
  const userInfo = {
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    birthDate: dayjs(user.birthDate),
  };

  // Định nghĩa các steps
  const stepsData = [
    {
      title: "Chọn gói & thông tin",
      icon: <MedicineBoxOutlined />,
    },
    {
      title: "Xác nhận & thanh toán",
      icon: <CheckOutlined />,
    }
  ];

  // Tạo mảng steps với status dựa vào currentStep
  const steps = stepsData.map((step, index) => {
    let status;
    if (index < currentStep) {
      status = "finish"; // Các bước đã hoàn thành
    } else if (index === currentStep) {
      status = "process"; // Bước hiện tại
    } else {
      status = "wait"; // Các bước tiếp theo
    }
    
    return {
      ...step,
      status
    };
  });

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
    // Đảm bảo price là number
    const numPrice = typeof price === 'string' ? parseInt(price, 10) : price;
    
    // Kiểm tra xem numPrice có phải là một số hợp lệ không
    if (isNaN(numPrice)) return "0đ";
    
    return new Intl.NumberFormat("vi-VN").format(numPrice) + "đ";
  };

  // Tính tổng tiền
  useEffect(() => {
    if (selectedPackage) {
      const total = parseInt(selectedPackage.price);      
      setTotalPrice(total);
    }
  }, [selectedPackage]);

  // Các hàm khác
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

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

        // Nếu đang ở bước thanh toán, kiểm tra đã chọn phương thức thanh toán chưa
        if (currentStep === 1) {
          const paymentMethod = form.getFieldValue("paymentMethod");
          if (!paymentMethod) {
            message.error("Vui lòng chọn phương thức thanh toán!");
            return;
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
      // Xử lý submit form
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

      // Nếu là thanh toán VNPay, redirect sang trang thanh toán
      if (form.getFieldValue("paymentMethod") === "vnpay") {
        // Đây là nơi sẽ gọi API VNPay và redirect
        message.info("Đang chuyển đến cổng thanh toán VNPay...");
        
        // Mô phỏng chuyển hướng đến VNPay
        // window.location.href = "https://sandbox.vnpayment.vn/...";
        
        // Thay vào đó hiển thị modal thành công (tạm thời)
        setTimeout(() => {
          showSuccessModal(true); // Sử dụng thông báo thành công mới
        }, 2000);
      } else {
        // Nếu là tiền mặt thì hiển thị thông báo thành công ngay
        showSuccessModal(false); // false = không thanh toán qua VNPay
      }
    }, 1500);
  };

  // Hàm hiển thị modal thành công
  const showSuccessModal = (isVnpay) => {
    setSuccessType(isVnpay ? "vnpay" : "cash");
    setIsSuccessModalVisible(true);
  };

  // Render phần thanh toán
  const renderPaymentStep = () => {
    return (
      <div>
        <Alert
          message="Chọn phương thức thanh toán"
          type="info"
          showIcon
          className="mb-8"
        />
        
        {/* Thông tin gói đã chọn */}
        <div className="mb-8 bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Thông tin gói đã chọn</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-600">Gói xét nghiệm:</div>
              <div className="font-medium">{selectedPackage?.name}</div>
            </div>
            <div>
              <div className="text-gray-600">Giá gói:</div>
              <div className="font-medium text-[#0099CF]">{formatPrice(totalPrice)}</div>
            </div>
            <div>
              <div className="text-gray-600">Ngày xét nghiệm:</div>
              <div className="font-medium">
                {form.getFieldValue("appointmentDate")?.format("DD/MM/YYYY")}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Giờ xét nghiệm:</div>
              <div className="font-medium">{form.getFieldValue("appointmentTime")}</div>
            </div>
          </div>
        </div>

        <Divider />
        
        {/* Phương thức thanh toán */}
        <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
        <Form.Item 
          name="paymentMethod" 
          rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán!" }]}
        >
          <Radio.Group className="w-full">
            <Space direction="vertical" className="w-full">
              <Card 
                className="w-full cursor-pointer hover:border-blue-500 mb-2"
                bodyStyle={{ padding: "16px" }}
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
                className="w-full cursor-pointer hover:border-blue-500"
                bodyStyle={{ padding: "16px" }}
              >
                <Radio value="vnpay" className="w-full">
                  <div className="flex items-center">
                    <BankOutlined className="mr-2 text-lg text-blue-600" />
                    <div>
                      <div className="font-medium">Thanh toán trực tuyến</div>
                      <div className="text-gray-500 text-sm">Thanh toán bằng VNPay (ATM/Visa/MasterCard/QR Code)</div>
                    </div>
                  </div>
                </Radio>
              </Card>
            </Space>
          </Radio.Group>
        </Form.Item>
        
        <Alert
          message="Lưu ý về thanh toán"
          description="Trường hợp thanh toán trực tuyến, bạn sẽ được chuyển đến cổng thanh toán an toàn của VNPay sau khi xác nhận. Gói xét nghiệm sẽ được đảm bảo sau khi thanh toán thành công."
          type="warning"
          showIcon
          className="mt-8"
        />
      </div>
    );
  };

  // Cập nhật renderStepContent để sử dụng renderPaymentStep thay vì component riêng
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <BookingForm 
              form={form}
              testingPackages={testingPackages}
              workingHours={workingHours}
              disabledDate={disabledDate}
              handlePackageSelect={handlePackageSelect}
              formatPrice={formatPrice}
            />
            
            <Divider />
          </div>
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

  // Render nút điều hướng - cập nhật tên nút
  const renderNavigationButtons = () => {
    return (
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
            {currentStep === 1 ? "Tiến hành thanh toán" : "Tiếp tục"}
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => handleSubmit()}
            size="large"
            className="bg-green-600 hover:bg-green-700"
          >
            Xác nhận đặt lịch và thanh toán
          </Button>
        )}
      </div>
    );
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
                {renderNavigationButtons()}
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
                    
                    {form.getFieldValue("paymentMethod") && (
                      <div>
                        <div className="text-gray-600 mb-1">Phương thức thanh toán:</div>
                        <div className="font-medium">
                          {form.getFieldValue("paymentMethod") === "cash" 
                            ? "Tiền mặt" 
                            : "Thanh toán VNPay"}
                        </div>
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
        title="Xác nhận thanh toán và đặt lịch"
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
            {form.getFieldValue("paymentMethod") === "vnpay" 
              ? "Chuyển đến thanh toán" 
              : "Xác nhận đặt lịch"}
          </Button>,
        ]}
      >
        <p>Bạn đã chắc chắn với thông tin đặt lịch này?</p>
        <p>
          Sau khi xác nhận, hệ thống sẽ gửi thông tin chi tiết qua email và SMS
          đến số điện thoại của bạn.
        </p>
        {form.getFieldValue("paymentMethod") === "vnpay" && (
          <p className="text-yellow-600 font-medium">
            Bạn sẽ được chuyển đến cổng thanh toán VNPay sau khi xác nhận.
          </p>
        )}
      </Modal>

      {/* Modal thành công */}
      <Modal
        title="Đặt lịch thành công"
        open={isSuccessModalVisible}
        onCancel={() => setIsSuccessModalVisible(false)}
        footer={null}
        centered
      >
        <div className="text-center py-4">
          <div className="text-4xl mb-4">
            <CheckCircleOutlined className="text-green-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {successType === "vnpay" ? "Thanh toán thành công!" : "Đặt lịch thành công!"}
          </h2>
          <p className="text-gray-600 mb-4">
            {successType === "vnpay"
              ? "Bạn đã thanh toán thành công qua VNPay. Vui lòng kiểm tra email để xem chi tiết."
              : "Chúng tôi đã nhận được thông tin đặt lịch của bạn. Vui lòng thanh toán tại cơ sở khi đến xét nghiệm."}
          </p>
          <Button type="primary" onClick={() => navigate("/dashboard")}>
            Về trang tổng quan
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default STIBooking;
