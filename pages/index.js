import { Fragment, useState, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react'; // , Combobox 
import { SearchIcon } from '@heroicons/react/solid';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'; // , UsersIcon
import SearchVolumeItem from './components/SearchVolumeItem';
import MainChart from './components/MainChart';
// import SideChart from './components/SideChart';
import NewsItem from './components/NewsItem';
import BlogItem from './components/BlogItem';
import CafeItem from './components/CafeItem';
import KinItem from './components/KinItem';
import Footer from './components/Footer';
import useSWR, { useSWRConfig } from "swr";
import Image from 'next/image';
import Head from 'next/head';
import { classNames } from '../libs/client/classNames';
// import { useRouter } from 'next/router';

export default function Home() {

const user = {
    name: 'Anonymous',
    email: 'admin@londonpark.me',
    imageUrl:
        'https://avatars.dicebear.com/api/pixel-art/adminlondonpark.svg',
    };

const navigation = [
    { category: 'kvolume', name: '키워드 검색량' },
    { category: 'news', name: '네이버 뉴스' },
    { category: 'blog', name: '네이버 블로그' },
    { category: 'cafe', name: '네이버 카페' },
    { category: 'kin', name: '네이버 지식in' },
];

const initialCategoryActive = {
    kvolume: false,
    news: false,
    blog: false,
    cafe: false,
    kin: false,
    shop: false,
};

const [categoryActive, setCategoryActive] = useState({
    kvolume: true,
    news: false,
    blog: false,
    cafe: false,
    kin: false,
    shop: false,
});

const [category, setCategory] = useState("kvolume")
const [keyword, setKeyword] = useState("");

const handleSubmitMain = async (e) => {
  e.preventDefault();
  const { mainKeyword } = e.target.elements;
  setKeyword(mainKeyword.value.replace(/\s/g, ''));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const { searchKeyword } = e.target.elements;
    setKeyword(searchKeyword.value.replace(/\s/g, ''));
};

const userNavigation = [
    { name: "나의 프로필", href: "#" },
    { name: "로그인", href: "#" },
];

const { data, error, isValidating } = useSWR(keyword ? `/api/search?keyword=${keyword}` : null);
const { mutate: unboundMutate, cache } = useSWRConfig();

useEffect(() => {
    if (keyword && data && !(!data && !error)) {
      console.log(`current cache key: /api/search?keyword=${keyword}`);
      console.log("<GLOBAL CACHE> CACHE DATA: ", cache.get(`/api/search?keyword=${keyword}`));
    };
}, [data]); 

  return (
    <>
    <Head>
      <title>London Search</title>
    </Head>

    {!keyword && !data

    ?

    <div className="flex items-center justify-center fixed w-full h-full">
      <Image
          className="overflow-hidden max-h-full max-w-full z-auto"
          alt="background-image"
          src="/galaxy.jpg"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      <div className="md:w-full mx-auto max-w-xl transform rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
        <form onSubmit={handleSubmitMain}>
          <label htmlFor="mainKeyword" className="sr-only" />
          <input 
          className="w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm" 
          type="text" 
          id="mainKeyword" 
          name="mainKeyword" 
          placeholder="키워드 검색"
          spellCheck="false"
          required />
        </form>
      </div>
    </div>

    :
    
    <div>
    <Disclosure as="header" className="bg-gray-800">
    {({ open }) => (
      <>
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:divide-y lg:divide-gray-700 lg:px-8">
          <div className="relative h-16 flex justify-between">
            <div className="relative z-10 px-2 flex lg:px-0">
              <div className="flex-shrink-0 flex items-center">
                <button 
                  onClick={() => {
                    setKeyword("")
                    setCategory("kvolume")
                    }}
                  className="block h-8 w-auto text-indigo-500 font-bold text-xl"
                >
                  LONDON
                </button>
              </div>
            </div>
            <div className="hidden sm:flex relative z-0 flex-1 px-2 items-center justify-center sm:absolute sm:inset-0">
              <div className="w-full sm:max-w-xs">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>

                  <form onSubmit={ handleSubmit }>
                      <label htmlFor="searchKeyword" className="sr-only">Search</label>
                      <input
                      id="searchKeyword"
                      name="searchKeyword"
                      className="block w-full bg-gray-700 border border-transparent rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 focus:placeholder-gray-500 sm:text-sm"
                      placeholder="검색 키워드 입력"
                      type="text"
                      spellCheck="false"
                      maxLength="15"
                      required
                      />
                  </form>

                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center lg:hidden">
              {/* Mobile menu button */}
              <Disclosure.Button className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open Menu</span>
                {open ? (
                  <XIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
            <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
              <button
                type="button"
                className="bg-gray-800 flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">View Notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="flex-shrink-0 relative ml-4">
                <div>
                  <Menu.Button className="bg-gray-800 rounded-full flex text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open User Menu</span>
                    <img className="h-8 w-8 rounded-full" src={user?.imageUrl} alt="profile" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                    {userNavigation.map((item, idx) => (
                      <Menu.Item key={idx}>
                        {({ active }) => ( 
                          <a
                          href={item?.href}
                          className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block py-2 px-4 text-sm text-gray-700'
                          )}
                          >
                          {item?.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <nav className="hidden lg:py-2 lg:flex lg:space-x-8" aria-label="Global">
            
            {navigation.map((item, idx) => (
              <button 
              key={idx}
              onClick={() => {
                  setCategory(item?.category);
                  setCategoryActive({...initialCategoryActive, [item?.category]: true});
              }}
              className={classNames(
                  categoryActive[item?.category] ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md py-2 px-3 inline-flex items-center text-sm font-medium'
              )}
              >
                  {item?.name}
              </button>
            ))}
          </nav>
        </div>

        <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
          {/* <div className="pt-2 pb-3 px-2 space-y-1">
            {navigation.map((item, idx) => (

              <Disclosure.Button
                  key={idx}
                  as="button"
                  onClick={() => {
                      setCategory(item?.category);
                      setCategoryActive({...initialCategoryActive, [item?.category]: true});
                  }}
                  className={classNames(
                      categoryActive[item?.category] ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md py-2 px-3 text-base font-medium'
                  )}
                  >
                  {item?.name}
              </Disclosure.Button>

            ))}
          </div> */}
          <div className="border-t border-gray-700 pt-4 pb-3">
            <div className="px-4 flex items-center">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full" src={user?.imageUrl || "https://avatars.dicebear.com/api/pixel-art/random.svg"} alt="user profile image" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user?.name || "Anonymous"}</div>
                <div className="text-sm font-medium text-gray-400">{user?.email || "No Email"}</div>
              </div>
              <button
                type="button"
                className="ml-auto flex-shrink-0 bg-gray-800 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">View Notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {userNavigation.map((item, idx) => (
                <Disclosure.Button
                  key={idx}
                  as="a"
                  href={item?.href}
                  className="block rounded-md py-2 px-3 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {item?.name}
                </Disclosure.Button>
              ))}
            </div>
          </div>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
  
  {
  
  data?.kvolumeItems && category === 'kvolume' && !error

  ?

  <div>

      {data?.dataset_recent_month?.all_labels && data?.dataset_recent_month?.all_labels?.length > 29 && data?.dataset_recent_month?.all_labels?.length === data?.dataset_recent_month?.all_device_absolute_counts?.length

      ?
    
      <div>
        <MainChart
            keyword={data?.keyword}
            isRecentMonth={true} 
            isRecentYear={false} 
            labels={data?.dataset_recent_month?.all_labels}
            all_device_absolute_counts={data?.dataset_recent_month?.all_device_absolute_counts}
            mobile_absolute_counts={data?.dataset_recent_month?.mobile_absolute_counts}
            pc_absolute_counts={data?.dataset_recent_month?.pc_absolute_counts}
        />
        
        {/* {data?.dataset_full_range?.all_labels_full_range && data?.dataset_full_range?.all_device_absolute_counts_full_range?.length === data?.dataset_full_range?.mobile_absolute_counts_full_range?.length

        ?

        // hidden sm:block
        <div className="mt-4">
          <MainChart
              keyword={data?.keyword} 
              isRecentMonth={false} 
              labels={data?.dataset_full_range?.all_labels_full_range}
              all_device_absolute_counts={data?.dataset_full_range?.all_device_absolute_counts_full_range}
              mobile_absolute_counts={data?.dataset_full_range?.mobile_absolute_counts_full_range}
              pc_absolute_counts={data?.dataset_full_range?.pc_absolute_counts_full_range}
          />
        </div>

        :

        null} */}

        {/* {data?.all_labels_recent_year && data?.all_device_recent_year_counts?.length === data?.mobile_recent_year_counts?.length

        ?

        // hidden sm:block
        <div className="mt-4">
          <MainChart
              keyword={data?.keyword} 
              isRecentMonth={false} 
              isRecentYear={true} 
              labels={data?.all_labels_recent_year}
              all_device_absolute_counts={data?.all_device_recent_year_counts}
              mobile_absolute_counts={data?.mobile_recent_year_counts}
              pc_absolute_counts={data?.pc_recent_year_counts}
          />
        </div>

        :

        null} */}

      </div>

      :

      null}

      {data?.kvolumeItems?.map((item, idx) => (
      
      <SearchVolumeItem
          key={idx}
          item={item}
          isMainKeyword={data?.keyword === item?.relKeyword}
          searchDate={data?.searchDate}
          keyword={data?.keyword}

          all_device_recent_year_absolute_counts_sum={data?.all_device_recent_year_absolute_counts_sum}
          mobile_recent_year_absolute_counts_sum={data?.mobile_recent_year_absolute_counts_sum}
          pc_recent_year_absolute_counts_sum={data?.pc_recent_year_absolute_counts_sum}

          begin_date_in_recent_month={data?.begin_date_in_recent_month}
          end_date_in_recent_month={data?.end_date_in_recent_month}
          begin_date_in_recent_year={data?.begin_date_in_recent_year}
          end_date_in_recent_year={data?.end_date_in_recent_year}
      />

      ))
      }

  </div>

  :

  null

  }

  {
  
  data?.newsItems && category === 'news' && !error

  ?

  <div>
      {data?.newsItems?.map((item, idx) => (
      
      <NewsItem
          key={idx}
          item={item}
      />

      ))
      }
  </div>

  :

  null

  }

  {
  
  data?.blogItems && category === 'blog' && !error

  ?

  <div>
      {data?.blogItems?.map((item, idx) => (
      
      <BlogItem
          key={idx}
          item={item}
      />

      ))
      }
  </div>

  :

  null

  }

  {
  
  data?.cafeItems && category === 'cafe' && !error

  ?

  <div>
      {data?.cafeItems?.map((item, idx) => (
      
      <CafeItem
          key={idx}
          item={item}
      />

      ))
      }
  </div>

  :

  null

  }

  {
  
  data?.kinItems && category === 'kin' && !error

  ?

  <div>
      {data?.kinItems?.map((item, idx) => (
      
      <KinItem
          key={idx}
          item={item}
          keyword={data?.keyword}
          searchDate={data?.searchDate}
      />

      ))
      }
  </div>

  :

  null

  }

  {
  
  data && !isValidating && !error 

  ?

  <Footer /> 

  :

  null

  }

  {
  
  keyword && category

  ?

  <nav className="lg:hidden bg-white max-w-6xl lg:max-w-7xl text-gray-700 fixed bottom-0 w-full px-10 pb-5 pt-3 flex justify-between text-xs">
        {/* <Link href="/"> */}
        <button onClick={() => {
            setKeyword("")
            setCategory("kvolume")
            }}>
          <a
            className={classNames(
              "flex flex-col items-center space-y-2",
              keyword !== ""
                ? "text-gray-500 transition-colors hover:text-gray-900"
                : "text-indigo-600"
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <span>검색</span>
          </a>
        {/* </Link> */}
        </button>

        {/* KVOLUME */}
        <button onClick={() => setCategory("kvolume")}>
        {/* <Link href="/">  */}
          <a
            className={classNames(
              "flex flex-col items-center space-y-2 ",
              category === "kvolume"
                ? "text-indigo-600"
                : " text-gray-500 transition-colors hover:text-gray-900"
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              ></path>
            </svg>
            <span>검색량</span>
          </a>
        {/* </Link> */}
        </button>

        {/* NEWS */}
        <button onClick={() => setCategory("news")}>
        {/* <Link href="/"> */}
          <a
            className={classNames(
              "flex flex-col items-center space-y-2 ",
              category === "news"
                ? "text-indigo-600"
                : "text-gray-500 transition-colors hover:text-gray-900"
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>뉴스</span>
          </a>
        {/* </Link> */}
        </button>

        {/* BLOG */}
        <button onClick={() => setCategory("blog")}>
        {/* <Link href="/"> */}
          <a
            className={classNames(
              "flex flex-col items-center space-y-2 ",
              category === "blog"
                ? "text-indigo-600"
                : "text-gray-500 transition-colors hover:text-gray-900"
            )}
          > 
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <span>블로그</span>
          </a>
        {/* </Link> */}
        </button>

        {/* CAFE */}
        <button onClick={() => setCategory("cafe")}>
        {/* <Link href="/"> */}
          <a
            className={classNames(
              "flex flex-col items-center space-y-2 ",
              category === "cafe"
                ? "text-indigo-600"
                : "text-gray-500 transition-colors hover:text-gray-900"
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
            <span>카페</span>
          </a>
        {/* </Link> */}
        </button>
        
        {/* KIN */}
        <button onClick={() => setCategory("kin")}>
        {/* <Link href="/"> */}
          <a
            className={classNames(
              "flex flex-col items-center space-y-2 ",
              category === "kin"
                ? "text-indigo-600"
                : "text-gray-500 transition-colors hover:text-gray-900"
            )}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>지식in</span>
          </a>
        {/* </Link> */}
        </button>
      </nav>

      :

      null
    }

</div>
}
</>
  )
}
