package com.kedu.ggirick_admin_backend.controllers.hr;

import com.kedu.ggirick_admin_backend.services.hr.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;
//
//    @GetMapping("/list")
//    public ResponseEntity<List<OrganizationDTO>> getAllOrganizations() {
//        return ResponseEntity.ok(organizationService.getAll());
//    }
//
//    @GetMapping("/{code}")
//    public ResponseEntity<OrganizationDTO> getOrganization(@PathVariable String code) {
//        return ResponseEntity.ok(organizationService.getByCode(code));
//    }
//
//    @PostMapping
//    public ResponseEntity<Void> create(@RequestBody OrganizationDTO dto) {
//        organizationService.create(dto);
//        return ResponseEntity.ok().build();
//    }
//
//    @PutMapping
//    public ResponseEntity<Void> update(@RequestBody OrganizationDTO dto) {
//        organizationService.update(dto);
//        return ResponseEntity.ok().build();
//    }
//
//    @DeleteMapping("/{code}")
//    public ResponseEntity<Void> delete(@PathVariable String code) {
//        organizationService.delete(code);
//        return ResponseEntity.ok().build();
//    }
//
//    @GetMapping("/{code}/employees")
//    public ResponseEntity<List<EmployeeDTO>> getEmployees(@PathVariable String code) {
//        return ResponseEntity.ok(organizationService.getEmployeesByOrg(code));
//    }
}

