import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _pieChart from './_pieChart';
import _lineChart from './_lineChart';
import _table from './_table';

function Dashboard() {
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


  return (
    <div className="grid grid-cols-12 gap-4 mb-2">
      <div className="col-span-12 xl:col-span-3 lg:col-span-12 md:col-span-6 sm:col-span-12 h-[400px] grid-grid-cols-3 border border-gray-300 p-5 rounded-lg shadow-sm bg-white flex flex-col gap-3">
          <span className="text-xl mb-5">Total Revenue</span>
          <div className="flex flex-col h-full gap-2">
            <div className="flex flex-wrap items-center gap-2 w-fit">
              <select
                id="arpc"
                value={isCustom ? "custom" : arpc}
                onChange={handleArpcChange}
                className="border rounded px-2 py-1"
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
                +6.7% <span className="text-gray-500">compare to last month</span>
              </p>
            </div>
          </div>
        </div>
    
    {/* Campaign ROI */}
    <div className="col-span-12 xl:col-span-9 lg:col-span-12 md:col-span-6 sm:col-span-12 h-[400px] border border-gray-300 p-5 rounded-lg shadow-sm bg-white flex flex-col gap-5">
      <div className="flex flex-col">
        <p className='text-lg'>Campaign List</p>
        <span className='text-gray-400 text-md'>This is a list of campaigns with their ROI</span>
      </div>
      <_table data={metric} ROI={rois} />
    </div>

    {/* Revenue vs Budget */}
    <div className="col-span-12 xl:col-span-8 lg:col-span-12 md:col-span-6 sm:col-span-12 grid-grid-cols-3 h-[450px] border border-gray-300 p-5 rounded-lg shadow-sm bg-white flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p className='text-lg'>Revenue vs Budget</p>
        <hr className='m-0' />
      </div>
      <_lineChart data={revenues} />
    </div>

    {/* Top 5 Performing Campaigns */}
    <div className="col-span-12 xl:col-span-4 lg:col-span-12 md:col-span-12 sm:col-span-12 h-[450px] border border-gray-300 rounded-lg shadow-sm bg-white flex flex-col gap-5">
      <div className="p-5">
        <p>Top 5 performing campaigns based on revenue</p>
        <hr />
      </div>
      <_pieChart revenue={revenues} />
    </div>
  </div>

  );
}

export default Dashboard;
