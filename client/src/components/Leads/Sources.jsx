import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyData from '../Empty/EmptyData';
import { itemsPerPage } from '../../constants/leads';
import { Button, Dropdown, Modal, Placeholder } from 'rsuite';
import _editSource from './_editSource';
import { toast } from 'react-toastify';
import axios from 'axios';
import {renderIconButton} from '../common/renderIcon'
import Reload from '../reload/Reload';


function Sources() {
  const [sourceData, setSourceData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const[passedData, setPassedData] = useState([]);

  const getSourceData = async() => {
    try{
      const response = await axios.get('http://localhost:5000/leads/source/get');
      setSourceData(response.data);
    }catch(error){
      toast.error('Error getting source data');
      console.error(error);
    }
  }

  useEffect(() => {
    getSourceData();
  },[])

  const handleOpen = (data, type) => {
    if(type === 'edit') {
      setPassedData(data);
      setOpenModal(true)
    }else{
      setPassedData('')
      setOpenModal(true)
    }
    
  };

  const handleClose = (formData) => {
    if (formData === null) {
        setOpenModal(false);
        return;
    }

    if (Object.keys(formData).length > 0) {
        setOpenModal(false);
        getSourceData();
    } else {
        toast.warning('Please don’t leave the field blank.');
        console.log('Form data:', formData);
    }
};

const deleteData = async(id) => {
  const sourceID = id.id;

  try{
    await axios.delete(`http://localhost:5000/leads/source/delete/${sourceID}`);
    toast.success('Source deleted successfully!');
    getSourceData();
  }catch(error){
    console.error('Error deleting source', error);
    toast.error('Error deleting source');
  }
}

//DELETE RECORD
 const handleDelete = (id) => {
  deleteData(id);
 }

//FORMAT DATE
const formDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA');
};
  
//PAGES
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sourceData.length / itemsPerPage); 
 
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = sourceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <nav
        className="flex items-center border-t rounded-md flex-column flex-wrap md:flex-row justify-between p-4"
        aria-label="Table navigation"
        >
        <div className="">
            <h1>Filter</h1>
        </div>
        <div className="flex gap-5 items-center">
          <Reload refreshData={getSourceData} />
          <div onClick={() => handleOpen()} className="border px-5 py-2 cursor-pointer rounded-xl">
          + Add
          </div>
        </div>
      </nav>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Lead Count</th>
            <th scope="col" className="px-6 py-3">Date Added</th>
            <th scope="col" className="px-6 py-3">Last Updated</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(sourceData).length != 0 && 
          currentData.map((data, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              key={index}
              >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor={`checkbox-table-search-`} className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {data.source_name}
              </th>
              <td className="px-6 py-4">{data.lead_count}</td>
              <td className="px-6 py-4">{formDate(data.date_added)}</td>
              <td className="px-6 py-4">{formDate(data.last_updated)}</td>
              <td className="flex items-center px-6 py-4 gap-2">
                <Dropdown renderToggle={renderIconButton}>
                  <Dropdown.Item>
                    <div
                      onClick={() => handleOpen(data, 'edit')}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                  <span
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    onClick={() => handleDelete({id: data.source_id })}
                  >
                    Remove
                  </span>
                  </Dropdown.Item>
                </Dropdown>    
              </td>
            </tr>
          ))   
          }  
        </tbody>
      </table>
      {sourceData.length != 0 
      ?
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, sourceData.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {sourceData.length}
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
      :
      <EmptyData/>
      }
    </div>

    <Modal open={openModal} onClose={() => handleClose(null)}>
        <Modal.Header>
          <Modal.Title>Add a lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <_editSource data={passedData} onSubmit={handleClose} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleClose(null)} color='red' appearance="ghost">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    
  )
}

export default Sources