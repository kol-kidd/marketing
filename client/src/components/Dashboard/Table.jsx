import React from 'react'

function Table({data}) {

    const formDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    };

  return (
    <table className="w-full border rounded-md text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
        <tr>
            <th scope="col" className="px-6 py-3">Campaign ID</th>
            <th scope="col" className="px-6 py-3">Campaign Name</th>
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3">Start Date</th>
            <th scope="col" className="px-6 py-3">End Date</th>
            <th scope="col" className="px-6 py-3">Budget</th>
            <th scope="col" className="px-6 py-3">Leads Generated</th>
            <th scope="col" className="px-6 py-3">Conversion Rate</th>
            <th scope="col" className="px-6 py-3">Engagement Rate</th>
            <th scope="col" className="px-6 py-3">Location</th>
        </tr>
        </thead>
        <tbody>
            {data.map((cam, index) => (
            <tr
                key={index}
                className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {cam.campaign_id}
                </th>
                <td className="px-6 py-4">{cam.campaign_name}</td>
                <td className="px-6 py-4">
                    {cam.campaign_desc?.length > 40
                    ? `${cam.campaign_desc.substring(0, 40)}...`
                    : cam.campaign_desc}
                </td>
                <td className="px-6 py-4">{formDate(cam.start_date)} </td>
                <td className="px-6 py-4">{formDate(cam.end_date)} </td>
                <td className='px-6 py-4'>{cam.budget}</td>
                <td className='px-6 py-4'>{cam.leads_generated}</td>
                <td className='px-6 py-4'>{cam.conversion_rate}</td>
                <td className='px-6 py-4'>{cam.engagement_rate}</td>
                <td className='px-6 py-4'>{cam.location}</td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default Table