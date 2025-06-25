import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Divider,
  Typography
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const serviceCategories = [
  { value: "single", label: "Dịch vụ đơn lẻ" },
  { value: "combo", label: "Gói combo" },
];

// Danh sách bệnh có sẵn
const availableTests = [
  { value: "hiv", label: "HIV" },
  { value: "syphilis", label: "Giang mai" },
  { value: "hepatitisB", label: "Viêm gan B" },
  { value: "hepatitisC", label: "Viêm gan C" },
  { value: "gonorrhea", label: "Lậu" },
  { value: "chlamydia", label: "Chlamydia" },
  { value: "hpv", label: "HPV" },
  { value: "herpes", label: "Herpes" },
];

const ServiceFormModal = ({ open, onCancel, onOk, form, editingId}) => {
  const category = Form.useWatch("type", form);
  const [customTests, setCustomTests] = useState([]);

  // Xử lý khi thay đổi loại dịch vụ
  const handleValuesChange = (changedValues) => {
    // Nếu người dùng chuyển sang "Dịch vụ đơn lẻ" và đang có nhiều hơn 1 xét nghiệm,
    // tự động giữ lại xét nghiệm đầu tiên.
    if (changedValues.type === "single") {
      const currentTests = form.getFieldValue("tests");
      if (currentTests && currentTests.length > 1) {
        form.setFieldsValue({ includedTests: [currentTests[0]] });
      }
    }
  };

  // Xử lý thêm loại bệnh tùy chỉnh
  const handleAddCustomTest = (name) => {
    // Format tên bệnh để làm value (lowercase, không dấu)
    const value = name.toLowerCase().replace(/\s+/g, '_');
    
    // Thêm vào danh sách bệnh tùy chỉnh
    setCustomTests([...customTests, { value, label: name }]);
    return value;
  };

  // Danh sách tất cả các loại bệnh (có sẵn + tùy chỉnh)
  const allTests = [...availableTests, ...customTests];


  return (
    <Modal
      title={editingId ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={800}
      okText={editingId ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        initialValues={{
          price: 0,
          discount: 0,
          status: true,
          category: "single",
          includedTests: [""], // Khởi tạo với 1 mục
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="serviceName"
            label="Tên dịch vụ"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
            className="md:col-span-2"
          >
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại dịch vụ"
            rules={[{ required: true, message: "Vui lòng chọn loại dịch vụ" }]}
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
            rules={[{ required: true, message: "Vui lòng nhập giá dịch vụ" }]}
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

          <Form.Item name="discount" label="Giảm giá (%)">
            <Input
              placeholder="Nhập % giảm giá"
              style={{ width: "100%" }}
              min={0}
              max={100}
            />
          </Form.Item>

          <Form.Item name="duration" label="Thời gian chẩn đoán">
            <Input
              placeholder="Nhập thời gian (ví dụ: 2 - 3 ngày)"
              style={{ width: "100%" }}
              min={5}
              max={240}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái dịch vụ"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Đang hoạt động"
              unCheckedChildren="Tạm ngưng"
            />
          </Form.Item>

          <div className="md:col-span-2">
            <Form.List
              name="tests"
              rules={[
                {
                  validator: async (_, tests) => {
                    if (!tests || tests.length < 1) {
                      return Promise.reject(
                        new Error("Vui lòng thêm ít nhất một loại bệnh.")
                      );
                    }
                  },  
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  <div className="mb-2">
                    <Text strong>Các bệnh được kiểm tra</Text>
                    {category === "single" && (
                      <Text type="secondary" className="ml-2">
                        (Dịch vụ đơn lẻ chỉ chứa một loại bệnh)
                      </Text>
                    )}
                  </div>

                  {fields.map((field, index) => {
                    // Tách key từ field object
                    const { key, ...restField } = field;
                    
                    return (
                      <div key={key} className="mb-3 flex items-center gap-2">
                        <Form.Item
                          {...restField} // Dùng restField thay vì field để loại bỏ key prop
                          rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập tên bệnh' }]}
                          style={{ flex: 1, marginBottom: 0 }}
                        >
                          <Select
                            placeholder="Chọn hoặc nhập tên bệnh"
                            showSearch
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            dropdownRender={(menu) => (
                              <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <div style={{ padding: '0 8px 4px' }}>
                                  <Input.Search
                                    placeholder="Nhập tên bệnh mới"
                                    enterButton={<PlusOutlined />}
                                    onSearch={(value) => {
                                      if (!value) return;
                                      const customValue = handleAddCustomTest(value);
                                      
                                      // Cập nhật giá trị trong form
                                      form.setFieldsValue({
                                        includedTests: form.getFieldValue('includedTests').map(
                                          (test, idx) => idx === restField.name ? customValue : test
                                        )
                                      });
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          >
                            {allTests.map((test) => (
                              <Option key={test.value} value={test.value}>
                                {test.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {fields.length > 1 && (
                          <Button 
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        )}
                      </div>
                    );
                  })}

                  {(category !== "single" || fields.length === 0) && (
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add("")}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm bệnh cần kiểm tra
                      </Button>
                    </Form.Item>
                  )}
                  <Form.ErrorList errors={errors} />
                </>
              )}
            </Form.List>
          </div>

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
  );
};

export default ServiceFormModal;