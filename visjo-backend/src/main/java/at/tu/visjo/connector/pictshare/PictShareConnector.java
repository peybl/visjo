package at.tu.visjo.connector.pictshare;

import lombok.NonNull;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.data.util.Pair;
import org.springframework.remoting.RemoteConnectFailureException;
import org.springframework.remoting.RemoteInvocationFailureException;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.io.IOException;

@Component
@Slf4j
public class PictShareConnector {

	private static final String TARGET_URL_UPLOAD = "/api/upload.php";

	private OkHttpClient client = new OkHttpClient();

	@Setter
	private String baseUrl;

	String uploadFile(@NotNull String fileName, byte[] data) throws RemoteConnectFailureException {
		MediaType octetStream = MediaType.parse("application/octet-stream");
		RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
															 .addFormDataPart("file", fileName,
																			  RequestBody.create(data, octetStream))
															 .build();

		Request request = new Request.Builder().url(baseUrl + TARGET_URL_UPLOAD)
											   .post(requestBody)
											   .build();

		Call call = client.newCall(request);

		try {
			Response response = call.execute();
			log.debug("File upload of file '{}' returned code {} - {}", fileName, response.code(), response.message());

			if (!response.isSuccessful()) {
				throw new RemoteInvocationFailureException("Upload to PictShare failed", null);
			}

			return response.body()
						   .string();
		} catch (IOException | NullPointerException e) {
			log.error(e.getMessage());
			throw new RemoteConnectFailureException("Upload to PictShare failed", e);
		}
	}

	Pair<byte[], String> downloadFile(@NonNull String url) {
		Request request = new Request.Builder().url(baseUrl + url)
											   .build();

		Call call = client.newCall(request);
		try {
			Response response = call.execute();
			log.debug("Fetching file '{}' returned code {} - {}", url, response.code(), response.message());

			if (!response.isSuccessful()) {
				throw new RemoteInvocationFailureException("Fetching from PictShare failed", null);
			}

			byte[] file = response.body()
								  .bytes();
			String type = response.body()
								  .contentType()
								  .toString();

			return Pair.of(file, type);
		} catch (IOException | NullPointerException e) {
			log.error(e.getMessage());
			throw new RemoteConnectFailureException("Fetching from PictShare failed", e);
		}
	}

	void deleteFile(String deleteUrl) {
		Request request = new Request.Builder().url(baseUrl + deleteUrl)
											   .build();

		Call call = client.newCall(request);
		try {
			Response response = call.execute();
			log.debug("Deleting file '{}' returned code {} - {}", deleteUrl, response.code(), response.message());

			if (!response.isSuccessful()) {
				throw new RemoteInvocationFailureException("Delete from PictShare", null);
			}
		} catch (IOException e) {
			log.error(e.getMessage());
			throw new RemoteConnectFailureException("Delete from PictShare failed", e);
		}
	}
}
