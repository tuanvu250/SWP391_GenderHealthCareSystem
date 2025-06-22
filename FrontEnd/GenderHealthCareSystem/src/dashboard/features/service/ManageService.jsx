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

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Mock data cho dịch vụ STIs
const mockServices = [
  {
    id: 1,
    name: "Xét nghiệm HIV",
    description:
      "Xét nghiệm HIV là xét nghiệm phát hiện kháng thể hoặc kháng nguyên của virus HIV trong máu. Đây là phương pháp chính xác để biết một người có nhiễm HIV hay không.",
    price: 200000,
    category: "single",
    includedTests: ["hiv"],
    discountPercent: 0,
    duration: 30,
    isActive: true,
    createdAt: "2023-05-10T08:30:00Z",
  },
  {
    id: 2,
    name: "Gói xét nghiệm STIs cơ bản",
    description:
      "Gói xét nghiệm cơ bản bao gồm các xét nghiệm STIs phổ biến nhất, giúp tầm soát sớm các bệnh lây truyền qua đường tình dục phổ biến.",
    price: 750000,
    category: "combo",
    includedTests: ["hiv", "syphilis", "hepatitisB", "hepatitisC"],
    discountPercent: 10,
    duration: 60,
    isActive: true,
    createdAt: "2023-05-11T10:15:00Z",
  },
  {
    id: 3,
    name: "Gói xét nghiệm STIs toàn diện",
    description:
      "Gói xét nghiệm toàn diện bao gồm tất cả các xét nghiệm STIs chính, giúp phát hiện đầy đủ và chính xác các bệnh lây truyền qua đường tình dục.",
    price: 1200000,
    category: "combo",
    includedTests: [
      "hiv",
      "syphilis",
      "hepatitisB",
      "hepatitisC",
      "gonorrhea",
      "chlamydia",
      "hpv",
      "herpes",
    ],
    discountPercent: 15,
    duration: 90,
    isActive: true,
    createdAt: "2023-05-12T14:45:00Z",
  },
  {
    id: 4,
    name: "Xét nghiệm Giang mai",
    description:
      "Xét nghiệm giang mai phát hiện sự hiện diện của kháng thể được tạo ra để chống lại vi khuẩn gây bệnh giang mai.",
    price: 180000,
    category: "single",
    includedTests: ["syphilis"],
    discountPercent: 0,
    duration: 30,
    isActive: true,
    createdAt: "2023-05-13T09:20:00Z",
  },
  {
    id: 5,
    name: "Xét nghiệm Viêm gan B",
    description:
      "Xét nghiệm viêm gan B giúp phát hiện sự hiện diện của virus viêm gan B trong máu, xác định tình trạng nhiễm trùng cấp tính hoặc mãn tính.",
    price: 250000,
    category: "single",
    includedTests: ["hepatitisB"],
    discountPercent: 0,
    duration: 40,
    isActive: true,
    createdAt: "2023-05-14T11:10:00Z",
  },
  {
    id: 6,
    name: "Khuyến mãi tháng 6 - Gói STIs đôi",
    description:
      "Gói xét nghiệm STIs dành cho 2 người, giúp đảm bảo sức khỏe tình dục cho cả bạn và đối tác.",
    price: 1500000,
    category: "promotion",
    includedTests: ["hiv", "syphilis", "hepatitisB", "gonorrhea", "chlamydia"],
    discountPercent: 25,
    duration: 120,
    isActive: true,
    createdAt: "2023-05-15T13:30:00Z",
  },
  {
    id: 7,
    name: "Xét nghiệm HPV",
    description:
      "Xét nghiệm HPV phát hiện sự hiện diện của virus HPV có nguy cơ cao, giúp đánh giá nguy cơ ung thư cổ tử cung.",
    price: 450000,
    category: "single",
    includedTests: ["hpv"],
    discountPercent: 0,
    duration: 45,
    isActive: false,
    createdAt: "2023-05-16T15:25:00Z",
  },
  {
    id: 8,
    name: "Gói thăm khám và xét nghiệm STIs cho nữ",
    description:
      "Gói khám và xét nghiệm toàn diện dành cho nữ giới, bao gồm thăm khám phụ khoa và xét nghiệm các bệnh lây truyền qua đường tình dục phổ biến.",
    price: 1350000,
    category: "combo",
    includedTests: ["hiv", "syphilis", "hepatitisB", "gonorrhea", "chlamydia", "hpv"],
    discountPercent: 12,
    duration: 120,
    isActive: true,
    createdAt: "2023-05-17T10:00:00Z",
  },
  {
    id: 9,
    name: "Xét nghiệm Chlamydia và Lậu",
    description:
      "Bộ xét nghiệm phát hiện sự nhiễm Chlamydia và Lậu, hai trong số những bệnh lây truyền qua đường tình dục phổ biến nhất.",
    price: 400000,
    category: "combo",
    includedTests: ["gonorrhea", "chlamydia"],
    discountPercent: 5,
    duration: 40,
    isActive: true,
    createdAt: "2023-05-18T14:15:00Z",
  },
  {
    id: 10,
    name: "Xét nghiệm Herpes",
    description:
      "Xét nghiệm phát hiện kháng thể chống lại virus Herpes simplex (HSV) type 1 và 2 trong máu.",
    price: 300000,
    category: "single",
    includedTests: ["herpes"],
    discountPercent: 0,
    duration: 30,
    isActive: false,
    createdAt: "2023-05-19T11:45:00Z",
  },
];

// Component xem chi tiết dịch vụ
const ServiceDetailModal = ({ open, onCancel, service }) => {
  if (!service) return null;

  // Hiển thị tên các xét nghiệm
  const testNames = {
    hiv: "HIV",
    syphilis: "Giang mai",
    hepatitisB: "Viêm gan B",
    hepatitisC: "Viêm gan C",
    gonorrhea: "Lậu",
    chlamydia: "Chlamydia",
    hpv: "HPV",
    herpes: "Herpes",
  };

  // Hiển thị loại dịch vụ
  const getCategoryDisplay = (category) => {
    switch (category) {
      case "single":
        return <Tag color="blue">Dịch vụ đơn</Tag>;
      case "combo":
        return <Tag color="purple">Gói combo</Tag>;
      case "promotion":
        return <Tag color="orange">Khuyến mãi</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      title={<Title level={4}>Chi tiết dịch vụ</Title>}
    >
      <Card className="mb-4">
        <Title level={4}>{service.name}</Title>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {getCategoryDisplay(service.category)}
            <Tag color={service.isActive ? "success" : "default"}>
              {service.isActive ? "Đang hoạt động" : "Tạm ngưng"}
            </Tag>
          </div>
          <div>
            {service.discountPercent > 0 && (
              <Text delete type="secondary" className="mr-2">
                {formatPrice(service.price)}
              </Text>
            )}
            <Text type="danger" strong style={{ fontSize: "18px" }}>
              {service.discountPercent > 0
                ? formatPrice(
                    service.price * (1 - service.discountPercent / 100)
                  )
                : formatPrice(service.price)}
            </Text>
            {service.discountPercent > 0 && (
              <Tag color="red" className="ml-2">
                -{service.discountPercent}%
              </Tag>
            )}
          </div>
        </div>

        <Divider />

        <Descriptions column={1} className="mb-4">
          <Descriptions.Item label="Thời gian thực hiện">
            {service.duration || "30"} phút
          </Descriptions.Item>
        </Descriptions>

        <Paragraph className="mb-4">
          <Text strong>Mô tả dịch vụ:</Text>
          <br />
          <Text>{service.description || "Không có mô tả"}</Text>
        </Paragraph>

        <Divider orientation="left">Các xét nghiệm bao gồm</Divider>

        {service.includedTests && service.includedTests.length > 0 ? (
          <List
            size="small"
            dataSource={service.includedTests}
            renderItem={(test) => (
              <List.Item>
                <Space>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <Text>{testNames[test] || test}</Text>
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">Không có thông tin xét nghiệm</Text>
        )}
      </Card>
    </Modal>
  );
};

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
    total: mockServices.length,
  });

  // Phân loại dịch vụ
  const serviceCategories = [
    { value: "single", label: "Dịch vụ đơn lẻ" },
    { value: "combo", label: "Gói combo" },
    { value: "promotion", label: "Khuyến mãi đặc biệt" },
  ];

  // Load dữ liệu từ mock data
  const loadData = () => {
    setLoading(true);

    // Tìm kiếm theo tên
    let filteredServices = mockServices.filter((service) =>
      service.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Phân trang
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    setServices(paginatedServices);
    setPagination({
      ...pagination,
      total: filteredServices.length,
    });

    setTimeout(() => {
      setLoading(false);
    }, 300); // Giả lập delay API
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
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      category: record.category,
      includedTests: record.includedTests,
      discountPercent: record.discountPercent || 0,
      duration: record.duration,
      isActive: record.isActive,
    });
    setModalVisible(true);
  };

  // Xử lý xem chi tiết
  const handleView = (record) => {
    setCurrentService(record);
    setViewModalVisible(true);
  };

  // Xử lý xóa
  const handleDelete = (id) => {
    // Giả lập API xóa
    const updatedServices = mockServices.filter(
      (service) => service.id !== id
    );
    // Cập nhật lại mockServices global
    mockServices.splice(0, mockServices.length, ...updatedServices);
    message.success("Xóa dịch vụ thành công");
    loadData();
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
        // Cập nhật
        const index = mockServices.findIndex(
          (service) => service.id === editingId
        );
        if (index !== -1) {
          mockServices[index] = { ...mockServices[index], ...values };
          message.success("Cập nhật dịch vụ thành công");
        }
      } else {
        // Thêm mới
        const newId = Math.max(...mockServices.map((service) => service.id)) + 1;
        const newService = {
          id: newId,
          ...values,
          createdAt: new Date().toISOString(),
        };
        mockServices.unshift(newService);
        message.success("Thêm dịch vụ thành công");
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 250,
      render: (text, record) => (
        <a onClick={() => handleView(record)}>{text}</a>
      ),
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
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
          case "promotion":
            color = "orange";
            text = "Khuyến mãi";
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: serviceCategories.map((cat) => ({
        text: cat.label,
        value: cat.value,
      })),
      onFilter: (value, record) => record.category === value,
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
      dataIndex: "discountPercent",
      key: "discountPercent",
      width: 100,
      render: (discount) =>
        discount > 0 ? <Tag color="red">{discount}%</Tag> : <span>-</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Đang hoạt động" : "Tạm ngưng"}
        </Tag>
      ),
      filters: [
        { text: "Đang hoạt động", value: true },
        { text: "Tạm ngưng", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
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
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              icon={
                <ExclamationCircleOutlined style={{ color: "red" }} />
              }
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm dịch vụ mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={services}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(newPagination) => setPagination(newPagination)}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Modal thêm/chỉnh sửa dịch vụ */}
      <Modal
        title={editingId ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={800}
        okText={editingId ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            price: 0,
            discountPercent: 0,
            duration: 30,
            isActive: true,
            category: "single",
            includedTests: [],
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Tên dịch vụ"
              rules={[
                { required: true, message: "Vui lòng nhập tên dịch vụ" },
              ]}
              className="md:col-span-2"
            >
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Loại dịch vụ"
              rules={[
                { required: true, message: "Vui lòng chọn loại dịch vụ" },
              ]}
            >
              <Select placeholder="Chọn loại dịch vụ">
                {serviceCategories.map((category) => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá dịch vụ (VNĐ)"
              rules={[
                { required: true, message: "Vui lòng nhập giá dịch vụ" },
              ]}
            >
              <InputNumber
                placeholder="Nhập giá dịch vụ"
                style={{ width: "100%" }}
                min={0}
                step={10000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="discountPercent"
              label="Giảm giá (%)"
            >
              <InputNumber
                placeholder="Nhập % giảm giá"
                style={{ width: "100%" }}
                min={0}
                max={100}
              />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Thời gian thực hiện (phút)"
            >
              <InputNumber
                placeholder="Nhập thời gian thực hiện"
                style={{ width: "100%" }}
                min={5}
                max={240}
              />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Trạng thái dịch vụ"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Đang hoạt động"
                unCheckedChildren="Tạm ngưng"
              />
            </Form.Item>

            <Form.Item
              name="includedTests"
              label="Các xét nghiệm bao gồm"
              className="md:col-span-2"
            >
              <Select
                mode="multiple"
                placeholder="Chọn các xét nghiệm"
                style={{ width: "100%" }}
                optionFilterProp="children"
              >
                <Option value="hiv">HIV</Option>
                <Option value="syphilis">Giang mai</Option>
                <Option value="hepatitisB">Viêm gan B</Option>
                <Option value="hepatitisC">Viêm gan C</Option>
                <Option value="gonorrhea">Lậu</Option>
                <Option value="chlamydia">Chlamydia</Option>
                <Option value="hpv">HPV</Option>
                <Option value="herpes">Herpes</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả dịch vụ"
              className="md:col-span-2"
            >
              <Input.TextArea
                placeholder="Nhập mô tả chi tiết về dịch vụ"
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Modal xem chi tiết dịch vụ */}
      <ServiceDetailModal
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        service={currentService}
      />
    </div>
  );
};

export default ManageService;