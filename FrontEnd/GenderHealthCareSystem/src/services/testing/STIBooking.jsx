import React, { useState, useEffect, use } from "react";
import {
  Button,
  Steps,
  Form,
  message,
  Modal,
  Result,
  Typography,
  Spin,
} from "antd";
import {
  MedicineBoxOutlined,
  CheckOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/provider/AuthProvider";
import BookingForm from "./BookingForm";
import ConfirmBooking from "./ConfirmBooking";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const STIBooking = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  // Thêm các state để lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    package: null,
    appointmentDate: null,
    appointmentTime: null,
    paymentMethod: null,
    notes: ""
  });

  // Các bước đặt lịch
  const steps = [
    {
      title: "Chọn gói & thông tin",
      icon: <MedicineBoxOutlined />,
    },
    {
      title: "Xác nhận & thanh toán",
      icon: <CheckOutlined />,
    },
  ];

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Thông tin khách hàng
  const userInfo = {
    fullName: user?.fullName,
    phone: user?.phone,
    email: user?.email,
    birthDate: dayjs(user.birthDate),
    gender: user?.gender,
  };

  // Danh sách gói dịch vụ
  const testingPackages = [
    {
      id: 1,
      name: "Gói xét nghiệm STI cơ bản",
      serviceName: "Gói xét nghiệm STI cơ bản",
      description:
        "Kiểm tra các bệnh lây nhiễm qua đường tình dục phổ biến nhất.",
      price: 899000,
      originalPrice: 1200000,
      tests: [
        "Chlamydia",
        "Gonorrhea",
        "HIV",
        "Syphilis",
        "Hepatitis B",
        "Hepatitis C",
      ],
      duration: "2-3 ngày làm việc",
    },
    {
      id: 2,
      name: "Gói xét nghiệm STI toàn diện",
      serviceName: "Gói xét nghiệm STI toàn diện",
      description:
        "Kiểm tra toàn diện các bệnh lây nhiễm qua đường tình dục, bao gồm cả các loại ít phổ biến hơn.",
      price: 1599000,
      originalPrice: 1800000,
      tests: [
        "Chlamydia",
        "Gonorrhea",
        "HIV",
        "Syphilis",
        "Hepatitis B",
        "Hepatitis C",
        "HPV",
        "Herpes",
        "Mycoplasma",
        "Trichomonas",
      ],
      duration: "3-5 ngày làm việc",
    },
  ];

  // Khung giờ làm việc
  const workingHours = [
    { value: "08:00 - 08:30", label: "08:00 - 08:30" },
    { value: "08:30 - 09:00", label: "08:30 - 09:00" },
    { value: "09:00 - 09:30", label: "09:00 - 09:30" },
    { value: "09:30 - 10:00", label: "09:30 - 10:00" },
    { value: "10:00 - 10:30", label: "10:00 - 10:30" },
    { value: "10:30 - 11:00", label: "10:30 - 11:00" },
    { value: "13:30 - 14:00", label: "13:30 - 14:00" },
    { value: "14:00 - 14:30", label: "14:00 - 14:30" },
    { value: "14:30 - 15:00", label: "14:30 - 15:00" },
    { value: "15:00 - 15:30", label: "15:00 - 15:30" },
    { value: "15:30 - 16:00", label: "15:30 - 16:00" },
    { value: "16:00 - 16:30", label: "16:00 - 16:30" },
    { value: "16:30 - 17:00", label: "16:30 - 17:00" },
  ];

  // Disable các ngày trong quá khứ và cuối tuần
  const disabledDate = (current) => {
    // Không cho chọn ngày trong quá khứ và ngày hiện tại
    if (current && current < dayjs().endOf("day")) {
      return true;
    }

    // Không cho chọn ngày cuối tuần
    return current && (current.day() === 0 || current.day() === 6);
  };

  // Xử lý chọn gói dịch vụ
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    form.setFieldsValue({
      package: pkg.id,
      packageName: pkg.name,
      packagePrice: pkg.price,
      packageDetails: JSON.stringify(pkg), // Lưu thông tin chi tiết của gói
    });
    setTotalPrice(parseInt(pkg.price));
  };

  // Chuyển sang bước tiếp theo
  const nextStep = () => {
    form
      .validateFields()
      .then((values) => {
        // Lưu lại giá trị trong form
        setFormData({
          ...formData,
          ...values,
        });

        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
        message.error("Vui lòng điền đầy đủ thông tin cần thiết");
      });
  };

  // Quay lại bước trước
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý submit form - Đặt lịch
  const handleBooking = async () => {
    try {
      // Kết hợp dữ liệu đã lưu với dữ liệu hiện tại
      const currentValues = form.getFieldsValue(true);
      const allValues = { ...formData, ...currentValues };

      console.log("All form data:", allValues);

      setIsSubmitting(true);

      // Data chuẩn bị gửi cho API
      const bookingData = {
        packageId: allValues.package,
        appointmentDate: allValues.appointmentDate.format("YYYY-MM-DD"),
        appointmentTime: allValues.appointmentTime,
        paymentMethod: allValues.paymentMethod,
        medicalHistory: allValues.medicalHistory || "",
        notes: allValues.notes || "",
        userId: user?.id || 0, // Thêm ? để tránh lỗi nếu user là null
      };

      console.log("Dữ liệu đặt lịch:", bookingData);

      // Mô phỏng API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (allValues.paymentMethod === "cash") {
        // Nếu thanh toán tiền mặt, đặt lịch thành công ngay lập tức
        setIsConfirmModalOpen(false);
        setBookingSuccess(true);
      } else if (allValues.paymentMethod === "vnpay") {
        // Nếu thanh toán VNPay, chuyển đến hàm xử lý thanh toán
        await handleVNPayPayment(bookingData);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      message.error("Có lỗi xảy ra khi đặt lịch, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý thanh toán VNPay
  const handleVNPayPayment = async (bookingData) => {
    try {
      console.log("Gọi API thanh toán VNPay với dữ liệu:", bookingData);

      // Mô phỏng API call VNPay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mô phỏng trả về URL thanh toán từ API
      const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${
        totalPrice * 100
      }&vnp_TxnRef=STI${Date.now()}&vnp_OrderInfo=Thanh+toan+xet+nghiem+STI`;

      setPaymentUrl(paymentUrl);
      setIsConfirmModalOpen(false);

      // Trong môi trường thực tế, chúng ta sẽ chuyển hướng đến URL thanh toán
      // window.location.href = paymentUrl;

      // Mô phỏng thanh toán thành công
      message.success("Đang chuyển hướng đến trang thanh toán VNPay...");

      // Giả lập thanh toán thành công sau 3 giây
      setTimeout(() => {
        setBookingSuccess(true);
      }, 3000);
    } catch (error) {
      console.error("Error processing VNPay payment:", error);
      message.error("Có lỗi xảy ra khi xử lý thanh toán, vui lòng thử lại.");
    }
  };

  // Xử lý hủy xác nhận
  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  };

  // Render nội dung của từng bước
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

  // Render nút điều hướng
  const renderNavigationButtons = () => {
    return (
      <div className="flex justify-between pt-6 border-t">
        <Button onClick={prevStep} disabled={currentStep === 0} size="large">
          Quay lại
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button type="primary" onClick={nextStep} size="large">
            Tiếp tục
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => setIsConfirmModalOpen(true)}
            size="large"
            className="bg-green-600 hover:bg-green-700"
          >
            Xác nhận đặt lịch và thanh toán
          </Button>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (bookingSuccess) {
      navigate("/booking-result");
    }
  }, [bookingSuccess]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <Title level={2} className="mb-2">
          Đặt lịch xét nghiệm STI
        </Title>
        <Text className="text-gray-500">
          Giữ gìn sức khỏe tình dục bằng việc kiểm tra định kỳ các bệnh lây
          nhiễm qua đường tình dục
        </Text>
      </div>

      {/* Stepper */}
      <div className="mb-10">
        <Steps
          current={currentStep}
          items={steps.map((step) => ({
            title: step.title,
            icon: step.icon,
          }))}
        />
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <Form
          form={form}
          layout="vertical"
          size="large"
          initialValues={{
            fullName: user?.fullName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            gender: user?.gender || "male",
            birthDate: user?.birthDate ? dayjs(user.birthDate) : null,
          }}
        >
          {renderStepContent()}
          {renderNavigationButtons()}
        </Form>

      </div>

      {/* Modal xác nhận đặt lịch */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Xác nhận đặt lịch xét nghiệm
          </div>
        }
        open={isConfirmModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className="py-2">
          <p className="mb-4">
            Bạn xác nhận đặt lịch xét nghiệm STI với thông tin đã cung cấp?
          </p>

          <div className="flex items-center p-3 bg-blue-50 rounded mb-6">
            <div className="mr-3 text-blue-500">
              <CheckOutlined className="text-lg" />
            </div>
            <div>
              <p className="font-medium mb-0">
                Phương thức thanh toán:{" "}
                <span className="font-bold">
                  {form.getFieldValue("paymentMethod") === "cash"
                    ? "Tiền mặt tại cơ sở"
                    : "Thanh toán qua VNPay"}
                </span>
              </p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4 flex justify-end gap-3">
            <Button size="large" onClick={handleCancel} disabled={isSubmitting}>
              Quay lại chỉnh sửa
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleBooking}
              loading={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal thanh toán VNPay - Trong thực tế sẽ redirect đến trang VNPay */}
      {paymentUrl && (
        <Modal
          title="Đang chuyển hướng đến cổng thanh toán"
          open={paymentUrl !== ""}
          footer={null}
          closable={false}
          centered
        >
          <div className="text-center py-6">
            <Spin size="large" />
            <div className="mt-4">
              <p>Đang chuyển hướng đến cổng thanh toán VNPay...</p>
              <p className="text-gray-500 text-sm mt-2">
                Vui lòng không đóng trình duyệt trong quá trình thanh toán
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default STIBooking;
