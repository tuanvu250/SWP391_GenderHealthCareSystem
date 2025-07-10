import { message } from "antd";
import { getStatisticsFeedbackConsultantAPI } from "../../../../components/api/FeedbackConsultant.api";
import { getStatisticsFeedbackTestingAPI } from "../../../../components/api/FeedbackTesting.api";
import dayjs from "dayjs"; // Sử dụng dayjs để xử lý ngày tháng
import {
  getRevenueStatsAPI,
  getUserAndBookingStatsAPI,
} from "../../../../components/api/Report.api";

export const getDashboardStats = async (role) => {
  switch (role) {
    case "Manager": {
      const revenueStats = await getRevenueStats();
      return {
        activeConsultants: 15,
        totalConsultants: 20,
        pendingPosts: 7,
        averageRating: 4.5,

        // Thêm dữ liệu đánh giá dịch vụ
        serviceRatings: await getRatingStats(),

        usersAndAppointments: await getUsersAndAppointmentsStats(),

        revenueStats: revenueStats,

        monthlyRevenue: revenueStats.length > 0 ? revenueStats[0].values : 0,
        previousMonthRevenue:
          revenueStats.length > 0 ? revenueStats[1].values : 0,
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
