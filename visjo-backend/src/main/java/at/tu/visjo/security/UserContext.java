package at.tu.visjo.security;

import org.springframework.lang.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
public class UserContext {

	public static Long getActiveUserId(@Nullable Principal principal) {
		if (principal instanceof UsernamePasswordAuthenticationToken) {
			Object token = ((UsernamePasswordAuthenticationToken) principal).getPrincipal();

			if (token instanceof UserPrincipal) {
				return ((UserPrincipal) token).getId();
			}
		}

		return null;
	}

	public Long getActiveUserId() {
		Authentication authentication = SecurityContextHolder.getContext()
															 .getAuthentication();
		if (authentication != null) {
			Object p = authentication.getPrincipal();

			if (p instanceof UserPrincipal) {
				return ((UserPrincipal) p).getId();
			}
		}

		return null;
	}
}
