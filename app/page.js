'use client';
import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import Navbar from '@/components/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ChartPage = () => {
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [doughnutData, setDoughnutData] = useState({ labels: [], datasets: [] });
  const [yearlyBarData, setYearlyBarData] = useState({ labels: [], datasets: [] }); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com',
          'X-RapidAPI-Key': '65d6f3e8f7mshbd880c856ae294cp169535jsnd56c0432ad7a'
        }
      };

      try {
        const response = await fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options);
        if (!response.ok) throw new Error('Failed to fetch game data');

        const data = await response.json();
        const genreCounts = data.reduce((acc, game) => {
          acc[game.genre] = (acc[game.genre] || 0) + 1;
          return acc;
        }, {});

        const platformCounts = data.reduce((acc, game) => {
          acc[game.platform] = (acc[game.platform] || 0) + 1;
          return acc;
        }, {});

        setDoughnutData({
          labels: Object.keys(platformCounts),
          datasets: [{
            label: 'Number of Games',
            data: Object.values(platformCounts),
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
          }],
        });

        setBarData({
          labels: Object.keys(genreCounts),
          datasets: [{
            label: 'Number of Games',
            data: Object.values(genreCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }],
        });

        const currentYear = new Date().getFullYear();
        const yearCounts = {};
        
        for (let year = currentYear; year > currentYear - 5; year--) {
          yearCounts[year] = 0;
        }

        data.forEach(game => {
          const releaseYear = new Date(game.release_date).getFullYear();
          if (releaseYear >= currentYear - 5) {
            yearCounts[releaseYear] = (yearCounts[releaseYear] || 0) + 1;
          }
        });

        setYearlyBarData({
          labels: Object.keys(yearCounts),
          datasets: [{
            label: 'Number of Games Released',
            data: Object.values(yearCounts),
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
          }],
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="chart-page text-black">
      <Navbar />
      <main className="container mx-auto p-4 text-black"></main>
      <h1 className="text-4xl font-bold text-center mb-8"></h1>
      <div className='flex flex-col items-center'>
        <div className="chart-container flex justify-center mb-8" style={{ width: '80%', height: '300px' }}>
          <Doughnut 
            data={doughnutData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Games by Platform',
                  font: { size: 35 },
                },
              },
            }} 
            height={250} 
          />
        </div>
        <div className="chart-container flex justify-center mb-8" style={{ width: '80%', height: '300px' }}>
          <Bar 
            data={barData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Games by Genre',
                  font: { size: 35 },
                },
              },
            }} 
            height={250} 
          />
        </div>
        <div className="chart-container flex justify-center" style={{ width: '80%', height: '300px' }}>
          <Bar 
            data={yearlyBarData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Games Released in the Last 5 Years',
                  font: { size: 35 },
                },
              },
            }} 
            height={250} 
          />
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
