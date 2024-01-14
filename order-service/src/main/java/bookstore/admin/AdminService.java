package bookstore.admin;

import java.util.List;

public interface AdminService {
    List<Admin> findAll();

    Admin findById(Long id);

    Admin save(Admin admin);

    void deleteById(Long id);
}
