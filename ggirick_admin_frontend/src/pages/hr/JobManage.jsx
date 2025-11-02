import { useState } from "react";
import CommonManagePage from "@/components/hr/CommonManagePage.jsx";
import JobReorderModal from "@/components/hr/JobReorderModal.jsx";
import useJobStore from "@/store/hr/jobStore.js";
import {
    updateJobAPI,
    deleteJobAPI,
    updateRankOrderAPI,
} from "@/api/hr/jobAPI.js";

export default function JobManage() {
    const { jobs, setJobs } = useJobStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 직급 등록 및 전체 순서 업데이트
    const handleInsertJob = async (payload) => {
        try {
            const newList = [...jobs, { ...payload }];
            const reordered = newList
                .map((j, i) => ({ ...j, rankOrder: i + 1 }))
                .sort((a, b) => a.rankOrder - b.rankOrder);

            await updateRankOrderAPI(reordered);
            setJobs(reordered);
            alert(`직급 "${payload.name}"이(가) 추가되었습니다.`);
        } catch (e) {
            console.error("직급 등록 실패:", e);
        }
    };

    // 직급 삭제 후 순서 재정렬
    const handleDeleteJob = async (code) => {
        try {
            const res = await deleteJobAPI(code);
            if (res.status === 200) {
                // 1️⃣ 삭제 후 리스트 재구성
                const filtered = jobs.filter((j) => j.code !== code);

                // 2️⃣ rank 순서 재조정
                const reordered = filtered.map((j, i) => ({
                    ...j,
                    rankOrder: i + 1,
                }));

                // 3️⃣ DB 반영
                await updateRankOrderAPI(reordered);

                // 4️⃣ 상태 갱신
                setJobs(reordered);
                alert("직급이 삭제되고 순서가 자동 정렬되었습니다.");
            }
        } catch (e) {
            console.error("직급 삭제 실패:", e);
            alert("직급 삭제 중 오류가 발생했습니다.");
        }
    };

    // 모달에서 순서 변경 저장
    const handleSubmitReorder = async (reordered) => {
        try {
            const sorted = [...reordered].sort((a, b) => a.rankOrder - b.rankOrder);
            await updateRankOrderAPI(sorted);
            setJobs(sorted);
            setIsModalOpen(false);
            alert("직급 순서가 저장되었습니다.");
        } catch (e) {
            console.error("직급 순서 저장 실패:", e);
        }
    };

    return (
        <>
            <CommonManagePage
                entityName="직급"
                dataList={jobs}
                setDataList={setJobs}
                fields={[]} // 기본 모달은 사용 안 함
                api={{
                    insert: handleInsertJob,
                    update: updateJobAPI,
                    delete: handleDeleteJob,
                    openCustomModal: () => setIsModalOpen(true), // 커스텀 모달 열기
                }}
            />

            <JobReorderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitReorder}
                jobs={jobs}
            />
        </>
    );
}
