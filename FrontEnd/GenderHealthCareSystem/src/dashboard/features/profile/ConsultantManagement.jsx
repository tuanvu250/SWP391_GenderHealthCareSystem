// src/pages/admin/ConsultantManagement.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, App as AntdApp } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { getAllConsultants } from "../../../components/api/Consultant.api";

function ConsultantManagementContent() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState(null);

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

  useEffect(() => {
    fetchConsultants();
  }, []);

  const columns = [
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
        <Button onClick={() => fetchDetails(r.profileID)} type="link">
          Xem chi tiết
        </Button>
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
        rowKey={(record) => record.profileID || record.ProfileID}
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
