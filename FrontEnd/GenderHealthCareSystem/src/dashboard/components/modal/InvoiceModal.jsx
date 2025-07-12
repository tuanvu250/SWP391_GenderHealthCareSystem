import React, { useRef } from "react";
import { Modal, Button, Typography, message } from "antd";
import { FilePdfOutlined, PercentageOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { convertUsdToVnd, formatPrice } from "../../../components/utils/format";

const { Title, Text } = Typography;

/**
 * Modal hiển thị hóa đơn đơn giản và cho phép xuất PDF
 */
const InvoiceModal = ({ visible, onCancel, invoice = {}, customer = {}, booking = {} }) => {
  const invoiceRef = useRef(null);

  // Kiểm tra có giảm giá không
  const hasDiscount = booking.discount > 0;
  
  // Tính toán giá gốc và giá đã giảm
  const originalPrice = booking.servicePrice || 0;
  const discountAmount = hasDiscount ? (originalPrice * booking.discount / 100) : 0;
  const finalAmount = invoice.totalAmount;

  // Hàm xuất PDF với xử lý màu oklch
  const handleExportPDF = () => {
    message.loading("Đang chuẩn bị tài liệu PDF...");

    // Tạo một bản sao style để xử lý
    const tempStyles = document.createElement("style");
    tempStyles.innerHTML = `
      .text-green-600 {
        color: rgb(22, 163, 74) !important;
      }
      .text-gray-500 {
        color: rgb(107, 114, 128) !important;
      }
      .text-red-500 {
        color: rgb(239, 68, 68) !important;
      }
    `;
    document.head.appendChild(tempStyles);

    html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`Hóa đơn-${invoice.invoiceId || "unknown"}.pdf`);

        // Xóa style tạm thời sau khi xuất
        document.head.removeChild(tempStyles);
        message.success("Xuất PDF thành công!");
      })
      .catch((err) => {
        // Đảm bảo xóa style tạm thời nếu có lỗi
        if (document.head.contains(tempStyles)) {
          document.head.removeChild(tempStyles);
        }
        console.error("Lỗi khi xuất PDF:", err);
        message.error("Có lỗi khi xuất PDF. Vui lòng thử lại!");
      });
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cash":
      case "CASH":
        return "Tiền mặt";
      case "vnpay":
      case "VNPAY":
        return "VNPAY";
      case "paypal":
      case "PAYPAL":
        return "PayPal";
      case "credit":
        return "Thẻ tín dụng";
      default:
        return method;
    }
  };

  return (
    <Modal
      title={<span className="text-lg">Hóa đơn thanh toán</span>}
      open={visible}
      onCancel={onCancel}
      width={500}
      footer={[
        <Button
          key="export"
          type="primary"
          icon={<FilePdfOutlined />}
          onClick={handleExportPDF}
        >
          Xuất PDF
        </Button>,
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      <div
        id="invoice-content"
        ref={invoiceRef}
        style={{ padding: "10px" }}
        className="invoice-printable-content"
      >
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
            Ngày: {dayjs(invoice.paidAt).format("DD/MM/YYYY")}
          </div>
        </div>

        <div className="pb-3 border-b mt-4">
          <div className="flex justify-between">
            <div className="text-gray-500">Mã hoá đơn:</div>
            <div className="font-medium">{invoice.invoiceId}</div>
          </div>
          <div className="flex justify-between mt-1">
            <div className="text-gray-500">Khách hàng:</div>
            <div className="font-medium">
              {customer?.fullName || "Khách hàng"}
            </div>
          </div>
        </div>

        <div className="space-y-2 pb-3 border-b mt-4">
          <div className="font-medium">Chi tiết dịch vụ:</div>
          <div className="flex justify-between border-b pb-2">
            <div>{invoice.serviceName}</div>
            <div className="font-medium">
              {invoice.currency === "USD"
                ? formatPrice(convertUsdToVnd(originalPrice))
                : formatPrice(originalPrice)}
            </div>
          </div>

          {/* Hiển thị phần giảm giá nếu có */}
          {hasDiscount && (
            <div className="flex justify-between text-red-500 pb-2">
              <div className="flex items-center">
                <PercentageOutlined className="mr-1" /> 
                Giảm giá ({booking.discount}%):
              </div>
              <div>
                -{invoice.currency === "USD"
                  ? formatPrice(convertUsdToVnd(discountAmount))
                  : formatPrice(discountAmount)}
              </div>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg pt-2">
            <div>Tổng tiền:</div>
            <div className="font-medium">
              {invoice.currency === "USD"
                ? formatPrice(convertUsdToVnd(finalAmount))
                : formatPrice(finalAmount)}
            </div>
          </div>
        </div>

        <div className="space-y-2 pb-3 mt-4">
          <div className="flex justify-between">
            <div className="text-gray-500">Phương thức thanh toán:</div>
            <div>
              {getPaymentMethodText(invoice.paymentMethod)}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500">Trạng thái:</div>
            <div className="text-green-600 font-medium">Đã thanh toán</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-500">Thời gian thanh toán:</div>
            <div>{dayjs(invoice.paidAt).format("HH:mm:ss DD/MM/YYYY")}</div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm pt-4 border-t">
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          <p>Mọi thắc mắc vui lòng liên hệ: support@genderhealthcare.vn</p>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
