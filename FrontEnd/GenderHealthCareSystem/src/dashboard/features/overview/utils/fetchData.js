import { message } from "antd";
import { getStatisticsFeedbackConsultantAPI } from "../../../../components/api/FeedbackConsultant.api";
import { getStatisticsFeedbackTestingAPI } from "../../../../components/api/FeedbackTesting.api";
import dayjs from "dayjs"; // Sử dụng dayjs để xử lý ngày tháng
import {
  getRevenueStatsAPI,
  getStatsUserRoleAPI,
  getUserAndBookingStatsAPI,
} from "../../../../components/api/Report.api";
import { getAllConsultants } from "../../../../components/api/Consultant.api";

export const getDashboardStats = async (role) => {
  switch (role) {
    case "Manager": {
      const revenueStats = await getRevenueStats();
      const statsByRole = await getStatsByRole();
      const serviceRatings = await getRatingStats();
      return {
        activeConsultants: await getActiveConsultants(),
        totalConsultants: statsByRole.Consultant || 0,
        pendingPosts: 0,
        averageRating: serviceRatings.testingAvg,

        // Thêm dữ liệu đánh giá dịch vụ
        serviceRatings: serviceRatings,

        usersAndAppointments: await getUsersAndAppointmentsStats(),

        revenueStats: revenueStats,

        monthlyRevenue: revenueStats.length > 0 ? revenueStats[0].values : 0,
        previousMonthRevenue:
          revenueStats.length > 0 ? revenueStats[1].values : 0,
      };
    }

    case "Consultant": {
      const ratingStats = await getRatingStats();
      const usersAndAppointments = await getUsersAndAppointmentsStats();
      return {
        unansweredQuestions: 5,
        newReviews: 2,
        monthlyEarnings: 15000000,
        monthlyEarningsChange: 12,
        weeklyAppointments: 8,

        // Thêm dữ liệu đánh giá cho consultant
        averageRating: ratingStats.consultingAvg,
        ratings: {
          five: ratingStats.consulting.five,
          four: ratingStats.consulting.four,
          three: ratingStats.consulting.three,
          two: ratingStats.consulting.two,
          one: ratingStats.consulting.one,
        },

        Appointments: {
          labels: usersAndAppointments.map((item) => item.date),
          data: usersAndAppointments.map((item) => item.consultAppointments),
        },

        // Dữ liệu hiện tại
        monthlyEarningsData: [
          { month: "T1", earnings: 12000000 },
          { month: "T2", earnings: 15000000 },
          { month: "T3", earnings: 10000000 },
          { month: "T4", earnings: 18000000 },
          { month: "T5", earnings: 15000000 },
          { month: "T6", earnings: 20000000 },
        ],
        recentQuestions: [
          {
            question:
              "Làm thế nào để ngăn ngừa các bệnh lây truyền qua đường tình dục?",
            userName: "user123",
            time: "2 giờ trước",
            category: "STIs",
            avatarUrl: "https://via.placeholder.com/32",
          },
          {
            question:
              "Tôi nên làm xét nghiệm STIs như thế nào và bao lâu một lần?",
            userName: "healthyUser",
            time: "5 giờ trước",
            category: "Sức khỏe",
            avatarUrl: "https://via.placeholder.com/32",
          },
          {
            question:
              "Tôi đang lo lắng về một số triệu chứng, liệu có thể là STIs không?",
            userName: "concernedUser",
            time: "1 ngày trước",
            category: "Triệu chứng",
            avatarUrl: "https://via.placeholder.com/32",
          },
        ],
        upcomingAppointments: [
          {
            id: 1,
            time: "09:00 - 24/07/2024",
            customer: "Nguyễn Văn A",
            type: "Tư vấn STIs",
            status: "confirmed",
          },
          {
            id: 2,
            time: "10:30 - 24/07/2024",
            customer: "Trần Thị B",
            type: "Tư vấn giới tính",
            status: "pending",
          },
          {
            id: 3,
            time: "14:00 - 25/07/2024",
            customer: "Lê Văn C",
            type: "Tư vấn sức khỏe",
            status: "confirmed",
          },
        ],
      };
    }

    case "Staff": {
      const usersAndAppointments = await getUsersAndAppointmentsStats();
      return {
        todayTestings: 12,
        todayConsultations: 8,
        appointmentTypeData: usersAndAppointments.map((item) => ({
          date: item.date,
          testAppointments: item.testAppointments,
          consultAppointments: item.consultAppointments,
        })),
      };
    }

    case "Admin": {
      const user = await getUserAndBookingStatsAPI();
      const statsByRole = await getStatsByRole();
      return {
        totalUsers: statsByRole.Total || 0,

        userRoles: {
          "Khách hàng": statsByRole.Customer,
          "Tư vấn viên": statsByRole.Consultant,
          "Nhân viên": statsByRole.Staff,
          "Quản lí": statsByRole.Manager,
          Admin: statsByRole.Admin,
        },

        userGrowth: user.data.data.map((item) => ({
          period: dayjs(item.date).format("DD/MM"),
          newUsers: item.users,
        })),
      };
    }
  }
};

export const getRatingStats = async () => {
  try {
    const testing = await getStatisticsFeedbackTestingAPI();
    const consulting = await getStatisticsFeedbackConsultantAPI();
    return {
      testing: {
        five: testing.data.data.ratingCounts?.[5] || 0,
        four: testing.data.data.ratingCounts?.[4] || 0,
        three: testing.data.data.ratingCounts?.[3] || 0,
        two: testing.data.data.ratingCounts?.[2] || 0,
        one: testing.data.data.ratingCounts?.[1] || 0,
      },
      consulting: {
        five: consulting.data.data.ratingCounts?.[5] || 0,
        four: consulting.data.data.ratingCounts?.[4] || 0,
        three: consulting.data.data.ratingCounts?.[3] || 0,
        two: consulting.data.data.ratingCounts?.[2] || 0,
        one: consulting.data.data.ratingCounts?.[1] || 0,
      },
      testingAvg: testing.data.data.averageRating || 0,
      consultingAvg: consulting.data.data.averageRating || 0,
    };
  } catch (error) {
    console.error("Error fetching rating statistics:", error);
    return {
      testing: {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      },
      consulting: {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      },
      testingAvg: 0,
      consultingAvg: 0,
    };
  }
};

/**
 * Lấy thống kê booking và users trong 7 ngày gần nhất
 * @returns {Promise<Array>} Mảng chứa dữ liệu thống kê theo ngày
 */
export const getUsersAndAppointmentsStats = async () => {
  try {
    const res = await getUserAndBookingStatsAPI();
    return res.data.data.map((item) => ({
      date: dayjs(item.date).format("DD/MM"),
      users: item.users,
      testAppointments: item.bookings,
      consultAppointments: item.appointments,
    }));
  } catch (error) {
    console.error("Error fetching users and appointments statistics:", error);
    return [];
  }
};

export const getRevenueStats = async () => {
  try {
    const res = await getRevenueStatsAPI();
    return res.data.data.map((item) => ({
      months: dayjs(item.month).format("MM/YYYY"), // Định dạng tháng năm
      values: item.totalRevenue,
    }));
  } catch (error) {
    console.error("Error fetching revenue statistics:", error);
    message.error("Không thể lấy thống kê doanh thu.");
    return [];
  }
};

export const getStatsByRole = async () => {
  try {
    const res = await getStatsUserRoleAPI();
    console.log(">>> Stats by role:", res.data.data);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching stats by role:", error);
    message.error(
      error.response?.data?.message || "Không thể lấy thống kê theo vai trò."
    );
    return [];
  }
};

export const getActiveConsultants = async () => {
  try {
    const res = await getAllConsultants();
    return res.length;
  } catch (error) {
    console.error("Error fetching active consultants:", error);
    message.error("Không thể lấy số lượng tư vấn viên hoạt động.");
    return 0;
  }
}
