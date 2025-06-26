import React from "react";
import { Modal, Card, Typography, Divider, Descriptions, List, Space, Tag } from "antd";

const { Title, Text, Paragraph } = Typography;

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

const getCategoryDisplay = (category) => {
  switch (category) {
    case "single":
      return <Tag color="blue">Dịch vụ đơn</Tag>;
    case "combo":
      return <Tag color="purple">Gói combo</Tag>;
    default:
      return <Tag>Không xác định</Tag>;
  }
};

const ServiceDetailModal = ({ open, onCancel, service, formatPrice }) => {
  if (!service) return null;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      title={<Title level={4}>Chi tiết dịch vụ</Title>}
    >
      <Card className="mb-4">
        <Title level={4}>{service.serviceName}</Title>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {getCategoryDisplay(service.type)}
            <Tag color={service.status === "ACTIVE" ? "green" : "red"}>
              {service.status === "ACTIVE" ? "Đang hoạt động" : "Tạm ngưng"}
            </Tag>
          </div>
          <div>
            {service.discountPercent > 0 && (
              <Text delete type="secondary" className="mr-2">
                {formatPrice(service.price)}
              </Text>
            )}
            <Text type="danger" strong style={{ fontSize: "18px" }}>
              {service.discount > 0
                ? formatPrice(service.price * (1 - service.discount / 100))
                : formatPrice(service.price)}
            </Text>
            {service.discount > 0 && (
              <Tag color="red" className="ml-2">
                -{service.discount}%
              </Tag>
            )}
          </div>
        </div>

        <Divider />

        <Descriptions column={1} className="mb-4">
          <Descriptions.Item label="Thời gian thực hiện">
            {service.duration}
          </Descriptions.Item>
        </Descriptions>

        <Paragraph className="mb-4">
          <Text strong>Mô tả dịch vụ:</Text>
          <br />
          <Text>{service.description || "Không có mô tả"}</Text>
        </Paragraph>

        <Divider orientation="left">Các xét nghiệm bao gồm</Divider>

        {service.tests ? (
          <List
            size="small"
            dataSource={service.tests.split(",").map((test) => test.trim())}
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

export default ServiceDetailModal;