import useKeywordVolume from '../../libs/client/useKeywordVolume';
import useSearchArticle from '../../libs/client/useSearchArticle';
import useDataLab from '../../libs/client/useDataLab';
import useKeywordVolumeMonth from '../../libs/client/useKeywordVolumeMonth';
import useKeywordVolumeFullRange from '../../libs/client/useKeywordVolumeFullRange';

async function handler(req, res) {

    if (req.method === "GET") { 

        const categories = ["kvolume", "news", "blog", "cafearticle", "kin"];
        
        const { query : { ...queries } } = req; 
        // const keyword = "이수역";

        const koreaTimeNow = String(new Date((new Date()).getTime() + ((new Date()).getTimezoneOffset() * 60 * 1000) + 9 * 60 * 60 * 1000)).slice(0, 24);
        const year = new Date().getFullYear(); // 년
        const month = new Date().getMonth();   // 월
        const day = new Date().getDate(); // 일

        const korea_year_ago = String(new Date(year - 1, month, day).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year - 1, month, day).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year - 1, month, day).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_year_and_a_day_ago = String(new Date(year - 1, month, day - 1).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year - 1, month, day - 1).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year - 1, month, day - 1).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_month_ago = String(new Date(year, month, day - 30).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month, day - 30).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month, day - 30).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_month_and_a_day_ago = String(new Date(year, month, day - 31).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month, day - 31).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month, day - 31).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_yesterday = String(new Date(year, month, day - 1).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month, day - 1).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month, day - 1).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_two_days_ago = String(new Date(year, month, day - 2).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month, day - 2).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month, day - 2).toLocaleDateString()).split("/")[1].padStart(2, "0");
        
        const minimum_date = korea_year_and_a_day_ago; // "2021-05-01";

        if (queries?.keyword ) { // queries?.keyword 
        
        const keyword = queries?.keyword;
        for (let i = 0; i < categories.length; i += 1) { 

            const categories_promises = categories.map(async (category) => { 

                if (category === "kvolume") {
                    const keywordVolume = await useKeywordVolume({ keyword, category })
                        .then((response) => new Promise(resolve => resolve({
                            keyword_volume: response,
                            all_device_total_count: response?.keywordList?.find(o => o?.relKeyword === keyword)?.monthlyPcQcCnt + response?.keywordList?.find(o => o?.relKeyword === keyword)?.monthlyMobileQcCnt,
                            mobile_total_count: response?.keywordList?.find(o => o?.relKeyword === keyword)?.monthlyMobileQcCnt,
                        })))
                    const datalab = await useDataLab({ keyword, category: "datalab", start_date: korea_month_ago, end_date: korea_yesterday })
                        .then((response) => new Promise(resolve => resolve({
                            all_datalab: response?.datalab?.[0]?.all?.results?.[0]?.data,
                            mobile_datalab: response?.datalab?.[1]?.mobile?.results?.[0]?.data,
                        })))
                    const datalab2 = await useDataLab({ keyword, category: "datalab2", start_date: minimum_date, end_date: korea_yesterday }) // korea_year_ago
                        .then((response) => new Promise(resolve => resolve({
                            all_datalab2: response?.datalab2?.[0]?.all?.results?.[0]?.data,
                            mobile_datalab2: response?.datalab2?.[1]?.mobile?.results?.[0]?.data,
                        })))
                    
                    const promiseResults = await Promise.all([keywordVolume, datalab, datalab2])
                        .then((response) => { 
                            const kvolume = { kvolume: response?.[0]?.keyword_volume?.keywordList }; 
                            const all_device_total_count = response?.[0]?.all_device_total_count; 
                            const mobile_total_count = response?.[0]?.mobile_total_count; 
                            const all_datalab = response?.[1]?.all_datalab;
                            const mobile_datalab = response?.[1]?.mobile_datalab;
                            const all_datalab2 = response?.[2]?.all_datalab2;
                            const mobile_datalab2 = response?.[2]?.mobile_datalab2;
                            // const sampleResponse = response;

                            const dataset = useKeywordVolumeMonth({
                                    korea_yesterday,
                                    korea_two_days_ago,
                                    all_device_total_count,
                                    mobile_total_count, 
                                    all_datalab,
                                    mobile_datalab,
                                })
                                .then((monthly_response) => { 

                                    const dataset_recent_month = {
                                        dataset_recent_month : {
                                            all_labels: monthly_response?.all_labels,
                                            all_device_absolute_counts: monthly_response?.all_device_absolute_counts,
                                            mobile_absolute_counts: monthly_response?.mobile_absolute_counts,
                                            pc_absolute_counts: monthly_response?.pc_absolute_counts,
                                        }
                                    };

                                    const dataset_full_range = useKeywordVolumeFullRange({
                                        latest_day: monthly_response?.latest_day,
                                        all_datalab2,
                                        mobile_datalab2,
                                        all_device_absolute_count_latest_day: monthly_response?.all_device_absolute_count_latest_day,
                                        mobile_absolute_count_latest_day: monthly_response?.mobile_absolute_count_latest_day,
                                    })
                                    .then(full_range_response => { return { ...kvolume, ...dataset_recent_month, dataset_full_range: full_range_response } })
                                    // .then(full_range_response => { return { dataset_full_range: full_range_response }})
                                    
                                    return dataset_full_range
                                })
        
                            return dataset;
                                
                            })

                    return promiseResults;
                }
                else { // if (!((category === "kvolume") || (category === "kvolume")))
                    const data = await useSearchArticle({ keyword, category });
                    return data;
                }
        
            })

            const result = await Promise.all(categories_promises)
            // return res.json(promiseResults);

            const dataset_recent_month = result?.[0]?.dataset_recent_month;
            const all_labels_recent_month = dataset_recent_month?.all_labels;
            const begin_date_in_recent_month = all_labels_recent_month?.includes(korea_month_ago) ? korea_month_ago : all_labels_recent_month?.includes(korea_month_and_a_day_ago) ? korea_month_and_a_day_ago : all_labels_recent_month?.[0];
            const end_date_in_recent_month = all_labels_recent_month?.[all_labels_recent_month?.length - 1] === korea_yesterday ? korea_yesterday : all_labels_recent_month?.[all_labels_recent_month?.length - 1] === korea_two_days_ago ? korea_two_days_ago : all_labels_recent_month?.[all_labels_recent_month?.length - 1];

            const dataset_full_range = result?.[0]?.dataset_full_range;
            const all_labels_full_range = dataset_full_range?.all_labels_full_range;

            const begin_date_in_recent_year = all_labels_full_range?.includes(korea_year_ago) ? korea_year_ago : all_labels_full_range?.includes(korea_year_and_a_day_ago) ? korea_year_and_a_day_ago : all_labels_full_range?.[0];
            const end_date_in_recent_year = all_labels_full_range?.[all_labels_full_range?.length - 1] === korea_yesterday ? korea_yesterday : all_labels_full_range?.[all_labels_full_range?.length - 1] === korea_two_days_ago ? korea_two_days_ago : all_labels_full_range?.[all_labels_full_range?.length - 1];

            const all_device_absolute_counts_full_range = dataset_full_range?.all_device_absolute_counts_full_range;
            const mobile_absolute_counts_full_range = dataset_full_range?.mobile_absolute_counts_full_range;
            const pc_absolute_counts_full_range = dataset_full_range?.pc_absolute_counts_full_range;

            const all_labels_recent_year = all_labels_full_range?.slice(all_labels_full_range.indexOf(begin_date_in_recent_year), all_labels_full_range.indexOf(end_date_in_recent_year) + 1);
            const all_device_recent_year_counts = all_device_absolute_counts_full_range?.slice(all_labels_full_range.indexOf(begin_date_in_recent_year), all_labels_full_range.indexOf(end_date_in_recent_year) + 1);
            const mobile_recent_year_counts = mobile_absolute_counts_full_range?.slice(all_labels_full_range.indexOf(begin_date_in_recent_year), all_labels_full_range.indexOf(end_date_in_recent_year) + 1);
            const pc_recent_year_counts = pc_absolute_counts_full_range?.slice(all_labels_full_range.indexOf(begin_date_in_recent_year), all_labels_full_range.indexOf(end_date_in_recent_year) + 1);

            const all_device_recent_year_absolute_counts_sum = all_device_recent_year_counts?.reduce(function(a, b) { return a + b; }, 0);
            const mobile_recent_year_absolute_counts_sum = mobile_recent_year_counts?.reduce(function(a, b) { return a + b; }, 0);
            const pc_recent_year_absolute_counts_sum = pc_recent_year_counts?.reduce(function(a, b) { return a + b; }, 0);
            

            return res.json({
                keyword,
                searchDate: koreaTimeNow,
                earliest_day: result?.[0]?.dataset_full_range?.earliest_day,
                latest_day: result?.[0]?.dataset_full_range?.latest_day,
                korea_year_ago,
                korea_year_and_a_day_ago,
                korea_yesterday,
                korea_two_days_ago,
                kvolumeItems: result?.[0]?.kvolume?.slice(0, 5),
                dataset_recent_month: result?.[0]?.dataset_recent_month,
                dataset_full_range, // : result?.[0]?.dataset_full_range,

                begin_date_in_recent_month,
                end_date_in_recent_month,
                begin_date_in_recent_year,
                end_date_in_recent_year,

                all_device_recent_year_absolute_counts_sum,
                mobile_recent_year_absolute_counts_sum,
                pc_recent_year_absolute_counts_sum,

                all_labels_recent_year,
                all_device_recent_year_counts,
                mobile_recent_year_counts,
                pc_recent_year_counts,

                newsItems: result?.[1]?.news?.items,
                blogItems: result?.[2]?.blog?.items,
                cafeItems: result?.[3]?.cafearticle?.items,
                kinItems: result?.[4]?.kin?.items,
            })
        }
    }
  }
}
export default handler;