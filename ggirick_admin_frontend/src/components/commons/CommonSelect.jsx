import React from "react";

/**
 * DaisyUI 스타일 공통 셀렉트 컴포넌트
 * { value, label } 또는 { code, name } 형태 모두 지원
 */
export default function CommonSelect({
                                         name,
                                         label,
                                         value,
                                         options = [],
                                         onChange,
                                         required = false,
                                         error = false,
                                         innerRef = null,
                                     }) {
    return (
        <div className="w-full overflow-visible">
            {label && (
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
            )}
            <select
                ref={innerRef}
                name={name}
                value={value || ""}
                onChange={(e) => onChange(name, e.target.value)}
                required={required}
                className={`select select-bordered w-full transition-all overflow-visible text-base-content ${
                    error ? "border-red-500 ring-1 ring-red-300" : ""
                }`}
            >
                <option value="">{label} 선택</option>

                {options
                    .filter((opt) => opt && (opt.value || opt.code))
                    .map((opt, idx) => (
                        <option
                            key={`${opt.value || opt.code}-${idx}`}
                            value={opt.value || opt.code}
                        >
                            {opt.label || opt.name}
                        </option>
                    ))}
            </select>
        </div>
    );
}
