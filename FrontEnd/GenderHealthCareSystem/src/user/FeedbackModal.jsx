import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Rate,
  Typography,
  Tag,
  Divider,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  StarFilled,
  UserOutlined,
  MedicineBoxOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { postFeedbackConsultantAPI } from "../components/api/FeedbackConsultant.api";
import { postFeedbackTestingAPI } from "../components/api/FeedbackTesting.api";
import { editFeedbackConsultantAPI } from "../components/api/FeedbackConsultant.api";
import { editFeedbackTestingAPI } from "../components/api/FeedbackTesting.api";

const { Title, Text } = Typography;

/**
 * Component Modal đánh giá có thể dùng chung cho đánh giá tư vấn viên và dịch vụ
 * @param {Object} props - Props của component
 * @param {boolean} props.visible - Trạng thái hiển thị của modal
 * @param {Function} props.onCancel - Hàm xử lý khi đóng modal
 * @param {Object} props.data - Dữ liệu để hiển thị (booking hoặc consultation)
 * @param {string} props.type - Loại đánh giá: "service" hoặc "consultant"
 * @param {string} props.mode - Chế độ: "create" hoặc "edit"
 * @param {Object} props.existingReview - Dữ liệu đánh giá hiện có (cho chế độ edit)
 * @param {Function} props.onSuccess - Hàm callback khi xử lý thành công
 */
const FeedbackModal = ({ 
  visible, 
  onCancel, 
  data, 
  type = "service", 
  mode = "create",
  existingReview = null,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (visible) {
      if (isEdit && existingReview) {
        form.setFieldsValue({
          content: existingReview.comment || existingReview.content
        });
        setRating(existingReview.rating);
      } else {
        form.resetFields();
        setRating(5);
      }
    }
  }, [visible, form, existingReview, isEdit]);

  // Xử lý submit form trực tiếp
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const feedbackData = {
        rating,
        content: values.content,
        id: data?.id || data?.bookingId,
        reviewId: isEdit && existingReview ? (existingReview.reviewId || existingReview.feedbackId) : undefined,
        consultantId: data?.consultantId,
        bookingId: data?.bookingId,
      };
      
      console.log("Dữ liệu đánh giá:", feedbackData);
      if (isEdit) {
        if (type === "service") {
          await editFeedbackTestingAPI(
            feedbackData.reviewId,
            feedbackData.rating,
            feedbackData.content
          );
        } else {
          await editFeedbackConsultantAPI(
            feedbackData.rating,
            feedbackData.content,
            feedbackData.consultantId,
            feedbackData.bookingId
          );
        }
        message.success("Đã cập nhật đánh giá thành công!");
      } else {
        if (type === "service") {
          await postFeedbackTestingAPI(
            feedbackData.id,
            feedbackData.rating,
            feedbackData.content
          );
        } else {
          await postFeedbackConsultantAPI(
            feedbackData
          );
        }
        message.success("Đã gửi đánh giá thành công!");
      }
      
      form.resetFields();
      onCancel();
      
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      message.error(error?.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (type === "service") {
      return (
        <>
          <div className="flex items-center justify-between">
            <Text strong>Dịch vụ:</Text>
            <div className="font-medium">{data?.serviceName}</div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Text strong>Ngày sử dụng:</Text>
            <div>{data?.appointmentDate}</div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex items-center justify-between">
            <Text strong>Tư vấn viên:</Text>
            <div className="font-medium">{data?.consultantName}</div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Text strong>Thời gian tư vấn:</Text>
            <div>{data?.consultationTime || data?.appointmentDate}</div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Text strong>Hình thức:</Text>
            <Tag color="blue">{data?.consultationType || "Trực tuyến"}</Tag>
          </div>
          {isEdit && existingReview && (
            <div className="flex items-center justify-between mt-2">
              <Text strong>Đánh giá vào:</Text>
              <div>{existingReview.createdAt}</div>
            </div>
          )}
        </>
      );
    }
  };

  const modalTitle = (
    <span className="text-lg">
      {isEdit ? (
        <><EditOutlined className="mr-2" />Chỉnh sửa đánh giá</>
      ) : (
        <>Đánh giá {type === "service" ? "dịch vụ" : "tư vấn viên"}</>
      )}
    </span>
  );

  return (
    <Modal
      title={modalTitle}
      open={visible}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {isEdit ? "Cập nhật đánh giá" : "Gửi đánh giá"}
        </Button>,
      ]}
      onCancel={onCancel}
      width={500}
      destroyOnClose
    >
      <div className="space-y-6">
        <div className="text-center pb-4 border-b">
          <Title level={4} className="mb-1">
            {isEdit ? "Chỉnh sửa đánh giá" : `Đánh giá ${type === "service" ? "dịch vụ" : "tư vấn viên"}`}
          </Title>
          {!isEdit && (
            <Text type="secondary">
              Cảm ơn bạn đã sử dụng {type === "service" ? "dịch vụ" : "dịch vụ tư vấn"} của chúng tôi. 
              Hãy đánh giá trải nghiệm của bạn!
            </Text>
          )}
          {isEdit && (
            <Text type="secondary">
              Bạn có thể chỉnh sửa đánh giá đã gửi trước đây.
            </Text>
          )}
        </div>

        <div>
          {renderContent()}
        </div>

        <Form form={form} layout="vertical">
          <div className="space-y-4">
            <div className="text-center">
              <Text strong>Mức độ hài lòng của bạn:</Text>
              <div className="mt-2">
                <Rate
                  value={rating}
                  onChange={setRating}
                  character={<StarFilled />}
                  className="text-2xl text-yellow-400"
                  allowClear={false}
                />
                <div className="mt-2">
                  {rating === 5 && (
                    <Text type="success">Rất hài lòng</Text>
                  )}
                  {rating === 4 && (
                    <Text type="success">Hài lòng</Text>
                  )}
                  {rating === 3 && <Text>Bình thường</Text>}
                  {rating === 2 && (
                    <Text type="warning">Không hài lòng</Text>
                  )}
                  {rating === 1 && (
                    <Text type="danger">Rất không hài lòng</Text>
                  )}
                </div>
              </div>
            </div>

            <Form.Item
              name="content"
              label="Nhận xét của bạn:"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập nhận xét của bạn",
                },
              ]}
            >
              <Input.TextArea
                placeholder={`Chia sẻ trải nghiệm của bạn về ${type === "service" ? "dịch vụ" : "tư vấn viên"}...`}
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Divider />
            
            {!isEdit && (
              <div className="text-gray-500 text-sm">
                <p className="mb-1 flex items-start">
                  <InfoCircleOutlined className="mr-2 mt-1" />
                  <span>
                    Đánh giá của bạn giúp chúng tôi 
                    {type === "service" 
                      ? " cải thiện chất lượng dịch vụ tốt hơn." 
                      : " nâng cao chất lượng đội ngũ tư vấn."}
                  </span>
                </p>
              </div>
            )}
            {isEdit && (
              <div className="text-gray-500 text-sm">
                <p className="mb-1 flex items-start">
                  <InfoCircleOutlined className="mr-2 mt-1" />
                  <span>
                    Bạn có thể chỉnh sửa đánh giá trong vòng 30 ngày sau khi gửi.
                  </span>
                </p>
              </div>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default FeedbackModal;