package at.tu.visjo.api;

import at.tu.visjo.api.dto.JourneyDto;
import at.tu.visjo.persistence.model.Journey;
import at.tu.visjo.security.UserContext;
import at.tu.visjo.service.JourneyService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/journey")
@Validated
@Slf4j
public class JourneyResource {

	private final ModelMapper modelMapper;
	private final JourneyService journeyService;

	@Autowired
	public JourneyResource(ModelMapper modelMapper, JourneyService journeyService) {
		this.modelMapper = modelMapper;
		this.journeyService = journeyService;
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity getForUser(Principal principal, @PathVariable("id") Long journeyId) {
		long userId = UserContext.getActiveUserId(principal);

		Optional<Journey> journey = journeyService.getJourneyOfUser(userId, journeyId);
		if (journey.isPresent()) {
			JourneyDto dto = modelMapper.map(journey.get(), JourneyDto.class);
			return ResponseEntity.ok(dto);
		} else {
			return ResponseEntity.ok("{}");
		}
	}

	@GetMapping()
	public ResponseEntity getAllForUser(Principal principal) {
		long userId = UserContext.getActiveUserId(principal);

		List<Journey> journeys = journeyService.getAllJourneysOfUser(userId);
		if (!journeys.isEmpty()) {
			List<JourneyDto> dtos = journeys.stream()
											.map(j -> modelMapper.map(j, JourneyDto.class))
											.collect(Collectors.toList());
			return ResponseEntity.ok(dtos);
		} else {
			return ResponseEntity.ok("[]");
		}
	}

	@PostMapping()
	public ResponseEntity createJourney(Principal principal, @RequestParam("name") String name) {
		long userId = UserContext.getActiveUserId(principal);

		Journey journey = journeyService.createJourney(userId, name);
		return new ResponseEntity(modelMapper.map(journey, JourneyDto.class), HttpStatus.CREATED);
	}
}
