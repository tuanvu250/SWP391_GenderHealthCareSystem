// Mock data cho dashboard
export const getMockDataForRole = (role) => {
  const mockData = {
    Admin: {
      totalUsers: 2450,

      userRoles: {
        "Khách hàng": 2250,
        Consultant: 68,
        Staff: 95,
        Manager: 25,
        Admin: 12,
      },

      // Biểu đồ tăng trưởng người dùng
      userGrowth: [
        { period: "2025-07-15", newUsers: 350 },
        { period: "2025-07-14", newUsers: 310 },
        { period: "2025-07-13", newUsers: 285 },
        { period: "2025-07-12", newUsers: 220 },
        { period: "2025-07-11", newUsers: 245 },
        { period: "2025-07-10", newUsers: 140 },
        { period: "2025-07-09", newUsers: 140 },
      ],
    },
  };

  return {
    ...mockData.common,
    ...(mockData[role] || {}),
  };
};
