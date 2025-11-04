// src/components/hr/CommonManagePage.jsx
import { useState } from "react";
import InputFormModal from "../../components/commons/modals/InputFormModal.jsx";
import ConfirmModal from "../../components/commons/modals/ConfirmModal.jsx";
import AlertModal from "../../components/commons/modals/AlertModal.jsx";

export default function CommonManagePage({
                                             entityName, // "부서" / "조직" / "직급"
                                             dataList, // 현재 목록 배열
                                             setDataList, // 상태 갱신 함수
                                             fields, // InputFormModal 필드 설정
                                             api, // { insert, update, delete, openCustomModal }
                                         }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [alertInfo, setAlertInfo] = useState({
        title: "",
        message: "",
        type: "info",
    });

    // 등록 (기본 모달에서만 사용)
    const handleCreate = async (data, resetForm) => {
        // 입력값 정리 (공백 제거 + 대문자 변환)
        const payload = {
            code: (data.code || "").trim().toUpperCase(),
            name: (data.name || "").trim(),
        };

        // 직급의 경우 rankOrder 자동 부여
        if (entityName === "직급" && !payload.rankOrder) {
            payload.rankOrder = dataList.length + 1;
        }

        // 필수 입력값 체크
        if (!payload.code || !payload.name) {
            setAlertInfo({
                title: "입력 오류",
                message: `${entityName} 코드와 이름을 모두 입력해주세요.`,
                type: "warn",
            });
            setIsAlertOpen(true);
            return;
        }

        // 엔터티별 코드 형식 제한
        let codeRegex;
        let formatHint = "";

        if (entityName === "조직") {
            codeRegex = /^ORG\d{3}$/; // ORG + 숫자 3자리
            formatHint = '조직 코드는 "ORG001" 형태여야 합니다.';
        } else if (entityName === "부서") {
            codeRegex = /^DEP\d{3}$/; // DEP + 숫자 3자리
            formatHint = '부서 코드는 "DEP001" 형태여야 합니다.';
        } else if (entityName === "직급") {
            codeRegex = /^[A-Z]+$/; // 영어만
            formatHint = '직급 코드는 영어 대문자만 입력 가능합니다. (예: CEO, DEVLEAD)';
        } else {
            // 기본적으로 영문+숫자 허용
            codeRegex = /^[A-Z0-9]+$/;
            formatHint = '코드는 영어 대문자와 숫자만 입력할 수 있습니다.';
        }

        if (!codeRegex.test(payload.code)) {
            setAlertInfo({
                title: "입력 오류",
                message: formatHint,
                type: "warn",
            });
            setIsAlertOpen(true);
            return;
        }

        // 등록 처리
        try {
            const res = await api.insert(payload);
            if (res?.status === 200) {
                setDataList([...dataList, payload]);
                setAlertInfo({
                    title: `${entityName} 등록 완료`,
                    message: `${entityName} "${payload.code}" 등록이 완료되었습니다.`,
                    type: "info",
                });
            }
        } catch (err) {
            // 409 Conflict → 중복 코드
            if (err.response?.status === 409) {
                setAlertInfo({
                    title: "중복 코드",
                    message: `${entityName} 코드 "${payload.code}"는 이미 존재합니다.`,
                    type: "warn",
                });
            } else {
                // 그 외 서버 오류
                setAlertInfo({
                    title: `${entityName} 등록 실패`,
                    message: `${entityName} 등록 중 오류가 발생했습니다.`,
                    type: "error",
                });
            }
        } finally {
            setIsCreateModalOpen(false);
            resetForm();
            setIsAlertOpen(true);
        }
    };

    // 수정
    const handleUpdate = async (item) => {
        try {
            const res = await api.update(item);
            if (res.status === 200) {
                const updated = dataList.map((d, i) =>
                    d.code === item.code
                        ? {
                            ...d,
                            name: item.name,
                            rankOrder:
                                d.rankOrder !== undefined
                                    ? d.rankOrder
                                    : i + 1,
                        }
                        : d
                );

                // 직급이면 rankOrder 순으로 재정렬
                const sorted =
                    entityName === "직급"
                        ? [...updated].sort(
                            (a, b) => (a.rankOrder ?? 0) - (b.rankOrder ?? 0)
                        )
                        : updated;

                setDataList(sorted);
                setAlertInfo({
                    title: "수정 완료",
                    message: `${entityName} "${item.code}" 수정 완료.`,
                    type: "info",
                });
                setEditingItem(null);
            }
        } catch {
            setAlertInfo({
                title: "수정 실패",
                message: `${entityName} 수정 중 오류가 발생했습니다.`,
                type: "error",
            });
        } finally {
            setIsAlertOpen(true);
        }
    };

    // 삭제
    const handleDelete = async () => {
        try {
            const res = await api.delete(deleteTarget.code);

            // 커스텀 delete가 직접 alert 띄운 경우에는 return
            if (res === "CUSTOM_HANDLED") return;

            if (res?.status === 200) {
                const filtered = dataList.filter((d) => d.code !== deleteTarget.code);
                setDataList(filtered);
                setAlertInfo({
                    title: "삭제 완료",
                    message: `${entityName} "${deleteTarget.name}"이(가) 삭제되었습니다.`,
                    type: "info",
                });
            }
        } catch {
            setAlertInfo({
                title: "삭제 실패",
                message: `${entityName} 삭제 중 문제가 발생했습니다.`,
                type: "error",
            });
        } finally {
            if (!api.delete.name.includes("handleDeleteJob")) {
                setIsAlertOpen(true);
            }
            setIsConfirmOpen(false);
        }
    };

    // 테이블 렌더링
    const renderRows = () => {
        let sorted = [];

        if (entityName === "직급") {
            // rankOrder 기준 정렬 (값 없으면 맨 뒤로)
            sorted = [...dataList].sort(
                (a, b) => Number(a.rankOrder ?? Infinity) - Number(b.rankOrder ?? Infinity)
            );
        } else {
            // code 기준 정렬
            sorted = [...dataList].sort((a, b) =>
                (a.code || "").localeCompare(b.code || "")
            );
        }

        return sorted.map((item, index) => {
            const order =
                item.rankOrder !== undefined && item.rankOrder !== null
                    ? Number(item.rankOrder)
                    : index + 1;

            return (
                <tr key={item.code}>
                    <td className="text-center font-mono">
                        {editingItem?.code === item.code ? (
                            <div className="flex justify-center gap-2">
                                <span className="text-gray-400">{item.code}</span>
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={(e) =>
                                        setEditingItem({
                                            ...editingItem,
                                            name: e.target.value,
                                        })
                                    }
                                    className="input input-bordered input-sm w-40 text-center"
                                />
                            </div>
                        ) : entityName === "직급" ? (
                            `${order}. ${item.code} / ${item.name}`
                        ) : (
                            `${item.code} / ${item.name}`
                        )}
                    </td>
                    <td className="text-center">
                        {editingItem?.code === item.code ? (
                            <>
                                <button
                                    className="btn btn-xs btn-success mr-2"
                                    onClick={() => handleUpdate(editingItem)}
                                >
                                    완료
                                </button>
                                <button
                                    className="btn btn-xs btn-ghost"
                                    onClick={() => setEditingItem(null)}
                                >
                                    취소
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn btn-xs btn-outline mr-2"
                                    onClick={() => setEditingItem(item)}
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
                            </>
                        )}
                    </td>
                </tr>
            );
        });
    };

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{entityName} 관리</h2>

                    {/* 수정된 부분: 커스텀 모달 or 기본 모달 */}
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            if (api?.openCustomModal) {
                                api.openCustomModal(); // 커스텀 모달 열기
                            } else {
                                setIsCreateModalOpen(true); // 기본 모달
                            }
                        }}
                    >
                        {entityName} 생성
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                        <tr className="bg-base-300">
                            <th className="text-center">
                                코드 / {entityName}명
                            </th>
                            <th className="text-center w-1/4">관리</th>
                        </tr>
                        </thead>
                        <tbody>{renderRows()}</tbody>
                    </table>
                </div>
            </div>

            {/* 기본 모달 (직급 외에서만 사용) */}
            <InputFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
                title={`${entityName} 생성`}
                fields={fields}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title={`${entityName} 삭제`}
                message={`${entityName} "${deleteTarget?.name}" (${deleteTarget?.code}) 를 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="delete"
            />

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
