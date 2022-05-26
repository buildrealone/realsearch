import '../styles/globals.css';
import { SWRConfig } from 'swr';
import axios from 'axios';

const SWRConfigOptions = {
  // (1-1). fetcher: fetcher function
  // fetcher: (API_URL, queryParams="") => fetch(`${API_URL}${queryParams}`).then(res => res.json()),
  // (1-2). axios fetcher 
  fetcher: (API_URL, queryParams = "") => axios.get(`${API_URL}${queryParams}`).then(res => res.data),
  
  // (2). revalidate: should the cache revalidate once the asynchorous update resolves. (default = true)
  revalidate: true,

  // (3). rollbackOnError: should the cache rollback if the remote mutation errors. (default = true)
  rollbackOnError: true,

  // (4). refreshInterval: how frequently the page should be refreshed in milliseconds. (default = 0)
  refreshInterval: 0,

  // (5). dedupingInterval: dedupe requests with the same key in this time span in milliseconds. (default = 2000)
  dedupingInterval: 2000,
};

const App = ({ Component, pageProps }) => {

  return (
    <SWRConfig value = { SWRConfigOptions }>
      <Component {...pageProps} />
      {/* <div className="w-full max-w-xl mx-auto">
        <Component {...pageProps} />
      </div> */}
    </SWRConfig>
  )
};

export default App;
