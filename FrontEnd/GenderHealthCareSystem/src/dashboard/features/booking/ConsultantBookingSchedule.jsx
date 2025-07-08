import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Spin,
  message,
  Button,
  Popconfirm,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getConsultantSchedule } from "../../../components/api/ConsultantBooking.api";
import axios from "axios";

const { Title } = Typography;

export default function ConsultantBookingSchedule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMySchedule = async () => {
    try {
      setLoading(true);
      const res = await getConsultantSchedule();
      setBookings(res?.data?.data || []);
    } catch (err) {
      console.error("Lỗi tải lịch tư vấn của bạn:", err);
      message.error("Không thể tải lịch tư vấn của bạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySchedule();
  }, []);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}/status`, { status });
      message.success(`Cập nhật trạng thái thành công: ${status}`);
      fetchMySchedule();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      message.error("Không thể cập nhật trạng thái.");
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Tag icon={<ClockCircleOutlined />} color="blue">
            Chờ xác nhận
          </Tag>
        );
      case "CONFIRMED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Đã xác nhận
          </Tag>
        );
      case "CANCELLED":
        return (
          <Tag icon={<CloseCircleOutlined />} color="red">
            Đã hủy
          </Tag>
        );
      case "COMPLETED":
        return (
          <Tag icon={<CheckCircleOutlined />} color="cyan">
            Đã hoàn thành
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
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
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ",
      key: "time",
      render: (_, record) =>
        `${record.bookingTimeStart} - ${record.bookingTimeEnd}`,
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
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        if (record.status !== "CONFIRMED") return null;

        return (
          <div className="flex gap-2">
            <Popconfirm
              title="Xác nhận hoàn thành lịch hẹn này?"
              onConfirm={() => updateBookingStatus(record.bookingId, "COMPLETED")}
              okText="Hoàn thành"
              cancelText="Hủy"
            >
              <Button type="primary" size="small">
                Hoàn thành
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Xác nhận hủy lịch hẹn này?"
              onConfirm={() => updateBookingStatus(record.bookingId, "CANCELLED")}
              okText="Đồng ý"
              cancelText="Không"
            >
              <Button danger size="small">Hủy</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <Card className="shadow-md">
      <Title level={4} className="flex items-center gap-2 mb-4">
        <CalendarOutlined className="text-blue-500" />
        Lịch tư vấn của bạn
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
          scroll={{ x: 1000 }}
        />
      ) : (
        <Empty
          description="Bạn chưa có lịch tư vấn nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
}
