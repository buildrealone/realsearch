export default function useKeywordVolumeMonth({
    all_datalab,
    mobile_datalab,
    all_device_total_count,
    mobile_total_count, 
    korea_yesterday,
    korea_two_days_ago
}) {

       // 최근 30일 데이터 Total & Mobile: Periods
       const all_labels = all_datalab?.map((num) => { return num?.period } );
       const latest_day = all_labels?.[all_labels?.length - 1];
       const mobile_labels = mobile_datalab?.map((num) => { return num?.period } );
   
       // 최근 30일 데이터 (Total)
       const all_device_relative_counts = all_datalab?.map((num) => { return num?.ratio } );
       const all_device_sum_of_relative_counts = all_device_relative_counts?.reduce(function(a, b) { return a + b; }, 0);
       const all_device_absolute_counts = all_device_relative_counts?.map((num) => { return Math.round(num * all_device_total_count / all_device_sum_of_relative_counts) });
       
       // 최근 30일 데이터 (Mobile)
       const reset = all_datalab?.map(num => { return { period: num?.period, ratio: 0 }});
       const mobile_relative_counts = reset?.map(num => { return !mobile_labels?.includes(num?.period) ? num : mobile_datalab?.find(object => object?.period === num?.period)})?.map((num) => { return num?.ratio } );
       const mobile_sum_of_relative_counts = mobile_relative_counts && mobile_relative_counts?.reduce(function(a, b) { return a + b; }, 0);
       const mobile_absolute_counts = mobile_sum_of_relative_counts && mobile_relative_counts?.map((num) => { return Math.round(num * mobile_total_count / mobile_sum_of_relative_counts) });
       
       // 최근 30일 데이터 (PC)
       const pc_absolute_counts = all_device_absolute_counts && mobile_absolute_counts && all_device_absolute_counts?.map(function(item, idx) { return (item - mobile_absolute_counts[idx]) >= 0 ? (item - mobile_absolute_counts[idx]) : 0 });
   
       // 전날 (lastest day) Absolute Count
       const all_device_absolute_count_latest_day = ((all_labels?.includes(korea_yesterday)) || (all_labels?.includes(korea_two_days_ago))) && all_device_absolute_counts?.[all_device_absolute_counts?.length - 1];
       const mobile_absolute_count_latest_day = ((mobile_labels?.includes(korea_yesterday) && mobile_absolute_counts && mobile_labels?.length === mobile_absolute_counts?.length) || (mobile_labels?.includes(korea_two_days_ago) && mobile_absolute_counts && mobile_labels?.length === mobile_absolute_counts?.length)) && mobile_absolute_counts?.[mobile_absolute_counts?.length - 1];
       
    return new Promise(resolve => resolve({
        latest_day,
        all_labels,

        all_device_absolute_counts,
        mobile_absolute_counts,
        pc_absolute_counts,

        all_device_absolute_count_latest_day,
        mobile_absolute_count_latest_day,
    }));

};