package com.kedu.ggirick_admin_backend.dto.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTokenDTO {
    private String id;
    private int authority; // grade
}
