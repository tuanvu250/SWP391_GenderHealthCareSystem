import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Card,
  Typography,
  Tabs,
  Select,
  message,
  Avatar,
  Tooltip,
  Popconfirm,
  DatePicker,
  Dropdown,
  Menu,
  Form,
  Row,
  Col,
  Divider,
  Modal,
} from "antd";
import {
  UserAddOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../components/provider/AuthProvider";
import {
  createUserAPI,
  editUserAPI,
  getAllUsersAPI,
  pathStatusUserAPI,
} from "../../../components/api/Users.api";
import UserFormModal from "../../components/modal/UserFormModal";
import { formatDateTime } from "../../../components/utils/format";
import dayjs from "dayjs";
import {
  UserOutlined,
  StopOutlined,
  LockOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  editEmploymentStatusAPI,
  editHourlyRateAPI,
} from "../../../components/api/Consultant.api";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManageUser = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "Admin";
  const isManager = currentUser?.role === "Manager";
  const [form] = Form.useForm();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("name"); // name, email, phone
  const [dateRange, setDateRange] = useState(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [activeTab, setActiveTab] = useState(isAdmin ? "" : "Staff");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  // State cho modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch danh sách user
  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc user dựa trên tab active và search text
  useEffect(() => {
    fetchUsers();
  }, [
    searchText,
    searchType,
    activeTab,
    pagination.current,
    pagination.pageSize,
    dateRange,
  ]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Chuẩn bị các tham số cho API
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        role: activeTab,
      };

      // Thêm điều kiện tìm kiếm theo loại
      if (searchText) {
        params[searchType] = searchText;
      }

      // Thêm điều kiện lọc theo ngày tạo
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format("YYYY-MM-DDT00:00");
        params.endDate = dateRange[1].format("YYYY-MM-DDT00:00");
      }

      const response = await getAllUsersAPI(params);

      setUsers(response.data.data.content);
      setPagination({
        ...pagination,
        total: response.data.data.totalElements,
      });
    } catch (error) {
      message.error(
        error.response?.data?.message || "Không thể tải danh sách người dùng"
      );
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    setSearchText("");
    setSearchType("name");
    setDateRange(null);
    form.resetFields();
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý thêm người dùng mới
  const handleAddUser = () => {
    setModalMode("add");
    setSelectedUser(null);
    setModalVisible(true);
  };

  // Xử lý chỉnh sửa thông tin người dùng
  const handleEditUser = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setModalVisible(true);
  };

  // Xử lý submit form từ modal
  const handleSubmitUser = async (values, userId) => {
    try {
      if (userId) {
        const userData = {
          fullName: values.fullName,
          role: values.role,
          phone: values.phone,
        };
        await editUserAPI(userId, userData);
        if (values.role === "Consultant") {
          await editHourlyRateAPI(userId, values.hourlyRate);
          await editEmploymentStatusAPI(userId, values.employmentStatus);
        }
        message.success("Cập nhật thông tin người dùng thành công!");
      } else {
        console.log("Creating user with values:", values);
        await createUserAPI({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          role: values.role,
          password: values.password,
          username: values.username,
        });
        message.success("Thêm người dùng mới thành công!");
      }

      setModalVisible(false);
      fetchUsers(); // Refresh danh sách
    } catch (error) {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xử lý người dùng"
      );
      console.error("Error processing user:", error);
    }
  };

  // Xử lý thay đổi tab
  const handleTabChange = (key) => {
    setActiveTab(key);
    setPagination({ ...pagination, current: 1 });
  };

  // Xử lý thay đổi pagination
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Menu cho dropdown search type
  const searchTypeMenu = (
    <Menu selectedKeys={[searchType]} onClick={({ key }) => setSearchType(key)}>
      <Menu.Item key="name">Họ tên</Menu.Item>
      <Menu.Item key="email">Email</Menu.Item>
      <Menu.Item key="phone">Số điện thoại</Menu.Item>
    </Menu>
  );

  // Tạo cấu hình cột cho từng loại user
  const getColumns = () => {
    // Cột chung
    const commonColumns = [
      {
        title: "ID",
        dataIndex: "userId",
        key: "userId",
        width: 80,
      },
      {
        title: "Họ tên",
        dataIndex: "fullName",
        key: "fullName",
        render: (text, record) => (
          <div className="flex items-center gap-2">
            <Avatar
              src={
                record.userImageUrl ||
                `https://placehold.co/32x32/0099CF/FFF?text=${text[0]}`
              }
              className="mr-2"
            />
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => (date ? formatDateTime(date) : "Chưa xác định"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          let color, text, icon;

          switch (status) {
            case "ACTIVE":
              color = "green";
              text = "Hoạt động";
              icon = <CheckCircleOutlined />;
              break;
            case "SUSPENDED":
              color = "orange";
              text = "Tạm khóa";
              icon = <StopOutlined />;
              break;
            case "BANNED":
              color = "red";
              text = "Vô hiệu hóa vĩnh viễn";
              icon = <LockOutlined />;
              break;
            case "DELETED":
              color = "default";
              text = "Đã xóa";
              icon = <DeleteOutlined />;
              break;
            default:
              color = "default";
              text = "Không xác định";
              icon = <UserOutlined />;
          }

          return (
            <Tag color={color} icon={icon}>
              {text}
            </Tag>
          );
        },
      },
    ];

    // Cột thao tác - cập nhật với menu dropdown để chọn trạng thái
    const actionColumn = {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => {
        // Menu cho dropdown action
        const actionMenu = (
          <Menu onClick={({ key }) => handleStatusChange(record, key)}>
            {record.status !== "ACTIVE" && (
              <Menu.Item key="ACTIVE" icon={<CheckCircleOutlined />}>
                Kích hoạt
              </Menu.Item>
            )}
            {record.status !== "SUSPENDED" && (
              <Menu.Item key="SUSPENDED" icon={<StopOutlined />}>
                Tạm khóa
              </Menu.Item>
            )}
            {record.status !== "BANNED" && (
              <Menu.Item key="BANNED" icon={<LockOutlined />}>
                Vô hiệu hóa vĩnh viễn
              </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item key="DELETED" icon={<DeleteOutlined />} danger>
              Xóa tài khoản
            </Menu.Item>
          </Menu>
        );

        return (
          <Space size="small">
            {(isAdmin || (isManager && record.role !== "Customer")) && (
              <>
                <Button size="small" onClick={() => handleEditUser(record)}>
                  Sửa
                </Button>
                <Dropdown overlay={actionMenu} placement="bottomRight">
                  <Button size="small" type="primary">
                    Trạng thái <DownOutlined />
                  </Button>
                </Dropdown>
              </>
            )}
          </Space>
        );
      },
    };

    return [...commonColumns, actionColumn];
  };

  // Thêm hàm xử lý thay đổi trạng thái
  const handleStatusChange = (record, newStatus) => {
    const action = statusMapping[newStatus] || "thay đổi trạng thái";

    Modal.confirm({
      title: `Xác nhận ${action} tài khoản`,
      content: (
        <div className="text-gray-700 w-full">
          <p>
            Bạn có chắc chắn muốn {action} tài khoản của{" "}
            <strong>{record.fullName}</strong>?
          </p>
          {newStatus === "SUSPENDED" && (
            <p>
              Tài khoản sẽ bị tạm thời vô hiệu hóa và có thể kích hoạt lại sau.
            </p>
          )}
          {newStatus === "BANNED" && (
            <p>
              Tài khoản sẽ bị vô hiệu hóa vĩnh viễn và không thể sử dụng các
              dịch vụ.
            </p>
          )}
          {newStatus === "DELETED" && (
            <p className="text-red-500 font-semibold">
              Hành động này không thể hoàn tác và tài khoản sẽ bị xóa khỏi hệ
              thống.
            </p>
          )}
        </div>
      ),
      okText: "Xác nhận",
      okType: newStatus === "DELETED" ? "danger" : "primary",
      cancelText: "Hủy",
      onOk: () => updateUserStatus(record.userId, newStatus),
    });
  };

  const statusMapping = {
    ACTIVE: "Kích hoạt",
    SUSPENDED: "Tạm khóa",
    BANNED: "Vô hiệu hóa vĩnh viễn",
    DELETED: "Xóa",
  };

  // Thêm hàm cập nhật trạng thái người dùng
  const updateUserStatus = async (userId, status) => {
    try {
      await pathStatusUserAPI(userId, status);
      message.success(`${statusMapping[status]} tài khoản thành công`);

      // Cập nhật lại danh sách
      fetchUsers();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái"
      );
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <Title level={4}>
            {isAdmin ? "Quản lý người dùng" : "Quản lý nhân sự"}
          </Title>

          <div className="flex flex-wrap gap-2">
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={handleAddUser}
            >
              Thêm người dùng
            </Button>

            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              type={showAdvancedFilter ? "primary" : "default"}
            >
              Bộ lọc nâng cao
            </Button>

            <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>
              Làm mới
            </Button>
          </div>
        </div>

        {showAdvancedFilter && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Tìm kiếm theo">
                    <Input.Group compact>
                      <Dropdown overlay={searchTypeMenu}>
                        <Button style={{ width: "30%" }}>
                          {searchType === "name"
                            ? "Họ tên"
                            : searchType === "email"
                            ? "Email"
                            : "Số điện thoại"}{" "}
                          <DownOutlined />
                        </Button>
                      </Dropdown>
                      <Input
                        style={{ width: "70%" }}
                        placeholder={`Tìm theo ${
                          searchType === "name"
                            ? "tên"
                            : searchType === "email"
                            ? "email"
                            : "số điện thoại"
                        }`}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        onPressEnter={() =>
                          setPagination({ ...pagination, current: 1 })
                        }
                      />
                    </Input.Group>
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item label="Thời gian tạo">
                    <RangePicker
                      style={{ width: "100%" }}
                      onChange={handleDateRangeChange}
                      value={dateRange}
                      format="DD/MM/YYYY"
                      placeholder={["Từ ngày", "Đến ngày"]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8} className="flex items-end mt-7">
                  <Form.Item>
                    <div className="flex gap-2">
                      <Button onClick={handleResetFilter}>Xóa bộ lọc</Button>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        )}

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {isAdmin && (
            <TabPane tab="Tất cả người dùng" key="">
              <Table
                columns={getColumns()}
                dataSource={users}
                rowKey="userId"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: "max-content" }}
              />
            </TabPane>
          )}

          {/* Tab chung cho Admin và Manager */}
          <TabPane tab="Nhân viên" key="Staff">
            <Table
              columns={getColumns()}
              dataSource={users}
              rowKey="userId"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
              scroll={{ x: "max-content" }}
            />
          </TabPane>

          <TabPane tab="Tư vấn viên" key="Consultant">
            <Table
              columns={getColumns()}
              dataSource={users}
              rowKey="userId"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
              scroll={{ x: "max-content" }}
            />
          </TabPane>

          <TabPane tab="Khách hàng" key="Customer">
            <Table
              columns={getColumns()}
              dataSource={users}
              rowKey="userId"
              loading={loading}
              pagination={pagination}
              onChange={handleTableChange}
              scroll={{ x: "max-content" }}
            />
          </TabPane>

          {/* Nếu là Admin thì có thêm tab Manager */}
          {isAdmin && (
            <TabPane tab="Quản lý" key="Manager">
              <Table
                columns={getColumns()}
                dataSource={users}
                rowKey="userId"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: "max-content" }}
              />
            </TabPane>
          )}
        </Tabs>
      </Card>

      {/* Modal chung cho thêm và sửa người dùng */}
      <UserFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmitUser}
        userData={selectedUser}
        isAdmin={isAdmin}
        mode={modalMode}
      />
    </div>
  );
};

export default ManageUser;
