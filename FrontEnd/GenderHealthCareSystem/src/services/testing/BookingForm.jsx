// src/services/STIBooking/BookingForm.jsx
import React, { useEffect, useState } from "react";
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
  Space,
  Tabs,
  Pagination,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  DollarCircleOutlined,
  BankOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../components/provider/AuthProvider";
import vnpayLogo from "../../assets/vnpay.png";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkLimitTimeToBookAPI } from "../../components/api/BookingTesting.api";

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const BookingForm = ({
  form,
  singlePackages = [],
  comboPackages = [],
  workingHours,
  disabledDate,
  handlePackageSelect,
  formatPrice,
}) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(
    form.getFieldValue("paymentMethod") || ""
  );
  const [worrkingTime, setWorkingTime] = useState(workingHours || []);
  const [activePackageType, setActivePackageType] = useState("combo");

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Show 6 items per page (2 rows x 3 columns)

  // Calculate paginated packages
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedSinglePackages = singlePackages.slice(startIndex, endIndex);
  const paginatedComboPackages = comboPackages.slice(startIndex, endIndex);

  // Reset pagination when changing tab
  const handlePackageTypeChange = (activeKey) => {
    setActivePackageType(activeKey);
    setCurrentPage(1); // Reset to first page
    form.setFieldsValue({ package: undefined, packageDetails: undefined });
  };

  // Tự động điền thông tin người dùng từ context khi component được tạo
  useEffect(() => {
    form.setFieldsValue({
      fullName: user?.fullName,
      email: user?.email,
      phone: user?.phone,
      birthDate: user?.birthDate ? dayjs(user.birthDate) : null,
      gender: user?.gender,
    });
  }, [form, user]);

  const [disabledHours, setDisabledHours] = useState(new Set());
  const [isCheckingTimes, setIsCheckingTimes] = useState(false);

  const checkTime = async (date) => {
    if (!date) return;

    try {
      setIsCheckingTimes(true);
      const serviceId = form.getFieldValue("package");

      if (!serviceId) return;

      // Check tất cả thời gian song song
      const timeCheckPromises = workingHours.map(async (hour) => {
        const bookingDateTime = `${date.format("YYYY-MM-DD")}T${hour.value}:00.0000000`;

        try {
          const response = await checkLimitTimeToBookAPI(serviceId, bookingDateTime);
          return {
            time: hour.value,
            isDisabled: response.data?.data === true,
          };
        } catch (error) {
          return { time: hour.value, isDisabled: true };
        }
      });

      const results = await Promise.all(timeCheckPromises);

      const newDisabledHours = new Set();
      results.forEach((result) => {
        if (result.isDisabled) {
          newDisabledHours.add(result.time);
        }
      });

      setDisabledHours(newDisabledHours);
    } catch (error) {
      message.error("Lỗi khi kiểm tra thời gian");
    } finally {
      setIsCheckingTimes(false);
    }
  };

  // ✅ Reset disabled hours khi thay đổi service
  useEffect(() => {
    setDisabledHours(new Set());
  }, [form.getFieldValue("package")]);

  useEffect(() => {
    const serviceId = searchParams.get("serviceId");
    navigate(window.location.pathname, { replace: true });
    if (serviceId) {
      // Tự động chọn gói dịch vụ nếu có serviceId trong URL
      const selectedPackage = [...singlePackages, ...comboPackages].find(
        (pkg) =>
          pkg.serviceId === serviceId || pkg.serviceId === Number(serviceId)
      );

      if (selectedPackage) {
        // Set form values
        form.setFieldsValue({
          package: selectedPackage.serviceId,
          packageDetails: selectedPackage,
        });

        // Execute handlePackageSelect
        handlePackageSelect(selectedPackage);

        // Set active tab based on package type
        if (
          singlePackages.some(
            (pkg) => pkg.serviceId === selectedPackage.serviceId
          )
        ) {
          setActivePackageType("single");
        } else if (
          comboPackages.some(
            (pkg) => pkg.serviceId === selectedPackage.serviceId
          )
        ) {
          setActivePackageType("combo");
        }
      } else {
        // Package not found, reset
        form.setFieldsValue({ package: undefined, packageDetails: undefined });
      }
    }
  }, [searchParams, singlePackages, comboPackages, handlePackageSelect, form]);

  // Render a package card with enhanced styling for grid
  const renderPackageCardForGrid = (pkg) => {
    // Make sure to compare with same type (string or number)
    const formPackageId = form.getFieldValue("package");
    const isSelected =
      formPackageId !== undefined &&
      (formPackageId === pkg.serviceId ||
        formPackageId === pkg.serviceId.toString());
    
    // Tính toán giá giảm nếu có discount
    const hasDiscount = pkg.discount > 0;
    const discountedPrice = hasDiscount ? 
      Math.round(pkg.price * (1 - pkg.discount / 100)) : 
      pkg.price;

    return (
      <div
        className={`h-full border rounded-md p-4 hover:border-[#0099CF] cursor-pointer transition-all ${
          isSelected ? "border-[#0099CF] border-2 shadow-md" : "border-gray-200"
        }`}
        onClick={() => handlePackageSelect(pkg)}
      >
        {/* Thêm badge hiển thị discount nếu có */}
        {hasDiscount && (
          <div className="absolute top-0 right-0 bg-[#0099CF] text-white text-xs px-2 py-1 rounded-tr-md rounded-bl-md font-semibold">
            -{pkg.discount}%
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <MedicineBoxOutlined className="text-[#0099CF]" />
          <div className="font-bold text-base">{pkg.serviceName}</div>
          {isSelected && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center ml-auto">
              <CheckCircleOutlined className="mr-1" /> Đã chọn
            </span>
          )}
        </div>

        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {pkg.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {pkg.tests &&
            pkg.tests.slice(0, 3).map((test, index) => (
              <div
                key={index}
                className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
              >
                {test}
              </div>
            ))}
          {pkg.tests && pkg.tests.length > 3 && (
            <div className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              +{pkg.tests.length - 3}
            </div>
          )}
        </div>

        <div className="text-gray-600 text-xs mb-3">
          <span className="text-gray-500">Thời gian có kết quả:</span>{" "}
          {pkg.duration}
        </div>

        <div className="flex justify-between items-end mt-auto pt-2 border-t border-gray-100">
          <div>
            {/* Hiển thị giá sau khi giảm */}
            <div className="text-base font-bold text-[#0099CF]">
              {formatPrice(discountedPrice)}
            </div>
            
            {/* Hiển thị giá gốc nếu có giảm giá */}
            {hasDiscount && (
              <div className="line-through text-xs text-gray-500">
                {formatPrice(pkg.price)}
              </div>
            )}
          </div>

          {!isSelected ? (
            <button
              className="bg-[#0099CF] text-white text-sm px-3 py-1 rounded hover:bg-[#007BA7] transition"
              onClick={(e) => {
                e.stopPropagation();
                handlePackageSelect(pkg);
              }}
            >
              Chọn
            </button>
          ) : (
            <div className="text-green-600 font-medium text-xs flex items-center">
              <CheckCircleOutlined className="mr-1" /> Đã chọn
            </div>
          )}
        </div>
      </div>
    );
  };

  // Theo dõi thay đổi phương thức thanh toán
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);

    // Reset trường onlinePaymentMethod khi người dùng chuyển về thanh toán tiền mặt
    if (e.target.value !== "online") {
      form.setFieldsValue({ onlinePaymentMethod: undefined }); // Đúng với tên field mới
    }
  };

  return (
    <div>
      <Divider />

      {/* Chọn gói xét nghiệm */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Chọn gói xét nghiệm</h3>

        <Tabs
          activeKey={activePackageType}
          onChange={handlePackageTypeChange}
          className="mb-4"
        >
          {/* Đổi vị trí tab combo và single */}
          <TabPane
            tab={<span>Gói combo tiết kiệm ({comboPackages.length})</span>}
            key="combo"
          >
            <div className="mb-4">
              <Text type="secondary">
                Gói xét nghiệm nhiều bệnh kết hợp, tiết kiệm chi phí và thời
                gian so với xét nghiệm riêng lẻ.
              </Text>
            </div>
          </TabPane>

          <TabPane
            tab={<span>Dịch vụ đơn lẻ ({singlePackages.length})</span>}
            key="single"
          >
            <div className="mb-4">
              <Text type="secondary">
                Dịch vụ xét nghiệm từng bệnh riêng biệt, phù hợp nếu bạn chỉ cần
                xét nghiệm một loại bệnh cụ thể.
              </Text>
            </div>
          </TabPane>
        </Tabs>

        <Form.Item
          name="package"
          rules={[{ required: true, message: "Vui lòng chọn gói xét nghiệm!" }]}
        >
          <div>
            {activePackageType === "combo" && comboPackages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedComboPackages.map((pkg) => (
                    <div key={pkg.serviceId} className="h-full">
                      {renderPackageCardForGrid(pkg)}
                    </div>
                  ))}
                </div>

                {/* Pagination for combo packages */}
                {comboPackages.length > pageSize && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      current={currentPage}
                      total={comboPackages.length}
                      pageSize={pageSize}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            ) : activePackageType === "combo" ? (
              <div className="text-center py-6 bg-gray-50 rounded">
                <Text type="secondary">Không có gói combo nào hiện có</Text>
              </div>
            ) : null}

            {/* Single Packages Grid */}
            {activePackageType === "single" && singlePackages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedSinglePackages.map((pkg) => (
                    <div key={pkg.serviceId} className="h-full">
                      {renderPackageCardForGrid(pkg)}
                    </div>
                  ))}
                </div>
                {singlePackages.length > pageSize && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      current={currentPage}
                      total={singlePackages.length}
                      pageSize={pageSize}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            ) : activePackageType === "single" ? (
              <div className="text-center py-6 bg-gray-50 rounded">
                <Text type="secondary">
                  Không có dịch vụ đơn lẻ nào hiện có
                </Text>
              </div>
            ) : null}
          </div>
        </Form.Item>

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
                onChange={(date) => {
                  checkTime(date);
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="appointmentTime"
              label="Giờ xét nghiệm"
              rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
            >
              <Select
                placeholder="Chọn giờ xét nghiệm"
                loading={isCheckingTimes}
              >
                {workingHours.map((hour) => (
                  <Option
                    key={hour.value}
                    value={hour.value}
                    disabled={disabledHours.has(hour.value)} // ✅ Sử dụng Set
                  >
                    {hour.label}
                    {disabledHours.has(hour.value) && (
                      <span className="text-red-500 ml-2">(Đã đầy)</span>
                    )}
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
        <h3 className="text-lg font-medium mb-4">
          Thông tin bổ sung (không bắt buộc)
        </h3>
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
        <h3 className="text-lg font-medium mb-4">
          Chọn phương thức thanh toán
        </h3>
        <Form.Item
          name="paymentMethod"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn phương thức thanh toán!",
            },
          ]}
        >
          <Radio.Group
            className="w-full"
            onChange={handlePaymentMethodChange}
            value={paymentMethod}
          >
            <Space direction="vertical" className="w-full">
              <Card
                className={`w-full cursor-pointer hover:border-blue-500 mb-2 p-[16px] ${
                  paymentMethod === "cash" ? "border-blue-500" : ""
                }`}
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
                className={`w-full cursor-pointer hover:border-blue-500 p-[16px] ${
                  paymentMethod === "online" ? "border-blue-500" : ""
                }`}
              >
                <Radio value="online" className="w-full">
                  <div className="flex items-center">
                    <BankOutlined className="mr-2 text-lg text-blue-600" />
                    <div>
                      <div className="font-medium">Thanh toán trực tuyến</div>
                      <div className="text-gray-500 text-sm">
                        Thanh toán bằng ATM/Visa/MasterCard/QR Code
                      </div>
                    </div>
                  </div>
                </Radio>
              </Card>

              {/* Dropdown cho phương thức thanh toán trực tuyến */}
              {paymentMethod === "online" && (
                <div className="pl-7 mt-2">
                  <Form.Item
                    name="onlinePaymentMethod" // Đổi từ "paymentMethod" thành "onlinePaymentMethod"
                    rules={[
                      {
                        required: paymentMethod === "online",
                        message: "Vui lòng chọn cổng thanh toán!",
                      },
                    ]}
                    className="mb-0"
                  >
                    <Radio.Group className="w-full">
                      <Space direction="vertical" className="w-full">
                        <Card
                          className="w-full cursor-pointer hover:border-blue-500 p-[12px]"
                          size="small"
                          bodyStyle={{ padding: "12px" }}
                        >
                          <Radio value="vnpay" className="w-full">
                            <div className="flex items-center">
                              <div className="mr-2 flex items-center">
                                <img
                                  src={vnpayLogo}
                                  alt="VNPAY"
                                  className="h-6"
                                />
                              </div>
                              <div>
                                <div className="font-medium">VNPAY</div>
                                <div className="text-gray-500 text-sm">
                                  Thẻ ATM/Internet Banking/QR Code
                                </div>
                              </div>
                            </div>
                          </Radio>
                        </Card>

                        <Card
                          className="w-full cursor-pointer hover:border-blue-500 p-[12px]"
                          size="small"
                          bodyStyle={{ padding: "12px" }}
                        >
                          <Radio value="paypal" className="w-full">
                            <div className="flex items-center">
                              <div className="mr-2 flex items-center">
                                <img
                                  src="/images/payment/paypal-logo.png"
                                  alt="PayPal"
                                  className="h-6"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg";
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">PayPal</div>
                                <div className="text-gray-500 text-sm">
                                  Thẻ tín dụng quốc tế/Tài khoản PayPal
                                </div>
                              </div>
                            </div>
                          </Radio>
                        </Card>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}
            </Space>
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};

export default BookingForm;
