import {useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import useAuthStore from "./store/authStore.js";

import {ThemeProvider} from "./context/ThemeContext.jsx";

import {LoginPage} from "./pages/auth/LoginPage.jsx";
import Nav from "./components/commons/nav/Nav.jsx";
import SideNav from "./components/commons/sideNav/SideNav.jsx";
import MainPage from "./pages/commons/MainPage.jsx";
import Error404Page from "./pages/commons/Error404Page.jsx";

import HRDashboard from "./pages/hr/HRDashboard.jsx";
import UserManagement from "./pages/hr/UserManagement.jsx";




export default function App() {
    const [test, setTest] = useState("");
    const isLogin = useAuthStore(state => state.isLogin);

    return (
        <ThemeProvider>
            <BrowserRouter>
                <div className="bg-gray-50 antialiased dark:bg-gray-900">
                    {isLogin === "none" && (
                        <div className="flex justify-center items-center min-h-screen text-gray-500">
                            로그인 상태 확인 중...
                        </div>
                    )}

                    {isLogin === false && (
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    )}

                    {isLogin === true && (
                        <>
                            <Nav />
                            <SideNav />
                            <Routes>
                                <Route path="/" element={<MainPage />} />
                                <Route path="/hrDashboard" element={<HRDashboard />} />
                                <Route path="/userManagement" element={<UserManagement />} />
                                <Route path="*" element={<Error404Page />} />
                            </Routes>
                        </>
                    )}
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}