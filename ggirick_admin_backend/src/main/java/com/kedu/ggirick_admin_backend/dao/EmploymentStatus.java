package com.kedu.ggirick_admin_backend.dao;

import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EmploymentStatus {

    private final SqlSessionTemplate mybatis;
}
