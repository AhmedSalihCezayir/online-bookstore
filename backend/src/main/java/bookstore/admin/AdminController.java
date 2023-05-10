package bookstore.admin;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<Admin>> findAllAdmins() {
        List<Admin> admins = adminService.findAll();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<Admin> findAdminById(@PathVariable Long adminId) {
        Admin admin = adminService.findById(adminId);
        return new ResponseEntity<>(admin, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Admin> addAdmin(@RequestBody Admin admin) {
        Admin savedAdmin = adminService.save(admin);
        return new ResponseEntity<>(savedAdmin, HttpStatus.CREATED);
    }

    @DeleteMapping("/{adminId}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long adminId) {
        adminService.deleteById(adminId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}

