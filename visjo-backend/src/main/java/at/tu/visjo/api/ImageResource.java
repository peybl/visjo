package at.tu.visjo.api;

import at.tu.visjo.api.dto.ImageDto;
import at.tu.visjo.persistence.model.Image;
import at.tu.visjo.security.UserContext;
import at.tu.visjo.service.ImageService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
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
@RequestMapping("/image")
@Validated
@Slf4j
public class ImageResource {

	private final ModelMapper modelMapper;
	private final ImageService imageService;

	@Autowired
	public ImageResource(ModelMapper modelMapper, ImageService imageService) {
		this.modelMapper = modelMapper;
		this.imageService = imageService;

		// Configure ModelMapper
		PropertyMap<ImageDto, Image> imageDtoMapping = new PropertyMap<>() {

			protected void configure() {
				map().getJourney()
					 .setId(source.getJourney());
			}
		};
		PropertyMap<Image, ImageDto> imageDtoFieldMapping = new PropertyMap<>() {

			protected void configure() {
				map().setJourney(source.getJourney()
									   .getId());
			}
		};
		modelMapper.addMappings(imageDtoMapping);
		modelMapper.addMappings(imageDtoFieldMapping);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<byte[]> getForUser(Principal principal, @PathVariable("id") long imageId,
			@RequestParam(name = "width", required = false) @Min(1) Integer width) {

		long userId = UserContext.getActiveUserId(principal);

		Pair<byte[], String> data = imageService.downloadImage(userId, imageId, width);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType(data.getSecond()));

		return new ResponseEntity<>(data.getFirst(), headers, HttpStatus.OK);
	}

	@GetMapping(value = "journey/{id}")
	public ResponseEntity getAllOfJourneyForUser(Principal principal, @PathVariable("id") long journeyId) {
		long userId = UserContext.getActiveUserId(principal);

		List<Image> images = imageService.getAllImagesOfJourneyAndUser(userId, journeyId);
		if (!images.isEmpty()) {
			List<ImageDto> dtos = images.stream()
										.map(j -> modelMapper.map(j, ImageDto.class))
										.collect(Collectors.toList());
			return ResponseEntity.ok(dtos);
		} else {
			return ResponseEntity.ok(null);
		}
	}

	@PostMapping(consumes = { "multipart/form-data" })
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
}
