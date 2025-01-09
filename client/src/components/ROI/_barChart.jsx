import React from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'CAM001',
    leads: 560,
    fill: '#82ca9d'
  },
  {
    name: 'CAM002',
    leads: 110,
    fill: 'red'
  },
  {
    name: 'CAM003',
    leads: 120,
    fill: 'blue'
  },
  {
    name: 'CAM004',
    leads: 258,
    fill: 'yellow'
  },
  {
    name: 'CAM005',
    leads: 150,
    fill: 'violet'
  },
];


function _barChart() {
  return (
       <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="leads" fill="fill" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
  )
}

export default _barChart