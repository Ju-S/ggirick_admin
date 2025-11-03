import { useEffect, useState } from "react";
import InputFormModal from "@/components/commons/modals/InputFormModal.jsx";
import ConfirmModal from "@/components/commons/modals/ConfirmModal.jsx";
import AlertModal from "@/components/commons/modals/AlertModal.jsx";

import {
    workPolicyAllListAPI,
    insertAPI as insertPolicyAPI,
    updateAPI as updatePolicyAPI,
    deleteAPI as deletePolicyAPI,
} from "@/api/system/workPolicyAPI.js";

export default function WorkPolicyPage() {
    const [policies, setPolicies] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [alertInfo, setAlertInfo] = useState({ title: "", message: "", type: "info" });

    // 필드 정의
    const policyFields = [
        {
            name: "policyName",
            label: "정책명 (영문 2~10자)",
            type: "text",
            placeholder: "예: BASIC, FLEX1, REMOTE",
            required: true,
            hint: "영문 대/소문자 조합만 가능 (2~10자)",
        },
        {
            name: "workStartTime",
            label: "출근 시간",
            type: "time",
            required: true,
            hint: "예: 09:00",
        },
        {
            name: "workEndTime",
            label: "퇴근 시간",
            type: "time",
            required: true,
            hint: "예: 18:00",
        },
        {
            name: "effectiveDate",
            label: "시행일",
            type: "date",
            required: true,
            hint: "해당 정책이 적용되는 시작 날짜",
        },
        {
            name: "remark",
            label: "비고",
            type: "textarea",
            placeholder: "예: 시차출퇴근 적용 정책 / 본사 전용 등",
            hint: "선택 입력란입니다.",
        },
    ];

    // 초기 데이터 로드
    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await workPolicyAllListAPI();
            const list = Array.isArray(res.data) ? res.data : [];
            setPolicies(list);
        } catch (err) {
            console.error("근무정책 목록 조회 실패:", err);
        }
    };

    // 정책명 유효성 검사
    const validatePolicyName = (name) => /^[A-Za-z]{2,10}$/.test(name);

    // 등록
    const handleCreate = async (data, resetForm) => {
        data.policyName = data.policyName?.toUpperCase();

        if (!validatePolicyName(data.policyName)) {
            setAlertInfo({
                title: "입력 오류",
                message: "정책명은 영문 대문자 2~10자 이내로 입력해주세요.",
                type: "warn",
            });
            setIsAlertOpen(true);
            return;
        }

        try {
            await insertPolicyAPI(data);
            await fetchPolicies();
            setIsCreateModalOpen(false);
            resetForm();
            setAlertInfo({
                title: "등록 완료",
                message: `"${data.policyName}" 정책이 등록되었습니다.`,
                type: "info",
            });
        } catch {
            setAlertInfo({
                title: "등록 실패",
                message: "근무정책 등록 중 오류가 발생했습니다.",
                type: "error",
            });
        } finally {
            setIsAlertOpen(true);
        }
    };

    // 수정 모달에서 제출
    const handleUpdateSubmit = async (data, resetForm) => {
        const updatedData = {
            ...editingItem,
            ...data,
            policyName: data.policyName.toUpperCase(),
        };

        if (!validatePolicyName(updatedData.policyName)) {
            setAlertInfo({
                title: "입력 오류",
                message: "정책명은 영문 대문자 2~10자 이내로 입력해주세요.",
                type: "warn",
            });
            setIsAlertOpen(true);
            return;
        }

        try {
            await updatePolicyAPI(updatedData);
            await fetchPolicies();
            setIsEditModalOpen(false);
            setEditingItem(null);
            resetForm();
            setAlertInfo({
                title: "수정 완료",
                message: `"${updatedData.policyName}" 정책이 수정되었습니다.`,
                type: "info",
            });
        } catch {
            setAlertInfo({
                title: "수정 실패",
                message: "근무정책 수정 중 오류가 발생했습니다.",
                type: "error",
            });
        } finally {
            setIsAlertOpen(true);
        }
    };

    // 삭제
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deletePolicyAPI(deleteTarget.policyId);
            await fetchPolicies();
            setAlertInfo({
                title: "삭제 완료",
                message: `"${deleteTarget.policyName}" 정책이 삭제되었습니다.`,
                type: "info",
            });
        } catch {
            setAlertInfo({
                title: "삭제 실패",
                message: "근무정책 삭제 중 오류가 발생했습니다.",
                type: "error",
            });
        } finally {
            setIsConfirmOpen(false);
            setIsAlertOpen(true);
        }
    };

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body">
                {/* 상단 헤더 */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">근무정책 관리</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        정책 추가
                    </button>
                </div>

                {/* 테이블 */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                        <tr className="bg-base-300">
                            <th>정책명</th>
                            <th>근무시간</th>
                            <th>시행일</th>
                            <th>비고</th>
                            <th className="text-center w-1/5">관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {policies.map((item) => (
                            <tr key={item.policyId}>
                                <td>{item.policyName}</td>
                                <td>{item.workStartTime} ~ {item.workEndTime}</td>
                                <td>{item.effectiveDate}</td>
                                <td>{item.remark || "-"}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-xs btn-outline mr-2"
                                        onClick={() => {
                                            setEditingItem(item);
                                            setIsEditModalOpen(true);
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className="btn btn-xs btn-error text-white"
                                        onClick={() => {
                                            setDeleteTarget(item);
                                            setIsConfirmOpen(true);
                                        }}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 등록 모달 */}
            <InputFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
                title="근무정책 등록"
                fields={policyFields}
            />

            {/* 수정 모달 */}
            {editingItem && (
                <InputFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSubmit={handleUpdateSubmit}
                    title={`근무정책 수정 - ${editingItem.policyName}`} // 어떤 정책인지 표시
                    fields={policyFields.map((f) => ({
                        ...f,
                        defaultValue:
                            f.name === "policyName"
                                ? editingItem.policyName
                                : f.name === "workStartTime"
                                    ? editingItem.workStartTime
                                    : f.name === "workEndTime"
                                        ? editingItem.workEndTime
                                        : f.name === "effectiveDate"
                                            ? editingItem.effectiveDate
                                            : f.name === "remark"
                                                ? editingItem.remark || ""
                                                : "",
                        disabled: f.name === "policyName", // 정책명 수정 불가
                    }))}
                />
            )}

            {/* 삭제 확인 모달 */}
            {isConfirmOpen && deleteTarget && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleDelete}
                    title="정책 삭제"
                    message={`"${deleteTarget.policyName}" 정책을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`}
                    confirmText="삭제"
                    cancelText="취소"
                    type="delete"
                />
            )}

            {/* 알림 모달 */}
            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title={alertInfo.title}
                message={alertInfo.message}
                type={alertInfo.type}
            />
        </div>
    );
}
