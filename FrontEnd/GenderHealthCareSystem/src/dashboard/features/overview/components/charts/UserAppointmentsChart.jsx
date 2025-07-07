import React from 'react';
import ChartComponent from '../../../../components/chart/ChartComponent';

// Cấu hình riêng cho biểu đồ user & appointments
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: { 
        display: true, 
        text: 'Người dùng mới',
        color: '#1677ff'
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: { 
        drawOnChartArea: false 
      },
      title: { 
        display: true, 
        text: 'Lịch hẹn',
        color: '#52c41a'
      }
    }
  },
  interaction: {
    mode: 'index',
    intersect: false,
  }
};

const UserAppointmentsChart = ({ data }) => {
  if (!data) return <div className="text-center p-6">Không có dữ liệu biểu đồ</div>;

  return (
    <ChartComponent 
      data={data}
      options={chartOptions}
      type="line"
      height="300px"
    />
  );
};

export default UserAppointmentsChart;