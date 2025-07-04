// src/pages/admin/ConsultantManagement.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  App as AntdApp,
  Input,
  Form,
  Switch,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { getAllConsultants } from "../../../components/api/Consultant.api";

function ConsultantManagementContent() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [editingConsultant, setEditingConsultant] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const data = await getAllConsultants();
      console.log("✅ Consultants:", data);
      setConsultants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      message.error("Không thể tải danh sách tư vấn viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (profileId) => {
    if (!profileId) {
      message.error("Thiếu profileId để gọi chi tiết");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/consultant/profile/details?profileId=${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
        }
      );

      const raw = res.data;
      const data = Array.isArray(raw) ? raw : raw?.data || [];

      if (Array.isArray(data)) {
        setDetails(data);
      } else {
        message.error("API chi tiết trả về sai định dạng");
        setDetails([]);
      }

      setCurrentProfileId(profileId);
      setDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết:", error);
      message.error("Lỗi khi tải chi tiết");
    }
  };

  const handleEdit = (record) => {
    setEditingConsultant(record);
    form.setFieldsValue(record);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      const id = editingConsultant.profileID || editingConsultant.id;

      // Cập nhật đơn giá
      await axios.put(
        `http://localhost:8080/api/consultant/profile/${id}/hourly-rate`,
        null,
        {
          params: { hourlyRate: values.hourlyRate },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
        }
      );

      // Cập nhật trạng thái
      await axios.put(
        `http://localhost:8080/api/consultant/profile/${id}/employment-status`,
        null,
        {
          params: { employmentStatus: values.isAvailable },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
        }
      );

      message.success("Cập nhật thành công!");
      setEditModalOpen(false);
      fetchConsultants();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      message.error("Cập nhật thất bại");
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  const columns = [
    { title: "Họ tên", dataIndex: "fullName" },
    { title: "Chức danh", dataIndex: "jobTitle" },
    { title: "Chuyên môn", dataIndex: "specialization" },
    { title: "Ngôn ngữ", dataIndex: "languages" },
    { title: "Kinh nghiệm", dataIndex: "experienceYears" },
    { title: "Đơn giá", dataIndex: "hourlyRate" },
    { title: "Vị trí", dataIndex: "location" },
    {
      title: "Sẵn sàng",
      dataIndex: "isAvailable",
      render: (val) => (val ? "✅" : "❌"),
    },
    {
      title: "Hành động",
      render: (_, r) => (
        <>
          <Button
            onClick={() => fetchDetails(r.profileID || r.id || r.consultantProfileId)}
            type="link"
            style={{ paddingRight: 8 }}
          >
            Xem chi tiết
          </Button>
          <Button type="link" onClick={() => handleEdit(r)}>
            Chỉnh sửa
          </Button>
        </>
      ),
    },
  ];

  const detailColumns = [
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Tổ chức", dataIndex: "organization" },
    { title: "Loại", dataIndex: "detailType" },
    {
      title: "Từ",
      dataIndex: "fromDate",
      render: (val) => (val ? dayjs(val).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Đến",
      dataIndex: "toDate",
      render: (val) => (val ? dayjs(val).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Ngày cấp",
      dataIndex: "issuedDate",
      render: (val) => (val ? dayjs(val).format("DD/MM/YYYY") : "-"),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý tư vấn viên</h2>
      <Table
        columns={columns}
        dataSource={consultants}
        rowKey={(record) => record.profileID || record.id || record.consultantProfileId}
        loading={loading}
      />

      <Modal
        title="Chi tiết tư vấn viên"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={details}
          rowKey={(record) => record.detailID || record.DetailID}
          columns={detailColumns}
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>

      <Modal
        title="Chỉnh sửa tư vấn viên"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSaveEdit}
        okText="Lưu"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="hourlyRate" label="Đơn giá">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="isAvailable" label="Trạng thái làm việc" valuePropName="checked">
            <Switch checkedChildren="Đang làm" unCheckedChildren="Tạm nghỉ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default function ConsultantManagement() {
  return (
    <AntdApp>
      <ConsultantManagementContent />
    </AntdApp>
  );
}
