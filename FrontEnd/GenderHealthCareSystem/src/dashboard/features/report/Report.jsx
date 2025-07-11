import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Tabs, DatePicker, Button, Space, 
  Table, Typography, Spin, Empty, Statistic, Divider,
  Select, message
} from 'antd';
import { 
  BarChartOutlined, LineChartOutlined, PieChartOutlined, 
  DownloadOutlined, ReloadOutlined, CalendarOutlined,
  DollarOutlined, UserOutlined, FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ChartComponent from '../../components/chart/ChartComponent';
import { useAuth } from '../../../components/provider/AuthProvider';
// import { fetchStatistics } from '../../../components/api/Statistics.api';
// import { downloadReportExcel } from '../../../components/api/Report.api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Dữ liệu mẫu cho báo cáo
const generateMockData = (startDate, endDate, reportType) => {
  // Tạo mảng các ngày trong khoảng
  const dates = [];
  let currentDate = dayjs(startDate);
  const end = dayjs(endDate);
  
  while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }
  
  // Tạo dữ liệu ngẫu nhiên
  const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  
  const consultingAppointments = dates.map(() => generateRandomNumber(5, 25));
  const testingAppointments = dates.map(() => generateRandomNumber(3, 20));
  const consultingRevenue = dates.map(() => generateRandomNumber(1000000, 5000000));
  const testingRevenue = dates.map(() => generateRandomNumber(800000, 4000000));
  
  // Tạo dữ liệu chi tiết
  const details = dates.map((date, index) => ({
    date,
    consultingAppointments: consultingAppointments[index],
    testingAppointments: testingAppointments[index],
    consultingRevenue: consultingRevenue[index],
    testingRevenue: testingRevenue[index],
    totalRevenue: consultingRevenue[index] + testingRevenue[index]
  }));
  
  // Tính tổng
  const totalConsultingAppointments = consultingAppointments.reduce((sum, val) => sum + val, 0);
  const totalTestingAppointments = testingAppointments.reduce((sum, val) => sum + val, 0);
  const totalConsultingRevenue = consultingRevenue.reduce((sum, val) => sum + val, 0);
  const totalTestingRevenue = testingRevenue.reduce((sum, val) => sum + val, 0);
  
  // Lọc theo loại báo cáo nếu cần
  let filteredData = {
    dates,
    consultingAppointments,
    testingAppointments,
    consultingRevenue,
    testingRevenue,
    details
  };
  
  if (reportType === 'consulting') {
    filteredData.testingAppointments = filteredData.testingAppointments.map(() => 0);
    filteredData.testingRevenue = filteredData.testingRevenue.map(() => 0);
    filteredData.details = filteredData.details.map(item => ({
      ...item,
      testingAppointments: 0,
      testingRevenue: 0,
      totalRevenue: item.consultingRevenue
    }));
  } else if (reportType === 'testing') {
    filteredData.consultingAppointments = filteredData.consultingAppointments.map(() => 0);
    filteredData.consultingRevenue = filteredData.consultingRevenue.map(() => 0);
    filteredData.details = filteredData.details.map(item => ({
      ...item,
      consultingAppointments: 0,
      consultingRevenue: 0,
      totalRevenue: item.testingRevenue
    }));
  }
  
  // Chuẩn bị kết quả theo format
  return {
    overview: {
      dates,
      consultingAppointments: filteredData.consultingAppointments,
      testingAppointments: filteredData.testingAppointments,
      revenue: filteredData.details.map(item => item.totalRevenue)
    },
    revenue: {
      dates,
      consulting: filteredData.consultingRevenue,
      testing: filteredData.testingRevenue,
      total: filteredData.details.map(item => item.totalRevenue)
    },
    appointments: {
      dates,
      consulting: filteredData.consultingAppointments,
      testing: filteredData.testingAppointments,
      total: filteredData.details.map((item) => item.consultingAppointments + item.testingAppointments)
    },
    distribution: {
      consulting: totalConsultingAppointments,
      testing: totalTestingAppointments
    },
    totalStats: {
      totalAppointments: totalConsultingAppointments + totalTestingAppointments,
      consultingAppointments: totalConsultingAppointments,
      testingAppointments: totalTestingAppointments,
      consultingRevenue: totalConsultingRevenue,
      testingRevenue: totalTestingRevenue,
      totalRevenue: totalConsultingRevenue + totalTestingRevenue
    },
    details: filteredData.details
  };
};

// Cấu hình cho các loại biểu đồ
const chartOptions = {
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 12
        },
        padding: 10
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  },
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  },
  pie: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 12
        }
      }
    }
  }
};

const ReportComponent = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'Manager';
  const isStaff = user?.role === 'Staff';
  
  // State cho các bộ lọc và dữ liệu
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('all');
  const [statsData, setStatsData] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Fetch dữ liệu báo cáo với mockData
  const fetchReportData = async () => {
    if (!dateRange || dateRange.length !== 2) {
      message.error('Vui lòng chọn khoảng thời gian báo cáo');
      return;
    }
    
    setLoading(true);
    try {
      // Giả lập thời gian tải
      setTimeout(() => {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
        
        // Tạo dữ liệu mẫu
        const mockData = generateMockData(startDate, endDate, reportType);
        setStatsData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching report data:', error);
      message.error('Không thể tải dữ liệu báo cáo');
      setLoading(false);
    }
  };

  // Download báo cáo Excel (giả lập)
  const handleDownloadExcel = async () => {
    if (!dateRange || dateRange.length !== 2) {
      message.error('Vui lòng chọn khoảng thời gian báo cáo');
      return;
    }
    
    setDownloadLoading(true);
    
    // Giả lập thời gian tải file
    setTimeout(() => {
      message.success('Đã tải báo cáo thành công (chế độ giả lập)');
      setDownloadLoading(false);
    }, 2000);
  };

  // Load dữ liệu khi component mount và khi các filter thay đổi
  useEffect(() => {
    fetchReportData();
  }, [activeTab]); // Không đưa dateRange và reportType vào dependencies để tránh tự động fetch khi thay đổi

  // Cấu trúc dữ liệu cho biểu đồ tổng quan
  const overviewChartData = {
    labels: statsData?.overview?.dates || [],
    datasets: [
      {
        label: 'Lịch hẹn tư vấn',
        data: statsData?.overview?.consultingAppointments || [],
        backgroundColor: 'rgba(24, 144, 255, 0.2)',
        borderColor: 'rgba(24, 144, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Lịch hẹn xét nghiệm',
        data: statsData?.overview?.testingAppointments || [],
        backgroundColor: 'rgba(82, 196, 26, 0.2)',
        borderColor: 'rgba(82, 196, 26, 1)',
        borderWidth: 1,
      },
      {
        label: 'Doanh thu (triệu VNĐ)',
        data: statsData?.overview?.revenue?.map(val => val / 1000000) || [],
        backgroundColor: 'rgba(250, 173, 20, 0.2)',
        borderColor: 'rgba(250, 173, 20, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ]
  };

  // Cấu trúc dữ liệu cho biểu đồ doanh thu
  const revenueChartData = {
    labels: statsData?.revenue?.dates || [],
    datasets: [
      {
        type: 'line',
        label: 'Tổng doanh thu',
        data: statsData?.revenue?.total || [],
        borderColor: 'rgba(24, 144, 255, 1)',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        type: 'bar',
        label: 'Doanh thu tư vấn',
        data: statsData?.revenue?.consulting || [],
        backgroundColor: 'rgba(82, 196, 26, 0.6)',
        borderWidth: 1,
      },
      {
        type: 'bar',
        label: 'Doanh thu xét nghiệm',
        data: statsData?.revenue?.testing || [],
        backgroundColor: 'rgba(250, 173, 20, 0.6)',
        borderWidth: 1,
      }
    ]
  };

  // Cấu trúc dữ liệu cho biểu đồ lịch hẹn
  const appointmentsChartData = {
    labels: statsData?.appointments?.dates || [],
    datasets: [
      {
        type: 'line',
        label: 'Tổng lịch hẹn',
        data: statsData?.appointments?.total || [],
        borderColor: 'rgba(24, 144, 255, 1)',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        type: 'bar',
        label: 'Lịch hẹn tư vấn',
        data: statsData?.appointments?.consulting || [],
        backgroundColor: 'rgba(82, 196, 26, 0.6)',
      },
      {
        type: 'bar',
        label: 'Lịch hẹn xét nghiệm',
        data: statsData?.appointments?.testing || [],
        backgroundColor: 'rgba(250, 173, 20, 0.6)',
      }
    ]
  };

  // Cấu trúc dữ liệu cho biểu đồ phân phối
  const distributionPieData = {
    labels: ['Tư vấn', 'Xét nghiệm'],
    datasets: [
      {
        data: [
          statsData?.distribution?.consulting || 0,
          statsData?.distribution?.testing || 0,
        ],
        backgroundColor: [
          'rgba(24, 144, 255, 0.6)',
          'rgba(82, 196, 26, 0.6)',
        ],
        borderColor: [
          'rgba(24, 144, 255, 1)',
          'rgba(82, 196, 26, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cấu trúc cho bảng báo cáo chi tiết
  const detailColumns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: text => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Lịch hẹn tư vấn',
      dataIndex: 'consultingAppointments',
      key: 'consultingAppointments',
      sorter: (a, b) => a.consultingAppointments - b.consultingAppointments,
    },
    {
      title: 'Lịch hẹn xét nghiệm',
      dataIndex: 'testingAppointments',
      key: 'testingAppointments',
      sorter: (a, b) => a.testingAppointments - b.testingAppointments,
    },
    {
      title: 'Doanh thu tư vấn',
      dataIndex: 'consultingRevenue',
      key: 'consultingRevenue',
      render: value => `${(value || 0).toLocaleString()} VNĐ`,
      sorter: (a, b) => a.consultingRevenue - b.consultingRevenue,
    },
    {
      title: 'Doanh thu xét nghiệm',
      dataIndex: 'testingRevenue',
      key: 'testingRevenue',
      render: value => `${(value || 0).toLocaleString()} VNĐ`,
      sorter: (a, b) => a.testingRevenue - b.testingRevenue,
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: value => `${(value || 0).toLocaleString()} VNĐ`,
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

  return (
    <div className="report-container p-6">
      <Card className="mb-6">
        <Title level={4} className="mb-4">Báo cáo thống kê</Title>
        
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} md={12}>
            <Space direction="vertical" size="middle" className="w-full">
              <Text strong>Chọn khoảng thời gian:</Text>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
                className="w-full"
                allowClear={false}
                disabledDate={current => current && current > dayjs().endOf('day')}
              />
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
              'Tổng lịch hẹn',
              statsData.totalStats?.totalAppointments || 0,
              <CalendarOutlined />,
              '#1890ff'
            )}
            {renderStatsCard(
              'Lịch tư vấn',
              statsData.totalStats?.consultingAppointments || 0,
              <UserOutlined />,
              '#52c41a'
            )}
            {renderStatsCard(
              'Lịch xét nghiệm',
              statsData.totalStats?.testingAppointments || 0,
              <FileTextOutlined />,
              '#faad14'
            )}
            {renderStatsCard(
              'Tổng doanh thu',
              `${((statsData.totalStats?.totalRevenue || 0) / 1000000).toFixed(1)}M`,
              <DollarOutlined />,
              '#f5222d'
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
                <div style={{ height: '400px' }}>
                  <ChartComponent
                    type="bar"
                    data={overviewChartData}
                    options={{
                      ...chartOptions.bar,
                      scales: {
                        ...chartOptions.bar.scales,
                        y: {
                          ...chartOptions.bar.scales.y,
                          position: 'left',
                        },
                        y1: {
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                          },
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Doanh thu (triệu VNĐ)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card>

              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card className="mb-4">
                    <Title level={5}>Phân bổ lịch hẹn</Title>
                    <div style={{ height: '300px' }}>
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
                      columns={detailColumns.filter(col => !isStaff || (col.dataIndex !== 'consultingRevenue' && col.dataIndex !== 'testingRevenue' && col.dataIndex !== 'totalRevenue'))}
                      size="small"
                      rowKey="date"
                      pagination={{
                        defaultPageSize: 5,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20']
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
                <div style={{ height: '400px' }}>
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
                <div style={{ height: '400px' }}>
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
                      pageSizeOptions: ['10', '20', '50']
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