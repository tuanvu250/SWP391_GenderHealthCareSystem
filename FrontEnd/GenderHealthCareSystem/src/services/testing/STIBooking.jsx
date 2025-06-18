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
import { MedicineBoxOutlined, CheckOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/provider/AuthProvider";
import BookingForm from "./BookingForm";
import ConfirmBooking from "./ConfirmBooking";
import dayjs from "dayjs";
import { bookStisAPI } from "../../components/utils/api";
import { paymentAPI } from "../../components/utils/api";
import { getSTISPackagesAPI } from "../../components/utils/api";

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
  const [testingPackages, setTestingPackages] = useState([]);
  const [cashPayment, setCashPayment] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getSTISPackagesAPI();
        if (response && response.data) {
          // Assuming response.data is an array of packages
          const packages = response.data.data.map((pkg) => ({
            id: pkg.serviceId,
            name: pkg.serviceName,
            price: pkg.price,
            tests: pkg.tests.split(", "),
            duration: pkg.duration,
            description: pkg.description,
          }));
          setTestingPackages(packages);
        } else {
          console.error("No data found for testing packages");
        }
      } catch (error) {
        console.error("Error fetching testing packages:", error);
        message.error("Không thể tải gói xét nghiệm. Vui lòng thử lại sau.");
      }
    };
    fetchPackages();
  }, []);

  // Thêm các state để lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    package: null,
    appointmentDate: null,
    appointmentTime: null,
    paymentMethod: null,
    notes: "",
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
    id: user?.id,
    fullName: user?.fullName,
    phone: user?.phone,
    email: user?.email,
    birthDate: dayjs(user.birthDate),
    gender: user?.gender,
  };

  // Khung giờ làm việc
  const workingHours = [
    { value: "08:00", label: "08:00 - 09:00" },
    { value: "09:00", label: "09:00 - 10:00" },
    { value: "10:00", label: "10:00 - 11:00" },
    { value: "13:00", label: "13:00 - 14:00" },
    { value: "14:00", label: "14:00 - 15:00" },
    { value: "15:00", label: "15:00 - 16:00" },
    { value: "16:00", label: "16:00 - 17:00" },
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

      setIsSubmitting(true);

      // Data chuẩn bị gửi cho API
      const bookingData = {
        packageId: allValues.package,
        appointmentDate: allValues.appointmentDate.format("YYYY-MM-DD"),
        appointmentTime: allValues.appointmentTime,
        paymentMethod: allValues.paymentMethod,
        notes: allValues.notes,
      };

      //console.log("Dữ liệu đặt lịch:", bookingData);

      console.log(">>> Submitting booking data:", allValues.paymentMethod);

      // Mô phỏng API call
      const response = await bookStisAPI(bookingData);

      if (allValues.paymentMethod === "cash") {
        // Nếu thanh toán tiền mặt, đặt lịch thành công ngay lập tức
        setIsConfirmModalOpen(false);
        setCashPayment(true);
      } else if (allValues.paymentMethod === "credit card") {
        await handlePayment(response.data.data.bookingId);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      message.error("Có lỗi xảy ra khi đặt lịch, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (bookingID) => {
    try {
      const response = await paymentAPI(
        totalPrice,
        "Đặt lịch xét nghiệm STI",
        bookingID
      );

      localStorage.setItem("bookingID", bookingID);
      localStorage.setItem("amount", totalPrice);
      localStorage.setItem("orderInfo", "Đặt lịch xét nghiệm STI");

      setIsConfirmModalOpen(false);

      // Mô phỏng thanh toán thành công
      message.success("Đang chuyển hướng đến trang thanh toán ...");

      // Giả lập thanh toán thành công sau 3 giây
      setTimeout(() => {
        window.location.href = response.data;
      }, 3000);
    } catch (error) {
      console.error("Error processing payment:", error);
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
                    : "Thanh toán qua ngân hàng"}
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
              <p>Đang chuyển hướng đến cổng thanh toán...</p>
              <p className="text-gray-500 text-sm mt-2">
                Vui lòng không đóng trình duyệt trong quá trình thanh toán
              </p>
            </div>
          </div>
        </Modal>
      )}

      {cashPayment && (
        <Modal
          open={cashPayment}
          footer={null}
          closable={false}
          centered>
          <Result
            status="success"
            title="Đặt lịch thành công!"
            subTitle="Cảm ơn bạn đã đặt lịch xét nghiệm STI. Chúng tôi sẽ liên hệ với bạn sớm nhất."
            extra={[
              <Button
                key="history"
                onClick={() => navigate("/user/history-testing")}
              >
                Xem lịch sử xét nghiệm
              </Button>,
              <Button type="primary" key="home" onClick={() => navigate("/")}>
                Về trang chủ
              </Button>,
            ]}
          />
        </Modal>
      )}
    </div>
  );
};

export default STIBooking;
