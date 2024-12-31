import React, { useState } from 'react';
import Header from './components/Header';
import ChartComponent from './components/Chart';
import Tabs from './components/Tabs';
import './styles/styles.css';

const App = () => {
  const [currentPrice, setCurrentPrice] = useState('99344.95');
  const [percentageChange, setPercentageChange] = useState('5.43');

  return (
    <div className="app-container">
      <div className="content-box">
        <Header currentPrice={currentPrice} percentageChange={percentageChange} />
        <Tabs />
        <ChartComponent
          setCurrentPrice={setCurrentPrice}
          setPercentageChange={setPercentageChange}
        />
      </div>
    </div>
  );
};

export default App;
