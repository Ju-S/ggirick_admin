import React from "react";

/**
 * 공용 탭 컴포넌트
 * @param {Array<string>} tabs - 탭 이름 목록
 * @param {string} activeTab - 현재 활성화된 탭 이름
 * @param {function} setActiveTab - 탭 클릭 시 상태 변경 함수
 * @param {string} className - 추가 커스텀 클래스 (선택)
 */
export default function DashboardTabs({ tabs = [], activeTab, setActiveTab, className = "" }) {
    return (
        <div
            className={`tabs tabs-boxed rounded-box mb-6 shadow-sm bg-base-100 p-2 ${className}`}
        >
            {tabs.map((tab) => (
                <a
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab transition-all duration-300 font-medium rounded-xl cursor-pointer
            ${
                        activeTab === tab
                            ? "tab-active bg-primary text-primary-content rounded-xl shadow-sm"
                            : "hover:bg-base-200 hover:rounded-2xl"
                    }`}
                >
                    {tab}
                </a>
            ))}
        </div>
    );
}
