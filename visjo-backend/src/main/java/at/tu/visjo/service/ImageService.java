package at.tu.visjo.service;

import at.tu.visjo.connector.ServiceConnector;
import at.tu.visjo.persistence.model.Image;
import at.tu.visjo.persistence.model.Journey;
import at.tu.visjo.persistence.model.User;
import at.tu.visjo.persistence.repository.ImageRepository;
import at.tu.visjo.persistence.repository.UserRepository;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ImageService {

	private final ServiceConnector serviceConnector;
	private final UserRepository userRepository;
	private final ImageRepository imageRepository;
	private final JourneyService journeyService;

	@Autowired
	public ImageService(ServiceConnector serviceConnector, UserRepository userRepository, ImageRepository imageRepository,
			JourneyService journeyRepository) {

		this.serviceConnector = serviceConnector;
		this.userRepository = userRepository;
		this.imageRepository = imageRepository;
		this.journeyService = journeyRepository;
	}

	public Optional<Image> getImageOfUser(long userId, long imageId) {
		Optional<Image> image = imageRepository.findByIdAndUserId(imageId, userId);
		image.ifPresentOrElse(j -> log.debug("Found: {}", j),
							  () -> log.debug("Could not find image with id={} of user with id={}", imageId, userId));
		return image;
	}

	public List<Image> getAllImagesOfJourneyAndUser(long userId, long journeyId) {
		List<Image> images = imageRepository.findAllByUserIdAndJourneyId(userId, journeyId);
		log.debug("Found {} images of journey with id={}", images.size(), journeyId);
		return images;
	}

	public List<Image> getAllImagesOfJourney(long journeyId) {
		List<Image> images = imageRepository.findAllByJourneyId(journeyId);
		log.debug("Found {} images of journey with id={}", images.size(), journeyId);
		return images;
	}

	public void updateImage(long userId, long imageId, double latitude, double longitude) {
		Optional<Image> image = getImageOfUser(userId, imageId);
		if (image.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No image with this ID found for the current user");
		}

		image.get().setLatitude(latitude);
		image.get().setLongitude(longitude);
		imageRepository.saveAndFlush(image.get());
	}

	public Image uploadImage(long userId, long journeyId, @NonNull String fileName, byte[] fileData, double latitude,
			double longitude, String timestamp) {

		User user = userRepository.findById(userId)
								  .get();

		Optional<Journey> journey = journeyService.getJourneyOfUser(userId, journeyId);
		if (journey.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No journey with this ID found for the current user");
		}

		ZonedDateTime utc;
		try {
			utc = ZonedDateTime.parse(timestamp);
		} catch (DateTimeParseException e) {
			log.error("Could not parse timestamp '{}'", timestamp);
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The timezone format is invalid");
		}

		// Prepare image
		Image image = new Image();
		image.setUser(user);
		image.setJourney(journey.get());
		image.setLatitude(latitude);
		image.setLongitude(longitude);
		image.setTimestamp(utc);

		image = serviceConnector.uploadFile(image, fileName, fileData);
		log.debug("Created: {}", image);

		return image;
	}

	public Pair<byte[], String> downloadImageOfUser(long userId, long imageId, Integer width) {
		Optional<Image> image = imageRepository.findByIdAndUserId(imageId, userId);
		return downloadImage(image.orElse(null), width);
	}

	public Pair<byte[], String> downloadImageOfJourney(long journeyId, long imageId, Integer width) {
		Optional<Image> image = imageRepository.findByIdAndJourneyId(imageId, journeyId);
		return downloadImage(image.orElse(null), width);
	}

	private Pair<byte[], String> downloadImage(Image image, Integer width) {
		if (image == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No image with this ID found for the current user");
		}

		return serviceConnector.downloadFile(image.getUrl(), width);
	}

	public void deleteImage(long userId, long imageId) {
		Optional<Image> image = imageRepository.findByIdAndUserId(imageId, userId);
		if (image.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No image with this ID found for the current user");
		}

		serviceConnector.deleteFile(imageId);

		imageRepository.delete(image.get());
	}
}
