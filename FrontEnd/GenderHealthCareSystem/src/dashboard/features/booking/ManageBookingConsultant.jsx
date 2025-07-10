import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Input,
  message,
  Popconfirm,
  Empty,
  Spin,
} from "antd";
import { CalendarOutlined, LinkOutlined } from "@ant-design/icons";
import {
  getConsultantSchedule,
  updateMeetingLink,
} from "../../../components/api/ConsultantBooking.api";

const { Title } = Typography;

export default function ManageBookingConsultant(){
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLinks, setNewLinks] = useState({}); // bookingId => link

  const fetchData = async () => {
    try {
      setLoading(true);
      // Giả sử tạm dùng API lấy schedule consultant, bạn nên tạo API riêng cho staff
      const res = await getConsultantSchedule();
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      // Lọc ra những booking chưa có meetLink
      const filtered = list.filter((b) => !b.meetLink);
      setBookings(filtered);
    } catch (err) {
      console.error("Lỗi tải lịch tư vấn:", err);
      message.error("Không thể tải danh sách lịch tư vấn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateLink = async (bookingId) => {
    const link = newLinks[bookingId];
    if (!link || link.trim() === "") {
      return message.warning("Vui lòng nhập link trước khi lưu.");
    }
    try {
      await updateMeetingLink(bookingId, link.trim());
      message.success("Cập nhật link thành công.");
      setNewLinks((prev) => ({ ...prev, [bookingId]: "" }));
      fetchData(); // Làm mới lại danh sách
    } catch (err) {
      console.error("Lỗi cập nhật link:", err);
      message.error("Không thể cập nhật link.");
    }
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Ngày hẹn",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "—",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => text || "—",
    },
    {
      title: "Link mới",
      key: "newLink",
      render: (_, record) => (
        <Input
          placeholder="Nhập link meet..."
          value={newLinks[record.bookingId] || ""}
          onChange={(e) =>
            setNewLinks((prev) => ({
              ...prev,
              [record.bookingId]: e.target.value,
            }))
          }
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận gắn link này?"
          onConfirm={() => handleUpdateLink(record.bookingId)}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Button type="primary" icon={<LinkOutlined />}>
            Gắn link
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card className="shadow-md">
      <Title level={4} className="flex items-center gap-2 mb-4">
        <CalendarOutlined className="text-blue-500" />
        Quản lý link Meet cho lịch tư vấn
      </Title>

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
          <div className="mt-2">Đang tải dữ liệu...</div>
        </div>
      ) : bookings.length > 0 ? (
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="bookingId"
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <Empty
          description="Tất cả lịch tư vấn đã có link meet hoặc không có lịch nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
}
