package at.tu.visjo.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class HomeResource {

	@GetMapping("/")
	public String home() {
		return "<h1>Welcome</h1>";
	}

	@GetMapping("/user")
	public String user() {
		return "<h1>Welcome User</h1>";
	}

	@GetMapping("/admin")
	public String admin() {
		return "<h1>Welcome Admin</h1>";
	}
}
