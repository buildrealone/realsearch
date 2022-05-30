export default function useSelectedDateKeywordVolume({ 

    begin_date, 
    end_date, 
    all_labels_full_range,
    all_device_absolute_counts_full_range,
    mobile_absolute_counts_full_range,
    pc_absolute_counts_full_range,

}) {
     
    const selected_begin_date = all_labels_full_range?.includes(begin_date) ? begin_date : !all_labels_full_range?.includes(begin_date) ? all_labels_full_range?.filter(date => date > begin_date)?.[0] : "";
    const selected_end_date = all_labels_full_range?.includes(end_date) ? end_date : !all_labels_full_range?.includes(end_date) ? all_labels_full_range?.filter(date => (date < end_date && date > begin_date))?.[all_labels_full_range?.length - 1] : "";

    const all_labels = all_labels_full_range?.slice(all_labels_full_range.indexOf(selected_begin_date), all_labels_full_range.indexOf(selected_end_date) + 1);
    const all_device_absolute_counts = all_device_absolute_counts_full_range && all_labels_full_range && selected_begin_date && selected_end_date && all_device_absolute_counts_full_range?.slice(all_labels_full_range?.indexOf(selected_begin_date), all_labels_full_range?.indexOf(selected_end_date) + 1);
    const mobile_absolute_counts = mobile_absolute_counts_full_range && all_labels_full_range && selected_begin_date && selected_end_date && mobile_absolute_counts_full_range?.slice(all_labels_full_range?.indexOf(selected_begin_date), all_labels_full_range?.indexOf(selected_end_date) + 1);
    const pc_absolute_counts = pc_absolute_counts_full_range && all_labels_full_range && selected_begin_date && selected_end_date && pc_absolute_counts_full_range?.slice(all_labels_full_range?.indexOf(selected_begin_date), all_labels_full_range?.indexOf(selected_end_date) + 1);

    const all_device_absolute_counts_sum = all_device_absolute_counts ? all_device_absolute_counts?.reduce(function(a, b) { return a + b; }, 0) : 0;            
    const mobile_absolute_counts_sum = mobile_absolute_counts ? mobile_absolute_counts?.reduce(function(a, b) { return a + b; }, 0) : 0;
    const pc_absolute_counts_sum = pc_absolute_counts ? pc_absolute_counts?.reduce(function(a, b) { return a + b; }, 0) : 0;

    return {
        selected_begin_date,
        selected_end_date,
        all_labels,
        all_device_absolute_counts,
        mobile_absolute_counts,
        pc_absolute_counts,
        all_device_absolute_counts_sum,
        mobile_absolute_counts_sum,
        pc_absolute_counts_sum,
    }
};