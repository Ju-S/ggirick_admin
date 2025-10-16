package com.kedu.ggirick_admin_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String extension;
    private String email;
    private String profile_url;
}
