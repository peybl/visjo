package at.tu.visjo.service;

import at.tu.visjo.persistence.model.Journey;
import at.tu.visjo.persistence.model.User;
import at.tu.visjo.persistence.repository.JourneyRepository;
import at.tu.visjo.persistence.repository.UserRepository;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class JourneyService {

	private final UserRepository userRepository;
	private final JourneyRepository journeyRepository;

	@Autowired
	public JourneyService(UserRepository userRepository, JourneyRepository journeyRepository) {
		this.userRepository = userRepository;
		this.journeyRepository = journeyRepository;
	}

	public Optional<Journey> getJourneyOfUser(long userId, long journeyId) {
		Optional<Journey> journey = journeyRepository.findByIdAndUserId(journeyId, userId);
		journey.ifPresentOrElse(j -> log.debug("Found: {}", j),
								() -> log.debug("Could not find journey with id={} of user with id={}", journeyId, userId));
		return journey;
	}

	public List<Journey> getAllJourneysOfUser(long userId) {
		List<Journey> journeys = journeyRepository.findAllByUserId(userId);
		log.debug("Found {} journeys of user with id={}", journeys.size(), userId);
		return journeys;
	}

	public Journey createJourney(long userId, @NonNull String name) {
		User user = userRepository.findById(userId)
								  .get();

		Journey journey = new Journey(user, name);
		journey = journeyRepository.saveAndFlush(journey);
		log.debug("Created: {}", journey);
		return journey;
	}

	public void updateJourneyOfUser(long userId, long journeyId, @NonNull String name) {
		Optional<Journey> journey = getJourneyOfUser(userId, journeyId);
		if (journey.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No journey with this ID found for the current user");
		}

		journey.get().setName(name);
		journeyRepository.saveAndFlush(journey.get());
	}
}
