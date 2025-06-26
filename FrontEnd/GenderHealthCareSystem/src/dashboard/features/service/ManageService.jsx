import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Input,
  Modal,
  Form,
  InputNumber,
  Select,
  Switch,
  message,
  Tooltip,
  Popconfirm,
  Descriptions,
  Divider,
  List,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { formatPrice } from "../../../components/utils/format"; // Import hàm định dạng giá
import ServiceDetailModal from "../../components/modal/ServiceDetailModal";
import ServiceFormModal from "../../components/modal/ServiceFormModal";
import {
  deleteServiceTestingAPI,
  editServiceTestingAPI,
  getServiceTestingAPI,
  postServiceTestingAPI,
} from "../../../components/api/ServiceTesting.api";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ManageService = () => {
  // States
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Phân loại dịch vụ
  const serviceCategories = [
    { value: "single", label: "Dịch vụ đơn lẻ" },
    { value: "combo", label: "Gói combo" },
  ];

  // Load dữ liệu từ mock data
  const loadData = async () => {
    setLoading(true);
    try {
      await getServiceTestingAPI({
        page: pagination.current - 1,
        size: pagination.pageSize,
        serviceName: searchText,
      }).then((response) => {
        const { content, totalElements } = response.data.data;
        setServices(content);
        setPagination({
          ...pagination,
          total: totalElements,
        });
        setLoading(false);
      });
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi tải dữ liệu");
    } // Giả lập delay API
  };

  // Tải dữ liệu ban đầu
  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, searchText]);

  // Xử lý thêm mới
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    setEditingId(record.serviceId);
    form.setFieldsValue({
      serviceName: record.serviceName,
      price: record.price,
      duration: record.duration,
      description: record.description,
      tests: record.tests ? record.tests.split(", ") : [],
      discount: record.discount || 0,
      type: record.type,
      status: record.status === "ACTIVE",
    });
    setModalVisible(true);
  };

  // Xử lý thay đổi phân trang
  const handleTabeChange = (pagination) => {
    setPagination(pagination)
  };
  // Nếu có sắp xếp, có thể xử lý ở đâ

  // Xử lý xem chi tiết
  const handleView = (record) => {
    setCurrentService(record);
    setViewModalVisible(true);
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    try {
      await deleteServiceTestingAPI(id);
      message.success("Xóa dịch vụ thành công");
      loadData(); // Tải lại dữ liệu sau khi xóa
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi xóa dịch vụ");
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingId) {
        await editServiceTestingAPI(editingId, {
          ...values,
          status: values.status ? "ACTIVE" : "INACTIVE",  
        });
        message.success("Cập nhật dịch vụ thành công");
      } else {
        // Thêm mới
        const newService = {
          ...values,
          status: values.isActive ? "ACTIVE" : "INACTIVE",
        };
        await postServiceTestingAPI(newService);
        loadData();
        message.success("Thêm dịch vụ thành công");
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "serviceId",
      key: "serviceId",
      width: 80,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      ellipsis: true,
      width: 250,
      render: (text, record) => (
        <a onClick={() => handleView(record)}>{text}</a>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (category) => {
        let color = "default";
        let text = "Không xác định";

        switch (category) {
          case "single":
            color = "blue";
            text = "Dịch vụ đơn";
            break;
          case "combo":
            color = "purple";
            text = "Gói combo";
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: serviceCategories.map((cat) => ({
        text: cat.label,
        value: cat.value,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => (
        <span className="font-semibold">{formatPrice(price)}</span>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      width: 100,
      render: (discount) =>
        discount > 0 ? <Tag color="red">{discount}%</Tag> : <span>-</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "volcano"}>
          {status === "ACTIVE" ? "Đang hoạt động" : "Tạm ngưng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa dịch vụ này?"
              onConfirm={() => handleDelete(record.serviceId)}
              okText="Xóa"
              cancelText="Hủy"
              icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="mb-6">
          <Title level={4}>Quản lý dịch vụ xét nghiệm STIs</Title>
          <Text type="secondary">
            Thêm, chỉnh sửa, xóa các dịch vụ và combo xét nghiệm STIs
          </Text>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <Input.Search
            placeholder="Tìm kiếm dịch vụ..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm dịch vụ mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={services}
          rowKey="serviceId"
          loading={loading}
          pagination={pagination}
          onChange={handleTabeChange}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Modal thêm/chỉnh sửa dịch vụ */}
      <ServiceFormModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        form={form}
        editingId={editingId}
      />

      {/* Modal xem chi tiết dịch vụ */}
      <ServiceDetailModal
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        service={currentService}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default ManageService;
