// Cấu hình chung cho Chart.js
export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      mode: "index",
    },
  },
};

// Cấu hình cho biểu đồ đường
export const lineChartOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "API Calls",
        color: "#1677ff",
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
      title: {
        display: true,
        text: "Lỗi",
        color: "#f5222d",
      },
    },
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
};

// Cấu hình cho biểu đồ cột ngang
export const horizontalBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y", // Để hiển thị biểu đồ cột ngang
  plugins: {
    legend: {
      display: false, // Ẩn legend vì chỉ có 1 data set
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let value = context.raw;
          return `Doanh thu: ${value.toLocaleString("vi-VN")} VNĐ`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Doanh thu (VNĐ)",
      },
      ticks: {
        callback: function (value) {
          return value >= 1000000
            ? `${(value / 1000000).toFixed(0)}M`
            : `${(value / 1000).toFixed(0)}K`;
        },
      },
    },
  },
};

// Cấu hình cho biểu đồ pie/doughnut
export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.raw;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${context.label}: ${value.toLocaleString(
            "vi-VN"
          )} (${percentage}%)`;
        },
      },
    },
  },
};

// Cấu hình cho biểu đồ người dùng và lịch hẹn
export const userAppointmentsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "Người dùng mới",
        color: "#1677ff",
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
      title: {
        display: true,
        text: "Lịch hẹn",
        color: "#52c41a",
      },
    },
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
};

// Cấu hình cho biểu đồ tăng trưởng người dùng
export const userGrowthChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "Người dùng mới",
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
      title: {
        display: true,
        text: "Tổng người dùng",
      },
    },
  },
};

// Cấu hình cho biểu đồ cột đơn giản
export const barChartOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export const ratingBarChartOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.raw}%`;
        },
      },
    },
    datalabels: {
      display: true,
      align: "end",
      anchor: "end",
      formatter: function (value) {
        return value + "%";
      },
      color: "#333",
      font: {
        weight: "bold",
      },
    },
  },
};

// Thêm cấu hình biểu đồ doanh thu

export const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        boxWidth: 15,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            // Định dạng số thành tiền tệ VNĐ
            label += new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        // Định dạng trục y thành tiền tệ
        callback: function (value) {
          if (value >= 1000000) {
            return (value / 1000000) + " triệu";
          }
          return value;
        },
      },
    },
  },
};