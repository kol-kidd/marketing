import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { itemsPerPage } from '../../constants/leads';
import { Dropdown, IconButton } from 'rsuite';
import EmptyData from '../Empty/EmptyData';
import { FaEllipsisH } from "react-icons/fa";

import Create from './create';
import _editCampaign from './_editCampaign';
import { Button, Modal } from "flowbite-react";

import Reload from '../reload/Reload';

function CampaignList() {
    const [campaignData, setCampaignData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(campaignData.length / itemsPerPage); 

    const getCampaignData = async () => {
        setLoading(true);
        try {
            const responses = await axios.get('http://localhost:5000/campaign/get');
            setCampaignData(responses.data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };  

    const renderIconButton = (props, ref) => {
      return (
        <IconButton {...props} ref={ref} icon={<FaEllipsisH />}  color="blue" appearance="ghost" />
      );
    };
    
    useEffect(() => {
        getCampaignData();
    }, []);

    const deleteData = async (id) => {
      const campID = id.id;
        try {
            const response = await axios.delete(`http://localhost:5000/campaign/delete/${campID}`);
            toast.success('Data successfully deleted!')
            
            getCampaignData();
        } catch (err) {
            console.error('Error deleting:', err);
            toast.error(`Failed to delete data. Reason: ${err.response?.data?.message || err.message}`);
        }
    };

    const [campID, setCampID] = useState();

    const handleOpenModal2 = (id) => {
      setOpenModal2(true);
      setCampID(id);
    }

    const handleCloseModal1 = () => {
      setOpenModal1(false);
      getCampaignData();
    };

    const handleCloseModal2 = () => {
      setOpenModal2(false);
      getCampaignData();
    };

    const handleDeleteData = (id) => {
        deleteData(id);
    };

    const formDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
          setCurrentPage(page);
        }
      };

    const currentData = campaignData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

    if (loading) {
        return (
           <Loading/>
        );
    }
    return (
      <>
      <div className="flex flex-col gap-5 w-full border border-gray-300 h-full rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="flex justify-between items-center shadow-sm-light shadow-gray-400 px-5 py-5 w-full">
              <span className='text-xl rtl:text-right font-semibold'>Campaign List</span>
                <div className="flex h-full items-center gap-5">
                <Reload refreshData={getCampaignData} />
              <Link className="border px-5 py-2 cursor-pointer rounded-xl" onClick={() => setOpenModal1(true)}> 
              + Add
              </Link>
                </div>
            </div>
            <div className="overflow-auto">

              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Campaign ID</th>
                    <th scope="col" className="px-6 py-3">Campaign Name</th>
                    <th scope="col" className="px-6 py-3">Start Date</th>
                    <th scope="col" className="px-6 py-3">End Date</th>
                    <th scope="col" className="px-6 py-3">Leads Generated</th>
                    <th scope="col" className="px-6 py-3">Conversion Rate</th>
                    <th scope="col" className="px-6 py-3">Engagement Rate</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {data.campaign_id}
                      </th>
                      <td className="px-6 py-4">
                       {data.campaign_name}
                      </td>
                      <td className="px-6 py-4">{formDate(data.start_date)} </td>
                      <td className="px-6 py-4">{formDate(data.end_date)} </td>
                      <td className="px-6 py-4">{data.leads_generated}</td>
                      <td className="px-6 py-4">{data.conversion_rate}</td>
                      <td className="px-6 py-4">{data.engagement_rate}</td>
                      <td className="flex items-center px-6 py-4 gap-2">
                      <Dropdown renderToggle={renderIconButton} placement='leftStart'>
                        <Dropdown.Item 
                        as={Link} 
                        to={`/campaigns/list/view/${data.token}`} 
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                          <span className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>View</span>
                        </Dropdown.Item>

                        <Dropdown.Item 
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"  onClick={() => handleOpenModal2(data.campaign_id)}>
                          <span className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>Edit</span>
                        </Dropdown.Item>

                        <Dropdown.Item as={"a"}  
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                          onClick={() => handleDeleteData({id: data.campaign_id})}>
                          <span className='font-medium text-red-600 dark:text-red-500 hover:underline'>Remove</span>
                        </Dropdown.Item>

                      </Dropdown>       
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        {currentData.length === 0 && <EmptyData/>}
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4 shadow-sm"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, campaignData.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {campaignData.length}
            </span>
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 'key'}>
                <button
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    currentPage === i + 1
                      ? 'text-white bg-blue-600'
                      : 'text-gray-500 bg-white'
                  } border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <Modal
        show={openModal1}
        onClose={() => setOpenModal1(false)}
        className="z-[1050]" // Modal z-index
      >
        <Modal.Header>Create a campaign</Modal.Header>
        <Modal.Body>
          <Create onFormSubmit={handleCloseModal1} />
        </Modal.Body>
      </Modal>

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
      </>
    );
}

export default CampaignList;
