package com.kedu.ggirick_admin_backend.controllers.hr;

import com.kedu.ggirick_admin_backend.dto.hr.*;
import com.kedu.ggirick_admin_backend.services.hr.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hr-meta")
@RequiredArgsConstructor
public class HrMetaController {

    private final DepartmentService departmentService;
    private final JobService jobService;
    private final OrganizationService organizationService;
    private final AuthorityService authorityService;
    private final EmploymentStatusService employmentStatusService;

    @GetMapping("/departments")
    public List<DepartmentDTO> getDepartments() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/jobs")
    public List<JobDTO> getJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/organizations")
    public List<OrganizationDTO> getOrganizations() {
        return organizationService.getAllOrganizations();
    }

    @GetMapping("/authorities")
    public List<AuthorityDTO> getAuthorities() {
        return authorityService.getAllAuthorities();
    }

    @GetMapping("/statuses")
    public List<EmploymentStatusCodeDTO> getAllEmploymentStatuses() {
        return employmentStatusService.getAllEmploymentStatuses();
    }
}
