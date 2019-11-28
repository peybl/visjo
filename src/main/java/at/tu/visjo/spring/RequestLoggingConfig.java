package at.tu.visjo.spring;

import at.tu.visjo.security.UserContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.AbstractRequestLoggingFilter;

import javax.servlet.Filter;
import javax.servlet.http.HttpServletRequest;

@Configuration
@Slf4j
public class RequestLoggingConfig {

	@Bean
	public Filter loggingFilter() {
		AbstractRequestLoggingFilter filter = new AbstractRequestLoggingFilter() {

			@Override
			protected void beforeRequest(HttpServletRequest request, String message) {
				Long uid = UserContext.getActiveUserId(request.getUserPrincipal());
				String userInfo = (uid != null) ? uid.toString() : "ANONYMOUS";
				log.trace("Processing Request for user {} {}", userInfo, message);
			}

			@Override
			protected void afterRequest(HttpServletRequest request, String message) {}
		};

		filter.setIncludeQueryString(true);
		filter.setIncludeClientInfo(true);
		filter.setIncludeHeaders(true);
		filter.setIncludePayload(false);

		filter.setBeforeMessagePrefix("[");
		filter.setAfterMessagePrefix("[");
		filter.setAfterMessageSuffix("]\n");

		return filter;
	}
}
