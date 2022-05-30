import axios from 'axios';

export default async function useSearchArticle({ keyword, category }) {

    const encoded_keyword = encodeURI(keyword);
    const url = `https://openapi.naver.com/v1/search/${category}.json?query=${encoded_keyword}&display=15&start=1&sort=date`;
    const options = {
        headers: { 
            "X-Naver-Client-Id": process.env.SEARCH_CLIENT_ID, 
            "X-Naver-Client-Secret": process.env.SEARCH_CLIENT_SECRET 
        }
    };

    const article = await axios.get(url, options)
    .then((response) => new Promise(resolve => resolve({[category]: response.data})))
    .catch((error) => new Promise(reject => reject(error)));

    return article;

};