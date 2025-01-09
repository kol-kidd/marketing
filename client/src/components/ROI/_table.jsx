import React from 'react'
import { Dropdown, IconButton } from 'rsuite';
import { FaEllipsisH } from "react-icons/fa";

function _table({data, ROI}) {

  const renderIconButton = (props, ref) => {
        return (
          <IconButton {...props} ref={ref} icon={<FaEllipsisH />}  color="blue" appearance="ghost" />
        );
    };

  const formDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

  const formatNumber = (value) => {
    const numericValue = Number(value); // Convert to number if it's a string
    return `₱${numericValue.toLocaleString('en-US')}`;
  };
  

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>   
              <th scope="col" className="px-6 py-3">Campaign ID</th>
              <th scope="col" className="px-6 py-3">Campaign Name</th>
              <th scope="col" className="px-6 py-3">Start Date</th>
              <th scope="col" className="px-6 py-3">End Date</th>
              <th scope="col" className="px-6 py-3">Budget</th>
              <th scope="col" className="px-6 py-3">Leads Generated</th>
              <th scope="col" className="px-6 py-3">ROI</th>
              {/* <th scope="col" className="px-6 py-3">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((dataItem, index) => {
              // Find the ROI for the current campaign_id
              const roiData = ROI.find((roiItem) => roiItem.campaignID === dataItem.campaign_id);
              const roi = roiData ? roiData.ROI.toFixed(2) : 'N/A'; // If no ROI data, display 'N/A'

              return (
                <tr
                  key={dataItem.campaign_id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {dataItem.campaign_id}
                  </th>
                  <td className="px-6 py-4">{dataItem.campaign_name}</td>
                  <td className="px-6 py-4">{formDate(dataItem.start_date)} </td>
                  <td className="px-6 py-4">{formDate(dataItem.end_date)} </td>
                  <td className="px-6 py-4">{formatNumber(dataItem.budget)}</td>
                  <td className="px-6 py-4">{dataItem.leads_generated}</td>
                  <td className="px-6 py-4">{roi}%</td> {/* Display ROI */}
                  {/* <td className="flex items-center px-6 py-4 gap-2">
                    <Dropdown renderToggle={renderIconButton} placement='leftStart'>
                      <Dropdown.Item className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        <span>View</span>
                      </Dropdown.Item>

                      <Dropdown.Item className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        <span>Edit</span>
                      </Dropdown.Item>

                      <Dropdown.Item as="a" className="font-medium text-red-600 dark:text-red-500 hover:underline">
                        <span>Remove</span>
                      </Dropdown.Item>
                    </Dropdown>       
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
  )
}

export default _table