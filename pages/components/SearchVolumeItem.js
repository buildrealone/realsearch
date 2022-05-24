import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChatAltIcon,
  CodeIcon,
  DotsVerticalIcon,
  EyeIcon,
  FlagIcon,
  ShareIcon,
  StarIcon,
  ThumbUpIcon,
} from '@heroicons/react/solid';
import { classNames } from '../../libs/client/classNames';

export default function SearchVolumeItem({ item, searchDate }) {
  return (
    <>
      <div className="min-h-full">
          <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
            <main className="lg:col-span-12">
              <div className="mt-4">
                <h1 className="sr-only">Recent Items</h1>
                <ul role="list" className="space-y-4">
                    <li className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg">
                      <article aria-labelledby={'item-title-' + item?.relKeyword}>
                        <div>
                      {/* <div className="flex"> */}
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0">
                              {/* `https://avatars.dicebear.com/api/pixel-art/${item?.relKeyword || 'default'}.svg` */}
                              <img className="h-10 w-10 rounded-full" src="/naver_logo.png" alt="relevant_keyword" />
                            </div>
                            <div className="min-w-0 flex-1 mb-2">

                                <span className="text-sm font-medium text-gray-900">
                                  {item?.relKeyword}
                                </span>

                              <p className="text-xs text-gray-500">
                                검색 시간: {searchDate}
                              </p>
                            </div>
                            <div className="flex-shrink-0 self-center flex">
                              <Menu as="div" className="relative inline-block text-left">
                                <div>
                                  <Menu.Button className="-m-2 p-2 rounded-full flex items-center text-gray-400 hover:text-gray-600">
                                    <span className="sr-only">Open options</span>
                                    <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
                                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            className={classNames(
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                              'flex px-4 py-2 text-sm'
                                            )}
                                          >
                                            <StarIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span>관심글 목록에 추가</span>
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            className={classNames(
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                              'flex px-4 py-2 text-sm'
                                            )}
                                          >
                                            <CodeIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span>링크 추가</span>
                                          </a>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            className={classNames(
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                              'flex px-4 py-2 text-sm'
                                            )}
                                          >
                                            <FlagIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            <span>부적합 게시물 신고</span>
                                          </a>
                                        )}
                                      </Menu.Item> 
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </div>
                          </div>

                          <ul className="mt-4 text-gray-900">
                            <li className="list-none ml-5 mb-2 mt-3">
                                <span className="text-sm font-medium">Total</span>
                            </li>

                            <li className="list-disc ml-12 mb-2">
                                <span className="text-sm font-light">
                                    검색량: {new Intl.NumberFormat('en-US').format(item?.monthlyPcQcCnt + item?.monthlyMobileQcCnt)}회<span className="text-xs ml-[6px]">(최근 30일 기준)</span>
                                </span>
                            </li>

                            <li className="list-disc ml-12 mb-2">
                                <span className="text-sm font-light">경쟁 정도: {item?.compIdx}</span>
                            </li>

                            <li className="list-none ml-5 mb-2 mt-3">
                                <span className="text-sm font-medium">Mobile</span>
                            </li>

                            <li className="list-disc ml-12 mb-2">
                                <span className="text-sm font-light">검색량: </span>
                                <span className="text-sm font-light">
                                    {new Intl.NumberFormat('en-US').format(item?.monthlyMobileQcCnt)}회 <span className="text-xs font-light ml-[2px]">(검색 비율: <span>{Math.round((item?.monthlyMobileQcCnt / (item?.monthlyPcQcCnt + item?.monthlyMobileQcCnt) * 100))}%</span>)</span>
                                </span>
                            </li>
                            
                            <li className="list-disc ml-12 mb-2">
                                <span className="text-sm font-light">클릭수: </span>
                                <span className="text-sm font-light">
                                    {new Intl.NumberFormat('en-US').format(item?.monthlyAveMobileClkCnt)}회 <span className="text-xs ml-[2px]">(최근 28일 기준: 평균 키워드 광고 클릭수)</span>
                                </span>
                            </li>

                            <li className="list-disc ml-12 mb-2">
                                <span className="text-sm font-light">CTR: </span>
                                <span className="text-sm font-light">
                                    {item?.monthlyAveMobileCtr}%
                                </span>
                            </li>

                            <li className="list-none ml-5 mb-2 mt-3">
                                <span className="text-sm font-medium">PC</span>
                            </li>

                            <li className="list-disc ml-12 mb-2">
                                <span className="text-sm font-light">검색량: </span>
                                <span className="text-sm font-light">
                                    {new Intl.NumberFormat('en-US').format(item?.monthlyPcQcCnt)}회 <span className="text-xs font-light ml-[2px]">(검색 비율: <span>{Math.round((item?.monthlyPcQcCnt / (item?.monthlyPcQcCnt + item?.monthlyMobileQcCnt) * 100))}%</span>)</span>
                                </span>
                            </li>

                            <li className="list-disc ml-12 mb-2">
                                <span className="text-sm font-light">클릭수: </span>
                                <span className="text-sm font-light">
                                    {new Intl.NumberFormat('en-US').format(item?.monthlyAvePcClkCnt)}회 <span className="text-xs ml-[2px]">(최근 28일 기준: 평균 키워드 광고 클릭수)</span>
                                </span>
                            </li>

                            <li className="list-disc ml-12 mb-2">
                                <span className="text-sm font-light">CTR: </span>
                                <span className="text-sm font-light">
                                    {item?.monthlyAvePcCtr}%
                                </span>
                            </li>

                          </ul>
        
                        </div>
                        {/* </div> */}
                        
                        <div className="mt-6 flex justify-between space-x-8">
                          <div className="flex space-x-6">
                            <span className="inline-flex items-center text-sm">
                              <button type="button" className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                <ThumbUpIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="font-medium text-gray-900">{item?.likes}</span>
                                <span className="sr-only">likes</span>
                              </button>
                            </span>
                            <span className="inline-flex items-center text-sm">
                              
                              <button type="button" className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                <ChatAltIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="font-medium text-gray-900">{item?.replies}</span>
                                <span className="sr-only">replies</span>
                              </button>
                            </span>
                            <span className="inline-flex items-center text-sm">
                              <button type="button" className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="font-medium text-gray-900">{item?.views}</span>
                                <span className="sr-only">views</span>
                              </button>
                            </span>
                          </div>
                          <div className="flex text-sm">
                            <span className="inline-flex items-center text-sm">
                              <button type="button" className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                                <ShareIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="font-medium text-gray-900">공유하기</span>
                              </button>
                            </span>
                          </div>
                        </div>
                      </article>
                    </li>
                </ul>
              </div>
            </main>
        </div>
      </div>
    </>
  )
}
