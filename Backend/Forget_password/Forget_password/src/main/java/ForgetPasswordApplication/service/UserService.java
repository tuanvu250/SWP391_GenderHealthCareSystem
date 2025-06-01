package ForgetPasswordApplication.service;

import ForgetPasswordApplication.model.Users;
import ForgetPasswordApplication.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public void saveUser(Users user) {
        userRepository.save(user);
    }
    public Users getUserById(int id) {
        Optional<Users> user= userRepository.findById(id);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }
}
