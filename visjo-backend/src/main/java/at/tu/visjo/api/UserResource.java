package at.tu.visjo.api;

import at.tu.visjo.api.dto.UserDto;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserResource {

	private final ModelMapper modelMapper;

	@Autowired
	public UserResource(ModelMapper modelMapper) {
		this.modelMapper = modelMapper;
	}

	@GetMapping()
	public ResponseEntity user(Principal principal) {
		UserDto dto = modelMapper.map(principal, UserDto.class);
		return ResponseEntity.ok(dto);
	}
}
