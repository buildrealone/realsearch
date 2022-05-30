export default function useKeywordVolumeFullRange({
    latest_day,
    all_datalab2,
    mobile_datalab2,
    all_device_absolute_count_latest_day,
    mobile_absolute_count_latest_day,
}) {

    const all_labels = all_datalab2?.map((num) => { return num?.period } );
    const selected_begin_date = all_labels?.[0];
    const selected_end_date = all_labels?.[all_labels?.length - 1];
    const mobile_labels_preprocessed = mobile_datalab2?.map((num) => { return num?.period } );

    // 최근 1년 데이터 (Total)
    const all_device_relative_counts = all_datalab2?.map((num) => { return num?.ratio } );
    const all_device_absolute_counts = all_labels?.includes(latest_day) && all_device_absolute_count_latest_day && all_device_relative_counts ? all_device_relative_counts?.map((num) => { return Math.round(num * all_device_absolute_count_latest_day / (all_device_relative_counts?.[all_device_relative_counts?.length - 1])) }) : new Array(all_device_relative_counts).fill(0); 

    // 최근 1년 데이터 (Mobile)
    const reset = all_datalab2?.map(num => { return { period: num?.period, ratio: 0 }});
    const mobile_labels = reset?.map(num => { return !mobile_labels_preprocessed?.includes(num?.period) ? num : mobile_datalab2?.find(object => object?.period === num?.period)})?.map((num) => { return num?.period } );
    const mobile_relative_counts = reset?.map(num => { return !mobile_labels_preprocessed?.includes(num?.period) ? num : mobile_datalab2?.find(object => object?.period === num?.period)})?.map((num) => { return num?.ratio } );
    const mobile_absolute_counts = all_device_relative_counts?.length > 0 && all_device_relative_counts?.length === mobile_relative_counts?.length ? mobile_relative_counts?.map((num) => { return Math.round(num * mobile_absolute_count_latest_day / (mobile_relative_counts ?.[mobile_relative_counts ?.length - 1])) }) : new Array(all_device_absolute_counts?.length).fill(0);
    
    // 최근 1년 데이터 (PC)
    // const pc_absolute_counts_full_range = all_device_absolute_counts_full_range && all_device_absolute_counts_full_range?.length === mobile_absolute_counts_full_range?.length && all_device_absolute_counts_full_range?.map(function(item, idx) { return (item - mobile_absolute_counts_full_range[idx]) >= 0 ? (item - mobile_absolute_counts_full_range[idx]) : 0 }); 
    const pc_absolute_counts = (all_device_absolute_counts?.length > 0 && all_device_absolute_counts?.length === mobile_absolute_counts?.length) ? all_device_absolute_counts?.map(function(item, idx) { return (item - mobile_absolute_counts[idx]) >= 0 ? (item - mobile_absolute_counts[idx]) : 0 }) : new Array(all_device_absolute_counts?.length).fill(0); 

    return new Promise(resolve => resolve({
        selected_begin_date,
        selected_end_date,
        all_labels,
        all_device_absolute_counts,
        mobile_labels,
        mobile_absolute_counts,
        pc_absolute_counts,
        all_device_relative_counts,
        mobile_relative_counts,
    }));

};