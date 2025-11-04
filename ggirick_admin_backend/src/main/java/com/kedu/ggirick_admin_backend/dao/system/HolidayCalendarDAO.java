package com.kedu.ggirick_admin_backend.dao.system;

import com.kedu.ggirick_admin_backend.dto.system.HolidayCalendarDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class HolidayCalendarDAO {

    private final SqlSessionTemplate mybatis;

    // 중복 체크
    public boolean exists(LocalDate date) {
        Integer count = mybatis.selectOne("HolidayCalendar.exists", date);
        return count != null && count > 0;
    }

    // 휴일 목록 전체 조회
    public List<HolidayCalendarDTO> selectAll() {
        return mybatis.selectList("HolidayCalendar.selectAll");
    }

    // 휴일 입력
    public void insert(HolidayCalendarDTO dto) {
        mybatis.insert("HolidayCalendar.insert", dto);
    }

    // 휴일 수정
    public void update(HolidayCalendarDTO dto) {
        mybatis.update("HolidayCalendar.update", dto);
    }

    // 휴일 삭제
    public void delete(Long id) {
        mybatis.delete("HolidayCalendar.delete", id);
    }

    // 공휴일 여부 확인
    public boolean isHoliday(Date date) {
        Boolean result = mybatis.selectOne("HolidayCalendar.isHoliday", date);
        return result != null && result;
    }
}
