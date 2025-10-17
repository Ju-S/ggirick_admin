import { useEffect, useState } from "react";
import DashboardTabs from "../../components/commons/DashboardTabs.jsx";
import InputFormModal from "../../components/commons/modals/InputFormModal.jsx";
import {employeeListAPI, insertAPI} from "../../api/hr/index.js";
import useEmployeeStore from "../../store/employeeStore.js";

export default function HRDashboard() {
    const [activeTab, setActiveTab] = useState("직원 관리");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    const { employeeList, setEmployeeList } = useEmployeeStore();

    // ✅ 직원 목록 자동 로드
    useEffect(() => {
        employeeListAPI()
            .then((res) => {
                if (res?.data) setEmployeeList(res.data);
            })
            .catch((err) => console.error("직원 목록 조회 실패:", err));
    }, []);

    // ✅ 직원 추가 처리
    const handleEmployeeInsert = (data, resetForm) => {
        insertAPI(data)
            .then((res) => {
                if (res.data != null) {
                    console.log("직원 등록 성공:", res.data);
                    setSuccessModalOpen(true);

                    // 등록된 직원 목록 새로 불러오기
                    employeeListAPI().then((listRes) => {
                        if (listRes.data != null) {
                            setEmployeeList(listRes.data);
                        }
                    });
                    // 입력 폼 초기화
                    resetForm();
                } else {
                    console.warn("등록 실패: 서버 응답 없음");
                    setErrorModalOpen(true);
                }
            })
            .catch((err) => {
                console.error("직원 등록 에러:", err);
                setErrorModalOpen(true);
            })
            .finally(() => {
                setIsModalOpen(false);
            });
    };

    // 직원 추가 필드
    const employeeFields = [
        { name: "name", label: "이름", type: "text", required: true },
        {
            name: "dept",
            label: "부서",
            type: "select",
            required: true,
            options: [
                { value: "dep001", label: "개발팀" },
                { value: "dep002", label: "인사팀" },
                { value: "dep003", label: "마케팅팀" },
            ],
        },
        {
            name: "job",
            label: "직급",
            type: "select",
            required: true,
            options: [
                { value: "ceo", label: "대표" },
                { value: "vp", label: "부사장" },
                { value: "dir", label: "부장" },
                { value: "mgr", label: "과장" },
                { value: "stf", label: "사원" },
            ],
        },
        {
            name: "organization",
            label: "조직",
            type: "select",
            required: true,
            options: [
                { value: "org001", label: "조직1" },
                { value: "org002", label: "조직2" }
            ],
        },
        { name: "hireDate", label: "입사일", type: "date", required: true },
        { name: "salary", label: "연봉", type: "text", required: true },
    ];

    return (
        <main className="min-h-screen p-6 pt-20 md:ml-64 bg-base-200 text-base-content">
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[{ title: "전체 직원", value: `${employeeList.length}명`, sub: "활성 직원 수" },
                    { title: "부서 수", value: "3개", sub: "운영 중인 부서" },
                    { title: "대기 중인 휴가", value: "1건", sub: "승인 대기" },
                    { title: "평균 급여", value: "850만원", sub: "월 평균" },
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

            <DashboardTabs tabs={["직원 관리", "부서 관리", "휴가 관리", "급여 관리", "조직 관리", "조직도"]}
                           activeTab={activeTab} setActiveTab={setActiveTab} />

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
                                    <tr key={emp.empNo} className="hover">
                                        <td>{emp.name}</td>
                                        <td>{emp.empNo}</td>
                                        <td>{emp.dept}</td>
                                        <td>{emp.position}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.hireDate}</td>
                                        <td>{emp.salary}</td>
                                        <td className="text-center">
                                            <span className="badge badge-success">{emp.status || "재직"}</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* 직원 추가 모달 */}
            <InputFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleEmployeeInsert}
                title="직원 추가"
                fields={employeeFields}
            />

            {/* 성공 / 실패 모달 */}
            {successModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box text-center">
                        <h3 className="font-bold text-lg text-green-600">직원 등록 완료</h3>
                        <p className="py-3 text-gray-600">새로운 직원이 성공적으로 등록되었습니다.</p>
                        <div className="modal-action flex justify-center">
                            <button className="btn btn-success text-white" onClick={() => setSuccessModalOpen(false)}>
                                확인
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setSuccessModalOpen(false)}>close</button>
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
