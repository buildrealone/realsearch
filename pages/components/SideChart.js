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
  
  export default function SideChart({ 
    keyword, 
    all_datalab, 
    all_device_total_count,
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
  
  const labels = all_datalab?.map((num) => { return num?.period } );
  const all_device_relative_counts = all_datalab?.map((num) => { return num?.ratio } );
  const all_device_sum_of_relative_counts = all_device_relative_counts?.reduce(function(a, b) { return a + b; }, 0);
  const all_device_absolute_counts = all_device_relative_counts?.map((num) => { return Math.round(num * all_device_total_count / all_device_sum_of_relative_counts) });
  
  const data = {
    
    labels,
    datasets: [
      {
        label: "Total 검색량",
        data: all_device_absolute_counts,
        borderColor: "rgb(15, 216, 103)",
        backgroundColor: "rgba(15, 216, 103, 0.5)",
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