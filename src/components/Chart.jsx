import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const ChartComponent = ({ setCurrentPrice, setPriceChange, setPercentageChange }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [timeRange, setTimeRange] = useState('1');  // Default set to '1' day
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    fetchChartData(timeRange);

    const id = setInterval(() => fetchRealTimeData(), 10000); 
    setIntervalId(id);

    return () => {
      clearInterval(id);
    };
  }, [timeRange]);

  const convertToIST = (timestamp) => {
    return timestamp + 5.5 * 60 * 60 * 1000;  // Convert to IST time
  };

  const fetchChartData = async (range) => {
    try {
      // Fetch Bitcoin data
      const btcResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${range}`
      );
      const btcData = await btcResponse.json();
      const btcPrices = btcData.prices.map(([timestamp, price]) => [
        convertToIST(timestamp),
        price
      ]);

      const minBtcPrice = Math.min(...btcPrices.map(([_, price]) => price));
      const maxBtcPrice = Math.max(...btcPrices.map(([_, price]) => price));

      setCurrentPrice(maxBtcPrice.toFixed(2));

      // Calculate the absolute price change and percentage change
      const priceChange = (maxBtcPrice - minBtcPrice).toFixed(2);
      setPriceChange(priceChange);  // Absolute price change

      const percentageChange = (((maxBtcPrice - minBtcPrice) / minBtcPrice) * 100).toFixed(2);
      setPercentageChange(percentageChange);  // Percentage change

      const series = [
        {
          name: 'BTC Price',
          data: btcPrices,
          type: 'area',
          tooltip: {
            valueDecimals: 2,
            valuePrefix: '$',
          },
          color: '#1E90FF',
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, '#1E90FF'],
              [1, Highcharts.color('#1E90FF').setOpacity(0).get('rgba')],
            ],
          },
          threshold: null,
        },
      ];

      // If in compare mode, add ETH data
      if (isCompareMode) {
        const ethResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${range}`
        );
        const ethData = await ethResponse.json();
        const ethPrices = ethData.prices.map(([timestamp, price]) => [
          convertToIST(timestamp),
          price,
        ]);

        series.push({
          name: 'ETH Price',
          data: ethPrices,
          type: 'area',
          tooltip: {
            valueDecimals: 2,
            valuePrefix: '$',
          },
          color: '#FF6347',
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, '#FF6347'],
              [1, Highcharts.color('#FF6347').setOpacity(0).get('rgba')],
            ],
          },
          threshold: null,
        });
      }

      setChartOptions({
        xAxis: {
          type: 'datetime',
          ordinal: false,
        },
        yAxis: {
          title: {
            text: 'Price (USD)',
          },
        },
        rangeSelector: {
          selected: 1,
        },
        series: series,
        scrollbar: {
          enabled: false,
        },
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1`
      );
      const data = await response.json();
      const latestPrice = data.prices[data.prices.length - 1];
      const timestamp = latestPrice[0];
      const price = latestPrice[1];

      const timestampInIST = convertToIST(timestamp);

      if (chartRef.current) {
        const chart = chartRef.current.chart;
        chart.series[0].addPoint([timestampInIST, price], true, true);

        setCurrentPrice(price.toFixed(2));

        // Update price change and percentage dynamically
        const minPrice = Math.min(...chart.series[0].data.map((point) => point.y));
        const maxPrice = Math.max(...chart.series[0].data.map((point) => point.y));
        const updatedPriceChange = (maxPrice - minPrice).toFixed(2);
        setPriceChange(updatedPriceChange);

        const updatedPercentageChange = (((maxPrice - minPrice) / minPrice) * 100).toFixed(2);
        setPercentageChange(updatedPercentageChange);
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      chartContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleCompareMode = () => {
    setIsCompareMode(!isCompareMode); 
    fetchChartData(timeRange);
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
        return '1';
    }
  };

  return (
    <div
      ref={chartContainerRef}
      className={`chart-container ${isFullscreen ? 'fullscreen' : ''}`}
    >
      <div className="chart-controls">
        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
   
        <button
          className="compare-btn"
          onClick={toggleCompareMode}
          title="Compare Bitcoin with Ethereum"
        >
          Compare
        </button>
        <div className="time-range-buttons">
          {['1d', '3d', '1w', '6m', '1y', 'max'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(mapTimeRange(range))}
              className="time-range-btn"
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={chartOptions}
        ref={chartRef} 
      />
    </div>
  );
};

export default ChartComponent;
