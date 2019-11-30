package at.tu.visjo.security;

import at.tu.visjo.persistence.model.Role;
import at.tu.visjo.persistence.model.User;
import at.tu.visjo.persistence.repository.UserRepository;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service("userDetailsService")
@Transactional
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

	private UserRepository userRepository;

	@Autowired
	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
		// The exception message is abstracted by "Bad credentials"
		User user = userRepository.findByUsername(userName)
								  .orElseThrow(() -> new UsernameNotFoundException("No found: " + userName));
		log.debug("Fetched {}", user);
		return new UserPrincipal(user.getId(), user.getUsername(), user.getPassword(), getAuthorities(user.getRoles()));
	}

	private List<GrantedAuthority> getAuthorities(@NonNull Collection<Role> roles) {
		return roles.stream()
					.map(role -> new SimpleGrantedAuthority(role.getName()))
					.collect(Collectors.toList());
	}
}
