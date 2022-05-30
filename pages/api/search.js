import useKeywordVolume from '../../libs/client/useKeywordVolume';
import useSearchArticle from '../../libs/client/useSearchArticle';
import useDataLab from '../../libs/client/useDataLab';
import useKeywordVolumeMonth from '../../libs/client/useKeywordVolumeMonth';
import useKeywordVolumeFullRange from '../../libs/client/useKeywordVolumeFullRange';
import calculateDate from '../../libs/client/calculateDate';
import useSelectedDateKeywordVolume from '../../libs/client/useSelectedDateKeywordVolume';

async function handler(req, res) {

    if (req.method === "GET") { 

        const categories = ["kvolume", "news", "blog", "cafearticle", "kin"];
        
        const { query : { ...queries } } = req; 
        // const keyword = "zoom";

        const koreaTimeNow = String(new Date((new Date()).getTime() + ((new Date()).getTimezoneOffset() * 60 * 1000) + 9 * 60 * 60 * 1000)).slice(0, 24);
        const year = new Date().getFullYear();
        const month = new Date().getMonth(); 
        const day = new Date().getDate(); 

        const korea_yesterday = calculateDate({year, month, day: day - 1}); 
        const korea_two_days_ago = calculateDate({year, month, day: day - 2}); 
        
        const korea_month_ago = calculateDate({year, month, day: day - 30});
        const korea_month_and_a_day_ago = calculateDate({year, month, day: day - 31});
        const korea_three_months_ago = calculateDate({year, month: month - 3, day});
        const korea_three_months_and_a_day_ago = calculateDate({year, month: month - 3, day: day - 1});
        const korea_six_months_ago = calculateDate({year, month: month - 6, day}); 
        const korea_six_months_and_a_day_ago = calculateDate({year, month: month - 6, day: day - 1});
        const korea_year_ago = calculateDate({year: year - 1, month, day}); 
        const korea_year_and_a_day_ago = calculateDate({year: year - 1, month, day: day - 1}); 
        
        const minimum_date = "2016-01-01";

        if (queries?.keyword) { // queries?.keyword 
        
        const keyword = queries?.keyword;

        for (let i = 0; i < categories.length; i += 1) { 

            const categories_promises = categories.map(async (category) => { 

                if (category === "kvolume") {
                    const keywordVolume = await useKeywordVolume({ keyword })
                        .then((response) => new Promise(resolve => resolve({
                            keyword_volume: response,
                            all_device_total_count: response?.keywordList?.find(object => object?.relKeyword === keyword)?.monthlyPcQcCnt + response?.keywordList?.find(o => o?.relKeyword === keyword)?.monthlyMobileQcCnt,
                            mobile_total_count: response?.keywordList?.find(object => object?.relKeyword === keyword)?.monthlyMobileQcCnt,
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
                                    // korea_yesterday,
                                    // korea_two_days_ago,
                                    all_device_total_count,
                                    mobile_total_count, 
                                    all_datalab,
                                    mobile_datalab,
                                })
                                .then((monthly_response) => { 

                                    const dataset_recent_month = {
                                        dataset_recent_month : {
                                            all_labels: monthly_response?.all_labels,
                                            
                                            selected_begin_date: monthly_response?.selected_begin_date,
                                            selected_end_date: monthly_response?.selected_end_date,
                                            
                                            all_device_absolute_counts: monthly_response?.all_device_absolute_counts,
                                            mobile_absolute_counts: monthly_response?.mobile_absolute_counts,
                                            pc_absolute_counts: monthly_response?.pc_absolute_counts,
                                            all_device_absolute_count_latest_day: monthly_response?.all_device_absolute_count_latest_day,
                                            mobile_absolute_count_latest_day: monthly_response?.mobile_absolute_count_latest_day,

                                            all_device_relative_counts: monthly_response?.all_device_relative_counts,
                                            mobile_relative_counts: monthly_response?.mobile_relative_counts,
                                        }
                                    };

                                    const dataset_full_range = useKeywordVolumeFullRange({
                                        latest_day: monthly_response?.selected_end_date,
                                        all_datalab2,
                                        mobile_datalab2,
                                        all_device_absolute_count_latest_day: monthly_response?.all_device_absolute_count_latest_day,
                                        mobile_absolute_count_latest_day: monthly_response?.mobile_absolute_count_latest_day,
                                    })
                                    .then(full_range_response => { return { ...kvolume, ...dataset_recent_month, dataset_full_range: full_range_response } });
                                    
                                    return dataset_full_range;
                                })
        
                            return dataset;
                                
                            })

                    return promiseResults;
                }
                else { 
                    const data = await useSearchArticle({ keyword, category });
                    return data;
                }
        
            })

            const result = await Promise.all(categories_promises)
            // return res.json(promiseResults);

            // Recent 1 Month Data
            const dataset_recent_month = result?.[0]?.dataset_recent_month;

            // Full Range Data
            const dataset_full_range = result?.[0]?.dataset_full_range;

            // Recent 3 Months Data
            const dataset_recent_three_months = useSelectedDateKeywordVolume({
                begin_date: korea_three_months_ago, 
                end_date: korea_yesterday, 
                all_labels_full_range: dataset_full_range?.all_labels,
                all_device_absolute_counts_full_range: dataset_full_range?.all_device_absolute_counts,
                mobile_absolute_counts_full_range: dataset_full_range?.mobile_absolute_counts,
                pc_absolute_counts_full_range: dataset_full_range?.pc_absolute_counts,
            });

            // Recent 6 Months Data
            const dataset_recent_six_months = useSelectedDateKeywordVolume({
                begin_date: korea_six_months_ago, 
                end_date: korea_yesterday, 
                all_labels_full_range: dataset_full_range?.all_labels,
                all_device_absolute_counts_full_range: dataset_full_range?.all_device_absolute_counts,
                mobile_absolute_counts_full_range: dataset_full_range?.mobile_absolute_counts,
                pc_absolute_counts_full_range: dataset_full_range?.pc_absolute_counts,
            });

            // Recent 1 Year Data
            const dataset_recent_year = useSelectedDateKeywordVolume({
                begin_date: korea_year_ago, 
                end_date: korea_yesterday, 
                all_labels_full_range: dataset_full_range?.all_labels,
                all_device_absolute_counts_full_range: dataset_full_range?.all_device_absolute_counts,
                mobile_absolute_counts_full_range: dataset_full_range?.mobile_absolute_counts,
                pc_absolute_counts_full_range: dataset_full_range?.pc_absolute_counts,
            });

            return res.json({
                keyword,
                search_date: koreaTimeNow,
                earliest_day: result?.[0]?.dataset_full_range?.earliest_day,
                latest_day: result?.[0]?.dataset_full_range?.latest_day,
                
                dataset_recent_month,
                dataset_full_range,
                dataset_recent_three_months,
                dataset_recent_six_months,
                dataset_recent_year,

                kvolumeItems: result?.[0]?.kvolume?.slice(0, 5),
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