import { useState } from "react";
import useEmployeeStore from "../../store/employeeStore.js";

import ggirickLogo from "../../assets/logo/ggirick-header.png";

import {loginAPI} from "../../api/auth/authAPI.js";
import LoginInputForm from "../../components/auth/LoginInputForm.jsx";
import useAuthStore from "../../store/authStore.js";
import {getMyInfoAPI} from "../../api/hr/index.js";
import {useNavigate} from "react-router-dom";


export function LoginPage() {
    // input 입력 값 저장할 상태변수
    const [loginInfo, setLoginInfo] = useState({
        id: "",
        pw: "",
    });

    // 네비게이터
    const navigate = useNavigate();

    // 전역 상태변수 불러오기
    const setEmployee = useEmployeeStore((state) => state.setEmployee);
    const login = useAuthStore(state => state.login);


    const handleLogin = () => {
        loginAPI(loginInfo)
            .then((resp) => {
                const token = resp.data;
                if (token != null) {
                    // 로그인 저장
                    login(token);
                    // 로그인한 직원 정보 가져오기
                    getMyInfoAPI(token).then(resp => {
                        const myInfo = resp.data;
                        if(myInfo != null) {
                            setEmployee(myInfo);
                            navigate("/");
                        }else {
                            alert("정보를 불러오는데 실패했습니다.");
                        }
                    });
                } else {
                    alert("회원정보가 일치하지 않습니다.");
                }
            })
            .catch(() => alert("로그인 실패"))
            .finally(() => setLoginInfo({ id: "", pw: "" }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
            <img src={ggirickLogo} alt="회사 로고" className="w-40 mb-8" />

            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center text-xl font-semibold mb-4">로그인</h2>

                    <LoginInputForm loginInfo={loginInfo} setLoginInfo={setLoginInfo} />

                    <label className="label mt-1 flex justify-center items-center">
                        <a href="#" className="label-text-alt link link-hover text-blue-500">
                            비밀번호를 잊으셨나요?
                        </a>
                    </label>

                    <div className="form-control mt-4">
                        <button className="btn btn-primary w-full" onClick={handleLogin}>
                            로그인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
