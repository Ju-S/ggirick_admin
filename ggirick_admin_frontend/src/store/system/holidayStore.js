// src/store/system/holidayStore.js
import {create} from "zustand";
import {getHolidayListAPI} from "@/api/system/holidayAPI.js";

const useHolidayStore = create((set) => ({
    holidays: [],
    selectedHoliday: null,

    // 공휴일 목록 조회
    getHolidays: async () => {
        try {
            const res = await getHolidayListAPI();
            if (res.data) set({ holidays: res.data });
        } catch (err) {
            console.error("공휴일 조회 실패:", err);
        }
    },

    // 선택 공휴일
    setSelectedHoliday: (holiday) => set({ selectedHoliday: holiday }),

    // 공휴일 추가
    addHoliday: (newHoliday) =>
        set((state) => ({ holidays: [...state.holidays, newHoliday] })),

    // 공휴일 삭제
    removeHoliday: (id) =>
        set((state) => ({
            holidays: state.holidays.filter((h) => h.id !== id),
        })),
}));

export default useHolidayStore;
