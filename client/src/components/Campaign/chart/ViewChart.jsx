import React from 'react';
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

function ViewChart({ data, className }) {
    // Group the data by month and year
    const groupedData = data.reduce((acc, { lead_date, number_of_leads }) => {
        const date = new Date(lead_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const key = `${year}-${month < 10 ? '0' + month : month}`;

        if (!acc[key]) {
            acc[key] = 0;
        }

        acc[key] += number_of_leads;

        return acc;
    }, {});

    // Convert the grouped data into an array suitable for the chart
    const groupedArray = Object.keys(groupedData).map(key => ({
        date: key,
        TotalLeads: groupedData[key],
    }));
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={groupedArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    height={50}
                    dataKey="date"  // Use 'date' as the key for XAxis
                    scale="point"
                    label={{ position: "insideBottom", offset: -5 }}
                    tickFormatter={(tick) =>
                        new Date(tick).toLocaleDateString("en-US", { month: "short", year: "numeric" }) // Format date as "Dec 2024"
                    }
                    textAnchor="middle"
                />
                <YAxis width={40} />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="TotalLeads"  // Use 'totalLeads' as the key for Area chart data
                    data={groupedArray}
                    stroke="#4bc0c0"
                    fill="#4bc0c0"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={{ r: 5, fill: "#ff6384" }}
                />
                <Legend />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default ViewChart;
