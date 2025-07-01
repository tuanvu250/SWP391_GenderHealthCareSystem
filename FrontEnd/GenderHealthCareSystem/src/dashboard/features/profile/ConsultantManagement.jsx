import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";

export default function ConsultantManagement() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [form] = Form.useForm();

  const [details, setDetails] = useState([]);
  const [detailForm] = Form.useForm();
  const [currentProfileId, setCurrentProfileId] = useState(null);

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/consultant/profile");
      setConsultants(res.data);
    } catch {
      message.error("Lỗi khi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (profileId) => {
    try {
      const res = await axios.get(`/api/consultant/profile/details?profileId=${profileId}`);
      setDetails(res.data);
      setCurrentProfileId(profileId);
    } catch {
      message.error("Lỗi khi tải chi tiết");
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  const handleEdit = (record) => {
    setEditingProfile(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (ProfileID) => {
    try {
      await axios.delete("/api/consultant/profile", { data: { profileId: ProfileID } });
      message.success("Đã xóa");
      fetchConsultants();
    } catch {
      message.error("Lỗi khi xóa");
    }
  };

  const handleCreate = () => {
    setEditingProfile(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingProfile) {
        await axios.put("/api/consultant/profile", { ...editingProfile, ...values });
        message.success("Cập nhật thành công");
      } else {
        await axios.post("/api/consultant/profile", values);
        message.success("Tạo mới thành công");
      }
      setModalOpen(false);
      fetchConsultants();
    } catch {
      message.error("Lỗi khi lưu");
    }
  };

  const columns = [
    { title: "Chức danh", dataIndex: "JobTitle" },
    { title: "Chuyên môn", dataIndex: "Specialization" },
    { title: "Ngôn ngữ", dataIndex: "Languages" },
    { title: "Kinh nghiệm", dataIndex: "ExperienceYears" },
    { title: "Đơn giá", dataIndex: "HourlyRate" },
    { title: "Vị trí", dataIndex: "Location" },
    {
      title: "Sẵn sàng",
      dataIndex: "IsAvailable",
      render: (val) => (val ? "✅" : "❌")
    },
    {
      title: "Hành động",
      render: (_, r) => (
        <>
          <Button onClick={() => handleEdit(r)} type="link">Sửa</Button>
          <Button onClick={() => handleDelete(r.ProfileID)} danger type="link">Xóa</Button>
          <Button onClick={() => { fetchDetails(r.ProfileID); setDetailModalOpen(true); }} type="link">Chi tiết</Button>
        </>
      )
    }
  ];

  const handleDetailSubmit = async (values) => {
    try {
      const formatted = { ...values, ProfileID: currentProfileId };
      if (values.DetailID) {
        await axios.put("/api/consultant/profile/detail", formatted);
      } else {
        await axios.post("/api/consultant/profile/detail", formatted);
      }
      message.success("Lưu chi tiết OK");
      detailForm.resetFields();
      fetchDetails(currentProfileId);
    } catch {
      message.error("Lỗi khi lưu chi tiết");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý tư vấn viên</h2>
      <Button type="primary" onClick={handleCreate} className="mb-4">Tạo mới</Button>
      <Table columns={columns} dataSource={consultants} rowKey="ProfileID" loading={loading} />

      <Modal
        title={editingProfile ? "Chỉnh sửa" : "Tạo mới"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="JobTitle" label="Chức danh" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="Specialization" label="Chuyên môn"><Input /></Form.Item>
          <Form.Item name="Languages" label="Ngôn ngữ"><Input /></Form.Item>
          <Form.Item name="ExperienceYears" label="Kinh nghiệm"><InputNumber min={0} className="w-full" /></Form.Item>
          <Form.Item name="HourlyRate" label="Đơn giá"><InputNumber min={0} className="w-full" /></Form.Item>
          <Form.Item name="Location" label="Vị trí"><Input /></Form.Item>
          <Form.Item name="IsAvailable" label="Sẵn sàng" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết Profile"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={detailForm} onFinish={handleDetailSubmit}>
          <Form.Item name="Title" label="Tiêu đề"><Input /></Form.Item>
          <Form.Item name="Organization" label="Tổ chức"><Input /></Form.Item>
          <Form.Item name="Description" label="Mô tả"><Input.TextArea /></Form.Item>
          <Form.Item name="DetailType" label="Loại chi tiết"><Input /></Form.Item>
          <Form.Item name="FromDate" label="Từ ngày"><DatePicker className="w-full" /></Form.Item>
          <Form.Item name="ToDate" label="Đến ngày"><DatePicker className="w-full" /></Form.Item>
          <Form.Item name="IssuedDate" label="Ngày cấp"><DatePicker className="w-full" /></Form.Item>
          <Button htmlType="submit" type="primary">Lưu chi tiết</Button>
        </Form>
        <Table
          dataSource={details}
          rowKey="DetailID"
          columns={[
            { title: "Tiêu đề", dataIndex: "Title" },
            { title: "Tổ chức", dataIndex: "Organization" },
            { title: "Loại", dataIndex: "DetailType" },
            { title: "Từ", dataIndex: "FromDate" },
            { title: "Đến", dataIndex: "ToDate" },
            {
              title: "Hành động", render: (_, r) => (
                <Button type="link" onClick={() => { detailForm.setFieldsValue({ ...r, FromDate: dayjs(r.FromDate), ToDate: dayjs(r.ToDate), IssuedDate: dayjs(r.IssuedDate) }); }}>Sửa</Button>
              )
            }
          ]}
        />
      </Modal>
    </div>
  );
}