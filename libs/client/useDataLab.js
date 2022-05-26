import axios from 'axios';

async function getDataLabData({ keyword, device_type, start_date, end_date }) {
    const request_body = {
        startDate: start_date,
        endDate: end_date,
        timeUnit: "date",
        keywordGroups: [
            {
                groupName: keyword,
                keywords: [
                    keyword,
                ]
            },
        ],
        device: device_type === "all" ? "" : device_type === "mobile" ? "mo" : "pc",
        // ages: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
        // gender: "f"
    };
    
    const url = "https://openapi.naver.com/v1/datalab/search";

    const data = await axios(url, {
    method: "post",
    headers: {
        "X-Naver-Client-Id": process.env.DATALAB_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.DATALAB_CLIENT_SECRET,
        "Content-Type": "application/json"
    },
    data: JSON.stringify(request_body),
    })
    .then((res) => new Promise(resolve => resolve({[device_type]: res.data})))
    .catch((err) => new Promise(reject => reject(err)));

    return data;

};

export default async function useDataLab({ keyword, category, start_date, end_date }) {

    // const encoded_keyword = encodeURI(keyword);
    const device_types = ["all", "mobile"]; // , "pc"

    for (let i = 0; i < device_types.length; i += 1) { 

        const promises = device_types.map(async (device_type) => {
            const data = await getDataLabData({ keyword, device_type, start_date, end_date });
            return data;
        })

        // const promiseResults = await Promise.all(promises);
        // return { [category]: promiseResults } ;

        const promiseResults = await Promise.all(promises)
        .then((response) => new Promise(resolve => resolve({ [category]: response} )))
        .catch((err) => new Promise(reject => reject(err)));

        return promiseResults;

    };
};