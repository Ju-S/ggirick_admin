import {useNavigate} from 'react-router-dom';

export default function SideNav() {
    const navigate = useNavigate();

    return (
        <aside
            className="fixed top-0 left-0 z-40 h-screen w-64 -translate-x-full border-r border-base-300 bg-base-100 pt-14 transition-transform md:translate-x-0 text-base-content"
            aria-label="Sidenav"
            id="drawer-navigation"
        >
            <div className="h-full overflow-y-auto border-base-300 bg-base-100 px-3 py-5 dark:bg-gray-800">
                <form action="#" method="GET" className="mb-2 md:hidden">
                    <label htmlFor="sidebar-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="h-5 w-5 "
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="sidebar-search"
                            className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border bg-base-100 p-2 pl-10 text-sm "
                            placeholder="검색어 입력.."
                        />
                    </div>
                </form>
                <ul className="space-y-2">
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75 "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="currentColor"
                                className="lucide lucide-house-icon lucide-house h-6 w-6 text-primary transition duration-75 group-hover:text-secondary dark:text-gray-400 dark:group-hover:text-white"
                            >
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                            <span className="ml-3">홈</span>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/hrdashboard")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary dark:text-gray-400 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                            </svg>
                            <span className="ml-3 flex-1 text-left whitespace-nowrap">
                HR 시스템
              </span>
                        </button>
                    </li>
                </ul>
                <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5 dark:border-gray-700">
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/systemdashboard")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary dark:text-gray-400 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                <path
                                    fill-rule="evenodd"
                                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                            <span className="ml-3">시스템 관리</span>
                        </button>
                    </li>
                </ul>
                <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5 dark:border-gray-700">
                    <li>
                        <button
                            type="button"
                            onClick={() => navigate("/organization")}
                            className="group flex w-full items-center rounded-lg p-2 text-base-content font-medium  transition duration-75"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-primary transition duration-75 group-hover:text-secondary dark:text-gray-400 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 -2 15 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                                <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
                            </svg>
                            <span className="ml-3">조직도</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
