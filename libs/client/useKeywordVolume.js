import axios from 'axios';
import CryptoJS from 'crypto-js';

export default async function useKeywordVolume({ keyword }) { // category 

    const timestamp = Date.now() + '';
    // const koreaTimeNow = String(new Date((new Date()).getTime() + ((new Date()).getTimezoneOffset() * 60 * 1000) + 9 * 60 * 60 * 1000)).slice(0, 24);
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, process.env.SECRET_KEY);
    hmac.update(`${timestamp}.GET./keywordstool`);
    const hash = hmac.finalize();
    hash.toString(CryptoJS.enc.Base64);

    const encoded_keyword = encodeURI(keyword); // queries.keyword
    const url = `https://api.naver.com/keywordstool?hintKeywords=${encoded_keyword}&showDetail=1`;     
    const options = {

        headers: {
            'X-Timestamp': timestamp, 
            'X-API-KEY': process.env.ACCESS_KEY, 
            'X-API-SECRET': process.env.SECRET_KEY, 
            'X-CUSTOMER': process.env.CUSTOMER_ID, 
            'X-Signature': hash.toString(CryptoJS.enc.Base64)
        },

    };

    const keywordVolume = await axios.get(url, options)
    .then((response) => new Promise(resolve => resolve(response.data)))
    // .then((res) => new Promise(resolve => resolve({ [category]: { ...res.data } })))
    .catch((error) => new Promise(reject => reject(error)));

    return keywordVolume;

};