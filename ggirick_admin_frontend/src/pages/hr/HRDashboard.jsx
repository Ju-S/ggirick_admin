import { useEffect, useMemo, useState } from "react";

import DashboardTabs from "../../components/commons/DashboardTabs.jsx";
import InputFormModal from "../../components/commons/modals/InputFormModal.jsx";
import EditEmployeeModal from "../../components/commons/modals/EditEmployeeModal.jsx";

import {
    employeeAllListAPI,
    insertAPI,
    getDepartmentsAPI,
    getJobsAPI,
    getOrganizationsAPI,
    getAllEmploymentStatusesAPI,
} from "@/api/hr/index.js";

import useEmployeeStore from "../../store/hr/employeeStore.js";
import useOrganizationStore from "@/store/hr/organizationStore.js";
import useJobStore from "@/store/hr/jobStore.js";
import useDepartmentStore from "@/store/hr/departmentStore.js";
import useEmploymentStatusStore from "@/store/hr/employmentStatusStore.js";

import DeptManage from "@/pages/hr/DeptManage.jsx";
import OrgManage from "@/pages/hr/OrgManage.jsx";
import JobManage from "@/pages/hr/JobManage.jsx";

export default function HRDashboard() {
    // 선택한 탭
    const [activeTab, setActiveTab] = useState("직원 관리");

    // 모달 상태들
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // 모달 데이터 상태
    const [pendingData, setPendingData] = useState(null);
    const [resultData, setResultData] = useState(null);

    // 스토어
    const { departments, setDepartments } = useDepartmentStore();
    const { jobs, setJobs } = useJobStore();
    const { organizations, setOrganizations } = useOrganizationStore();
    const { employmentStatuses, setEmploymentStatuses } = useEmploymentStatusStore();
    const { employeeList, setEmployeeList, setEmployee } = useEmployeeStore();

    // 직원 목록 자동 로드
    useEffect(() => {
        employeeAllListAPI()
            .then((res) => {
                if (res?.data) setEmployeeList(res.data);
            })
            .catch((err) => console.error("직원 목록 조회 실패:", err));
    }, []);

    // 부서 / 직급 / 조직 / 재직 상태 목록 초기 로드
    useEffect(() => {
        if (!departments.length)
            getDepartmentsAPI().then((res) => setDepartments(res.data || []));
        if (!jobs.length)
            getJobsAPI().then((res) => setJobs(res.data || []));
        if (!organizations.length)
            getOrganizationsAPI().then((res) => setOrganizations(res.data || []));
        if (!employmentStatuses.length)
            getAllEmploymentStatusesAPI().then((res) => setEmploymentStatuses(res.data || []));
    }, []);

    // 행 클릭 시 수정 모달 열기
    const handleRowClick = async (employee) => {
        if (!departments.length)
            await getDepartmentsAPI().then((res) => setDepartments(res.data || []));
        if (!jobs.length)
            await getJobsAPI().then((res) => setJobs(res.data || []));
        if (!organizations.length)
            await getOrganizationsAPI().then((res) => setOrganizations(res.data || []));
        if (!employmentStatuses.length)
            await getAllEmploymentStatusesAPI().then((res) => setEmploymentStatuses(res.data || []));

        setEmployee(employee);
        setIsEditModalOpen(true);
    };

    // 직원 추가 - 1단계
    const handleEmployeeInsert = (data, resetForm) => {
        setPendingData(data);
        setConfirmModalOpen(true);
        handleEmployeeInsert.resetForm = resetForm;
    };

    // 직원 추가 - 2단계
    const handleConfirmInsert = () => {
        insertAPI(pendingData)
            .then((res) => {
                if (res.data) {
                    setResultData(res.data);
                    setResultModalOpen(true);

                    employeeAllListAPI().then((listRes) => {
                        if (listRes.data) setEmployeeList(listRes.data);
                    });

                    if (handleEmployeeInsert.resetForm) handleEmployeeInsert.resetForm();
                } else {
                    setErrorModalOpen(true);
                }
            })
            .catch(() => setErrorModalOpen(true))
            .finally(() => {
                setConfirmModalOpen(false);
                setIsModalOpen(false);
            });
    };

    // 직원 등록 필드 구성
    const employeeFields = useMemo(
        () => [
            { name: "name", label: "이름", type: "text", required: true },
            {
                name: "departmentCode",
                label: "부서",
                type: "select",
                required: true,
                options: departments || [],
            },
            {
                name: "jobCode",
                label: "직급",
                type: "select",
                required: true,
                options: jobs || [],
            },
            {
                name: "organizationCode",
                label: "조직",
                type: "select",
                required: true,
                options: organizations || [],
            },
            { name: "hireDate", label: "입사일", type: "date", required: true },
            { name: "salary", label: "연봉", type: "text", required: true },
        ],
        [departments, jobs, organizations]
    );

    return (
        <main className="min-h-screen p-6 pt-20 md:ml-64 bg-base-200 text-base-content">
            {/* 요약 카드 */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    { title: "전체 직원", value: `${employeeList.length}명`, sub: "활성 직원 수" },
                    { title: "부서 수", value: `${departments.length}개`, sub: "운영 중인 부서" },
                    { title: "조직 수", value: `${organizations.length}개`, sub: "운영 중인 조직" }
                ].map((card, i) => (
                    <div key={i} className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="card-body p-4">
                            <span className="text-sm opacity-60">{card.title}</span>
                            <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
                            <span className="text-xs opacity-50">{card.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 탭 */}
            <DashboardTabs
                tabs={["직원 관리", "부서 관리", "조직 관리", "직급 관리"]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* 직원 관리 탭 */}
            {activeTab === "직원 관리" && (
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">직원 목록</h2>
                            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                                직원 추가
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                <tr className="bg-base-300">
                                    <th>이름</th>
                                    <th>사번</th>
                                    <th>부서</th>
                                    <th>직급</th>
                                    <th>이메일</th>
                                    <th>입사일</th>
                                    <th>급여</th>
                                    <th className="text-center">상태</th>
                                </tr>
                                </thead>
                                <tbody>
                                {employeeList.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        className="hover cursor-pointer"
                                        onClick={() => handleRowClick(emp)}
                                    >
                                        <td>{emp.name}</td>
                                        <td>{emp.id}</td>
                                        <td>{emp.departmentName}</td>
                                        <td>{emp.jobName}</td>
                                        <td>{emp.email}</td>
                                        <td>{new Date(emp.hireDate).toLocaleDateString("ko-KR")}</td>
                                        <td>{emp.salary}</td>
                                        <td className="text-center">
                                                <span className="badge badge-success">
                                                    {emp.statusName || "재직"}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "부서 관리" && <DeptManage />}
            {activeTab === "조직 관리" && <OrgManage />}
            {activeTab === "직급 관리" && <JobManage />}

            {/* 직원 수정 모달 */}
            <EditEmployeeModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                departments={departments}
                jobs={jobs}
                organizations={organizations}
                employmentStatuses={employmentStatuses}
            />

            {/* 직원 추가 모달 */}
            <InputFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleEmployeeInsert}
                title="직원 추가"
                fields={employeeFields}
            />

            {/* 등록 확인, 결과, 실패 모달은 그대로 유지 */}
            {confirmModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box bg-base-100 max-w-md">
                        <h3 className="text-lg font-bold mb-4">입력 내용 확인</h3>
                        <p className="text-sm text-gray-500 mb-3">다음 정보로 직원을 등록합니다.</p>
                        {(() => {
                            const deptObj = departments?.find(d => d.code === pendingData?.departmentCode);
                            const jobObj = jobs?.find(j => j.code === pendingData?.jobCode);
                            const orgObj = organizations?.find(o => o.code === pendingData?.organizationCode);

                            return (
                                <ul className="space-y-1 text-sm">
                                    <li><strong>이름:</strong> {pendingData?.name}</li>
                                    <li>
                                        <strong>조직:</strong> {orgObj ? `${orgObj.name} (${orgObj.code})` : "-"}
                                    </li>
                                    <li>
                                        <strong>부서:</strong> {deptObj ? `${deptObj.name} (${deptObj.code})` : "-"}
                                    </li>
                                    <li>
                                        <strong>직급:</strong> {jobObj ? `${jobObj.name} (${jobObj.code})` : "-"}
                                    </li>
                                    <li><strong>입사일:</strong> {pendingData?.hireDate}</li>
                                    <li><strong>연봉:</strong> {pendingData?.salary}</li>
                                </ul>
                            );
                        })()}
                        <div className="flex justify-end gap-2 mt-6">
                            <button className="btn btn-ghost" onClick={() => setConfirmModalOpen(false)}>취소</button>
                            <button className="btn btn-primary" onClick={handleConfirmInsert}>확인</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setConfirmModalOpen(false)}>close</button>
                    </form>
                </dialog>
            )}

            {resultModalOpen && resultData && (
                <dialog className="modal modal-open">
                    <div className="modal-box bg-base-100 max-w-md relative">
                        <button
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setResultModalOpen(false)}
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold text-center mb-2 text-error">
                            ⚠️ 이 창을 닫으면 초기 비밀번호를 다시 확인할 수 없습니다.
                        </h3>
                        <div className="border-t border-gray-200 my-3" />
                        <div className="text-sm space-y-2">
                            <p><strong>이름:</strong> {resultData.name}</p>
                            <p><strong>조직 / 부서 / 직급:</strong> {`${resultData.organizationName} / ${resultData.departmentName} / ${resultData.jobName}`}</p>
                            <p><strong>사원번호:</strong> {resultData.empId}</p>
                            <div className="flex items-center justify-between">
                                <p><strong>초기 비밀번호:</strong> {resultData.tempPw}</p>
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => navigator.clipboard.writeText(resultData.tempPw)}
                                >
                                    📋 복사
                                </button>
                            </div>
                        </div>
                        <div className="modal-action flex justify-center mt-6">
                            <button className="btn btn-primary" onClick={() => setResultModalOpen(false)}>
                                완료
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop cursor-not-allowed" onClick={(e) => e.preventDefault()}>
                        <button disabled>close</button>
                    </form>
                </dialog>
            )}

            {errorModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box text-center">
                        <h3 className="font-bold text-lg text-error">직원 등록 실패</h3>
                        <p className="py-3 text-gray-500">서버 오류 또는 입력값이 올바르지 않습니다.</p>
                        <div className="modal-action flex justify-center">
                            <button className="btn btn-error text-white" onClick={() => setErrorModalOpen(false)}>
                                확인
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setErrorModalOpen(false)}>close</button>
                    </form>
                </dialog>
            )}
        </main>
    );
}
