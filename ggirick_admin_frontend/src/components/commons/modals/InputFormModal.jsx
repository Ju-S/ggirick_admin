import React, {useRef, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * 📦 공용 폼 모달 컴포넌트 (form 태그 제거 버전)
 */
export default function InputFormModal({isOpen, onClose, onSubmit, title, fields = []}) {
    const [formData, setFormData] = useState({});
    const [openPicker, setOpenPicker] = useState(null);
    const [errorField, setErrorField] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const inputRefs = useRef({});

    // ✅ 오늘 날짜 (전역 사용)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleChange = (name, value) => {
        setFormData((prev) => ({...prev, [name]: value}));
        if (name === errorField) {
            setErrorField(null);
            setErrorMsg("");
        }
    };

    /** ✅ 유효성 검사 */
    const handleConfirm = () => {
        const nameRegex = /^(?:[가-힣]{2,8}|[a-zA-Z]{2,10})$/;
        const salaryRegex = /^\d{1,3}(,\d{3})*$|^\d{4,8}$/;

        for (const field of fields) {
            const value = formData[field.name];

            // ✅ 필수 입력 확인
            if (field.required && (!value || value === "")) {
                setErrorField(field.name);
                setErrorMsg(`${field.label}을(를) 입력해주세요.`);
                inputRefs.current[field.name]?.focus();
                return;
            }

            // ✅ 이름 정규식 검사
            if (field.name === "name" && !nameRegex.test(value)) {
                setErrorField(field.name);
                setErrorMsg("이름은 한글 2~8자 또는 영어 2~10자만 가능합니다.");
                inputRefs.current[field.name]?.focus();
                return;
            }

            // ✅ 연봉 정규식 검사
            if (field.name === "salary" && !salaryRegex.test(value)) {
                setErrorField(field.name);
                setErrorMsg("연봉은 숫자 4~8자리 또는 천단위 콤마 형식으로 입력해주세요. (예: 2,500)");
                inputRefs.current[field.name]?.focus();
                return;
            }

            // ✅ 날짜 검사 — 오늘 이전 날짜 불가
            if (field.name === "hireDate") {
                const dateValue = new Date(value);
                if (isNaN(dateValue.getTime())) {
                    setErrorField(field.name);
                    setErrorMsg("유효한 날짜를 선택해주세요.");
                    inputRefs.current[field.name]?.focus();
                    return;
                }
                dateValue.setHours(0, 0, 0, 0);

                if (dateValue < today) {
                    setErrorField(field.name);
                    setErrorMsg("입사일은 오늘 이후 날짜만 선택할 수 있습니다.");
                    inputRefs.current[field.name]?.focus();
                    return;
                }
            }
        }

        // ✅ 모든 통과 시
        setErrorField(null);
        setErrorMsg("");

        // ✅ 등록 후 입력폼 초기화 함수
        const resetForm = () => {
            setFormData({});
            Object.keys(inputRefs.current).forEach((key) => {
                if (inputRefs.current[key]) inputRefs.current[key].value = "";
            });
        };

        onSubmit(formData, resetForm); // 👈 resetForm을 같이 넘김
        onClose();

    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box bg-base-100 max-w-md min-h-[200px] relative">
                <h3 className="text-lg font-bold mb-1">{title}</h3>

                {/* 🔴 에러 메시지 */}
                {errorMsg && (
                    <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm font-medium">
                        ⚠️ {errorMsg}
                    </div>
                )}

                <p className="text-sm mb-4 text-gray-500">입력 정보를 작성하거나 수정하세요.</p>

                {/* 입력 필드 목록 */}
                <div className="space-y-3">
                    {fields.map((field) => {
                        const isError = field.name === errorField;

                        // ✅ 셀렉트 박스
                        if (field.type === "select") {
                            return (
                                <select
                                    key={field.name}
                                    ref={(el) => (inputRefs.current[field.name] = el)}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className={`select select-bordered w-full transition-all ${
                                        isError ? "border-red-500 ring-1 ring-red-300" : ""
                                    }`}
                                    required={field.required}
                                >
                                    <option value="">{field.label} 선택</option>
                                    {field.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            );
                        }

                        // ✅ 날짜 선택
                        if (field.type === "date") {
                            return (
                                <div key={field.name} className="relative">
                                    <DatePicker
                                        selected={formData[field.name] ? new Date(formData[field.name]) : null}
                                        onChange={(date) => {
                                            handleChange(field.name, date);
                                            setOpenPicker(null);
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText={field.label}
                                        className={`input input-bordered w-full transition-all ${
                                            isError ? "border-red-500 ring-1 ring-red-300" : ""
                                        }`}
                                        minDate={today}
                                        showMonthYearDropdown
                                        open={openPicker === field.name}
                                        onClickOutside={() => setOpenPicker(null)}
                                        onChangeRaw={(e) => handleChange(field.name, e.target.value)}
                                        popperPlacement="bottom-start"   // 👈 모달 아래로 띄움
                                        calendarClassName="scale-[0.9] origin-top font-normal"
                                        popperClassName="z-[9999]"
                                        popperOptions={{
                                            modifiers: [
                                                {
                                                    name: "offset",
                                                    options: {offset: [0, 8]}, // 살짝 띄우기
                                                },
                                            ],
                                        }}
                                    />


                                    {/* 📅 아이콘 클릭 시 달력 열기 */}
                                    <svg
                                        onClick={() =>
                                            setOpenPicker(openPicker === field.name ? null : field.name)
                                        }
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            );
                        }

                        // ✅ 연봉 입력칸 (만원 단위 표시)
                        if (field.name === "salary") {
                            return (
                                <div key={field.name} className="relative">
                                    <input
                                        ref={(el) => (inputRefs.current[field.name] = el)}
                                        type="text"
                                        placeholder={field.label}
                                        value={formData[field.name] || ""}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        className={`input input-bordered w-full pr-12 transition-all ${
                                            isError ? "border-red-500 ring-1 ring-red-300" : ""
                                        }`}
                                        required={field.required}
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-500 select-none">
                                        만원
                                    </span>
                                </div>
                            );
                        }

                        // ✅ 일반 input
                        return (
                            <input
                                key={field.name}
                                ref={(el) => (inputRefs.current[field.name] = el)}
                                type={field.type}
                                placeholder={field.label}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                className={`input input-bordered w-full transition-all ${
                                    isError ? "border-red-500 ring-1 ring-red-300" : ""
                                }`}
                                required={field.required}
                            />
                        );
                    })}
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-end gap-2 pt-6">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        취소
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleConfirm}>
                        확인
                    </button>
                </div>
            </div>

            {/* 배경 클릭 시 닫힘 */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
