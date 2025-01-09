import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDataContext } from '../../Context/DataContext'; // Import the custom hook

import Cards from '../common/cards/Cards';
import EmptyData from '../Empty/EmptyData';

import CustomLineChart from './chart/LineChart';
import CustomBarChart from './chart/BarChart';

import { FaHandHoldingHeart, FaChartLine } from "react-icons/fa";
import { IoMegaphone } from "react-icons/io5";

function Performance() {
  const { setMetricData, setLineChartData, setBarChartData, metricData, lineChartData, barChartData } = useDataContext(); // Use the context to access and set data
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const resultsMetrics = await axios.get('http://localhost:5000/campaign/metrics');
      const resultsLineChart = await axios.get('http://localhost:5000/campaign/lineChartData');
      const resultsBarChart = await axios.get('http://localhost:5000/campaign/barChartData');

      setMetricData(resultsMetrics.data); // Set data in the context
      setLineChartData(resultsLineChart.data);
      setBarChartData(resultsBarChart.data);
      setLoading(false);
      setDataLoaded(true);
    } catch (err) {
      console.error('Error getting metrics:', err);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      const ws = new WebSocket('ws://localhost:5001');

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'metrics') {
            setMetricData(data.data);
          } else if (data.type === 'barChartData') {
            setBarChartData(Array.isArray(data.data) ? data.data : []);
          } else if (data.type === 'lineChartData') {
            setLineChartData(Array.isArray(data.data) ? data.data : []);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
      };

      return () => {
        ws.close();  // Cleanup on unmount
      };
    }
  }, [dataLoaded]);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-12 lg:grid-cols-10 md:grid-cols-6 sm:grid-cols-4 gap-5">
      {loading ? (
        <EmptyData passStyle="col-span-12 row-span-2" />
      ) : (
        <>
          <Cards
            title="Number of Campaigns"
            metric={metricData} // Using context data
            className="col-span-2 xl:col-span-4 lg:col-span-10 md:col-span-6 sm:col-span-4 shadow-sm"
            icon={<IoMegaphone/>}
          />
          <Cards
            title="Conversion Rate"
            metric={metricData} // Using context data
            className="col-span-2 xl:col-span-4 lg:col-span-5 md:col-span-6 sm:col-span-4 shadow-sm"
             icon={<FaChartLine/>}
          />
          <Cards
            title="Engagement Rate"
            metric={metricData} // Using context data
            className="col-span-2 xl:col-span-4 lg:col-span-5 md:col-span-6 sm:col-span-4 shadow-sm"
            icon={<FaHandHoldingHeart/>}
          />

          <CustomLineChart
            data={lineChartData} // Using context data
            totalLeads={metricData} // Using context data
            className="col-span-2 xl:col-span-6 lg:col-span-10 md:col-span-6 sm:col-span-4 border border-gray-300 p-5 rounded-lg shadow-sm bg-white"
          />
          <CustomBarChart
            data={barChartData} // Using context data
            className="col-span-2 xl:col-span-6 lg:col-span-10 md:col-span-6 sm:col-span-4 border border-gray-300 p-5 rounded-lg shadow-sm bg-white"
          />
        </>
      )}
    </div>
  );
}

export default Performance;
