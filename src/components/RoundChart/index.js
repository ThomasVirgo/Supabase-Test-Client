import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const RoundChart = ({gameState}) => {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Round Score Summary',
        },
      },
    };
    const labels = gameState.players[0].score_history.map((val, idx) => `Move ${idx}`)
    const colors = [
        {
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            borderColor: 'rgb(230,230,250)',
            backgroundColor: 'rgba(230, 230, 250, 0.5)',
        },
        {
            borderColor: '	rgb(0, 255, 255)',
            backgroundColor: 'rgba(0, 255, 255, 0.5)',
        },

    ]
    const datasets = gameState.players.map((p, idx) => {
        return {
            label: p.username,
            data: p.score_history,
            borderColor: colors[idx].borderColor,
            backgroundColor: colors[idx].backgroundColor
        }
    })
    const data = {
        labels,
        datasets
      };
    return <Line options={options} data={data} />;
}

export default RoundChart