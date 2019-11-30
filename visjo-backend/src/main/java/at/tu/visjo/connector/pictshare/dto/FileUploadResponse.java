package at.tu.visjo.connector.pictshare.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@JsonIgnoreProperties(value = { "hash", "filetype", "delete_code" })
public class FileUploadResponse {

	private static final String STATUS_CODE_OK = "ok";

	private String status;

	@JsonProperty("url")
	private String imageUrl;

	@JsonProperty("delete_url")
	private String deleteUrl;

	@JsonProperty("reason")
	private String errorReason;

	public boolean isStatusOk() {
		return status != null && status.toLowerCase()
									   .equals(STATUS_CODE_OK);
	}
}
