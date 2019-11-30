package at.tu.visjo.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class WebResource {

	@GetMapping("/")
	public void base(HttpServletResponse response) throws IOException {
		response.sendRedirect("/app/index.html");
	}

	@GetMapping("/index.html")
	public void baseIndex(HttpServletResponse response) throws IOException {
		response.sendRedirect("/app/index.html");
	}

	@GetMapping("/app/")
	public void baseApp(HttpServletResponse response) throws IOException {
		response.sendRedirect("/app/index.html");
	}
}
