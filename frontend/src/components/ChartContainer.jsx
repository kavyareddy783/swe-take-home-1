import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const qualityColors = {
  excellent: 'rgba(34, 197, 94, 0.7)',
  good: 'rgba(59, 130, 246, 0.7)',
  questionable: 'rgba(234, 179, 8, 0.7)',
  poor: 'rgba(239, 68, 68, 0.7)'
};

function ChartContainer({ title, loading, chartType, data, showQuality = false }) {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md h-96">
        <h2 className="text-xl font-semibold text-eco-primary mb-4">{title}</h2>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  // Fallback for empty data
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md h-96">
        <h2 className="text-xl font-semibold text-eco-primary mb-4">{title}</h2>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available. Please apply filters to see visualizations.</p>
        </div>
      </div>
    );
  }

  // 🔍 CASE 1: Weighted summary (object with avg/min/max)
  if (!Array.isArray(data) && data.avg !== undefined) {
    const barData = {
      labels: ['Min', 'Average', 'Max'],
      datasets: [
        {
          label: `Temperature (${data.unit})`,
          data: [data.min, data.avg, data.max],
          backgroundColor: ['#60A5FA', '#34D399', '#F87171']
        }
      ]
    };

    const pieData = data.quality_distribution
      ? {
          labels: Object.keys(data.quality_distribution),
          datasets: [
            {
              label: 'Quality Distribution',
              data: Object.values(data.quality_distribution),
              backgroundColor: Object.keys(data.quality_distribution).map(q => qualityColors[q])
            }
          ]
        }
      : null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-eco-primary mb-4">{title}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-80">
          <Bar data={barData} options={{ responsive: true }} />
        </div>
      </div>
    );
  }

  // 🔍 CASE 2: Raw or Trends (array of climate records)
  const locations = [...new Set(data.map(item => item.location_name))];
  const dates = [...new Set(data.map(item => item.date))].sort();

  const datasets = locations.map(location => {
    const locationData = data.filter(item => item.location_name === location);
    return {
      label: location,
      data: dates.map(date => {
        const point = locationData.find(item => item.date === date);
        return point ? point.value : null;
      }),
      borderColor: showQuality
        ? locationData.map(item => qualityColors[item.quality] || '#999')
        : '#3B82F6',
      backgroundColor: showQuality
        ? locationData.map(item => qualityColors[item.quality] || '#999')
        : '#3B82F6',
      pointBackgroundColor: showQuality
        ? locationData.map(item => qualityColors[item.quality] || '#999')
        : '#3B82F6',
      borderWidth: 2,
      tension: 0.1
    };
  });

  const chartData = {
    labels: dates,
    datasets
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          afterLabel: function (context) {
            if (showQuality) {
              const point = data.find(
                item =>
                  item.location_name === context.dataset.label &&
                  item.date === context.label
              );
              return point ? `Quality: ${point.quality}` : '';
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: data[0]?.unit || 'Value' }
      },
      x: {
        title: { display: true, text: 'Date' }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-96">
      <h2 className="text-xl font-semibold text-eco-primary mb-4">{title}</h2>
      <div className="h-5/6">
        {chartType === 'line' ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}

export default ChartContainer;
