import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Spin,
  Input,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ConsultantBookingSchedule = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [consultantId, setConsultantId] = useState("");

  const fetchBookings = async () => {
    if (!consultantId) {
      message.warning("Vui lòng nhập consultantId");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/bookings/consultant/${consultantId}/schedule`
      );
      setBookings(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch consultant schedule", error);
      message.error("Không thể tải lịch tư vấn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (consultantId) {
      fetchBookings();
    }
  }, [consultantId]);

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
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
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
      title: "Thời gian",
      key: "bookingTime",
      render: (_, record) =>
        `${record.bookingTimeStart} - ${record.bookingTimeEnd}`,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) => note || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
    },
  ];

  return (
    <Card className="shadow-sm">
      <div className="mb-4">
        <Title level={4} className="flex items-center mb-2">
          <UserOutlined className="mr-2 text-blue-500" />
          Quản lý lịch tư vấn theo Consultant
        </Title>
        <Text type="secondary">
          Nhập `consultantId` để xem lịch tư vấn tương ứng.
        </Text>

        <div className="mt-4 flex items-center gap-3">
          <Input
            placeholder="Nhập consultantId"
            value={consultantId}
            onChange={(e) => setConsultantId(e.target.value)}
            style={{ width: 240 }}
            onPressEnter={fetchBookings}
          />
        </div>
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
          className="mt-4"
          scroll={{ x: 1000 }}
        />
      ) : (
        <Empty
          description="Chưa có lịch tư vấn nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default ConsultantBookingSchedule;
