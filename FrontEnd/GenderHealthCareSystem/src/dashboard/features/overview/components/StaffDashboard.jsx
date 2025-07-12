import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Typography,
  Divider,
  message,
  Popconfirm,
} from "antd";
import {
  ClockCircleOutlined,
  MedicineBoxOutlined,
  FileDoneOutlined,
  UserOutlined,
  LinkOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ChartComponent from "../../../components/chart/ChartComponent";
import { appointmentsChartOptions } from "../utils/chartConfig";
import { getAllBookings, updateBookingStatus} from "../../../../components/api/ConsultantBooking.api";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { 
  manageBookingsAPI, 
  viewResultStisAPI, 
  markPendingResultBookingStisAPI,
  markCompletedBookingStisAPI
} from "../../../../components/api/BookingTesting.api";
import UpdateMeetLinkModal from "../../../components/modal/UpdateMeetLinkModal";
import ResultStisModal from "../../../components/modal/ResultStisModal";
import ViewResultStisModal from "../../../components/modal/ViewResultStisModal";
import { getUserByIdAPI } from "../../../../components/api/Auth.api";
import { getServiceTestingByIdAPI } from "../../../../components/api/ServiceTesting.api";

const { Text, Title } = Typography;

const StaffDashboard = ({ stats }) => {
  const [testingAppointments, setTestingAppointments] = useState([]);
  const [consultingAppointments, setConsultingAppointments] = useState([]);
  const [paginationTesting, setPaginationTesting] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [paginationConsulting, setPaginationConsulting] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  
  // States cho modal cập nhật link meeting
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // States cho modal nhập và xem kết quả xét nghiệm
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [viewResultModalVisible, setViewResultModalVisible] = useState(false);
  const [selectedTestingBooking, setSelectedTestingBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const fetchConsultingAppointments = async () => {
    try {
      const response = await getAllBookings({
        size: paginationConsulting.pageSize,
        page: paginationConsulting.current - 1,
        status: "CONFIRMED",
      });
      const data = response.data.content.map((item) => ({
        ...item,
        bookingTimeStart: dayjs(item.bookingDate).format("HH:mm"),
        bookingTimeEnd: dayjs(item.bookingDate).add(1, "hour").format("HH:mm"),
      }));
      setConsultingAppointments(data);
      setPaginationConsulting({
        ...paginationConsulting,
        total: response.data.totalElements,
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchTestingAppointments = async () => {
    try {
      const response = await manageBookingsAPI({
        page: paginationTesting.current - 1,
        size: paginationTesting.pageSize,
        status: "PENDING_TEST_RESULT",
      });
      setPaginationTesting({
        ...paginationTesting,
        total: response.data.data.totalElements,
      });

      setTestingAppointments(
        response.data.data.content.map((booking) => ({
          ...booking,
          bookingTimeStart: booking.bookingTimeStart,
          bookingTimeEnd: booking.bookingTimeEnd,
        }))
      );
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };
  
  // Hàm mở modal cập nhật link
  const showUpdateLinkModal = (booking) => {
    setCurrentBooking(booking);
    setIsModalVisible(true);
  };
  
  // Hàm đóng modal cập nhật link
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentBooking(null);
  };
  
  // Hàm xử lý khi cập nhật link thành công
  const handleUpdateSuccess = () => {
    setIsModalVisible(false);
    setCurrentBooking(null);
    // Tải lại dữ liệu lịch hẹn
    fetchConsultingAppointments();
  };
  
  // Hàm cập nhật trạng thái booking thành "SCHEDULED" (Đã lên lịch)
  const handleUpdateStatus = async (bookingId) => {
    setUpdateLoading(true);
    try {
      await updateBookingStatus(bookingId, "SCHEDULED");
      message.success("Cập nhật trạng thái thành công!");
      // Tải lại danh sách lịch hẹn
      fetchConsultingAppointments();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      message.error(err?.response?.data?.message || "Không thể cập nhật trạng thái.");
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Hàm lấy thông tin khách hàng và dịch vụ khi cần nhập/xem kết quả
  const handleGetTestingData = async (booking) => {
    try {
      const userResponse = await getUserByIdAPI(booking.customerId);
      setCustomer(userResponse.data.data);
      
      const serviceResponse = await getServiceTestingByIdAPI(booking.serviceId);
      setServiceData(serviceResponse.data.data);
    } catch (error) {
      console.error("Error fetching testing data:", error);
      message.error("Không thể tải dữ liệu khách hàng và dịch vụ");
    }
    setSelectedTestingBooking(booking);
  };
  
  // Hàm mở modal nhập kết quả
  const handleEnterResult = async (booking) => {
    await handleGetTestingData(booking);
    setResultModalVisible(true);
  };
  
  // Hàm mở modal xem kết quả
  const handleViewResult = async (booking) => {
    try {
      await handleGetTestingData(booking);
      const response = await viewResultStisAPI(booking.bookingId);
      setResultData(response.data.data || []);
      setAttachmentUrl(response.data.data[0]?.pdfResultUrl || "");
      setViewResultModalVisible(true);
    } catch (error) {
      console.error("Error loading test results:", error);
      message.error("Không thể tải kết quả xét nghiệm");
    }
  };
  
  // Hàm xử lý khi lưu kết quả thành công
  const handleResultSaveSuccess = () => {
    setResultModalVisible(false);
    fetchTestingAppointments();
    message.success("Đã lưu kết quả xét nghiệm thành công!");
  };

  useEffect(() => {
    fetchConsultingAppointments();
  }, [paginationConsulting.current, paginationConsulting.pageSize]);

  useEffect(() => {
    fetchTestingAppointments();
  }, [paginationTesting.current, paginationTesting.pageSize]);

  // Biểu đồ đường cho số lượng các loại lịch hẹn theo ngày
  const appointmentTypeChart = stats.appointmentTypeData
    ? {
        labels: stats.appointmentTypeData.map((d) => d.date),
        datasets: [
          {
            label: "Xét nghiệm STIs",
            data: stats.appointmentTypeData.map((d) => d.testAppointments),
            borderColor: "#1677ff",
            backgroundColor: "rgba(22, 119, 255, 0.1)",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "Tư vấn",
            data: stats.appointmentTypeData.map((d) => d.consultAppointments),
            borderColor: "#52c41a",
            backgroundColor: "rgba(82, 196, 26, 0.1)",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      }
    : null;

  return (
    <>
      <Row gutter={[16, 16]}>
        {/* Stats cards - 3 cards now take less width */}
        <Col xs={24} md={4}>
          <Card>
            <Statistic
              title="Lịch hẹn chờ xác nhận"
              value={consultingAppointments.length || 0}
              valueStyle={{
                color: stats.pendingAppointments > 5 ? "#faad14" : "",
              }}
              prefix={<ClockCircleOutlined />}
            />
            {stats.pendingAppointments > 0 && (
              <div className="mt-2">
                <Button size="small" type="primary">
                  Xem tất cả
                </Button>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={4}>
          <Card>
            <Statistic
              title="Khách đến xét nghiệm hôm nay"
              value={stats.todayTestings || 0}
              valueStyle={{ color: "#1677ff" }}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={4}>
          <Card>
            <Statistic
              title="Kết quả cần cập nhật"
              value={testingAppointments.length || 0}
              valueStyle={{
                color: testingAppointments.length > 0 ? "#f5222d" : "",
              }}
              prefix={<FileDoneOutlined />}
            />
            {testingAppointments.length > 0 && (
              <div className="mt-2">
                <Button size="small" danger>
                  Cập nhật ngay
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Chart now takes up more space */}
        <Col xs={24} md={12}>
          <Card title="Số lượng lịch hẹn theo ngày" className="h-full">
            {appointmentTypeChart ? (
              <div
                className="chart-container"
                style={{ height: "240px", width: "100%" }}
              >
                <ChartComponent
                  data={appointmentTypeChart}
                  options={appointmentsChartOptions}
                  type="line"
                  height="240px"
                />
              </div>
            ) : (
              <div className="text-center p-6">Không có dữ liệu biểu đồ</div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card title="Lịch hẹn xét nghiệm cần nhập kết quả" className="mb-4">
            <Table
              dataSource={testingAppointments}
              rowKey="id"
              columns={[
                {
                  title: "Ngày hẹn",
                  dataIndex: "bookingDate",
                  key: "bookingDate",
                  render: (text) => (
                    <Text strong>{dayjs(text).format("DD/MM/YYYY")}</Text>
                  ),
                },
                {
                  title: "Thời gian",
                  dataIndex: "bookingTimeStart",
                  key: "bookingTimeStart",
                  render: (time, record) => (
                    <span>
                      {record.bookingTimeStart} - {record.bookingTimeEnd}
                    </span>
                  ),
                },
                {
                  title: "Khách hàng",
                  dataIndex: "customerName",
                  key: "customerName",
                  render: (text, record) => (
                    <div className="flex items-center">
                      <UserOutlined className="mr-2" />
                      {text}
                    </div>
                  ),
                },
                {
                  title: "Tên xét nghiệm",
                  dataIndex: "serviceName",
                  key: "serviceName",
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => {
                    let color = "yellow";
                    let text = "Chờ kết quả";
                    
                    if (status === "COMPLETED") {
                      color = "green";
                      text = "Hoàn thành";
                    }
                    
                    return <Tag color={color}>{text}</Tag>;
                  }
                },
                {
                  title: "Hành động",
                  key: "action",
                  render: (_, record) => (
                    <div>
                      {record.status === "PENDING_TEST_RESULT" ? (
                        <Button
                          size="small"
                          type="primary"
                          icon={<EditOutlined />}
                          className="bg-green-600 mr-1"
                          onClick={() => handleEnterResult(record)}
                        >
                          Nhập kết quả
                        </Button>
                      ) : record.status === "COMPLETED" ? (
                        <Button
                          size="small"
                          type="default"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewResult(record)}
                        >
                          Xem kết quả
                        </Button>
                      ) : (
                        <Text type="secondary">Không có hành động</Text>
                      )}
                    </div>
                  ),
                },
              ]}
              size="small"
              pagination={paginationTesting}
              onChange={(pagination) =>
                setPaginationTesting({
                  ...paginationTesting,
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                })
              }
              scroll={{ x: "max-content" }}
            />
          </Card>

          <Card title="Lịch hẹn tư vấn cần cập nhật link meeting">
            <Table
              dataSource={consultingAppointments}
              rowKey="bookingId"
              columns={[
                {
                  title: "Ngày hẹn",
                  dataIndex: "bookingDate",
                  key: "bookingDate",
                  render: (date) => dayjs(date).format("DD/MM/YYYY"),
                },
                {
                  title: "Thời gian",
                  dataIndex: "bookingTimeStart",
                  key: "bookingTimeStart",
                  render: (time, record) => (
                    <span>
                      {record.bookingTimeStart} - {record.bookingTimeEnd}
                    </span>
                  ),
                },
                {
                  title: "Khách hàng",
                  dataIndex: "customerName",
                  key: "customerName",
                },
                {
                  title: "Tư vấn viên",
                  dataIndex: "consultantName",
                  key: "consultantName",
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => {
                    let color = "green";
                    let text = "Đã xác nhận";
                    
                    if (status === "SCHEDULED") {
                      color = "purple";
                      text = "Đã lên lịch";
                    }
                    
                    return <Tag color={color}>{text}</Tag>;
                  },
                },
                {
                  title: "Link Meeting",
                  dataIndex: "meetLink",
                  key: "meetLink",
                  render: (link) => (
                    <div>
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkOutlined /> {link.substring(0, 25)}...
                        </a>
                      ) : (
                        <Text type="secondary">Chưa có link</Text>
                      )}
                    </div>
                  ),
                },
                {
                  title: "Hành động",
                  key: "action",
                  render: (_, record) => (
                    <div>
                      {/* Nút cập nhật link meeting */}
                      <Button
                        size="small"
                        type="primary"
                        className="bg-blue-500 hover:bg-blue-600 mr-1"
                        onClick={() => showUpdateLinkModal(record)}
                      >
                        {record.meetLink ? "Cập nhật link" : "Thêm link"}
                      </Button>

                      {/* Nút chuyển trạng thái sang "Đã lên lịch" */}
                      {record.status === "CONFIRMED" && record.meetLink && (
                        <Popconfirm
                          title="Xác nhận đã lên lịch cho buổi tư vấn này?"
                          onConfirm={() => handleUpdateStatus(record.bookingId)}
                          okText="Xác nhận"
                          cancelText="Hủy"
                        >
                          <Button
                            size="small"
                            type="primary"
                            className="bg-purple-600 hover:bg-purple-700"
                            loading={updateLoading}
                          >
                            Lên lịch
                          </Button>
                        </Popconfirm>
                      )}
                    </div>
                  ),
                },
              ]}
              size="small"
              pagination={paginationConsulting}
              onChange={(pagination) =>
                setPaginationConsulting({
                  ...paginationConsulting,
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                })
              }
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal cập nhật link meeting */}
      {currentBooking && (
        <UpdateMeetLinkModal
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onSuccess={handleUpdateSuccess}
          booking={currentBooking}
        />
      )}
      
      {/* Modal nhập kết quả xét nghiệm */}
      <ResultStisModal
        open={resultModalVisible}
        onCancel={() => setResultModalVisible(false)}
        booking={selectedTestingBooking}
        customer={customer}
        serviceData={serviceData}
        onSave={handleResultSaveSuccess}
      />
      
      {/* Modal xem kết quả xét nghiệm */}
      <ViewResultStisModal
        open={viewResultModalVisible}
        onCancel={() => setViewResultModalVisible(false)}
        booking={selectedTestingBooking}
        customer={customer}
        serviceData={serviceData}
        resultData={resultData}
        attachmentUrl={attachmentUrl}
      />
    </>
  );
};

export default StaffDashboard;
