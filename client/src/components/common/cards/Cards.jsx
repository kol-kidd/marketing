import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdPerson } from "react-icons/io";

function Cards({title, metric, className, icon}) {
    const [totalConversion, setTotalConversion] = useState(0);
    const [totalEngagement, setTotalEngagement] = useState(0);
    const [campaign, setCampaign] = useState(0);
    const navigate = useNavigate();

    const groupDataByDay = (data, selectedYear, selectedMonth) => {
        const uniqueDates = Array.from(
          new Set(
            data
              .filter(
                (item) =>
                  new Date(`${item.year}`).getFullYear() === selectedYear &&
                  new Date(`${item.month}`).getMonth() + 1 === selectedMonth
                )
                .map((item) => 
                    new Date(`${item.year}-1-${item.month}`).toLocaleDateString("en-US")
                )
            )
        ).sort((a, b) => new Date(a) - new Date(b));
    
        let formattedData = [];
        
          uniqueDates.forEach((date) => {
            const totalConversion = data
              .filter((item) => new Date(`${item.year}-1-${item.month}`).toLocaleDateString("en-US") === date)
              .reduce((sum, item) => sum + item.total_conversion_rate, 0);
            formattedData.push({ date, totalConversion: totalConversion });
          });

          uniqueDates.forEach((date) => {
            const totalEngagement = data
              .filter((item) => new Date(`${item.year}-1-${item.month}`).toLocaleDateString("en-US") === date)
              .reduce((sum, item) => sum + item.total_engagement_rate, 0);
            formattedData.push({ date, totalEngagement: totalEngagement });
          });

          uniqueDates.forEach((date) => {
            const totalCampaign = data
              .filter((item) => new Date(`${item.year}-1-${item.month}`).toLocaleDateString("en-US") === date)
              .reduce((sum, item) => sum + item.total_campaigns, 0);
            formattedData.push({ date, totalCampaign: totalCampaign });
          });
          
       return formattedData;
      };

    const [selectedYear, setSelectedYear] = useState(() => {
        const years = Array.from(new Set(metric.map((item) => new Date(`${item.year}`).getFullYear())));
        return years.length ? years[0] : new Date().getFullYear(); // Default to the first available year
        });

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const months = Array.from(
        new Set(
            metric
            .filter((item) => new Date(`${item.year}`).getFullYear() === selectedYear)
            .map((item) => new Date(`${item.month}`).getMonth() + 1)
        )
        );
        return months.length ? months[0] : new Date().getMonth() + 1; // Default to the first available month
    });

    const chartData = groupDataByDay(metric, selectedYear, selectedMonth);

    const getChart = () => {
        setCampaign(chartData[2].totalCampaign)
        setTotalConversion(chartData[0].totalConversion)
        setTotalEngagement(chartData[1].totalEngagement);
    }

    useEffect(() => {
        getChart()
    }, [chartData])

    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value);
        setSelectedYear(newYear);

        // Update the month to the first available month for the selected year
        const months = Array.from(
            new Set(
            metric
                .filter((item) => new Date(`${item.year}`).getFullYear() === newYear)
                .map((item) => new Date(`${item.month}`).getMonth() + 1)
            )
        );
        setSelectedMonth(months.length ? months[0] : new Date().getMonth() + 1);
        };

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value));
        };

    const availableYears = Array.from(
        new Set(metric.map((item) => new Date(`${item.year}`).getFullYear()))
    );

    const availableMonths = Array.from(
        new Set(
          metric
            .filter((item) => new Date(`${item.year}`).getFullYear() === selectedYear)
            .map((item) => new Date(`${item.month}`).getMonth() + 1)
        )
      );
 
    const formatMetric = (value, isPercentage = false) => {
        if (value == null) return '0'; 
        return isPercentage ? `${(value * 100).toFixed(2)}%` : value.toString();
      };

      const handleView = () => {
        navigate('/campaigns/list')
      }

  return (
    <div className={`w-[100%] z-1 border border-gray-300 flex flex-col rounded-md px-5 py-5 bg-gradient-to-r from-white to-gray-500 ${className}`}>
        <div className="flex justify-between">
            <div className="flex flex-col gap-10 w-full">
                <div className="flex justify-between items-center w-full">
                    <div className="bg-black text-green-400 border p-3 w-fit rounded-full text-[20px]">
                        {icon}
                    </div>
                    {title.includes('Campaign') &&
                        <div className="border border-green-800 rounded-md px-5 py-1 cursor-pointer bg-emerald-400 text-black" onClick={handleView}>
                            View
                        </div>
                    }
                    {title.includes('Rate') &&
                    <>
                        <hr className='m-0' />
                        <div className="flex gap-3 h-fit ">
                            <div className="w-full h-fit">
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="w-fit p-2 border-none text-gray-500 rounded-md shadow-lg focus:ring-0 focus:text-black cursor-pointer"
                                >
                                    {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full h-fit">
                                <select
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    className="w-fit p-2 border-none text-gray-500 rounded-md shadow-lg focus:ring-0 focus:text-black cursor-pointer"
                                >
                                    {availableMonths.map((month) => (
                                    <option key={month} value={month}>
                                        {new Date(2024, month - 1).toLocaleString("en-US", { month: "short" })}
                                    </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>
                    }
                </div>
                <div className="flex w-full justify-between items-center gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="text-[1.2rem] text-gray-600">
                            {title}
                        </div>
                        <p className='text-3xl font-semibold text-black'>
                            {title.includes('Campaigns') && 
                            campaign
                            }
                            {title.includes('Engagement') && 
                                formatMetric(totalEngagement, true)
                            }
                            {title.includes('Conversion') && 
                                formatMetric(totalConversion, true)
                            }
                        </p>
                    </div>
                    {title.includes('Rate') &&
                    <div className="flex h-full items-end">
                        <div className="w-full inline-flex gap-1 font-bold p-1 text-emerald-400">
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
                            
                            <p className="text-sm font-medium"> 69.420% since last month</p>
                        </div>
                    </div>
                    }
                </div>     
            </div>  
        </div>
    </div>
  )
}

export default Cards