import React from "react";
import { Modal, Form, Input, Button, Space, message } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { updateBookingMeetLink } from "../../../components/api/ConsultantBooking.api";

const UpdateMeetLinkModal = ({ 
  visible, 
  booking, 
  onCancel, 
  onSuccess 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  // Cập nhật form khi booking thay đổi
  React.useEffect(() => {
    if (visible && booking) {
      form.setFieldsValue({
        meetLink: booking.meetLink || '',
      });
    }
  }, [visible, booking, form]);

  const handleSubmit = async (values) => {
    if (!booking) return;
    setLoading(true);
    
    try {
      await updateBookingMeetLink(booking.bookingId, values.meetLink);
      message.success("Cập nhật link cuộc họp thành công!");
      form.resetFields();
      onSuccess();
    } catch (err) {
      console.error("Lỗi cập nhật link cuộc họp:", err);
      message.error(err?.response?.data?.message || "Không thể cập nhật link cuộc họp.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <LinkOutlined className="text-blue-500" />
          <span>Cập nhật link cuộc họp</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="meetLink"
          label="Link cuộc họp"
          rules={[
            { required: true, message: 'Vui lòng nhập link cuộc họp!' },
          ]}
        >
          <Input 
            prefix={<LinkOutlined className="text-gray-400" />} 
            placeholder="Nhập link cuộc họp (vd: https://meet.google.com/xxx-xxxx-xxx)" 
          />
        </Form.Item>
        
        <Form.Item className="mb-0 flex justify-end">
          <Space>
            <Button onClick={handleCancel}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              Cập nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMeetLinkModal;