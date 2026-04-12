import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './MaterialChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MaterialChart = ({ data = {}, language = 'en' }) => {
  const translations = {
    en: {
      title: 'Material Distribution',
      noData: 'No material data available. Add items to see the distribution.',
      pieChart: 'Pie Chart',
      barChart: 'Bar Chart'
    },
    ta: {
      title: 'பொருள் விநியோகம்',
      noData: 'பொருள் தரவு எதுவும் கிடைக்கவில்லை. விநியோகத்தைப் பார்க்க பொருட்களைச் சேர்க்கவும்.',
      pieChart: 'பை விளக்கப்படம்',
      barChart: 'பார் விளக்கப்படம்'
    }
  };

  const t = translations[language] || translations['en'];
  const [chartType, setChartType] = React.useState('pie');

  const materials = Object.keys(data);
  const counts = Object.values(data);

  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#C9CBCF'
  ];

  const chartData = {
    labels: materials,
    datasets: [
      {
        label: 'Count',
        data: counts,
        backgroundColor: colors.slice(0, materials.length),
        borderColor: colors.slice(0, materials.length).map(color => color + '80'),
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Count: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      }
    }
  };

  if (materials.length === 0) {
    return (
      <div className="material-chart">
        <h3>{t.title}</h3>
        <div className="no-data">
          <div className="no-data-icon">📊</div>
          <p>{t.noData}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="material-chart">
      <div className="chart-header">
        <h3>{t.title}</h3>
        <div className="chart-toggle">
          <button 
            className={chartType === 'pie' ? 'active' : ''}
            onClick={() => setChartType('pie')}
          >
            {t.pieChart}
          </button>
          <button 
            className={chartType === 'bar' ? 'active' : ''}
            onClick={() => setChartType('bar')}
          >
            {t.barChart}
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        {chartType === 'pie' ? (
          <Pie data={chartData} options={pieOptions} />
        ) : (
          <Bar data={chartData} options={barOptions} />
        )}
      </div>
      
      <div className="material-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Items:</span>
            <span className="stat-value">{counts.reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Material Types:</span>
            <span className="stat-value">{materials.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialChart;