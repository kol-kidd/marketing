import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const generateDistinctColor = () => {
  const hue = Math.floor(Math.random() * 360); // Random hue between 0 and 359
  const saturation = 80 + Math.random() * 30; // Saturation between 70% and 100%
  const lightness = 30 + Math.random() * 20; // Lightness between 50% and 70%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

function CustomLineChart({ className, data, totalLeads }) {

  const [leads, setLeads] = useState(0);

  const groupDataByDay = (data, displayMode, selectedYear, selectedMonth) => {
    const uniqueDates = Array.from(
      new Set(
        data
          .filter(
            (item) =>
              new Date(item.lead_date).getFullYear() === selectedYear &&
              new Date(item.lead_date).getMonth() + 1 === selectedMonth
          )
          .map((item) => new Date(item.lead_date).toLocaleDateString("en-US"))
      )
    ).sort((a, b) => new Date(a) - new Date(b));

    let formattedData = [];

    if (displayMode === "Show All") {
      const campaigns = Array.from(new Set(data.map((item) => item.campaign_id)));

      uniqueDates.forEach((date) => {
        let dailyData = { date };
        campaigns.forEach((campaignId) => {
          const leads = data.filter(
            (item) =>
              new Date(item.lead_date).toLocaleDateString("en-US") === date &&
              item.campaign_id === campaignId
          );
          dailyData[campaignId] = leads.reduce((sum, item) => sum + item.number_of_leads, 0) || 0;
        });

        formattedData.push(dailyData);
      });

    } else if (displayMode === "Show Total") {
      uniqueDates.forEach((date) => {
        const totalLeads = data
          .filter((item) => new Date(item.lead_date).toLocaleDateString("en-US") === date)
          .reduce((sum, item) => sum + item.number_of_leads, 0);
        formattedData.push({ date, leads: totalLeads });
      });
    }

    return formattedData;
  };

  const [selectedYear, setSelectedYear] = useState(() => {
    if (data.length) {
      const latestDate = new Date(
        Math.max(...data.map((item) => new Date(item.lead_date).getTime()))
      );
      return latestDate.getFullYear(); // Use the year from the latest date
    }
    return new Date().getFullYear(); // Fallback to the current year
  });
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (data.length) {
      const latestDate = new Date(
        Math.max(...data.map((item) => new Date(item.lead_date).getTime()))
      );
      return latestDate.getMonth() + 1; // Use the month from the latest date
    }
    return new Date().getMonth() + 1; // Fallback to the current month
  });

  const [displayMode, setDisplayMode] = useState("Show All");

  const chartData = groupDataByDay(data, displayMode, selectedYear, selectedMonth);

  useEffect(() => {
    const matchingTotalLeads = totalLeads.find(
      (item) => item.year === selectedYear && item.month === selectedMonth
    );

    if (matchingTotalLeads) {
      setLeads(matchingTotalLeads.total_leads_generated);
    } else {
      setLeads(0); // Reset to 0 if no matching entry is found
    }
  }, [selectedYear, selectedMonth, totalLeads]);

  const handleDisplayModeChange = (event) => {
    setDisplayMode(event.target.value);
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    setSelectedYear(newYear);

    // Update the month to the first available month for the selected year
    const months = Array.from(
      new Set(
        data
          .filter((item) => new Date(item.lead_date).getFullYear() === newYear)
          .map((item) => new Date(item.lead_date).getMonth() + 1)
      )
    );
    setSelectedMonth(months.length ? months[0] : new Date().getMonth() + 1);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const availableYears = Array.from(
    new Set(data.map((item) => new Date(item.lead_date).getFullYear()))
  );

  const availableMonths = Array.from(
    new Set(
      data
        .filter((item) => new Date(item.lead_date).getFullYear() === selectedYear)
        .map((item) => new Date(item.lead_date).getMonth() + 1)
    )
  );

  return (
    <div className={`${className} z-1 flex flex-col`}>
      <div className="flex flex-col mb-2">
        <div className="flex justify-between">
          <span className="text-2xl font-bold">{leads}</span>
            <div className="flex w-full items-end justify-end">
                  <div className="inline-flex gap-2 p-1 text-emerald-400">
                      {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                          <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                          />
                      </svg> */}

                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                      </svg>

                      <span className="text-xs font-medium"> 69.420% </span>
                  </div>
            </div>
        </div>
      <span className="w-full text-gray-500 text-lg">Total Leads Generated</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="1 4" stroke="black" />
          {/* <XAxis
            height={50}
            dataKey="date"
            scale="point"
            label={{ position: "insideBottom", offset: -5 }}
            tickFormatter={(tick) =>
              new Date(tick).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
            textAnchor="middle"
          />
          <YAxis width={40} /> */}
          <Tooltip />
          {displayMode === "Show All" &&
            Object.keys(chartData[0] || {})
            .filter((key) => key !== "date")
            .map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={generateDistinctColor()}
                fill={generateDistinctColor()}
                fillOpacity={0.3}
                strokeWidth={2}
                dot={{ r: 5, fill: "#ff6384" }}
              />
            ))}
          {displayMode === "Show Total" && (
            <Area
              type="monotone"
              dataKey="leads"
              data={chartData}
              stroke="#4bc0c0"
              fill="#4bc0c0"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 5, fill: "#ff6384" }}
            />
          )}
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
      <hr/>
      <div className="flex gap-5">
        <div className="w-fit">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full p-2 border-none text-gray-500 shadow-lg rounded-md focus:ring-0 focus:text-black"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="w-fit">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full p-2 border-none text-gray-500 rounded-md shadow-lg focus:ring-0 focus:text-black"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(2024, month - 1).toLocaleString("en-US", { month: "short" })}
              </option>
            ))}
          </select>
        </div>

        <div className="w-fit">
          <select
            value={displayMode}
            onChange={handleDisplayModeChange}
            className="w-full p-2 border-none text-gray-500 rounded-md shadow-lg focus:ring-0 focus:text-black"
          >
            <option value="Show All">Show All</option>
            <option value="Show Total">Show Total</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default CustomLineChart;
