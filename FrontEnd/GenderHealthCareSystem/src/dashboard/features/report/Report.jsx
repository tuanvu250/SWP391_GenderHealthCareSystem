import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tabs,
  Button,
  Space,
  Table,
  Typography,
  Spin,
  Empty,
  Statistic,
  Select,
  message,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ChartComponent from "../../components/chart/ChartComponent";
import { useAuth } from "../../../components/provider/AuthProvider";
import { chartOptionsReport } from "../overview/utils/chartConfig";
import { getReportDashboardAPI } from "../../../components/api/Report.api";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Định nghĩa các tùy chọn ngày
const dayOptions = [
  { value: 7, label: "7 ngày gần nhất" },
  { value: 14, label: "14 ngày gần nhất" },
  { value: 30, label: "30 ngày gần nhất" },
  { value: 60, label: "60 ngày gần nhất" },
  { value: 90, label: "90 ngày gần nhất" },
];

const ReportComponent = () => {
  const { user } = useAuth();
  const isManager = user?.role === "Manager";
  const isStaff = user?.role === "Staff";
  const chartOptions = chartOptionsReport;
  
  // Thay đổi state dateRange thành days
  const [days, setDays] = useState(30); 
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("all");
  const [statsData, setStatsData] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Tính toán khoảng thời gian dựa trên số ngày đã chọn
  const getDateRange = () => {
    const endDate = dayjs();
    const startDate = endDate.subtract(days, 'days');
    return [startDate, endDate];
  };

  // Fetch dữ liệu báo cáo với API thật
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await getReportDashboardAPI(days);
      setStatsData(response.data.data);
      message.success(`Đã cập nhật báo cáo ${days} ngày gần nhất`);
    } catch (error) {
      console.error("Error fetching report data:", error);
      message.error(error?.response?.data?.message || "Lỗi khi tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  // Download báo cáo Excel
  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      // Nếu dữ liệu chưa được tải, tải lại
      if (!statsData) {
        await fetchReportData();
      }

      const dateRange = `${getDateRange()[0].format('DD/MM/YYYY')} - ${getDateRange()[1].format('DD/MM/YYYY')}`;
      
      // Tạo workbook mới
      const wb = XLSX.utils.book_new();
      
      // SHEET 1: TỔNG QUAN
      const overviewData = [
        ['BÁO CÁO THỐNG KÊ GENDERHEALTHCARE'],
        [`Khoảng thời gian: ${dateRange}`],
        [`Ngày xuất báo cáo: ${dayjs().format('DD/MM/YYYY HH:mm')}`],
        [],
        ['THỐNG KÊ TỔNG QUAN'],
        ['Chỉ số', 'Giá trị'],
        ['Tổng lịch hẹn', statsData.totals.totalAppointments || 0],
        ['Lịch tư vấn', statsData.totals.consultingAppointments || 0],
        ['Lịch xét nghiệm', statsData.totals.testingAppointments || 0],
        ['Tổng doanh thu', `${(statsData.totals.totalRevenue || 0).toLocaleString()} VNĐ`],
      ];
      
      const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(wb, overviewSheet, 'Tổng quan');
      
      // SHEET 2: PHÂN TÍCH CHI TIẾT - giống như table trong hình
      // Headers giống như trong bảng
      const tableHeaders = [
        'Ngày', 
        'Lịch hẹn tư vấn', 
        'Lịch hẹn xét nghiệm', 
        'Doanh thu tư vấn', 
        'Doanh thu xét nghiệm', 
        'Tổng doanh thu'
      ];
      
      // Data từ statsData.details với định dạng giống như bảng
      const tableData = statsData.details.map(item => [
        dayjs(item.date).format('DD/MM/YYYY'),
        item.consultingAppointments || 0,
        item.testingAppointments || 0,
        `${(item.consultingRevenue || 0).toLocaleString()} VNĐ`,
        `${(item.testingRevenue || 0).toLocaleString()} VNĐ`,
        `${(item.totalRevenue || 0).toLocaleString()} VNĐ`
      ]);
      
      // Thêm dòng tổng cộng
      const totalRow = [
        'TỔNG CỘNG',
        statsData.totals.consultingAppointments || 0,
        statsData.totals.testingAppointments || 0,
        `${(statsData.totals.consultingRevenue || 0).toLocaleString()} VNĐ`,
        `${(statsData.totals.testingRevenue || 0).toLocaleString()} VNĐ`,
        `${(statsData.totals.totalRevenue || 0).toLocaleString()} VNĐ`
      ];
      
      // Tạo worksheet với header và data
      const detailsSheet = XLSX.utils.aoa_to_sheet([tableHeaders, ...tableData, totalRow]);
      
      // Thiết lập chiều rộng cột phù hợp
      const colWidths = [
        { wch: 15 },  // Ngày
        { wch: 15 },  // Lịch hẹn tư vấn
        { wch: 18 },  // Lịch hẹn xét nghiệm
        { wch: 20 },  // Doanh thu tư vấn
        { wch: 20 },  // Doanh thu xét nghiệm
        { wch: 20 },  // Tổng doanh thu
      ];
      detailsSheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, detailsSheet, 'Phân tích chi tiết');
      
      // SHEET 3: DỮ LIỆU BIỂU ĐỒ
      const chartData = [
        ['DOANH THU VÀ LỊCH HẸN THEO NGÀY'],
        [],
        ['Ngày', 'Lịch tư vấn', 'Lịch xét nghiệm', 'Doanh thu tư vấn (VNĐ)', 'Doanh thu xét nghiệm (VNĐ)', 'Tổng doanh thu (VNĐ)'],
      ];
      
      statsData.details.forEach(item => {
        chartData.push([
          dayjs(item.date).format('DD/MM/YYYY'),
          item.consultingAppointments || 0,
          item.testingAppointments || 0,
          item.consultingRevenue || 0,
          item.testingRevenue || 0,
          item.totalRevenue || 0
        ]);
      });
      
      const chartSheet = XLSX.utils.aoa_to_sheet(chartData);
      XLSX.utils.book_append_sheet(wb, chartSheet, 'Dữ liệu biểu đồ');
      
      // Tạo file Excel và tải xuống
      const excelBuffer = XLSX.write(wb, { 
        bookType: 'xlsx', 
        type: 'array',
      });
      
      const data = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Đặt tên file với khoảng thời gian báo cáo
      const fileName = `BaoCao_${days}Ngay_${dayjs().format('DDMMYYYY')}.xlsx`;
      saveAs(data, fileName);
      
      message.success(`Đã tải báo cáo ${days} ngày gần nhất`);
    } catch (error) {
      console.error("Lỗi khi tạo báo cáo Excel:", error);
      message.error("Lỗi khi tải báo cáo");
    } finally {
      setDownloadLoading(false);
    }
  };

  // Load dữ liệu khi component mount và khi thay đổi tab
  useEffect(() => {
    fetchReportData();
  }, [activeTab, days]); // Không đưa days và reportType vào để tránh tự động fetch khi thay đổi

  // Cấu trúc dữ liệu cho biểu đồ tổng quan
  const overviewChartData = {
    labels: statsData?.overview?.dates || [],
    datasets: [
      {
        label: "Lịch hẹn tư vấn",
        data: statsData?.overview?.consultingAppointments || [],
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        borderColor: "rgba(24, 144, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Lịch hẹn xét nghiệm",
        data: statsData?.overview?.testingAppointments || [],
        backgroundColor: "rgba(82, 196, 26, 0.2)",
        borderColor: "rgba(82, 196, 26, 1)",
        borderWidth: 1,
      },
      {
        label: "Doanh thu (triệu VNĐ)",
        data: statsData?.overview?.revenue?.map((val) => val / 1000000) || [],
        backgroundColor: "rgba(250, 173, 20, 0.2)",
        borderColor: "rgba(250, 173, 20, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  // Cấu trúc dữ liệu cho biểu đồ doanh thu
  const revenueChartData = {
    labels: statsData?.revenue?.dates || [],
    datasets: [
      {
        type: "line",
        label: "Tổng doanh thu",
        data: statsData?.revenue?.total || [],
        borderColor: "rgba(24, 144, 255, 1)",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        type: "bar",
        label: "Doanh thu tư vấn",
        data: statsData?.revenue?.consulting || [],
        backgroundColor: "rgba(82, 196, 26, 0.6)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Doanh thu xét nghiệm",
        data: statsData?.revenue?.testing || [],
        backgroundColor: "rgba(250, 173, 20, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  // Cấu trúc dữ liệu cho biểu đồ lịch hẹn
  const appointmentsChartData = {
    labels: statsData?.appointments?.dates || [],
    datasets: [
      {
        type: "line",
        label: "Tổng lịch hẹn",
        data: statsData?.appointments?.total || [],
        borderColor: "rgba(24, 144, 255, 1)",
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        type: "bar",
        label: "Lịch hẹn tư vấn",
        data: statsData?.appointments?.consulting || [],
        backgroundColor: "rgba(82, 196, 26, 0.6)",
      },
      {
        type: "bar",
        label: "Lịch hẹn xét nghiệm",
        data: statsData?.appointments?.testing || [],
        backgroundColor: "rgba(250, 173, 20, 0.6)",
      },
    ],
  };

  // Cấu trúc dữ liệu cho biểu đồ phân phối
  const distributionPieData = {
    labels: ["Tư vấn", "Xét nghiệm"],
    datasets: [
      {
        data: [
          statsData?.distribution?.consulting || 0,
          statsData?.distribution?.testing || 0,
        ],
        backgroundColor: ["rgba(24, 144, 255, 0.6)", "rgba(82, 196, 26, 0.6)"],
        borderColor: ["rgba(24, 144, 255, 1)", "rgba(82, 196, 26, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Cấu trúc cho bảng báo cáo chi tiết
  const detailColumns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Lịch hẹn tư vấn",
      dataIndex: "consultingAppointments",
      key: "consultingAppointments",
      sorter: (a, b) => a.consultingAppointments - b.consultingAppointments,
    },
    {
      title: "Lịch hẹn xét nghiệm",
      dataIndex: "testingAppointments",
      key: "testingAppointments",
      sorter: (a, b) => a.testingAppointments - b.testingAppointments,
    },
    {
      title: "Doanh thu tư vấn",
      dataIndex: "consultingRevenue",
      key: "consultingRevenue",
      render: (value) => `${(value || 0).toLocaleString()} VNĐ`,
      sorter: (a, b) => a.consultingRevenue - b.consultingRevenue,
    },
    {
      title: "Doanh thu xét nghiệm",
      dataIndex: "testingRevenue",
      key: "testingRevenue",
      render: (value) => `${(value || 0).toLocaleString()} VNĐ`,
      sorter: (a, b) => a.testingRevenue - b.testingRevenue,
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => `${(value || 0).toLocaleString()} VNĐ`,
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    },
  ];

  // Render Stats Card
  const renderStatsCard = (title, value, icon, color) => (
    <Col xs={24} sm={12} lg={6}>
      <Card>
        <Statistic
          title={title}
          value={value}
          valueStyle={{ color }}
          prefix={icon}
        />
      </Card>
    </Col>
  );

  // Handler khi thay đổi số ngày
  const handleDaysChange = (value) => {
    setDays(value);
  };

  return (
    <div className="report-container p-6">
      <Card className="mb-6">
        <Title level={4} className="mb-4">
          Báo cáo thống kê
        </Title>

        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} md={12}>
            <Space direction="vertical" size="middle" className="w-full">
              <Text strong>Chọn khoảng thời gian:</Text>
              <Select
                value={days}
                onChange={handleDaysChange}
                className="w-full"
                placeholder="Chọn khoảng thời gian"
              >
                {dayOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              
              {/* Hiển thị khoảng thời gian đã tính toán */}
              {statsData && (
                <Text type="secondary">
                  Từ {getDateRange()[0].format('DD/MM/YYYY')} đến {getDateRange()[1].format('DD/MM/YYYY')}
                </Text>
              )}
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="middle" className="w-full">
              <Text strong>Loại báo cáo:</Text>
              <Select
                value={reportType}
                onChange={setReportType}
                className="w-full"
                placeholder="Chọn loại báo cáo"
              >
                <Option value="all">Tất cả</Option>
                <Option value="consulting">Tư vấn</Option>
                <Option value="testing">Xét nghiệm</Option>
                <Option value="revenue">Doanh thu</Option>
              </Select>
            </Space>
          </Col>
        </Row>

        <Row justify="end" gutter={[16, 16]}>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchReportData}
                loading={loading}
              >
                Cập nhật
              </Button>
              {(isManager || isStaff) && (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadExcel}
                  loading={downloadLoading}
                >
                  Tải Excel
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Spin size="large" />
          <Text className="ml-3">Đang tải dữ liệu...</Text>
        </div>
      ) : statsData ? (
        <>
          {/* Thẻ thống kê tổng quan */}
          <Row gutter={[16, 16]} className="mb-4">
            {renderStatsCard(
              "Tổng lịch hẹn",
              statsData.totals.totalAppointments || 0,
              <CalendarOutlined />,
              "#1890ff"
            )}
            {renderStatsCard(
              "Lịch tư vấn",
              statsData.totals?.consultingAppointments || 0,
              <UserOutlined />,
              "#52c41a"
            )}
            {renderStatsCard(
              "Lịch xét nghiệm",
              statsData.totals.testingAppointments || 0,
              <FileTextOutlined />,
              "#faad14"
            )}
            {renderStatsCard(
              "Tổng doanh thu",
              `${((statsData.totals.totalRevenue || 0) / 1000000).toFixed(
                1
              )}M`,
              <DollarOutlined />,
              "#f5222d"
            )}
          </Row>

          <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
            <TabPane
              tab={
                <span>
                  <BarChartOutlined />
                  Tổng quan
                </span>
              }
              key="overview"
            >
              <Card className="mb-4">
                <Title level={5}>Biểu đồ tổng quan</Title>
                <div style={{ height: "400px" }}>
                  <ChartComponent
                    type="bar"
                    data={overviewChartData}
                    options={{
                      ...chartOptions.bar,
                      scales: {
                        ...chartOptions.bar.scales,
                        y: {
                          ...chartOptions.bar.scales.y,
                          position: "left",
                        },
                        y1: {
                          position: "right",
                          grid: {
                            drawOnChartArea: false,
                          },
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Doanh thu (triệu VNĐ)",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </Card>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card className="mb-4">
                    <Title level={5}>Phân bổ lịch hẹn</Title>
                    <div style={{ height: "300px" }}>
                      <ChartComponent
                        type="pie"
                        data={distributionPieData}
                        options={chartOptions.pie}
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card>
                    <Title level={5}>Báo cáo chi tiết</Title>
                    <Table
                      dataSource={statsData.details || []}
                      columns={detailColumns.filter(
                        (col) =>
                          !isStaff ||
                          (col.dataIndex !== "consultingRevenue" &&
                            col.dataIndex !== "testingRevenue" &&
                            col.dataIndex !== "totalRevenue")
                      )}
                      size="small"
                      rowKey="date"
                      pagination={{
                        defaultPageSize: 5,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20"],
                      }}
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <LineChartOutlined />
                  Doanh thu
                </span>
              }
              key="revenue"
              disabled={isStaff}
            >
              <Card>
                <Title level={5}>Thống kê doanh thu</Title>
                <div style={{ height: "400px" }}>
                  <ChartComponent
                    type="bar"
                    data={revenueChartData}
                    options={chartOptions.line}
                  />
                </div>
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <BarChartOutlined />
                  Lịch hẹn
                </span>
              }
              key="appointments"
            >
              <Card>
                <Title level={5}>Thống kê lịch hẹn</Title>
                <div style={{ height: "400px" }}>
                  <ChartComponent
                    type="bar"
                    data={appointmentsChartData}
                    options={chartOptions.line}
                  />
                </div>
              </Card>
            </TabPane>

            {isManager && (
              <TabPane
                tab={
                  <span>
                    <PieChartOutlined />
                    Phân tích chi tiết
                  </span>
                }
                key="analysis"
              >
                <Card>
                  <Title level={5}>Phân tích chi tiết</Title>
                  <Table
                    dataSource={statsData.details || []}
                    columns={detailColumns}
                    pagination={{
                      defaultPageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ["10", "20", "50"],
                    }}
                    rowKey="date"
                  />
                </Card>
              </TabPane>
            )}
          </Tabs>
        </>
      ) : (
        <Empty
          description="Chưa có dữ liệu báo cáo. Vui lòng chọn khoảng thời gian và nhấn Cập nhật."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="p-12"
        />
      )}
    </div>
  );
};

export default ReportComponent;
