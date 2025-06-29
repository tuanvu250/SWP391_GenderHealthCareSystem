import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ data, options, type, height = '300px' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Chỉ tạo biểu đồ khi có data và DOM element
    if (!data || !chartRef.current) return;
    
    // Cleanup previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    });
    
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options, type]);

  return (
    <div style={{ height, width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartComponent;