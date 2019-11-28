package at.tu.visjo.spring;

import at.tu.visjo.persistence.model.Role;
import at.tu.visjo.persistence.model.User;
import at.tu.visjo.persistence.repository.RoleRepository;
import at.tu.visjo.persistence.repository.UserRepository;
import at.tu.visjo.security.SecurityRole;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class SetupData implements ApplicationListener<ContextRefreshedEvent> {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;

	private boolean alreadySetup = false;

	@Autowired
	public SetupData(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
		if (alreadySetup) {
			return;
		}

		// Create security roles
		Role adminRole = createRoleIfNotFound(SecurityRole.ROLE_ADMIN.name());
		Role userRole = createRoleIfNotFound(SecurityRole.ROLE_USER.name());

		// Create initial users
		createUserIfNotFound("admin", "pass", Arrays.asList(adminRole, userRole));
		createUserIfNotFound("user", "pass", Arrays.asList(userRole));

		alreadySetup = true;
	}

	private Role createRoleIfNotFound(@NonNull String name) {
		Optional<Role> role = roleRepository.findByName(name);
		if (role.isEmpty()) {
			Role defaultRole = new Role(name);
			role = Optional.of(roleRepository.save(defaultRole));
		}
		return role.get();
	}

	private User createUserIfNotFound(@NonNull String username, @NonNull String password, @NonNull List<Role> roles) {
		Optional<User> user = userRepository.findByUsername("user");
		if (user.isEmpty()) {
			User defaultUser = new User(username, passwordEncoder.encode(password), roles);
			user = Optional.of(userRepository.save(defaultUser));
		}
		return user.get();
	}
}
