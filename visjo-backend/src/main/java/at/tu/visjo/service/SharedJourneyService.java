package at.tu.visjo.service;

import at.tu.visjo.persistence.model.Journey;
import at.tu.visjo.persistence.model.SharedJourney;
import at.tu.visjo.persistence.repository.SharedJourneyRepository;
import at.tu.visjo.util.RandomString;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@Slf4j
public class SharedJourneyService {

	private static final int UUID_LENGTH = 8;

	private final RandomString randomString;
	private final SharedJourneyRepository sharedJourneyRepository;
	private final JourneyService journeyService;

	@Autowired
	public SharedJourneyService(RandomString randomString, SharedJourneyRepository sharedJourneyRepository,
			JourneyService journeyService) {

		this.randomString = randomString;
		this.sharedJourneyRepository = sharedJourneyRepository;
		this.journeyService = journeyService;
	}

	public Optional<SharedJourney> getSharedJourney(String uuid) {
		return sharedJourneyRepository.findByUuid(uuid);
	}

	public SharedJourney shareJourneyOfUser(long userId, long journeyId) {
		Optional<Journey> journey = journeyService.getJourneyOfUser(userId, journeyId);
		if (journey.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No journey with this ID found for the current user");
		}

		Optional<SharedJourney> sharedJourney = sharedJourneyRepository.findByJourneyId(journey.get().getId());
		return sharedJourney.orElseGet(() -> createSharedJourney(journey.orElse(null)));
	}

	public void deleteSharedJourneyOfUser(long userId, long journeyId) {
		Optional<Journey> journey = journeyService.getJourneyOfUser(userId, journeyId);
		if (journey.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No journey with this ID found for the current user");
		}

		Optional<SharedJourney> sharedJourney = sharedJourneyRepository.findByJourneyId(journey.get().getId());
		sharedJourney.ifPresent(value -> sharedJourneyRepository.deleteById(value.getId()));
	}

	private SharedJourney createSharedJourney(@NonNull Journey journey) {
		String uuid = randomString.generateAlphanumeric(UUID_LENGTH);
		SharedJourney sharedJourney = new SharedJourney(journey, uuid);
		log.debug("Created: {}", sharedJourney);
		return sharedJourneyRepository.saveAndFlush(sharedJourney);
	}
}
