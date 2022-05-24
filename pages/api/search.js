import useKeywordVolume from '../../libs/client/useKeywordVolume';
import useSearchArticle from '../../libs/client/useSearchArticle';
import useDataLab from '../../libs/client/useDataLab';

async function handler(req, res) {

    if (req.method === "GET") { 

        const categories = ["datalab", "datalab2", "kvolume", "news", "blog", "cafearticle", "kin"];
        
        const { query : { ...queries } } = req; 
        // const keyword = "메타랩";

        const koreaTimeNow = String(new Date((new Date()).getTime() + ((new Date()).getTimezoneOffset() * 60 * 1000) + 9 * 60 * 60 * 1000)).slice(0, 24);
        const year = new Date().getFullYear(); // 년
        const month = new Date().getMonth();   // 월
        const day = new Date().getDate(); // 일
        //const korea_month_ago = String(new Date(year, month - 1, day - 1).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month-1, day -1).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month-1, day -1).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_year_ago = String(new Date(year - 1, month, day).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year - 1, month, day).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year - 1, month, day).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_month_ago = String(new Date(year, month, day - 30).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month, day - 30).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month, day - 30).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_yesterday = String(new Date(year, month, day - 1).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month, day - 1).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month, day - 1).toLocaleDateString()).split("/")[1].padStart(2, "0");
        const korea_two_days_ago = String(new Date(year, month, day - 2).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month, day - 2).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month, day - 2).toLocaleDateString()).split("/")[1].padStart(2, "0");
        
        if (queries?.keyword) { 
        
        const keyword = queries?.keyword;
        for (let i = 0; i < categories.length; i += 1) { 

            const promises = categories.map(async (category) => {
                if (category === "datalab") {
                    const data = await useDataLab({ keyword, category, start_date: korea_month_ago, end_date: korea_yesterday });
                    return data;
                } 
                else if (category === "datalab2") {
                    const data = await useDataLab({ keyword, category, start_date: korea_year_ago, end_date: korea_yesterday });
                    return data;
                } 
                else if (category === "kvolume") {
                    const data = await useKeywordVolume({ keyword, category });
                    return data;
                }
                else { // if (!((category === "kvolume") || (category === "kvolume")))
                    const data = await useSearchArticle({ keyword, category });
                    return data;
                }
        
            })

            const promiseResults = await Promise.all(promises);

            return res.json({

                keyword: queries?.keyword,
                searchDate: koreaTimeNow,
                korea_yesterday,
                korea_two_days_ago,

                all_datalab: promiseResults?.[0]?.datalab?.[0]?.all?.results?.[0]?.data,
                all_datalab2: promiseResults?.[1]?.datalab2?.[0]?.all?.results?.[0]?.data,
                // all_device_relative_counts: all_datalab?.map((num) => { return num?.ratio } ),
                
                mobile_datalab: promiseResults?.[0]?.datalab?.[1]?.mobile?.results?.[0]?.data,
                mobile_datalab2: promiseResults?.[1]?.datalab2?.[1]?.mobile?.results?.[0]?.data,
                // pc_datalab: promiseResults?.[0]?.datalab?.[2]?.pc?.results?.[0]?.data,

                kvolumeItems: promiseResults?.[2]?.kvolume?.keywordList?.slice(0, 5),
                newsItems: promiseResults?.[3]?.news?.items,
                blogItems: promiseResults?.[4]?.blog?.items,
                cafeItems: promiseResults?.[5]?.cafearticle?.items,
                kinItems: promiseResults?.[6]?.kin?.items,

            })
        }
    }
  }
}

export default handler;