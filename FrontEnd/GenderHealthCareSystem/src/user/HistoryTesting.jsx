import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Tooltip,
  Empty,
  Modal,
  Spin,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../components/provider/AuthProvider";
import { historyBookingAPI } from "../components/utils/api";
import { paymentAPI } from "../components/utils/api";
import { cancelBookingAPI } from "../components/utils/api";

const { Title, Text } = Typography;

const HistoryTesting = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(false);
  const [viewResult, setViewResult] = useState(false);
  const [viewDetail, setViewDetail] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Fetch booking history
  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const response = await historyBookingAPI({
        page: pagination.current - 1,
        size: pagination.pageSize,
        status: "",
        sort: "",
      });
      setPagination({
        ...pagination,
        total: response.data.data.totalElements,
      });
      const data = response.data.data.content.map((item) => ({
        ...item,
        id: item.bookingId,
        serviceName: item.serviceName,
        price: item.servicePrice,
        bookingDate: dayjs(item.updatedAt).format("DD/MM/YYYY"),
        appointmentDate: dayjs(item.bookingDate).format("DD/MM/YYYY"),
        appointmentTime: `${item.bookingTimeStart} - ${item.bookingTimeEnd}`,
        notes: item.notem,
        paymentStatus: item.paymentStatus,
        status: item.status,
        testingStatus: item.status,
        paymentMethod: item.paymentMethod,
      }));

      console.log("Booking history data:", data);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      message.error("Không thể tải lịch sử đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, [pagination.current]);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Xử lý thanh toán
  const handlePayment = async (bookingId, totalPrice) => {
    try {
      const response = await paymentAPI(
        totalPrice,
        "Đặt lịch xét nghiệm STI",
        bookingId
      );

      localStorage.setItem("bookingID", bookingId);
      localStorage.setItem("amount", totalPrice);
      localStorage.setItem("orderInfo", "Đặt lịch xét nghiệm STI");

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

  const handleCancel = async (bookingId) => {
    try {
      await cancelBookingAPI(bookingId);
      // Giả lập hủy thành công sau 2 giây
      setTimeout(() => {
        fetchBookingHistory();
        message.success("Đã hủy đặt lịch thành công!");
      }, 200);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error("Có lỗi xảy ra khi hủy đặt lịch, vui lòng thử lại.");
    }
  };

  // Xử lý xem hóa đơn
  const handleViewReceipt = (record) => {
    setSelectedBooking(record);
    setViewReceipt(true);
  };

  // Xử lý xem kết quả xét nghiệm
  const handleViewResult = (record) => {
    setSelectedBooking(record);
    setViewResult(true);
  };

  const handleViewDetail = (record) => {
    setSelectedBooking(record);
    setViewDetail(true);
  };

  // Render trạng thái đặt lịch
  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Đang xử lý
          </Tag>
        );
      case "COMPLETED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Hoàn thành
          </Tag>
        );
      case "CANCELLED":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Đã hủy
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // Render trạng thái thanh toán
  const renderPaymentStatus = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã thanh toán
          </Tag>
        );
      case "UNPAID":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Chưa thanh toán
          </Tag>
        );
      default:
        return <Tag color="default">Chưa thanh toán</Tag>;
    }
  };

  // Render trạng thái xét nghiệm
  const renderTestingStatus = (testingStatus) => {
    switch (testingStatus) {
      case "not_started":
        return <Tag color="default">Chưa xét nghiệm</Tag>;
      case "in_progress":
        return <Tag color="processing">Đang xử lý</Tag>;
      case "completed":
        return <Tag color="success">Đã có kết quả</Tag>;
      default:
        return <Tag color="default">{testingStatus}</Tag>;
    }
  };

  // Render phương thức thanh toán
  const renderPaymentMethod = (method) => {
    switch (method) {
      case "credit card":
        return (
          <span>
            <CreditCardOutlined /> Ngân hàng
          </span>
        );
      case "cash":
        return (
          <span>
            <DollarOutlined /> Tiền mặt
          </span>
        );
      default:
        return method;
    }
  };

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text) => (
        <span className="font-medium flex items-center">{text}</span>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-medium">{formatPrice(price)}</span>
      ),
    },
    {
      title: "Ngày giờ hẹn",
      key: "appointment",
      render: (_, record) => (
        <span>
          {record.appointmentDate}
          <br />
          <span className="text-gray-500">{record.appointmentTime}</span>
        </span>
      ),
      sorter: (a, b) =>
        new Date(a.appointmentDate) - new Date(b.appointmentDate),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {renderStatus(record.status)}
          {renderTestingStatus(record.testingStatus)}
          {renderPaymentStatus(record.paymentStatus)}
        </Space>
      ),
      filters: [
        { text: "Đã đặt lịch", value: "booked" },
        { text: "Đang xử lý", value: "in_progress" },
        { text: "Hoàn thành", value: "completed" },
        { text: "Đã hủy", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thanh toán",
      key: "payment",
      render: (_, record) => (
        <div>
          <div>{renderPaymentMethod(record.paymentMethod)}</div>
          <div className="mt-1">
            {record.paymentMethod === "credit card" &&
              record.paymentStatus === "UNPAID" && (
                <Button
                  type="primary"
                  size="small"
                  icon={<CreditCardOutlined />}
                  onClick={() => {
                    setSelectedBooking(record);
                    handlePayment(record.id, record.price);
                  }}
                >
                  Thanh toán
                </Button>
              )}

            {record.paymentStatus === "PAID" && (
              <Button
                type="default"
                size="small"
                icon={<FileDoneOutlined />}
                onClick={() => handleViewReceipt(record)}
              >
                Xem hóa đơn
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<InfoCircleOutlined />}
              type="text"
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>

          {record.testingStatus === "completed" && (
            <Tooltip title="Xem kết quả xét nghiệm">
              <Button
                type="text"
                ghost
                onClick={() => handleViewResult(record)}
              >
                Xem kết quả
              </Button>
            </Tooltip>
          )}

          {record.status !== "CANCELLED" && (
            <Tooltip title="Hủy đặt lịch">
              <Button
                size="large"
                type="text"
                danger
                onClick={() => handleCancel(record.id)}
              >
                Hủy
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Modal xem chi tiết
  const renderDetailModal = () => (
    <Modal
      title={<span className="text-lg">Chi tiết đặt lịch</span>}
      open={viewDetail}
      footer={[
        <Button key="back" onClick={() => setViewDetail(false)}>
          Đóng
        </Button>,
      ]}
      onCancel={() => setViewDetail(false)}
      width={600}
    >
      {selectedBooking && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <div>
              <Text type="secondary">Mã đặt lịch</Text>
              <div className="text-lg font-medium">{selectedBooking.id}</div>
            </div>
            <div>{renderStatus(selectedBooking.status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text type="secondary">Dịch vụ</Text>
              <div className="font-medium">{selectedBooking.serviceName}</div>
            </div>
            <div>
              <Text type="secondary">Giá</Text>
              <div className="font-medium">
                {formatPrice(selectedBooking.price)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text type="secondary">Ngày đặt lịch</Text>
              <div>{selectedBooking.bookingDate}</div>
            </div>
            <div>
              <Text type="secondary">Thời gian đặt</Text>
              <div>{dayjs(selectedBooking.createdAt).format("HH:mm")}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text type="secondary">Ngày hẹn</Text>
              <div>{selectedBooking.appointmentDate}</div>
            </div>
            <div>
              <Text type="secondary">Giờ hẹn</Text>
              <div>{selectedBooking.appointmentTime}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text type="secondary">Phương thức thanh toán</Text>
              <div>{renderPaymentMethod(selectedBooking.paymentMethod)}</div>
            </div>
            <div>
              <Text type="secondary">Trạng thái thanh toán</Text>
              <div>{renderPaymentStatus(selectedBooking.paymentStatus)}</div>
            </div>
          </div>

          <div>
            <Text type="secondary">Trạng thái xét nghiệm</Text>
            <div>{renderTestingStatus(selectedBooking.testingStatus)}</div>
          </div>

          {selectedBooking.notes && (
            <div>
              <Text type="secondary">Ghi chú</Text>
              <div className="p-2 bg-gray-50 rounded">
                {selectedBooking.notes}
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-between">
            {selectedBooking.paymentMethod === "credit card" &&
              selectedBooking.paymentStatus === "pending" && (
                <Button
                  type="primary"
                  icon={<CreditCardOutlined />}
                  onClick={() => handlePayment(selectedBooking.id)}
                >
                  Thanh toán ngay
                </Button>
              )}

            {selectedBooking.paymentStatus === "paid" && (
              <Button
                icon={<FileDoneOutlined />}
                onClick={() => setViewReceipt(true)}
              >
                Xem hóa đơn
              </Button>
            )}

            {selectedBooking.testingStatus === "completed" && (
              <Button
                type="primary"
                icon={<FileSearchOutlined />}
                onClick={() => setViewResult(true)}
              >
                Xem kết quả xét nghiệm
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );

  // Modal xem hóa đơn
  const renderReceiptModal = () => (
    <Modal
      title={<span className="text-lg">Hóa đơn thanh toán</span>}
      open={viewReceipt}
      footer={[
        <Button key="print" type="primary" icon={<FileDoneOutlined />}>
          In hóa đơn
        </Button>,
        <Button key="back" onClick={() => setViewReceipt(false)}>
          Đóng
        </Button>,
      ]}
      onCancel={() => setViewReceipt(false)}
      width={500}
    >
      {selectedBooking && (
        <div className="space-y-4">
          <div className="text-center pb-4 border-b">
            <Title level={4} className="mb-1">
              GENDER HEALTHCARE CENTER
            </Title>
            <div className="text-gray-500 text-sm">
              227 Nguyễn Văn Cừ, Quận 5, TP.HCM
            </div>
            <div className="text-gray-500 text-sm">Hotline: 028 3835 9033</div>
          </div>

          <div className="text-center">
            <Title level={4} className="my-2">
              HÓA ĐƠN THANH TOÁN
            </Title>
            <div className="text-gray-500">
              Ngày: {selectedBooking.bookingDate}
            </div>
          </div>

          <div className="pb-3 border-b">
            <div className="flex justify-between">
              <div className="text-gray-500">Mã hoá đơn:</div>
              <div className="font-medium">INV-{selectedBooking.id}</div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-gray-500">Khách hàng:</div>
              <div className="font-medium">
                {user?.fullName || "Khách hàng"}
              </div>
            </div>
          </div>

          <div className="space-y-2 pb-3 border-b">
            <div className="font-medium">Chi tiết dịch vụ:</div>
            <div className="flex justify-between border-b pb-2">
              <div>{selectedBooking.serviceName}</div>
              <div className="font-medium">
                {formatPrice(selectedBooking.price)}
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg pt-2">
              <div>Tổng tiền:</div>
              <div className="text-[#0099CF]">
                {formatPrice(selectedBooking.price)}
              </div>
            </div>
          </div>

          <div className="space-y-2 pb-3">
            <div className="flex justify-between">
              <div className="text-gray-500">Phương thức thanh toán:</div>
              <div>{renderPaymentMethod(selectedBooking.paymentMethod)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">Trạng thái:</div>
              <div className="text-green-600 font-medium">Đã thanh toán</div>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">Thời gian thanh toán:</div>
              <div>
                {dayjs(selectedBooking.createdAt).format("HH:mm:ss DD/MM/YYYY")}
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm pt-4 border-t">
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Mọi thắc mắc vui lòng liên hệ: support@genderhealthcare.vn</p>
          </div>
        </div>
      )}
    </Modal>
  );

  // Modal xem kết quả xét nghiệm
  const renderTestResultModal = () => (
    <Modal
      title={<span className="text-lg">Kết quả xét nghiệm</span>}
      open={viewResult}
      footer={[
        <Button key="download" type="primary" icon={<FileDoneOutlined />}>
          Tải kết quả
        </Button>,
        <Button key="back" onClick={() => setViewResult(false)}>
          Đóng
        </Button>,
      ]}
      onCancel={() => setViewResult(false)}
      width={700}
    >
      {selectedBooking && (
        <div className="space-y-4">
          <div className="text-center pb-4 border-b">
            <Title level={4} className="mb-1">
              GENDER HEALTHCARE CENTER
            </Title>
            <div className="text-gray-500 text-sm">
              PHIẾU KẾT QUẢ XÉT NGHIỆM
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Text type="secondary">Họ và tên:</Text>
              <div className="font-medium">
                {user?.fullName || "Khách hàng"}
              </div>
            </div>
            <div>
              <Text type="secondary">Mã xét nghiệm:</Text>
              <div className="font-medium">{selectedBooking.id}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <Text type="secondary">Ngày xét nghiệm:</Text>
              <div>
                {dayjs(selectedBooking.appointmentDate).format("DD/MM/YYYY")}
              </div>
            </div>
            <div>
              <Text type="secondary">Ngày trả kết quả:</Text>
              <div>
                {dayjs(selectedBooking.appointmentDate)
                  .add(2, "day")
                  .format("DD/MM/YYYY")}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Title level={5}>Kết quả chi tiết</Title>
            <Table
              size="small"
              pagination={false}
              dataSource={[
                {
                  test: "HIV 1/2 Ab/Ag",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
                {
                  test: "Giang mai (Syphilis RPR)",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
                {
                  test: "Chlamydia trachomatis",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
                {
                  test: "Neisseria gonorrhoeae",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
                {
                  test: "Vi khuẩn Trichomonas",
                  result: "Âm tính",
                  unit: "",
                  reference: "Âm tính",
                  note: "",
                },
              ]}
              columns={[
                {
                  title: "Xét nghiệm",
                  dataIndex: "test",
                  key: "test",
                  width: "30%",
                },
                {
                  title: "Kết quả",
                  dataIndex: "result",
                  key: "result",
                  width: "20%",
                  render: (text) => <span className="font-medium">{text}</span>,
                },
                {
                  title: "Đơn vị",
                  dataIndex: "unit",
                  key: "unit",
                  width: "10%",
                },
                {
                  title: "Giá trị tham chiếu",
                  dataIndex: "reference",
                  key: "reference",
                  width: "20%",
                },
                {
                  title: "Ghi chú",
                  dataIndex: "note",
                  key: "note",
                  width: "20%",
                },
              ]}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="font-medium">Kết luận:</div>
            <div className="p-2 bg-gray-50 rounded mt-2">
              <p className="font-medium">
                Không phát hiện bệnh lây truyền qua đường tình dục.
              </p>
              <p>Khuyến nghị tái khám định kỳ 6 tháng/lần.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 pt-4">
            <div></div>
            <div className="text-center">
              <div>Bác sĩ kết luận</div>
              <div className="h-16"></div>
              <div className="font-medium">BS. Nguyễn Văn A</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <Card className="shadow-sm">
      <div className="mb-4">
        <Title level={4} className="flex items-center mb-3">
          <MedicineBoxOutlined className="mr-2 text-[#0099CF]" />
          Lịch sử khám bệnh
        </Title>
        <Text type="secondary">
          Xem lịch sử đặt khám và kết quả xét nghiệm của bạn tại đây.
        </Text>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
          <div className="mt-4">Đang tải dữ liệu...</div>
        </div>
      ) : bookings.length > 0 ? (
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          className="mt-4"
        />
      ) : (
        <Empty
          description="Bạn chưa có lịch sử đặt khám"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      {/* Các modal */}
      {renderDetailModal()}
      {renderReceiptModal()}
      {renderTestResultModal()}
    </Card>
  );
};

export default HistoryTesting;
