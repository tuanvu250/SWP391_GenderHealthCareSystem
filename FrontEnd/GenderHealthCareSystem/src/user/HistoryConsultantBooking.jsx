import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Spin,
  Button,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  VideoCameraOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const HistoryConsultantBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = sessionStorage.getItem("token"); // ✅ đổi từ localStorage → sessionStorage
      const userString = sessionStorage.getItem("user"); // ✅ đồng bộ

      if (!token || token.trim() === "" || !userString) {
        message.error("Bạn chưa đăng nhập hoặc phiên đã hết hạn.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`/api/bookings/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: 0,
            size: 10,
            sort: "createdAt,desc",
          },
        });

        setBookings(response.data?.data?.content || []);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử booking:", error);
        message.error("Không thể tải lịch sử đặt lịch.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag icon={<ClockCircleOutlined />} color="blue">Đang xử lý</Tag>;
      case "CONFIRMED":
        return <Tag icon={<CheckCircleOutlined />} color="green">Đã xác nhận</Tag>;
      case "CANCELLED":
        return <Tag icon={<CloseCircleOutlined />} color="red">Đã hủy</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const renderPaymentStatus = (status) => {
    switch (status) {
      case "PAID":
        return <Tag color="green">Đã thanh toán</Tag>;
      case "UNPAID":
        return <Tag color="orange">Chưa thanh toán</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Chuyên gia",
      dataIndex: "consultantName",
      key: "consultantName",
      render: (text, record) =>
        text || <span className="text-gray-500">ID {record.consultantId}</span>,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => text || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: renderPaymentStatus,
    },
    {
      title: "Link tư vấn",
      dataIndex: "meetLink",
      key: "meetLink",
      render: (text) =>
        text ? (
          <Button
            type="link"
            href={text}
            target="_blank"
            icon={<VideoCameraOutlined />}
          >
            Tham gia
          </Button>
        ) : (
          <span className="text-gray-400">Chưa có</span>
        ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <div className="mb-4">
        <Title level={4} className="flex items-center mb-2">
          <UserOutlined className="mr-2 text-blue-500" />
          Lịch sử đặt lịch tư vấn
        </Title>
        <Text type="secondary">Xem các buổi tư vấn đã đặt của bạn.</Text>
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
          rowKey="bookingId"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
          className="mt-4"
        />
      ) : (
        <Empty
          description="Bạn chưa có lịch tư vấn nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default HistoryConsultantBooking;
