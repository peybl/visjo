package at.tu.visjo.connector.pictshare;

import at.tu.visjo.connector.ServiceConnector;
import at.tu.visjo.connector.pictshare.dto.FileUploadResponse;
import at.tu.visjo.connector.pictshare.persistence.model.PictShareImageMetadata;
import at.tu.visjo.connector.pictshare.persistence.repository.PictShareImageMetadataRepository;
import at.tu.visjo.persistence.model.Image;
import at.tu.visjo.persistence.repository.ImageRepository;
import at.tu.visjo.spring.ConnectorProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Component
@Slf4j
public class PictShareServiceConnector implements ServiceConnector {

	private final PictShareConnector connector;
	private final ImageRepository imageRepository;
	private final PictShareImageMetadataRepository metadataRepository;

	@Autowired
	public PictShareServiceConnector(ConnectorProperties properties, PictShareConnector connector,
			ImageRepository imageRepository, PictShareImageMetadataRepository metadataRepository) {

		this.connector = connector;
		this.imageRepository = imageRepository;
		this.metadataRepository = metadataRepository;

		// Connector setup
		connector.setBaseUrl(properties.pictShare()
									   .url());
	}

	@Override
	public Image uploadFile(@NonNull Image image, @NonNull String fileName, byte[] data) {
		log.debug("Uploading file \"{}\" with of size {} bytes", fileName, data.length);
		String result = connector.uploadFile(fileName, data);

		FileUploadResponse response = jsonStringToResponse(result, FileUploadResponse.class);

		if (response == null || !response.isStatusOk()) {
			String msg = response != null ? response.getErrorReason() : "Could not map response object";
			log.warn("Could not upload file \"{}\": {}", fileName, msg);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, msg);
		}

		// Create and persist image data object
		image.setUrl(response.getImageUrl());
		image = imageRepository.saveAndFlush(image);

		// Create and persist pictshare metadata object
		PictShareImageMetadata metadata = new PictShareImageMetadata(image, response.getDeleteUrl());
		metadataRepository.save(metadata);

		return image;
	}

	@Override
	public Pair<byte[], String> downloadFile(@NonNull String url, @Nullable Integer width) {
		if (width != null) {
			url = extendUri(url, width.toString());
		}

		return connector.downloadFile(url);
	}

	@Override
	public void deleteFile(long imageId) {
		Optional<PictShareImageMetadata> metadata = metadataRepository.findByImageId(imageId);
		if (metadata.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not find metadata of image");
		}

		connector.deleteFile(metadata.get()
									 .getDeleteUrl());

		metadataRepository.delete(metadata.get());
	}

	private <T> T jsonStringToResponse(@Nullable String json, @NonNull Class<T> clazz) {
		if (json == null || json.isEmpty()) {
			return null;
		}

		T response = null;
		try {
			log.debug("Mapping json \"{}\" to type {}", json, clazz.getSimpleName());
			response = new ObjectMapper().readValue(json, clazz);
			log.debug("{}", response);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return response;
	}

	private String extendUri(@NonNull String uri, @NonNull String extension) {
		String[] parts = uri.split("/");
		parts[parts.length - 1] = extension + "/" + parts[parts.length - 1];
		return String.join("/", parts);
	}
}
