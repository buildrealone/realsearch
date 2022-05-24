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
  import { useEffect } from 'react';
  
  export default function MainChart({ 
    keyword, 

    korea_yesterday,
    korea_two_days_ago,
    all_datalab, 
    mobile_datalab, 
    // pc_datalab, 
    
    all_datalab2, 
    mobile_datalab2, 

    all_device_total_count,
    mobile_total_count,
    // pc_total_count
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
          display: true // false // Hide X axis labels
      }
  }   
  };
  
  // 최근 30일 데이터 Total & Mobile: Periods
  const all_labels = all_datalab?.map((num) => { return num?.period } );
  const mobile_labels = mobile_datalab?.map((num) => { return num?.period } );

  // 최근 30일 데이터 (Total)
  const all_device_relative_counts = all_datalab?.map((num) => { return num?.ratio } );
  const all_device_sum_of_relative_counts = all_device_relative_counts?.reduce(function(a, b) { return a + b; }, 0);
  const all_device_absolute_counts = all_device_relative_counts?.map((num) => { return Math.round(num * all_device_total_count / all_device_sum_of_relative_counts) });
  
  // 최근 30일 데이터 (Mobile)
  const mobile_relative_counts = mobile_datalab?.map((num) => { return num?.ratio } ) || []; // new Array(len).fill(labels?.length)
  const mobile_sum_of_relative_counts = mobile_relative_counts && mobile_relative_counts?.reduce(function(a, b) { return a + b; }, 0);
  const mobile_absolute_counts = mobile_sum_of_relative_counts && mobile_relative_counts?.map((num) => { return Math.round(num * mobile_total_count / mobile_sum_of_relative_counts) });
  
  // 최근 30일 데이터 (PC)
  const pc_absolute_counts = all_device_absolute_counts && mobile_absolute_counts && all_device_absolute_counts?.map(function(item, idx) { return (item - mobile_absolute_counts[idx]) >= 0 ? (item - mobile_absolute_counts[idx]) : 0 }); // pc_relative_counts?.map((num) => { return Math.round(num * pc_total_count / pc_sum_of_relative_counts) });
  

  // 최근 1년 데이터 Total & Mobile: Yesterday Counts & Periods
  const all_device_absolute_count_yesterday = ((all_labels?.includes(korea_yesterday) && all_device_absolute_counts && all_labels?.length === all_device_absolute_counts?.length) || (all_labels?.includes(korea_two_days_ago) && all_device_absolute_counts && all_labels?.length === all_device_absolute_counts?.length)) && all_device_absolute_counts?.[all_device_absolute_counts?.length - 1]; // : null;
  const mobile_absolute_count_yesterday = ((mobile_labels?.includes(korea_yesterday) && mobile_absolute_counts && mobile_labels?.length === mobile_absolute_counts?.length) || (mobile_labels?.includes(korea_two_days_ago) && mobile_absolute_counts && mobile_labels?.length === mobile_absolute_counts?.length)) && mobile_absolute_counts?.[mobile_absolute_counts?.length - 1]; // : null;

  const all_labels_one_year = all_datalab2?.map((num) => { return num?.period } );
  const mobile_labels_one_year = mobile_datalab2?.map((num) => { return num?.period } );

  // 최근 1년 데이터 (Total)
  const all_device_relative_counts_one_year = all_datalab2?.map((num) => { return num?.ratio } );
  // const all_device_sum_of_relative_counts_one_year = all_device_relative_counts_one_year?.reduce(function(a, b) { return a + b; }, 0);
  const all_device_absolute_counts_one_year = all_device_absolute_count_yesterday && all_device_relative_counts_one_year?.map((num) => { return Math.round(num * all_device_absolute_count_yesterday / (all_device_relative_counts_one_year?.[all_device_relative_counts_one_year?.length - 1])) }); // (all_device_absolute_count_yesterday / all_device_sum_of_relative_counts_one_year?.[all_device_sum_of_relative_counts_one_year?.length - 1])

  // 최근 1년 데이터 (Mobile)
  const mobile_relative_counts_one_year = mobile_datalab2?.map((num) => { return num?.ratio } );
  // const mobile_sum_of_relative_counts_one_year = mobile_relative_counts_one_year?.reduce(function(a, b) { return a + b; }, 0);
  const mobile_absolute_counts_one_year = mobile_absolute_count_yesterday && mobile_relative_counts_one_year?.map((num) => { return Math.round(num * mobile_absolute_count_yesterday / (mobile_relative_counts_one_year ?.[mobile_relative_counts_one_year ?.length - 1])) }); // (mobile_absolute_count_yesterday / mobile_sum_of_relative_counts_one_year?.[mobile_sum_of_relative_counts_one_year?.length - 1])
  
  // 최근 1년 데이터 (PC)
  const pc_absolute_counts_one_year = all_device_absolute_counts_one_year && mobile_absolute_counts_one_year && all_device_absolute_counts_one_year?.map(function(item, idx) { return (item - mobile_absolute_counts_one_year[idx]) >= 0 ? (item - mobile_absolute_counts_one_year[idx]) : 0 }); 

  // useEffect(()=>{
  //   if (all_device_absolute_count_yesterday) {
  //     console.log("all_device_absolute_count_yesterday: ", all_device_absolute_count_yesterday)
  //   };
  //   if (mobile_absolute_count_yesterday) {
  //     console.log("mobile_absolute_count_yesterday: ", mobile_absolute_count_yesterday)
  //   }
  // }, [all_device_absolute_count_yesterday, mobile_absolute_count_yesterday]);

  // useEffect(()=>{
  //   if (all_labels) {
  //     console.log("all_labels: ", all_labels)
  //   };
  //   if (mobile_labels) {
  //     console.log("mobile_labels: ", mobile_labels)
  //   }
  // }, [all_labels, mobile_labels]);

  const data1 = {
    
    labels: all_labels,

    datasets: [
      {
        label: "Total 검색량 (최근 30일)",
        data: all_device_absolute_counts,
        borderColor: "rgb(15, 216, 103)",
        backgroundColor: "rgba(15, 216, 103, 0.5)",
      },
      {
          label: "Mobile 검색량 (최근 30일)",
          data: mobile_absolute_counts,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      {
        label: "PC 검색량 (최근 30일)",
        data: pc_absolute_counts,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const data2 = {
    
    labels: all_labels_one_year,

    datasets: [
      {
        label: "Total 검색량 (최근 1년)",
        data: all_device_absolute_counts_one_year,
        borderColor: "rgb(15, 216, 103)",
        backgroundColor: "rgba(15, 216, 103, 0.5)",
      },
      {
        label: "Mobile 검색량 (최근 1년)",
        data: mobile_absolute_counts_one_year,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "PC 검색량 (최근 1년)",
        data: pc_absolute_counts_one_year,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  
  return (
      <div className="min-h-full">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <main className="lg:col-span-12">
            
            {all_labels && all_labels?.length === mobile_labels?.length

            ?

            <div className="mt-4">
                <Line options={options} data={data1} />
            </div>

            :

            null}

            {all_labels_one_year && all_labels_one_year?.length === mobile_labels_one_year?.length

            ?

            <div className="mt-4 hidden sm:block">
              <Line options={options} data={data2} />
            </div>

            :

            null}


            {/* <div className="mt-4">
              <Line options={options} data={data1} />
            </div>

            <div className="mt-4">
              <Line options={options} data={data2} />
            </div> */}

            {/* <div className="mt-4">
              <Line options={options} data={data3} />
            </div> */}
          </main>
        </div>
      </div>
  )
  
  };