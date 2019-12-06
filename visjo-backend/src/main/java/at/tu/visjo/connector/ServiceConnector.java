package at.tu.visjo.connector;

import at.tu.visjo.persistence.model.Image;
import lombok.NonNull;
import org.springframework.data.util.Pair;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotNull;

public interface ServiceConnector {

	Image uploadFile(@NotNull Image image, @NotNull String fileName, byte[] data);

	Pair<byte[], String> downloadFile(@NonNull String url, @Nullable Integer width);

	void deleteFile(long imageId);
}
