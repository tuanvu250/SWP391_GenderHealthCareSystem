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
  Modal,
  Form,
  Select,
  message,
  Avatar,
  Tooltip,
  Popconfirm
} from "antd";
import { getAllUsersAPI, updateUserStatusAPI, updateUserRoleAPI } from "../../../components/api/User.api";
import { useAuth } from "../../../components/provider/AuthProvider";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const ManageUser = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "Admin";
  const isManager = currentUser?.role === "Manager";
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState(isAdmin ? "all" : "staff");
  
  // State cho modal thêm/sửa user
  const [userModal, setUserModal] = useState({
    visible: false,
    mode: "add", // "add" hoặc "edit"
    currentUser: null
  });
  
  const [form] = Form.useForm();
  
  // Fetch danh sách user
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Lọc user dựa trên tab active và search text
  useEffect(() => {
    filterUsers();
  }, [users, searchText, activeTab]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsersAPI();
      if (response && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      message.error("Không thể tải danh sách người dùng");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Lọc user theo tab và search
  const filterUsers = () => {
    let filtered = [...users];
    
    // Lọc theo tab
    if (activeTab !== "all") {
      filtered = filtered.filter(user => 
        user.role.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    // Lọc theo text search
    if (searchText) {
      filtered = filtered.filter(
        user =>
          user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          (user.phone && user.phone.includes(searchText))
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  // Xử lý thay đổi tab
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  
  // Tạo cấu hình cột cho từng loại user
  const getColumns = () => {
    // Cột chung
    const commonColumns = [
      {
        title: "ID",
        dataIndex: "userId",
        key: "userId",
        width: 70
      },
      {
        title: "Họ tên",
        dataIndex: "fullName",
        key: "fullName",
        render: (text, record) => (
          <div className="flex items-center">
            <Avatar 
              src={record.avatarUrl || `https://placehold.co/32x32/0099CF/FFF?text=${text[0]}`}
              className="mr-2"
            />
            <span>{text}</span>
          </div>
        )
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={status === "ACTIVE" ? "green" : "red"}>
            {status === "ACTIVE" ? "Hoạt động" : "Vô hiệu"}
          </Tag>
        )
      }
    ];
    
    // Cột thao tác
    const actionColumn = {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => handleEditUser(record)}>
            Sửa
          </Button>
          
          {/* Kích hoạt/Vô hiệu hóa tài khoản */}
          <Popconfirm
            title={`${record.status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"} tài khoản này?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button 
              size="small" 
              type={record.status === "ACTIVE" ? "default" : "primary"}
            >
              {record.status === "ACTIVE" ? "Vô hiệu" : "Kích hoạt"}
            </Button>
          </Popconfirm>
          
          {/* Admin có thêm quyền thay đổi role */}
          {isAdmin && (
            <Select
              defaultValue={record.role}
              style={{ width: 120 }}
              onChange={(value) => handleRoleChange(record.userId, value)}
              size="small"
            >
              <Option value="Staff">Nhân viên</Option>
              <Option value="Consultant">Tư vấn viên</Option>
              <Option value="Customer">Khách hàng</Option>
              <Option value="Manager">Quản lý</Option>
              <Option value="Admin">Quản trị</Option>
            </Select>
          )}
        </Space>
      )
    };
    
    // Cột đặc biệt cho từng loại user
    const staffColumns = [
      // Cột riêng cho staff
    ];
    
    const consultantColumns = [
      {
        title: "Chuyên môn",
        dataIndex: "specialization",
        key: "specialization",
      },
      {
        title: "Đánh giá",
        dataIndex: "rating",
        key: "rating",
        render: (rating) => `${rating || 0}/5`
      }
    ];
    
    const customerColumns = [
      {
        title: "Số đơn hàng",
        dataIndex: "orderCount",
        key: "orderCount",
        render: (count) => count || 0
      }
    ];
    
    // Lựa chọn cột theo tab
    let specificColumns = [];
    
    switch (activeTab) {
      case "Staff":
        specificColumns = staffColumns;
        break;
      case "Consultant":
        specificColumns = consultantColumns;
        break;
      case "Customer":
        specificColumns = customerColumns;
        break;
      default:
        // Không thêm cột đặc biệt
        break;
    }
    
    return [...commonColumns, ...specificColumns, actionColumn];
  };
  
  // Xử lý kích hoạt/vô hiệu hóa tài khoản
  const handleToggleStatus = async (record) => {
    try {
      const newStatus = record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateUserStatusAPI(record.userId, newStatus);
      
      message.success(`${newStatus === "ACTIVE" ? "Kích hoạt" : "Vô hiệu hóa"} tài khoản thành công`);
      
      // Cập nhật lại danh sách
      fetchUsers();
    } catch (error) {
      message.error("Không thể cập nhật trạng thái tài khoản");
      console.error("Error updating user status:", error);
    }
  };
  
  // Xử lý thay đổi role (chỉ dành cho Admin)
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRoleAPI(userId, newRole);
      message.success("Cập nhật vai trò thành công");
      fetchUsers();
    } catch (error) {
      message.error("Không thể cập nhật vai trò người dùng");
      console.error("Error updating user role:", error);
    }
  };
  
  // Xử lý chỉnh sửa thông tin user
  const handleEditUser = (user) => {
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      // Các trường khác tùy theo loại user
    });
    
    setUserModal({
      visible: true,
      mode: "edit",
      currentUser: user
    });
  };
  
  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>
            {isAdmin ? "Quản lý người dùng" : "Quản lý nhân sự"}
          </Title>
          
          <Search
            placeholder="Tìm kiếm theo tên, email, số điện thoại"
            allowClear
            enterButton="Tìm kiếm"
            onSearch={(value) => setSearchText(value)}
            style={{ width: 300 }}
          />
        </div>
        
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {/* Tab cho Admin */}
          {isAdmin && (
            <TabPane tab="Tất cả người dùng" key="all">
              <Table
                columns={getColumns()}
                dataSource={filteredUsers}
                rowKey="userId"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
          )}
          
          {/* Tab chung cho Admin và Manager */}
          <TabPane tab="Nhân viên" key="Staff">
            <Table
              columns={getColumns()}
              dataSource={filteredUsers}
              rowKey="userId"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          
          <TabPane tab="Tư vấn viên" key="Consultant">
            <Table
              columns={getColumns()}
              dataSource={filteredUsers}
              rowKey="userId"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          
          <TabPane tab="Khách hàng" key="Customer">
            <Table
              columns={getColumns()}
              dataSource={filteredUsers}
              rowKey="userId"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          
          {/* Nếu là Admin thì có thêm tab Manager */}
          {isAdmin && (
            <TabPane tab="Quản lý" key="Manager">
              <Table
                columns={getColumns()}
                dataSource={filteredUsers}
                rowKey="userId"
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
          )}
        </Tabs>
      </Card>
      
      {/* Modal thêm/sửa thông tin user */}
      <Modal
        title={userModal.mode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa thông tin"}
        open={userModal.visible}
        onCancel={() => setUserModal({ ...userModal, visible: false })}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitUserForm}
        >
          {/* Các trường form tùy theo loại user */}
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          
          {/* Các trường form khác */}
          
          <div className="flex justify-end mt-4">
            <Button className="mr-2" onClick={() => setUserModal({ ...userModal, visible: false })}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {userModal.mode === "add" ? "Thêm" : "Lưu thay đổi"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUser;