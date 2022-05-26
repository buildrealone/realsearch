export default function useKeywordVolumeFullRange({
    latest_day,
    all_datalab2,
    mobile_datalab2,
    all_device_absolute_count_latest_day,
    mobile_absolute_count_latest_day,
}) {

    const all_labels_full_range = all_datalab2?.map((num) => { return num?.period } );
    const earliest_day = all_labels_full_range?.[0];
    const mobile_labels_full_range_preprocessed = mobile_datalab2?.map((num) => { return num?.period } );

    // 최근 1년 데이터 (Total)
    const all_device_relative_counts_full_range = all_datalab2?.map((num) => { return num?.ratio } );
    const all_device_absolute_counts_full_range = all_labels_full_range?.includes(latest_day) && all_device_absolute_count_latest_day && all_device_relative_counts_full_range?.map((num) => { return Math.round(num * all_device_absolute_count_latest_day / (all_device_relative_counts_full_range?.[all_device_relative_counts_full_range?.length - 1])) }); 

    // 최근 1년 데이터 (Mobile)
    const reset = all_datalab2?.map(num => { return { period: num?.period, ratio: 0 }});
    const mobile_labels_full_range = reset?.map(num => { return !mobile_labels_full_range_preprocessed?.includes(num?.period) ? num : mobile_datalab2?.find(object => object?.period === num?.period)})?.map((num) => { return num?.period } );
    const mobile_relative_counts_full_range = reset?.map(num => { return !mobile_labels_full_range_preprocessed?.includes(num?.period) ? num : mobile_datalab2?.find(object => object?.period === num?.period)})?.map((num) => { return num?.ratio } );
    // const mobile_relative_counts_full_range = mobile_datalab2?.map((num) => { return num?.ratio } );
    const mobile_absolute_counts_full_range = mobile_labels_full_range?.includes(latest_day) && mobile_absolute_count_latest_day && mobile_relative_counts_full_range?.map((num) => { return Math.round(num * mobile_absolute_count_latest_day / (mobile_relative_counts_full_range ?.[mobile_relative_counts_full_range ?.length - 1])) }); 
    
    // 최근 1년 데이터 (PC)
    const pc_absolute_counts_full_range = all_device_absolute_counts_full_range && all_device_absolute_counts_full_range?.length === mobile_absolute_counts_full_range?.length && all_device_absolute_counts_full_range?.map(function(item, idx) { return (item - mobile_absolute_counts_full_range[idx]) >= 0 ? (item - mobile_absolute_counts_full_range[idx]) : 0 }); 

    return new Promise(resolve => resolve({
        earliest_day,
        latest_day,
        all_labels_full_range,
        all_device_absolute_counts_full_range,
        mobile_labels_full_range,
        mobile_absolute_counts_full_range,
        pc_absolute_counts_full_range,
    }));

};