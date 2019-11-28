package at.tu.visjo.security;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component("authenticationSuccessHandler")
@Slf4j
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

	@Override
	public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
			Authentication authentication) throws IOException, ServletException {

		handle(httpServletRequest, httpServletResponse, authentication);
		clearAuthenticationAttributes(httpServletRequest);
	}

	protected void handle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
			@NonNull Authentication authentication) throws IOException {

		String targetUrl = determineTargetUrl(authentication);
		log.debug("Redirect after login to {}", targetUrl);

		if (response.isCommitted()) {
			log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
			return;
		}

		redirectStrategy.sendRedirect(request, response, targetUrl);
	}

	protected String determineTargetUrl(@NonNull Authentication authentication) {
		boolean isUser = false;
		boolean isAdmin = false;

		for (GrantedAuthority grantedAuthority : authentication.getAuthorities()) {
			if (grantedAuthority.getAuthority()
								.equals("ROLE_USER")) {
				isUser = true;
			} else if (grantedAuthority.getAuthority()
									   .equals("ROLE_ADMIN")) {
				isAdmin = true;
				isUser = false;
				break;
			}
		}

		if (isUser) {
			return "/user";
		} else if (isAdmin) {
			return "/admin";
		} else {
			throw new IllegalStateException("Missing granted authority");
		}
	}

	protected void clearAuthenticationAttributes(@NonNull HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		}
	}
}
