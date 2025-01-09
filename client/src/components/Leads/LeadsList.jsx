import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { itemsPerPage, statusBadge } from '../../constants/leads';
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Dropdown } from 'rsuite';
import { renderIconButton } from '../common/renderIcon';
import Reload from '../reload/Reload';

function LeadsList() {
  const [leadsData, setLeadsData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(groupedData.length / itemsPerPage);

  const getLeads = async () => {
    setLoading(true);
    try {
      const results = await axios.get('http://localhost:5000/leads/get');

      // Group leads by user_id
      const grouped = results.data.reduce((acc, lead) => {
        const { user_id, name, email, phone, status, score, campaign_id } = lead;
        if (!acc[user_id]) {
          acc[user_id] = { user_id, name, email, phone, status, score, campaigns: [] };
        }
        acc[user_id].campaigns.push(campaign_id);
        return acc;
      }, {});

      setGroupedData(Object.values(grouped)); // Convert grouped object to array
      setLeadsData(results.data);
    } catch (error) {
      console.error('Error client getting leads: ', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLeads();
  }, []);

  const deleteData = async (data) => {
    try {
      await axios.delete(`http://localhost:5000/leads/delete/${data.id}/${data.email}`);
      toast.success('Data deleted successfully!');
      getLeads();
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error('Error deleting data');
    }
  };

  const handleDelete = (id) => {
    deleteData(id);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const currentData = groupedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-5 w-full border border-gray-300 h-full rounded-xl shadow-sm bg-white overflow-hidden">
      <div className="flex justify-between items-center shadow-sm-light shadow-gray-400 px-5 py-5 w-full">
          <span className='text-xl rtl:text-right font-semibold'>Leads List</span>
          <div className="flex h-full items-center gap-5">
            <Reload refreshData={getLeads} />
          </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>    
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Phone No.</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Score</th>
            <th scope="col" className="px-6 py-3">Campaigns</th>
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
                {data.name}
              </th>
              <td className="px-6 py-4">{data.email}</td>
              <td className="px-6 py-4">{data.phone}</td>
              <td className="px-6 py-4">
                {statusBadge.map((badge, index) =>
                  <div key={index}>
                    {badge.status === data.status ? badge.badge : ''}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{data.score}</td>
              <td className="px-6 py-4">{data.campaigns.join(', ')}</td>
              <td className="flex items-center px-6 py-4 gap-2">
                <Dropdown renderToggle={renderIconButton} placement="leftStart">
                  <Dropdown.Item>
                    <Link
                      to={`/leads/list/edit/${data.user_id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <a
                      href="#"
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      onClick={() => handleDelete({ id: data.user_id, email: data.email })}
                    >
                      Remove
                    </a>
                  </Dropdown.Item>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, groupedData.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {groupedData.length}
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
  );
}

export default LeadsList;
