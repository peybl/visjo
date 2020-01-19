package at.tu.visjo.spring;

import at.tu.visjo.security.SharedJourneyFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@ComponentScan(basePackages = { "at.tu.visjo.security" })
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final UserDetailsService userDetailsService;
	private final AuthenticationSuccessHandler authenticationSuccessHandler;
	private final SharedJourneyFilter sharedJourneyFilter;

	@Autowired
	public SecurityConfig(UserDetailsService userDetailsService, AuthenticationSuccessHandler authenticationSuccessHandler,
			SharedJourneyFilter sharedJourneyFilter) {
		this.userDetailsService = userDetailsService;
		this.authenticationSuccessHandler = authenticationSuccessHandler;

		this.sharedJourneyFilter = sharedJourneyFilter;
		this.sharedJourneyFilter.setAntPatterns("/s/**");
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService)
			.passwordEncoder(passwordEncoder());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// @formatter:off
		http
			.csrf().disable()
			.authorizeRequests()
				.antMatchers("/admin").hasRole("ADMIN")
				.antMatchers("/user", "/journey/**", "/image/**").hasAnyRole("ADMIN", "USER")
				.antMatchers("/s/**").permitAll()
				.antMatchers("/").permitAll()
				.and()
			.addFilterAfter(sharedJourneyFilter, FilterSecurityInterceptor.class)
			.formLogin()
				.loginProcessingUrl("/login")
				.successHandler(authenticationSuccessHandler)
			.permitAll()
				.and()
			.sessionManagement()
				.maximumSessions(1).sessionRegistry(sessionRegistry()).and()
				.sessionFixation().none()
			.and()
			.logout()
				.logoutUrl("/logout")
				.deleteCookies("JSESSIONID")
				.invalidateHttpSession(false)
			.permitAll();
		// @formatter:off
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(12);
	}

	@Bean
	public SessionRegistry sessionRegistry() {
		return new SessionRegistryImpl();
	}
}
