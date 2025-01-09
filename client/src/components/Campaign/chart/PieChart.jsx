import React from "react";
import { Pie } from "react-chartjs-2";
import { Data } from "../../../constants/campaign/index"; 

function PieChart({ className }) {
  return (
    <div className={`chart-container border p-5 h-[100%] max-h-[450px] ${className}`}>
      <h2 style={{ textAlign: "center" }}>Engagement Breakdown</h2>
      <Pie
        data={''}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            }
          }
        }}
      />
    </div>
  );
}
export default PieChart;