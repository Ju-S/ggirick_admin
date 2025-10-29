package com.kedu.ggirick_admin_backend.dao.system;

import com.kedu.ggirick_admin_backend.dto.system.HolidayCalendarDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

@Repository
@RequiredArgsConstructor
public class HolidayCalendarDAO {

    private final SqlSessionTemplate mybatis;

    // 중복 체크
    public boolean exists(LocalDate date) {
        Integer count = mybatis.selectOne("system.HolidayCalendar.exists", date);
        return count != null && count > 0;
    }

    // 휴일 입력
    public void insert(HolidayCalendarDTO dto) {
        mybatis.insert("system.HolidayCalendar.insert", dto);
    }
}
