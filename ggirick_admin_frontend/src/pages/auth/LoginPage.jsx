import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

import Logo from '../../assets/logo/ggirick-header.svg?react';

import useEmployeeStore from "../../store/hr/employeeStore.js";
import useAuthStore from "../../store/auth/authStore.js";

import LoginInputForm from "../../components/auth/LoginInputForm.jsx";

import {loginAPI} from "../../api/auth/authAPI.js";
import {getMyInfoAPI} from "../../api/hr/index.js";

export function LoginPage() {
    // input 입력 값 저장할 상태변수
    const [loginInfo, setLoginInfo] = useState({
        id: "",
        pw: "",
    });

    // 네비게이터
    const navigate = useNavigate();

    // 전역 상태변수 불러오기
    const setMyInfo = useEmployeeStore((state) => state.setMyInfo);
    const login = useAuthStore(state => state.login);


    const handleLogin = async () => {
        try {
            const resp = await loginAPI(loginInfo);
            const { token, authority } = resp.data;

            if (!token) {
                alert("회원정보가 일치하지 않습니다.");
                return;
            }

            // 로그인 토큰 저장
            login({ token, authority });

            // 본인 정보 조회
            const meResp = await getMyInfoAPI();
            if (meResp.status === 200 && meResp.data) {
                setMyInfo(meResp.data); // 스토어에 저장
                console.log("로그인 성공 / 사용자 정보:", meResp.data);
                navigate("/");
            } else {
                alert("사용자 정보를 불러오는데 실패했습니다.");
            }
        } catch (err) {
            console.error("로그인 실패:", err);
            alert("로그인 실패. 아이디나 비밀번호를 확인해주세요.");
        } finally {
            setLoginInfo({ id: "", pw: "" });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
            <div className="flex items-center justify-start">
                <button onClick={() => navigate("/")} className="mr-4 flex items-center justify-between">
                    <Logo width={120} height={50}/>
                </button>
            </div>

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
