import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";

export default function JobReorderModal({ isOpen, onClose, onSubmit, jobs }) {
    const [localList, setLocalList] = useState([]);
    const [newJob, setNewJob] = useState({ code: "", name: "" });

    useEffect(() => {
        if (jobs) {
            const sorted = [...jobs].sort((a, b) => a.rankOrder - b.rankOrder);
            setLocalList(sorted);
        }
    }, [jobs]);

    // 드래그 종료 시 순서 재정렬
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(localList);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        const reordered = items.map((j, i) => ({ ...j, rankOrder: i + 1 }));
        setLocalList(reordered);
    };

    // 코드 입력 시 영어 대문자만 (2~6자 제한)
    const handleCodeChange = (e) => {
        const input = e.target.value.toUpperCase();
        const filtered = input.replace(/[^A-Z]/g, ""); // 영어 대문자만 허용
        if (filtered.length <= 6) {
            setNewJob({ ...newJob, code: filtered });
        }
    };

    // 새 직급 추가 (정렬 포함)
    const handleAddJob = () => {
        const { code, name } = newJob;

        if (!code.trim() || !name.trim()) {
            alert("코드와 이름을 모두 입력하세요.");
            return;
        }

        if (code.length < 2 || code.length > 6) {
            alert("직급 코드는 영어 대문자 2~6자여야 합니다.");
            return;
        }

        if (localList.some((j) => j.code === code)) {
            alert("이미 존재하는 코드입니다.");
            return;
        }

        const added = [
            ...localList,
            { ...newJob, rankOrder: localList.length + 1, isNew: true },
        ];

        // 추가 후 rankOrder 기준 정렬 보장
        const reordered = added
            .map((j, i) => ({ ...j, rankOrder: i + 1 }))
            .sort((a, b) => a.rankOrder - b.rankOrder);

        setLocalList(reordered);
        setNewJob({ code: "", name: "" });
    };

    const handleSave = () => {
        const reordered = localList.map((j, i) => ({ ...j, rankOrder: i + 1 }));
        onSubmit(reordered);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]"
            style={{ backdropFilter: "blur(2px)" }}
        >
            <div className="bg-base-100 rounded-xl shadow-2xl w-11/12 max-w-2xl p-6 relative">
                <h3 className="font-bold text-lg mb-3">직급 추가 및 순서 변경</h3>
                <p className="text-sm text-gray-500 mb-4">
                    새 직급을 입력하고, 원하는 위치로 드래그해서 배치하세요.
                </p>

                {/* 입력 폼 */}
                <div className="flex gap-2 mb-5">
                    <input
                        type="text"
                        placeholder="직급 코드 (영문 2~6자)"
                        value={newJob.code}
                        onChange={handleCodeChange}
                        className="input input-bordered w-1/3 font-mono uppercase"
                    />
                    <input
                        type="text"
                        placeholder="직급명"
                        value={newJob.name}
                        onChange={(e) =>
                            setNewJob({ ...newJob, name: e.target.value.trimStart() })
                        }
                        className="input input-bordered w-1/3"
                    />
                    <button className="btn btn-primary" onClick={handleAddJob}>
                        추가
                    </button>
                </div>

                {/* 세로 드래그 리스트 */}
                <div className="overflow-y-auto max-h-[440px] pb-4 pt-2">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="job-list" direction="vertical">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex flex-col gap-3"
                                >
                                    {localList
                                        .sort((a, b) => a.rankOrder - b.rankOrder)
                                        .map((job, index) => (
                                            <Draggable
                                                key={job.code}
                                                draggableId={job.code}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`card flex items-center justify-start px-5 py-3 cursor-grab border rounded-lg shadow-sm transition-all ${
                                                            snapshot.isDragging
                                                                ? "bg-primary/10 scale-[1.02]"
                                                                : "bg-base-100 hover:bg-base-200"
                                                        } ${
                                                            job.isNew
                                                                ? "border-primary text-primary font-semibold"
                                                                : "border-base-300"
                                                        }`}
                                                    >
                            <span className="text-sm font-medium truncate">
                              {index + 1}. {job.name} /{" "}
                                <span className="text-gray-500">{job.code}</span>
                            </span>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* 버튼 영역 */}
                <div className="modal-action mt-6 flex justify-end gap-2">
                    <button className="btn btn-primary" onClick={handleSave}>
                        저장
                    </button>
                    <button className="btn" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
