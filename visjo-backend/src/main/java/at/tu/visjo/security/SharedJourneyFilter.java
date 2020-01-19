package at.tu.visjo.security;

import at.tu.visjo.service.SharedJourneyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Service
@Slf4j
public class SharedJourneyFilter extends GenericFilterBean {

	private final SharedJourneyService sharedJourneyService;
	private final AntPathMatcher antPathMatcher = new AntPathMatcher();

	private String[] antPatterns;

	@Autowired
	public SharedJourneyFilter(SharedJourneyService sharedJourneyService) {
		this.sharedJourneyService = sharedJourneyService;
	}

	public void setAntPatterns(String... antPatterns) {
		this.antPatterns = antPatterns;
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
			throws IOException, ServletException {

		String uri = extractUri(servletRequest);

		if (matchUri(uri)) {
			String uuid = extractUUID(uri);
			if (sharedJourneyService.getSharedJourney(uuid)
									.isPresent()) {
				filterChain.doFilter(servletRequest, servletResponse);
			} else {
				log.warn("Could not find shared journey with uri {}", uri);
				returnError(servletResponse);
			}
		} else {
			filterChain.doFilter(servletRequest, servletResponse);
		}
	}

	private String extractUri(ServletRequest request) {
		String uri = "";
		if (request instanceof HttpServletRequest) {
			uri = ((HttpServletRequest) request).getServletPath();
		}

		return uri;
	}

	private String extractUUID(String uri) {
		String[] parts = uri.split("/");
		if (parts.length >= 3) {
			return parts[2];
		} else {
			return "";
		}
	}

	private boolean matchUri(String uri) {
		for (String antPattern : antPatterns) {
			if (antPathMatcher.match(antPattern, uri)) {
				return true;
			}
		}

		return false;
	}

	private void redirectToHome(ServletResponse response) throws IOException {
		String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
													.build()
													.toUriString();
		((HttpServletResponse) response).sendRedirect(baseUrl);
	}

	private void returnError(ServletResponse response) {
		((HttpServletResponse) response).setStatus(HttpStatus.FORBIDDEN.value());
	}
}
