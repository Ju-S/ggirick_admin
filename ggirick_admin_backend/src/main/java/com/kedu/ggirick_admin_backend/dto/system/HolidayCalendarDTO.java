package com.kedu.ggirick_admin_backend.dto.system;

import lombok.Data;
import java.time.LocalDate;

@Data
public class HolidayCalendarDTO {
    private Long id;
    private LocalDate calDate;
    private String isWorkday;    // Y / N
    private String holidayType;  // PUBLIC / SUBSTITUTE / COMPANY
    private String description;
}