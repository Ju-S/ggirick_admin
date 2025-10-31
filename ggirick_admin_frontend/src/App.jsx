// App.js
import {useEffect, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

// 스토어
import useAuthStore from "./store/authStore.js";

// 테마 + 공통 컴포넌트
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Nav from "./components/commons/nav/Nav.jsx";
import SideNav from "./components/commons/sideNav/SideNav.jsx";

// 페이지
import {LoginPage} from "./pages/auth/LoginPage.jsx";
import MainPage from "./pages/commons/MainPage.jsx";
import Error404Page from "./pages/commons/Error404Page.jsx";
import HRDashboard from "./pages/hr/HRDashboard.jsx";
import UserManagement from "./pages/hr/UserManagement.jsx";
import useCommonStore from "./store/commonStore.js";
import {getAllHrMetaAPI} from "./api/hr/employeeMetaAPI.js";
import AlertModal from "./components/commons/modals/AlertModal.jsx";




export default function App() {
    // 전역 상태변수 - 로그인용
    const {isLogin, login, logout} = useAuthStore(state => state);
    // 전역 상태변수 - 메타 데이터용
    const setAllCommonData = useCommonStore(state => state.setAllCommonData);

    // 오류 모달 상태 설정
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // 로그인 상태 먼저 초기화 (맨 처음 앱 실행 시)
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const authority = sessionStorage.getItem("authority");

        if (token && authority) {
            // 세션에 로그인 정보가 있으면 상태 복원
            login({ token, authority });
        } else {
            // 세션에 정보 없으면 로그아웃 상태로
            logout();
        }
    }, [login, logout]);

    // 로그인 이후 공통 데이터 불러오고 스토어에 저장 (부서 / 직급 / 조직)
    useEffect(() => {
        //  데이터 불러오고 스토어에 저장하는 함수 정의
        const fetchHrMetaData  = async () => {
            try {
                // 비동기로 메타데이터 받아오기
                const metaData = await getAllHrMetaAPI();

                // Zustand 스토어에 한꺼번에 저장
                setAllCommonData(metaData);
            } catch (err) {
                console.error("❌ HR 메타데이터 불러오기 실패:", err);
                // 🔹 모달로 에러 안내
                setErrorMessage("서버에서 데이터를 불러오는 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
                setErrorModalOpen(true);
            }
        };

        // 로그인 상태가 true일 때만 실행
        if (isLogin === true) {
            fetchHrMetaData();
        }
    }, [isLogin, setAllCommonData]);

                return (
        <ThemeProvider>

            {/* 전역 에러 안내 모달 — 로그인 여부 상관없이 항상 렌더링 */}
            <AlertModal
                isOpen={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="데이터 로드 실패"
                message={errorMessage}
                type="error"
            />

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