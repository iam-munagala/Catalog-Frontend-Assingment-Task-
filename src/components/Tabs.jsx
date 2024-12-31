import React from 'react';

const Tabs = () => {
  return (
    <div className="tabs-container">
      <button >Summary</button>
      <button className="active">Chart</button>
      <button>Statistics</button>
      <button>Analysis</button>
      <button>Settings</button>
    </div>
  );
};

export default Tabs;
