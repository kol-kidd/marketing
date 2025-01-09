import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

const generateDistinctColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i); // Spread hues evenly across the spectrum
    const saturation = 80 + Math.random() * 10; // Saturation between 80% and 90%
    const lightness = 40 + Math.random() * 20; // Lightness between 40% and 60%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

function _pieChart({ revenue }) {
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (revenue && revenue.length) {
      // Sort the data by `revenueGained` in descending order
      const sortedData = [...revenue].sort((a, b) => b.revenueGained - a.revenueGained);

      // Get the top 5 entries
      const top5 = sortedData.slice(0, 5);

      if (sortedData.length > 5) {
        const othersRevenue = sortedData.slice(5).reduce((sum, item) => sum + item.revenueGained, 0);
        top5.push({ campaignID: 'Others', revenueGained: othersRevenue });
      }

      setData(top5);

      // Generate distinct colors for the data
      setColors(generateDistinctColors(top5.length));
    }
  }, [revenue]);

  const formatTooltip = (value) => {
    const numericValue = Number(value); 
    return `₱${numericValue.toLocaleString('en-US')}`;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="revenueGained"
            data={data}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(1)}%)`
            }
            nameKey="campaignID"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [formatTooltip(value), name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default _pieChart;
