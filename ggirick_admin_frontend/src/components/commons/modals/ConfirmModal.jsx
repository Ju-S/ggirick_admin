/**
 * 🧾 공용 확인 모달 (삭제, 승인, 반려 등)
 *
 * @param {boolean} isOpen - 모달 열림 여부
 * @param {function} onClose - 닫기 함수
 * @param {function} onConfirm - 확인 버튼 클릭 시 실행 함수 (axios 포함 가능)
 * @param {string} title - 모달 제목
 * @param {string} message - 본문 메시지
 * @param {string} confirmText - 확인 버튼 텍스트 (기본: "확인")
 * @param {string} cancelText - 취소 버튼 텍스트 (기본: "취소")
 * @param {string} type - 모달 타입 ("delete" | "approve" | "reject" | "warn") → 색상 스타일 자동 변경
 */

export default function ConfirmModal({
                                         isOpen,
                                         onClose,
                                         onConfirm,
                                         title = "확인",
                                         message = "이 작업을 진행하시겠습니까?",
                                         confirmText = "확인",
                                         cancelText = "취소",
                                         type = "warn", // 기본 스타일: 경고
                                     }) {
    if (!isOpen) return null;

    // 버튼 스타일 자동 지정
    const colorClass =
        type === "delete"
            ? "btn-error"
            : type === "approve"
                ? "btn-success"
                : type === "reject"
                    ? "btn-warning"
                    : "btn-primary";

    return (
        <dialog className="modal modal-open">
            <div className="modal-box bg-base-100 max-w-sm text-center">
                {/* 제목 */}
                <h3 className="text-lg font-bold mb-2">{title}</h3>

                {/* 메시지 */}
                <p className="text-sm text-gray-500 mb-6 whitespace-pre-line">{message}</p>

                {/* 버튼 영역 */}
                <div className="flex justify-center gap-3">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`btn ${colorClass}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            {/* 배경 클릭 시 닫기 */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
