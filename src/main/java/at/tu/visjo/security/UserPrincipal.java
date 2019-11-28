package at.tu.visjo.security;

import lombok.Getter;
import lombok.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class UserPrincipal extends User {

	@Getter
	private final long id;

	public UserPrincipal(long id, @NonNull String username, @NonNull String password,
			@NonNull Collection<? extends GrantedAuthority> authorities) {

		super(username, password, true, true, true, true, authorities);
		this.id = id;
	}
}
