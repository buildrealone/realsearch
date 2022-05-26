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
  
  export default function MainChart({ 
    keyword,
    // begin_date,
    // end_date,
    labels, 
    all_device_absolute_counts,
    mobile_absolute_counts,
    pc_absolute_counts,
    isRecentMonth,

  }) {
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  const options = {
  
    responsive: true,
  
    plugins: {
  
      legend: {
        position: 'top',
        // display: false
      },
  
      title: {
        display: true,
        text: `${keyword?.toUpperCase()} 검색 트렌드`,
      },
  
    }, 
  
    scales: {
      
      y: {
          display: true // Hide Y axis labels
      },
      
      x: {
          display: true // Hide X axis labels
      }
  }   
  };

  const data = {
    
    labels,

    datasets: [
      {
        label: `Total 검색량${isRecentMonth ? " (최근 30일)" : ""}`,
        data: all_device_absolute_counts,
        borderColor: "rgb(15, 216, 103)",
        backgroundColor: "rgba(15, 216, 103, 0.5)",
      },
      {
          label: `Mobile 검색량${isRecentMonth ? " (최근 30일)" : ""}`,
          data: mobile_absolute_counts,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      {
        label: `PC 검색량${isRecentMonth ? " (최근 30일)" : ""}`,
        data: pc_absolute_counts,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  
  return (
    <div className="min-h-full">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
            <main className="lg:col-span-12">
            <div className="mt-4">
                <Line options={options} data={data} />
            </div>
            </main>
        </div>
    </div>
  )
};