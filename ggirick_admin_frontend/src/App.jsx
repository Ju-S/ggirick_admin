// App.js
import {useEffect, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

// 스토어
import useAuthStore from "./store/auth/authStore.js";
import useDepartmentStore from "./store/hr/departmentStore.js";
import useJobStore from "./store/hr/jobStore.js";
import useOrganizationStore from "./store/hr/organizationStore.js";
import useEmployeeStore from "./store/hr/employeeStore.js";

// 테마 + 공통 컴포넌트
import {ThemeProvider} from "./context/ThemeContext.jsx";
import Nav from "./components/commons/nav/Nav.jsx";
import SideNav from "./components/commons/sideNav/SideNav.jsx";
import AlertModal from "./components/commons/modals/AlertModal.jsx";

// API
import {
    getAllEmploymentStatusesAPI,
    getDepartmentsAPI,
    getJobsAPI, getMyInfoAPI,
    getOrganizationsAPI
} from "./api/hr/index.js";

// 페이지
import {LoginPage} from "./pages/auth/LoginPage.jsx";
import Error404Page from "./pages/commons/Error404Page.jsx";
import HRDashboard from "./pages/hr/HRDashboard.jsx";
import MainPage from "./pages/commons/MainPage.jsx";
import SystemDashboard from "./pages/system/SystemDashboard.jsx";
import OrganizationPage from "./pages/organization/OrganizationPage.jsx";



export default function App() {
    // 전역 상태변수 - 로그인용
    const {isLogin, login, logout} = useAuthStore(state => state);
    // 각 store setter 가져오기
    const {setDepartments} = useDepartmentStore();
    const {setJobs} = useJobStore();
    const {setOrganizations} = useOrganizationStore();
    const {setEmploymentStatuses, setMyInfo} = useEmployeeStore();

    // 오류 모달 상태 설정
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // F5 누를때마다 프로필 날라가는거 수정
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const res = await getMyInfoAPI();
                if (res.status === 200 && res.data) {
                    setMyInfo(res.data);
                }
            } catch (err) {
                console.error("세션 복원 실패:", err);
                logout();
            }
        };

        restoreSession();
    }, []);

    // 로그인 상태 먼저 초기화 (맨 처음 앱 실행 시)
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const authority = sessionStorage.getItem("authority");

        if (token && authority) {
            // 세션에 로그인 정보가 있으면 상태 복원
            login({token, authority});
        } else {
            // 세션에 정보 없으면 로그아웃 상태로
            logout();
        }
    }, [login, logout]);

    // 로그인 성공 시 HR 메타데이터 불러오기
    useEffect(() => {
        if (isLogin === true) {
            fetchHrMetaData();
        }
    }, [isLogin]); // 로그인 상태 변경될 때마다 실행

    // 로그인 이후 공통 데이터 불러오고 스토어에 저장 (부서 / 직급 / 조직 / 재직 상태 )
    const fetchHrMetaData = async () => {
        // 로그인 상태가 true일 때만 실행
        if (isLogin === true) {
            try {
                const [deptRes, jobRes, orgRes, statusRes] = await Promise.all([
                    getDepartmentsAPI(),
                    getJobsAPI(),
                    getOrganizationsAPI(),
                    getAllEmploymentStatusesAPI(),
                ]);

                // 각각의 store에 데이터 세팅
                setDepartments(deptRes.data.map((d) => ({ code: d.code, name: d.name })));
                setJobs(jobRes.data.map((j) => ({ code: j.code, name: j.name })));
                setOrganizations(orgRes.data.map((o) => ({ code: o.code, name: o.name })));
                setEmploymentStatuses(statusRes.data.map((s) => ({ code: s.code, name: s.name })));

                console.log("✅ HR 메타데이터 로드 완료");
            } catch (err) {
                console.error("❌ HR 메타데이터 로드 실패:", err);
                setErrorMessage("서버에서 메타데이터를 불러오는 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
                setErrorModalOpen(true);
            }
        } else {
            console.log("⏸ 로그인 상태가 아니므로 HR 메타데이터 로드를 생략합니다.");
        }
    };

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
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="*" element={<Navigate to="/login" replace/>}/>
                        </Routes>
                    )}

                    {isLogin === true && (
                        <>
                            <Nav/>
                            <SideNav/>
                            <Routes>
                                <Route path="/" element={<MainPage/>}/>
                                <Route path="/hrDashboard" element={<HRDashboard/>}/>
                                <Route path="/systemDashboard" element={<SystemDashboard/>}/>
                                <Route path="/organization" element={<OrganizationPage/>}/>
                                <Route path="*" element={<Error404Page/>}/>
                            </Routes>
                        </>
                    )}
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}