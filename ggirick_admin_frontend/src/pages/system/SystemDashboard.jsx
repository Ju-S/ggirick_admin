import { useState } from "react";
import DashboardTabs from "@/components/commons/DashboardTabs.jsx";
import WorkPolicyPage from "@/pages/system/WorkPolicyPage.jsx";
import HolidayPage from "@/pages/system/HolidayPage.jsx";

export default function SystemDashboard() {
    const [activeTab, setActiveTab] = useState("정책 관리");

    return (
        <main className="min-h-screen p-6 pt-20 md:ml-64 bg-base-200 text-base-content">
            <DashboardTabs
                tabs={["정책 관리", "휴일 관리"]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {activeTab === "정책 관리" && <WorkPolicyPage />}
            {activeTab === "휴일 관리" && <HolidayPage />}
        </main>
    );
}
