import React, { useEffect, useState } from 'react'
import Loading from '../Loading/Loading';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FaEdit } from "react-icons/fa";


import _table from './_table'; 
import _editCampaign from './_editCampaign';
import ViewChart from './chart/ViewChart'; 
import { useDataContext } from '../../Context/DataContext'; 
import { Modal } from 'flowbite-react';

function _viewCampaign() {
  const { setMetricData, setLineChartData, setBarChartData, metricData, lineChartData, barChartData } = useDataContext(); // Use the context to access and set data
  const { token } = useParams();
  const [campaignData, setCampaignData] = useState({});
  const [loading, setLoading] = useState(true);

  const getCampaignData = async () => {
    const decode = jwtDecode(token);
    const id = decode.campaignId;
    try {
      const responses = await axios.get(`http://localhost:5000/campaign/get/${id}`);
      setCampaignData(responses.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCampaignData();
  }, [token]);

  const {
    campaign_id: campID,
    campaign_name: name,
    campaign_desc: desc,
    start_date: sDate,
    end_date: eDate,
    budget,
    leads_generated: leads,
    status,
    engagement_rate: engage,
    conversion_rate: conversion,
    age_range,
    location,
    interest,
    createdBy
  } = campaignData;

  const [openModal2, setOpenModal2] = useState(false);
  
  const handleOpenModal2 = () => {
    setOpenModal2(true);
  }

  const handleCloseModal2 = () => {
    setOpenModal2(false);
    getCampaignData();
  };


  if (loading) {
    return <Loading />;
  }

  return (
    <div className='grid grid-cols-12 gap-5 p-5'>
        <div className="col-span-12 flex flex-col gap-5">
          <div className="flex gap-3">
            <h1>Campaign Details</h1>
            <FaEdit className='text-xl cursor-pointer' onClick={() => handleOpenModal2()}/>
          </div>
        <_table data={campaignData} />
        </div>
      
      {/* Pass the total leads for the specific campaign to the chart */}
      <div  className="col-span-2 xl:col-span-12 lg:col-span-10 md:col-span-6 sm:col-span-4 h-[500px] border flex flex-col border-gray-300 p-5 rounded-lg shadow-sm bg-white" >
        <div className="flex flex-col">
            <p className='text-2xl'>Total Leads Generated</p>
            <p className='text-5xl text-black'>{leads}</p>
            <hr />
        </div>
        <ViewChart
            data={lineChartData.filter(data => data.campaign_id === campID)} 
        />
      </div>


      <Modal
        show={openModal2}
        onClose={() => setOpenModal2(false)}
        className="z-[1050]" // Modal z-index
      >
        <Modal.Header>Edit</Modal.Header>
        <Modal.Body>
          <_editCampaign data={campID} onFormSubmit={handleCloseModal2} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default _viewCampaign;
