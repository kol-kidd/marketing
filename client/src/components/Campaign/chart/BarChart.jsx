import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Loading from '../../Loading/Loading';

function CustomBarChart({ className, data }) {
  const [newData, setNewData] = useState([{
    campaign_id: '',
    campaign_name: '',
    start_date: '',
    end_date: '',
    leads_generated: '',
    engagement_rate: '',
    conversion_rate: '',
  }]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
  const conversionColor = 'rgb(75, 192, 192)';
  const engagementColor = 'rgb(255, 99, 132)';


  const handleChange = (index, value) => {
    const updatedSelection = [...selectedCampaigns];
    updatedSelection[index] = value;
    setSelectedCampaigns(updatedSelection);
  };

  useEffect(() => {
    if (data.length > 0) {
      setIsLoading(false);

      if (selectedCampaigns.length === 0) {
        setSelectedCampaigns([data[0]?.campaign_name, data[1]?.campaign_name]);
      }
    }
  }, [data]);

  useEffect(() => {
    const updatedData = [];
    data.forEach((item) => {
      if (item.conversion_rate != null) {
        updatedData.push({
          campaign_name: item.campaign_name,
          campaign_id: item.campaign_id,
          start_date: item.start_date,
          end_date: item.end_date,
          leads_generated: item.leads_generated,
          engagement_rate: item.engagement_rate,
          conversion_rate: item.conversion_rate,
        });
      }
    });
    setNewData(updatedData);
  }, [data]);

  // Filter and format data for Recharts
  const formattedData = [
    { metric: 'Conversion Rate' },
    { metric: 'Engagement Rate' },
  ];

  selectedCampaigns.forEach((campaign) => {
    const campaignData = data.find((item) => item.campaign_name === campaign);
    if (campaignData) {
      formattedData[0][campaign] = parseFloat(campaignData.conversion_rate);
      formattedData[1][campaign] = parseFloat(campaignData.engagement_rate);
    }
  });



  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={`${className} flex flex-col z-1 gap-3 h-[500px]`}>
      {/* Dropdown selectors for each campaign */}
      <div className="flex gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <select
            key={index}
            value={selectedCampaigns[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            className="p-2 border rounded"
          >
            {newData.map((item) => (
              <option
                key={item.campaign_id}
                value={item.campaign_name}
                disabled={
                  selectedCampaigns.includes(item.campaign_name) &&
                  selectedCampaigns[index] !== item.campaign_name
                }
              >
                {item.campaign_name}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} width={40} />
          <Tooltip />
          <Legend />
          {selectedCampaigns.map((campaign, index) => (
            <Bar
              key={campaign}
              dataKey={campaign}
              fill={index === 0 ? conversionColor : engagementColor}
              barSize={90}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;
