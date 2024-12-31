import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ setCurrentPrice, setPercentageChange }) => {
  const [chartData, setChartData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeRange, setTimeRange] = useState('7');
  const chartRef = useRef(null);

  useEffect(() => {
    fetchChartData(timeRange);
  }, [timeRange]);

  const fetchChartData = async (range) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${range}`
      );
      const data = await response.json();
      const labels = data.prices.map(() => '');
      const prices = data.prices.map((price) => price[1]);

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setCurrentPrice(maxPrice.toFixed(2));
      setPercentageChange(
        (((maxPrice - minPrice) / minPrice) * 100).toFixed(2)
      );

      setChartData({
        labels,
        datasets: [
          {
            data: prices,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById('chartCanvas').getContext('2d');

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
              },
            },
            y: {
              ticks: {
                display: false,
              },
              grid: {
                display: false,
              },
            },
          },
        },
      });

      return () => {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
      };
    }
  }, [chartData]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const mapTimeRange = (range) => {
    switch (range) {
      case '1d':
        return '1';
      case '3d':
        return '3';
      case '1w':
        return '7';
      case '6m':
        return '180';
      case '1y':
        return '365';
      case 'max':
        return 'max';
      default:
        return '7';
    }
  };

  return (
    <div className={`chart-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="chart-controls">
        <button onClick={toggleFullscreen}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        {['1d', '3d', '1w', '6m', '1y', 'max'].map((range) => (
          <button key={range} onClick={() => setTimeRange(mapTimeRange(range))}>
            {range}
          </button>
        ))}
      </div>
      <canvas id="chartCanvas"></canvas>
    </div>
  );
};

export default ChartComponent;
