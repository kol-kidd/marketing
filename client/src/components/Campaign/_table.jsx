import React from 'react'
import { Dropdown, IconButton } from 'rsuite';

function _table({data}) {
    const formDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Campaign ID</th>
              <th scope="col" className="px-6 py-3">Campaign Name</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Start Date</th>
              <th scope="col" className="px-6 py-3">End Date</th>
              <th scope="col" className="px-6 py-3">Budget</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Engagement Rate</th>
              <th scope="col" className="px-6 py-3">Conversion Rate</th>
              <th scope="col" className="px-6 py-3">Age Range</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Interest</th>
            </tr>
          </thead>
          <tbody>
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {data.campaign_id}
                </th>
                <td className="px-6 py-4">{data.campaign_name}</td>
                <td className="px-6 py-4">
                  {data.campaign_desc?.length > 40
                    ? `${data.campaign_desc.substring(0, 40)}...`
                    : data.campaign_desc}
                </td>
                <td className="px-6 py-4">{formDate(data.start_date)} </td>
                <td className="px-6 py-4">{formDate(data.end_date)} </td>
                <td className="px-6 py-4">{data.budget} </td>
                <td className="px-6 py-4">{data.status} </td>
                <td className="px-6 py-4">{data.engagement_rate} </td>
                <td className="px-6 py-4">{data.conversion_rate} </td>
                <td className="px-6 py-4">{data.age_range} </td>
                <td className="px-6 py-4">{data.location} </td>
                <td className="px-6 py-4">{data.interest} </td>
              </tr>
          </tbody>
        </table>
  )
}

export default _table