// Mock data cho dashboard
export const getMockDataForRole = (role) => {
  const mockData = {

    Staff: {
      pendingAppointments: 7,
      todayTestings: 12,
      todayConsultations: 8,
      pendingResults: 5,
      appointmentTypeData: [
        { date: "01/07", testAppointments: 8, consultAppointments: 6 },
        { date: "02/07", testAppointments: 10, consultAppointments: 7 },
        { date: "03/07", testAppointments: 7, consultAppointments: 5 },
        { date: "04/07", testAppointments: 12, consultAppointments: 8 },
        { date: "05/07", testAppointments: 9, consultAppointments: 6 },
        { date: "06/07", testAppointments: 11, consultAppointments: 9 },
        { date: "07/07", testAppointments: 14, consultAppointments: 11 },
      ],
      todayTasks: [
        {
          task: "Chuẩn bị phòng xét nghiệm",
          description: "Chuẩn bị vật tư y tế",
          completed: true,
        },
        {
          task: "Nhập kết quả xét nghiệm",
          description: "Cập nhật 5 kết quả vào hệ thống",
          completed: false,
        },
        {
          task: "Xác nhận lịch hẹn",
          description: "Gọi điện xác nhận lịch hẹn ngày mai",
          completed: false,
        },
        {
          task: "Kiểm kê vật tư",
          description: "Kiểm kê vật tư y tế cuối ngày",
          completed: false,
        },
      ],
      taskCompletion: 25,
      todayAppointmentList: [
        {
          id: 1,
          time: "09:00",
          customerName: "Nguyễn Văn A",
          serviceType: "Xét nghiệm",
          serviceName: "Gói xét nghiệm STIs cơ bản",
          status: "confirmed",
        },
        {
          id: 2,
          time: "09:30",
          customerName: "Trần Thị B",
          serviceType: "Tư vấn",
          serviceName: "Tư vấn sức khỏe sinh sản",
          status: "completed",
        },
        {
          id: 3,
          time: "10:00",
          customerName: "Lê Văn C",
          serviceType: "Xét nghiệm",
          serviceName: "Xét nghiệm HPV",
          status: "no_show",
        },
        {
          id: 4,
          time: "11:00",
          customerName: "Phạm Thị D",
          serviceType: "Xét nghiệm",
          serviceName: "Gói xét nghiệm STIs đầy đủ",
          status: "pending",
        },
        {
          id: 5,
          time: "13:30",
          customerName: "Hoàng Văn E",
          serviceType: "Tư vấn",
          serviceName: "Tư vấn phòng ngừa STIs",
          status: "confirmed",
        },
      ],
    },

    Admin: {
      totalUsers: 2450,
      newUsersToday: 35,
      uptime: 99.95,
      uptimeChange: 0.15,
      systemErrors: 3,
      systemErrorsChange: -5,
      securityScore: 78,
      cpuUsage: 45,
      ramUsage: 62,
      diskUsage: 58,
      dbConnections: 42,
      maxDbConnections: 100,

      // Thêm dữ liệu mới cho Admin Dashboard
      totalRevenue: 850000000,
      revenueGrowth: 12.5,
      storageUsed: 185.2,
      storagePercentage: 37,
      onlineUsers: 76,
      onlineUsersPercentage: 6.1,
      avgResponseTime: 256,
      responseTimeChange: -8.3,

      // Biểu đồ phân bổ vai trò người dùng
      userRoles: {
        "Khách hàng": 2250,
        Consultant: 68,
        Staff: 95,
        Manager: 25,
        Admin: 12,
      },

      // Biểu đồ hoạt động hệ thống
      systemActivity: [
        { date: "17/07", apiCalls: 12450, errors: 5 },
        { date: "18/07", apiCalls: 13280, errors: 8 },
        { date: "19/07", apiCalls: 12800, errors: 6 },
        { date: "20/07", apiCalls: 14500, errors: 3 },
        { date: "21/07", apiCalls: 15200, errors: 4 },
        { date: "22/07", apiCalls: 14100, errors: 7 },
        { date: "23/07", apiCalls: 15800, errors: 3 },
      ],

      // Biểu đồ tăng trưởng người dùng
      userGrowth: [
        { period: "T1/2024", newUsers: 350, totalUsers: 1250 },
        { period: "T2/2024", newUsers: 310, totalUsers: 1560 },
        { period: "T3/2024", newUsers: 285, totalUsers: 1845 },
        { period: "T4/2024", newUsers: 220, totalUsers: 2065 },
        { period: "T5/2024", newUsers: 245, totalUsers: 2310 },
        { period: "T6/2024", newUsers: 140, totalUsers: 2450 },
      ],

      // Biểu đồ phân bổ doanh thu theo dịch vụ
      revenueByService: {
        "Xét nghiệm STIs": 350000000,
        "Tư vấn sức khỏe": 250000000,
        "Xét nghiệm combo": 150000000,
        "Gói tư vấn định kỳ": 80000000,
        Khác: 20000000,
      },

      // Biểu đồ phân tích thời gian sử dụng
      systemUsageByTime: [
        { hour: "00:00", users: 15, visits: 45 },
        { hour: "02:00", users: 5, visits: 20 },
        { hour: "04:00", users: 3, visits: 10 },
        { hour: "06:00", users: 10, visits: 25 },
        { hour: "08:00", users: 50, visits: 120 },
        { hour: "10:00", users: 80, visits: 180 },
        { hour: "12:00", users: 65, visits: 150 },
        { hour: "14:00", users: 70, visits: 165 },
        { hour: "16:00", users: 85, visits: 200 },
        { hour: "18:00", users: 60, visits: 145 },
        { hour: "20:00", users: 45, visits: 110 },
        { hour: "22:00", users: 30, visits: 70 },
      ],

      // Thống kê đánh giá
      ratings: {
        five: 65,
        four: 22,
        three: 8,
        two: 3,
        one: 2,
      },
      averageRating: 4.5,
      totalRatings: 843,

      // Dữ liệu API Usage cho bảng API
      apiUsage: [
        { endpoint: "/api/users", calls: 3250, responseTime: 120, errors: 0 },
        {
          endpoint: "/api/appointments",
          calls: 2840,
          responseTime: 180,
          errors: 2,
        },
        {
          endpoint: "/api/auth/login",
          calls: 1950,
          responseTime: 90,
          errors: 5,
        },
        { endpoint: "/api/tests", calls: 1680, responseTime: 320, errors: 0 },
        {
          endpoint: "/api/consultations",
          calls: 1420,
          responseTime: 275,
          errors: 1,
        },
        { endpoint: "/api/reports", calls: 980, responseTime: 450, errors: 3 },
        { endpoint: "/api/payments", calls: 760, responseTime: 210, errors: 0 },
      ],

      // Dữ liệu cho các tác vụ bảo trì
      maintenanceTasks: [
        {
          name: "Sao lưu dữ liệu tự động",
          status: "completed",
          lastRun: "23/07/2024 01:00",
          nextRun: "24/07/2024 01:00",
        },
        {
          name: "Tối ưu hóa cơ sở dữ liệu",
          status: "pending",
          lastRun: "18/07/2024 03:00",
          nextRun: "25/07/2024 03:00",
        },
        {
          name: "Quét virus & malware",
          status: "completed",
          lastRun: "22/07/2024 02:00",
          nextRun: "29/07/2024 02:00",
        },
        {
          name: "Xóa file tạm thời",
          status: "processing",
          lastRun: "20/07/2024 04:00",
          nextRun: "27/07/2024 04:00",
        },
      ],

      // Cảnh báo hệ thống
      systemAlerts: [
        "Phát hiện 2 lần truy cập trái phép từ địa chỉ IP lạ.",
        "Cảnh báo: 1 dịch vụ quan trọng sắp hết hạn chứng chỉ SSL.",
        "Thông báo bảo trì hệ thống vào lúc 02:00 sáng mai.",
        "Cảnh báo tài nguyên: Database đạt ngưỡng 85% dung lượng.",
        "Đề xuất: Nâng cấp kế hoạch lưu trữ để đảm bảo hiệu suất.",
      ],

      // Dữ liệu hoạt động gần đây
      recentActivities: [
        {
          type: "success",
          message: "Backup hệ thống hoàn tất",
          time: "10:30",
          user: "System",
        },
        {
          type: "warning",
          message: "Phát hiện nhiều lần đăng nhập thất bại",
          time: "09:15",
          user: "Security Monitor",
        },
        {
          type: "normal",
          message: "Cập nhật phiên bản phần mềm 2.3.1",
          time: "08:45",
          user: "System",
        },
        {
          type: "error",
          message: "Lỗi kết nối đến máy chủ email",
          time: "Hôm qua",
          user: "Mail Server",
        },
      ],
    },
  };

  return {
    ...mockData.common,
    ...(mockData[role] || {}),
  };
};
