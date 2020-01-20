package at.tu.visjo.api;

import at.tu.visjo.api.dto.ImageDto;
import at.tu.visjo.persistence.model.Image;
import at.tu.visjo.persistence.model.SharedJourney;
import at.tu.visjo.security.UserContext;
import at.tu.visjo.service.ImageService;
import at.tu.visjo.service.SharedJourneyService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Validated
@Slf4j
public class ImageResource {

	private final ModelMapper modelMapper;
	private final ImageService imageService;
	private final SharedJourneyService sharedJourneyService;

	@Autowired
	public ImageResource(ModelMapper modelMapper, ImageService imageService, SharedJourneyService sharedJourneyService) {
		this.modelMapper = modelMapper;
		this.imageService = imageService;
		this.sharedJourneyService = sharedJourneyService;
	}

	@GetMapping(value = "/image/{id}")
	public ResponseEntity<byte[]> getForUser(Principal principal, @PathVariable("id") long imageId,
			@RequestParam(name = "width", required = false) @Min(1) Integer width) {

		long userId = UserContext.getActiveUserId(principal);

		Pair<byte[], String> data = imageService.downloadImageOfUser(userId, imageId, width);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType(data.getSecond()));

		return new ResponseEntity<>(data.getFirst(), headers, HttpStatus.OK);
	}

	@DeleteMapping(value = "/image/{id}")
	public ResponseEntity deleteForUser(Principal principal, @PathVariable("id") long imageId) {

		long userId = UserContext.getActiveUserId(principal);
		imageService.deleteImage(userId, imageId);
		return ResponseEntity.ok("");
	}

	@PutMapping(value = "/image/{id}")
	public ResponseEntity updateForUser(Principal principal, @PathVariable("id") long imageId,
			@RequestParam("latitude") @Min(-90) @Max(90) double latitude,
			@RequestParam("longitude") @Min(-180) @Max(180) double longitude) {

		long userId = UserContext.getActiveUserId(principal);
		imageService.updateImage(userId, imageId, latitude, longitude);
		return ResponseEntity.ok("");
	}

	@GetMapping(value = "/image/journey/{id}")
	public ResponseEntity getAllOfJourneyForUser(Principal principal, @PathVariable("id") long journeyId) {
		long userId = UserContext.getActiveUserId(principal);

		List<Image> images = imageService.getAllImagesOfJourneyAndUser(userId, journeyId);
		if (!images.isEmpty()) {
			List<ImageDto> dtos = images.stream()
										.map(j -> modelMapper.map(j, ImageDto.class))
										.collect(Collectors.toList());
			return ResponseEntity.ok(dtos);
		} else {
			return ResponseEntity.ok("");
		}
	}

	@PostMapping(value = "/image", consumes = { "multipart/form-data" })
	public ResponseEntity createImage(Principal principal, @RequestParam("journeyId") long journeyId,
			@RequestParam("latitude") @Min(-90) @Max(90) double latitude,
			@RequestParam("longitude") @Min(-180) @Max(180) double longitude, @RequestParam("timestamp") String timestamp,
			@RequestParam("file") MultipartFile file) {

		long userId = UserContext.getActiveUserId(principal);

		byte[] fileData;
		try {
			fileData = file.getBytes();
		} catch (IOException e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read file data");
		}

		Image image = imageService.uploadImage(userId, journeyId, file.getOriginalFilename(), fileData, latitude, longitude,
											   timestamp);
		ImageDto dto = modelMapper.map(image, ImageDto.class);

		return new ResponseEntity(dto, HttpStatus.CREATED);
	}

	@GetMapping(value = "/s/{uuid}/image/{imageId}")
	public ResponseEntity<byte[]> getForSharedJourney(@PathVariable("uuid") String uuid, @PathVariable("imageId") long imageId,
			@RequestParam(name = "width", required = false) @Min(1) Integer width) {

		SharedJourney sharedJourney = sharedJourneyService.getSharedJourney(uuid).get();	// Is safe because of security filter
		Pair<byte[], String> data = imageService.downloadImageOfJourney(sharedJourney.getJourney()
																					 .getId(), imageId, width);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType(data.getSecond()));

		return new ResponseEntity<>(data.getFirst(), headers, HttpStatus.OK);
	}

	@GetMapping(value = "/s/{uuid}/image")
	public ResponseEntity getAllForSharedJourney(@PathVariable("uuid") String uuid) {

		SharedJourney sharedJourney = sharedJourneyService.getSharedJourney(uuid).get();	// Is safe because of security filter
		List<Image> images = imageService.getAllImagesOfJourney(sharedJourney.getJourney().getId());
		if (!images.isEmpty()) {
			List<ImageDto> dtos = images.stream()
										.map(j -> modelMapper.map(j, ImageDto.class))
										.collect(Collectors.toList());
			return ResponseEntity.ok(dtos);
		} else {
			return ResponseEntity.ok("");
		}
	}
}
