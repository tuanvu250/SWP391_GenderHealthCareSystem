import React from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Divider,
  Typography,
  Tag,
  Button,
} from "antd";
import { FileTextOutlined, DownloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const resultLabel = {
  positive: "Dương tính",
  negative: "Âm tính",
  inconclusive: "Không xác định",
};

const resultColor = {
  positive: "red",
  negative: "green",
  inconclusive: "orange",
};

const ViewResultStisModal = ({
  open,
  onCancel,
  booking,
  customer,
  serviceData,
  resultData = [],
  attachmentUrl,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={<Title level={4}>Chi tiết kết quả xét nghiệm STIs</Title>}
      width={800}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      destroyOnClose
    >
      <Card className="mb-4">
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Text type="secondary">Mã đặt lịch:</Text>{" "}
            <Text strong>{booking?.bookingId}</Text>
          </Col>
          <Col span={12}>
            <Text type="secondary">Dịch vụ:</Text>{" "}
            <Text strong>{booking?.serviceName}</Text>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Text type="secondary">Khách hàng:</Text>{" "}
            <Text strong>{booking?.customerName}</Text>
          </Col>
          <Col span={12}>
            <Text type="secondary">Số điện thoại:</Text>{" "}
            <Text strong>{customer?.phone}</Text>
          </Col>
        </Row>
      </Card>

      <Divider>Kết quả xét nghiệm</Divider>

      {resultData && resultData.length > 0 ? (
        resultData.map((item, idx) => (
          <Card key={idx} className="mb-3" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>Bệnh lý / Chỉ số:</Text>
                <div>{item.testCode}</div>
              </Col>
              <Col span={8}>
                <Text strong>Kết quả:</Text>
                <div>
                  <Tag color={resultColor[item.resultText] || "default"}>
                    {resultLabel[item.resultText] || item.resultText}
                  </Tag>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>Ghi chú:</Text>
                <div>{item.note || <Text type="secondary">Không có</Text>}</div>
              </Col>
            </Row>
          </Card>
        ))
      ) : (
        <Text type="secondary">Chưa có kết quả xét nghiệm.</Text>
      )}

      <Divider />

      <div>
        <Text strong>Tài liệu đính kèm:</Text>{" "}
        {attachmentUrl ? (
          <a href={attachmentUrl} target="_blank" rel="noopener noreferrer">
            <Button
              type="link"
              icon={<DownloadOutlined />}
              style={{ padding: 0 }}
            >
              Xem/ Tải file
            </Button>
          </a>
        ) : (
          <Text type="secondary">Không có</Text>
        )}
      </div>
    </Modal>
  );
};

export default ViewResultStisModal;