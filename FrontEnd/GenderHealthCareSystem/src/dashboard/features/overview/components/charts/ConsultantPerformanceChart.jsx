import React from 'react';
import ChartComponent from '../../../../components/chart/ChartComponent';

// Cấu hình biểu đồ cột
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y', // Để hiển thị biểu đồ cột ngang
  plugins: {
    legend: {
      display: false, // Ẩn legend vì chỉ có 1 data set
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let value = context.raw;
          return `Doanh thu: ${value.toLocaleString('vi-VN')} VNĐ`;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Doanh thu (VNĐ)'
      },
      ticks: {
        callback: function(value) {
          return value >= 1000000 
            ? `${(value / 1000000).toFixed(0)}M` 
            : `${(value / 1000).toFixed(0)}K`;
        }
      }
    }
  }
};

const ConsultantPerformanceChart = ({ data }) => {
  if (!data) return <div className="text-center p-6">Không có dữ liệu biểu đồ</div>;

  return (
    <ChartComponent 
      data={data}
      options={barChartOptions}
      type="bar"
      height="300px"
    />
  );
};

export default ConsultantPerformanceChart;