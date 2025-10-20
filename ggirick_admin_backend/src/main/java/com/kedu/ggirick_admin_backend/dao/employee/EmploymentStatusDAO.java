package com.kedu.ggirick_admin_backend.dao.employee;

import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EmploymentStatusDAO {

    private final SqlSessionTemplate mybatis;


}
