import React from 'react';
import { 
  Modal, 
  Button, 
  Typography, 
  Divider, 
  Rate, 
  Popconfirm 
} from 'antd';
import { 
  StarFilled, 
  CalendarOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import { formatDateTime } from '../../../components/utils/format';

const { Text, Paragraph } = Typography;

/**
 * Component hiển thị modal chi tiết đánh giá
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Trạng thái hiển thị modal
 * @param {Object} props.feedback - Dữ liệu đánh giá
 * @param {string} props.type - Loại đánh giá ("service" hoặc "consultant") 
 * @param {Function} props.onClose - Hàm xử lý khi đóng modal
 * @param {Function} props.onDelete - Hàm xử lý khi xóa đánh giá
 */
const FeedbackModal = ({ 
  visible, 
  feedback, 
  type = "service", 
  onClose, 
  onDelete 
}) => {
  if (!feedback) return null;
  
  // Xác định các trường dữ liệu dựa vào loại đánh giá
  const isServiceFeedback = type === "service";
  const title = isServiceFeedback ? "Chi tiết đánh giá dịch vụ" : "Chi tiết đánh giá chuyên viên";
  
  // Trường nội dung đánh giá (có thể khác nhau giữa các loại)
  const content = feedback.content || feedback.comment || feedback.description || "";

  return (
    <Modal
      title={title}
      open={visible}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      onCancel={onClose}
      width={700}
    >
      <div className="space-y-4">
        <div>
          <div className="mb-2">
            <Text strong className="text-lg">{feedback.userName || feedback.userFullName}</Text>
            <div className="text-gray-500 mt-1">
              <CalendarOutlined className="mr-1" /> 
              {formatDateTime(feedback.createdAt)}
            </div>
          </div>
          
          <div className="mt-3">
            <Rate 
              disabled 
              defaultValue={feedback.rating} 
              character={<StarFilled />}
              className="text-yellow-400" 
            />
          </div>
          
          <Paragraph className="mt-3">
            {content}
          </Paragraph>
        </div>
        
        <Divider />
        
        {/* Chi tiết tuỳ theo loại đánh giá */}
        {isServiceFeedback ? (
          <div>
            <Text strong>Chi tiết dịch vụ</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <Text type="secondary">Tên dịch vụ:</Text>
                <div>{feedback.serviceName}</div>
              </div>
              <div>
                <Text type="secondary">Mã đặt lịch:</Text>
                <div>#{feedback.bookingId}</div>
              </div>
            </div>
            <div className="mt-2">
              <Text type="secondary">Ngày sử dụng dịch vụ:</Text>
              <div>{feedback.appointmentDate || feedback.bookingDate}</div>
            </div>
          </div>
        ) : (
          <div>
            <Text strong>Chi tiết buổi tư vấn</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <Text type="secondary">Tên chuyên viên:</Text>
                <div>{feedback.consultantName}</div>
              </div>
              <div>
                <Text type="secondary">Mã buổi tư vấn:</Text>
                <div>#{feedback.consultingId || feedback.appointmentId}</div>
              </div>
            </div>
            {feedback.consultingDate && (
              <div className="mt-2">
                <Text type="secondary">Ngày tư vấn:</Text>
                <div>{feedback.consultingDate}</div>
              </div>
            )}
          </div>
        )}
        
        <Divider />
        
        <div className="flex justify-end">
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn có chắc chắn muốn xóa đánh giá này?"
            onConfirm={() => {
              onClose();
              onDelete(feedback.id || feedback.feedbackId);
            }}
            okText="Xóa"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;