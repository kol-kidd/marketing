import React, { useEffect, useState } from 'react'

import { useDataContext } from '../../Context/DataContext'; // Import the custom hook

import Cards from '../common/cards/Cards';
import _pieChart from '../ROI/_pieChart';
import CustomLineChart from '../Campaign/chart/LineChart';
import EmptyData from '../Empty/EmptyData';
import Table from './Table';
import axios from 'axios';

import { FaHandHoldingHeart, FaChartLine } from "react-icons/fa";
import { IoMegaphone } from "react-icons/io5";



function Dashboard() {
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

  const [metric, setMetric] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [arpc, setArpc] = useState(1000); 
  const [customArpc, setCustomArpc] = useState('');
  const [isCustom, setIsCustom] = useState(false); 

  const getTotalRevenue = async () => {
    try {
      const response = await axios.get('http://localhost:5000/roi/dashboard/get');
      setMetric(response.data.data);
    } catch (error) {
      console.error('Error getting metric data:', error);
    }
  };

  useEffect(() => {
    getTotalRevenue();
  }, []);

  const handleArpcChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setArpc(Number(value));
    }
  };

  const handleCustomArpcChange = (e) => {
    setCustomArpc(e.target.value);
    setArpc(Number(e.target.value)); // Update ARPC dynamically
  };

  const calculateTotalRevenue = () => {
    let totalCustomer = 0;
     metric.forEach((data) => {
        totalCustomer += data.number_of_customers
     })
     setTotalRevenue(totalCustomer * arpc);
  }

  const [revenues, setRevenues] = useState([]);

  const calculateEachRevenue = () => {
    const updatedRevenues = metric.map((data) => ({
      campaignID: data.campaign_id,
      revenueGained: data.number_of_customers * arpc,
      budget: data.budget
    }));

    setRevenues(updatedRevenues); 
  };

  const [rois, setRois] = useState([]);

  const calculateEachRoi = () => {
    const updatedRoi = metric.map((data) => ({
      campaignID: data.campaign_id,
      ROI: (((data.number_of_customers * arpc) - data.budget)  / data.budget) * 100,
    }));

    setRois(updatedRoi); 
  };

  useEffect(() => {
    //Calculate Total Revenue
    try{
      calculateTotalRevenue();
      calculateEachRevenue();
      calculateEachRoi();
    }catch(error){
      console.error('Error:', error);
    }
  }, [metric, arpc])


  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className='grid grid-cols-12 gap-5'>
      {loading ? (
        <EmptyData passStyle="col-span-12 row-span-2" />
      ) : (
        <>
          <Cards
            title="Number of Campaigns"
            metric={metricData} // Using context data
            className="col-span-12 xl:col-span-4 lg:col-span-12 md:col-span-12 sm:col-span-12 shadow-sm"
            icon={<IoMegaphone/>}
          />
          <Cards
            title="Conversion Rate"
            metric={metricData} // Using context data
            className="col-span-12 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 shadow-sm"
            icon={<FaChartLine/>}
          />
          <Cards
            title="Engagement Rate"
            metric={metricData} // Using context data
            className="col-span-12 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 shadow-sm"
            icon={<FaHandHoldingHeart/>}
          />
         
          {/* Top 5 Performing Campaigns */}
          <div className="col-span-12 xl:col-span-4 lg:col-span-12 md:col-span-12 sm:col-span-12 h-[450px] border border-gray-300 rounded-lg shadow-sm bg-white  flex flex-col gap-5">
            <div className="">
              <p className='text-lg px-5 py-5'>Top 5 performing campaigns based on revenue</p>
              <hr className=' m-0' />
            </div>
            <_pieChart revenue={revenues} />
          </div>

          <div className="col-span-12 xl:col-span-3 lg:col-span-12 md:col-span-12 sm:col-span-12 h-[450px] grid-grid-cols-3 border border-gray-300 p-5 rounded-lg shadow-sm bg-white flex flex-col gap-3">
            <span className="text-xl mb-5">Total Revenue</span>
            <div className="flex flex-col h-full gap-2">
              <div className="flex flex-wrap items-center gap-2 w-fit ">
                <select
                  id="arpc"
                  value={isCustom ? "custom" : arpc}
                  onChange={handleArpcChange}
                  className="shadow-sm shadow-black rounded-md px-2 py-1"
                >
                  <option value={1000}>₱1000</option>
                  <option value={2000}>₱2000</option>
                  <option value={3000}>₱3000</option>
                  <option value="custom">Custom</option>
                </select>
                {isCustom && (
                  <input
                    type="number"
                    placeholder="Enter ARPC"
                    value={customArpc}
                    onChange={handleCustomArpcChange}
                    className="border rounded px-2 py-1 w-[50%]"
                  />
                )}
              </div>
              <div>
                <span className="text-gray-500">Estimated ARPC: ₱{arpc}</span>
              </div>
              <div className="flex">
                <span className="text-[4rem] font-normal">₱{totalRevenue}</span>
              </div>
              <div className="flex h-full items-end">
                <p className="text-green-400">
                  +6.7% <span className="text-gray-400">compare to last month</span>
                </p>
              </div>
            </div>
          </div>

          <CustomLineChart
            data={lineChartData} // Using context data
            totalLeads={metricData} // Using context data
            className="col-span-12 xl:col-span-5 lg:col-span-12 md:col-span-12 sm:col-span-12 border h-[450px] border-gray-300 p-5 rounded-lg shadow-sm bg-white to-gray-500"
          />

        <div className="col-span-12 flex flex-col gap-5 border border-gray-300 h-full rounded-xl shadow-sm bg-white">
            <div className="flex justify-between items-center shadow-sm-light shadow-gray-400 px-5 py-5">
              <span className='text-xl rtl:text-right font-semibold'>Campaign List</span>
                <div className="flex h-full items-center gap-5">
                    <div className="search px-5 py-2 rounded-md w-[250px] shadow-inner shadow-gray-300 bg-white">Search</div>
                    <div className="flex border border-gray-400 px-5 py-2 rounded-md w-[100px] shadow-sm shadow-gray-600 bg-white">Filter</div>
                </div>
            </div>
            <div className="px-5 mb-5">
              <Table data={metric} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard