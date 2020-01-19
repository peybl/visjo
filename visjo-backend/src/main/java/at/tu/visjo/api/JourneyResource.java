package at.tu.visjo.api;

import at.tu.visjo.api.dto.JourneyDto;
import at.tu.visjo.api.dto.SharedJourneyDto;
import at.tu.visjo.persistence.model.Journey;
import at.tu.visjo.persistence.model.SharedJourney;
import at.tu.visjo.security.UserContext;
import at.tu.visjo.service.JourneyService;
import at.tu.visjo.service.SharedJourneyService;
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
@Validated
@Slf4j
public class JourneyResource {

	private final ModelMapper modelMapper;
	private final JourneyService journeyService;
	private final SharedJourneyService sharedJourneyService;

	@Autowired
	public JourneyResource(ModelMapper modelMapper, JourneyService journeyService, SharedJourneyService sharedJourneyService) {
		this.modelMapper = modelMapper;
		this.journeyService = journeyService;
		this.sharedJourneyService = sharedJourneyService;
	}

	@GetMapping(value = "/journey")
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

	@GetMapping(value = "/journey/{id}")
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

	@PostMapping(value = "/journey")
	public ResponseEntity createJourney(Principal principal, @RequestParam("name") String name) {
		long userId = UserContext.getActiveUserId(principal);

		Journey journey = journeyService.createJourney(userId, name);
		return new ResponseEntity(modelMapper.map(journey, JourneyDto.class), HttpStatus.CREATED);
	}

	@PutMapping(value = "/journey/{id}")
	public ResponseEntity updateJourney(Principal principal, @PathVariable("id") Long journeyId,
			@RequestParam("name") String name) {

		long userId = UserContext.getActiveUserId(principal);

		journeyService.updateJourneyOfUser(userId, journeyId, name);
		return ResponseEntity.ok("");
	}

	@PutMapping(value = "/journey/{id}/share")
	public ResponseEntity shareJourney(Principal principal, @PathVariable("id") Long journeyId) {
		long userId = UserContext.getActiveUserId(principal);

		SharedJourney sharedJourney = sharedJourneyService.shareJourneyOfUser(userId, journeyId);
		SharedJourneyDto dto = modelMapper.map(sharedJourney, SharedJourneyDto.class);
		return ResponseEntity.ok(dto);
	}

	@DeleteMapping(value = "/journey/{id}/share")
	public ResponseEntity deleteShareJourney(Principal principal, @PathVariable("id") Long journeyId) {
		long userId = UserContext.getActiveUserId(principal);

		sharedJourneyService.deleteSharedJourneyOfUser(userId, journeyId);
		return ResponseEntity.ok("");
	}

	@GetMapping(value = "/s/{uuid}")
	public ResponseEntity getForShared(@PathVariable("uuid") String uuid) {
		Optional<SharedJourney> sharedJourney = sharedJourneyService.getSharedJourney(uuid);
		if (sharedJourney.isPresent()) {
			SharedJourneyDto dto = modelMapper.map(sharedJourney.get(), SharedJourneyDto.class);
			return ResponseEntity.ok(dto);
		} else {
			return ResponseEntity.ok("{}");
		}
	}
}
