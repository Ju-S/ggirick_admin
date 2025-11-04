import { useEffect, useState } from "react";
import InputFormModal from "@/components/commons/modals/InputFormModal.jsx";
import ConfirmModal from "@/components/commons/modals/ConfirmModal.jsx";
import AlertModal from "@/components/commons/modals/AlertModal.jsx";

import {
    holidayAllListAPI,
    insertAPI as insertHolidayAPI,
    updateAPI as updateHolidayAPI,
    deleteAPI as deleteHolidayAPI,
} from "@/api/system/holidayAPI.js";

export default function HolidayPage() {
    // 상태 정의
    const [holidays, setHolidays] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [alertInfo, setAlertInfo] = useState({ title: "", message: "", type: "info" });

    // 신규 등록용 필드
    const holidayFields = [
        { name: "calDate", label: "날짜", type: "date", required: true },
        {
            name: "isWorkday",
            label: "근무일 여부",
            type: "select",
            options: [
                { label: "근무일(Y)", value: "Y" },
                { label: "휴일(N)", value: "N" },
            ],
            required: true,
        },
        {
            name: "holidayType",
            label: "휴일 구분",
            type: "select",
            options: [
                { label: "공휴일(PUBLIC)", value: "PUBLIC" },
                { label: "대체휴일(SUBSTITUTE)", value: "SUBSTITUTE" },
                { label: "회사휴일(COMPANY)", value: "COMPANY" },
            ],
            required: true,
        },
        // 설명란도 필수 입력하게 설정
        { name: "description", label: "설명", type: "textarea", required: true },
    ];

    // 수정용 필드 (holidayType 고정)
    const editFields = [
        { name: "calDate", label: "날짜", type: "date", required: true },
        { name: "description", label: "설명", type: "textarea" },
    ];

    // 최초 조회
    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        try {
            const res = await holidayAllListAPI();
            setHolidays(res.data || []);
        } catch (err) {
            console.error("휴일 목록 조회 실패:", err);
        }
    };

    // 등록
    const handleCreate = async (data, resetForm) => {
        try {
            await insertHolidayAPI(data);
            await fetchHolidays();
            setIsModalOpen(false);
            resetForm();
            setAlertInfo({ title: "등록 완료", message: "휴일이 등록되었습니다.", type: "info" });
        } catch (err) {
            if (err.response?.status === 409) {
                setAlertInfo({
                    title: "중복 날짜",
                    message: "이미 등록된 날짜입니다.",
                    type: "warn",
                });
            } else {
                setAlertInfo({
                    title: "등록 실패",
                    message: "휴일 등록 중 오류가 발생했습니다.",
                    type: "error",
                });
            }
        } finally {
            setIsAlertOpen(true);
        }
    };

    // 수정
    const handleUpdate = async (data) => {
        try {
            await updateHolidayAPI({ ...editTarget, ...data });
            await fetchHolidays();
            setIsEditModalOpen(false);
            setEditTarget(null);
            setAlertInfo({ title: "수정 완료", message: "휴일 정보가 수정되었습니다.", type: "info" });
        } catch (err) {
            setAlertInfo({ title: "수정 실패", message: "휴일 수정 중 오류가 발생했습니다.", type: "error" });
        } finally {
            setIsAlertOpen(true);
        }
    };

    // 삭제
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteHolidayAPI(deleteTarget.id);
            await fetchHolidays();
            setAlertInfo({ title: "삭제 완료", message: "휴일이 삭제되었습니다.", type: "info" });
        } catch {
            setAlertInfo({ title: "삭제 실패", message: "휴일 삭제 중 오류가 발생했습니다.", type: "error" });
        } finally {
            setIsConfirmOpen(false);
            setIsAlertOpen(true);
        }
    };

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">휴일 관리</h2>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        휴일 추가
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                        <tr className="bg-base-300">
                            <th>날짜</th>
                            <th>근무일 여부</th>
                            <th>휴일 구분</th>
                            <th>설명</th>
                            <th className="text-center w-1/5">관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {holidays.map((item) => (
                            <tr key={item.id}>
                                <td>{item.calDate}</td>
                                <td>{item.isWorkday === "Y" ? "근무일" : "휴일"}</td>
                                <td>{item.holidayType}</td>
                                <td>{item.description || "-"}</td>
                                <td className="text-center">
                                    {["PUBLIC", "SUBSTITUTE"].includes(item.holidayType) ? (
                                        <span className="text-sm text-gray-400 italic">수정/삭제 불가</span>
                                    ) : (
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="btn btn-xs btn-outline"
                                                onClick={() => {
                                                    setEditTarget(item);
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
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 등록 모달 */}
            <InputFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
                title="휴일 등록"
                fields={holidayFields}
            />

            {/* 수정 모달 */}
            {editTarget && (
                <InputFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdate}
                    title="휴일 수정"
                    fields={editFields}
                    defaultValues={{
                        calDate: editTarget.calDate,
                        description: editTarget.description,
                    }}
                />
            )}

            {/* 삭제 확인 모달 */}
            {isConfirmOpen && deleteTarget && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleDelete}
                    title="휴일 삭제"
                    message={`"${deleteTarget.description || deleteTarget.calDate}" 휴일을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`}
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
