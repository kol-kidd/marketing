import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function _lineChart({ data }) {
  const [childData, setChildData] = useState([]);

  useEffect(() => {
    // Keep raw data for the chart
    setChildData(data);
  }, [data]);

  // Format tooltip values with the peso sign
  const formatTooltip = (value) => {
    const numericValue = Number(value);
    return `₱${numericValue.toLocaleString('en-US')}`;
  };

  const formatYAxis = (value) => `₱${value.toLocaleString('en-US')}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={childData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="campaignID" />
        <YAxis width={50} tickFormatter={formatYAxis} />
        <Tooltip formatter={(value, name) => [formatTooltip(value), name]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenueGained"
          stroke="red"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="budget" stroke="blue" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default _lineChart;
