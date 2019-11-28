package at.tu.visjo.spring;

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
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@ComponentScan(basePackages = { "at.tu.visjo.security" })
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final UserDetailsService userDetailsService;
	private final AuthenticationSuccessHandler authenticationSuccessHandler;

	@Autowired
	public SecurityConfig(UserDetailsService userDetailsService, AuthenticationSuccessHandler authenticationSuccessHandler) {

		this.userDetailsService = userDetailsService;
		this.authenticationSuccessHandler = authenticationSuccessHandler;
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
				.antMatchers("/image.html", "/journey.html").hasAnyRole("ADMIN", "USER")
				.antMatchers("/").permitAll()
				.and()
			.formLogin()
				.loginPage("/login.html")
				.loginProcessingUrl("/login")
				.failureUrl("/login.html?error")
				.successHandler(authenticationSuccessHandler)
			.permitAll()
				.and()
			.sessionManagement()
				.invalidSessionUrl("/login.html")
				.maximumSessions(1).sessionRegistry(sessionRegistry()).and()
				.sessionFixation().none()
			.and()
			.logout()
				.logoutUrl("/logout")
				.logoutSuccessUrl("/login.html?logout")
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
