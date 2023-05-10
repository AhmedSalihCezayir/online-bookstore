package bookstore.admin;

import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    @Override
    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    @Override
    public Admin findById(Long id) {
        Optional<Admin> optionalAdmin = adminRepository.findById(id);
        if (optionalAdmin.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found");
        }
        return optionalAdmin.get();
    }

    @Override
    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public void deleteById(Long id) {
        if(!adminRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found");
        }
        adminRepository.deleteById(id);
    }
}

