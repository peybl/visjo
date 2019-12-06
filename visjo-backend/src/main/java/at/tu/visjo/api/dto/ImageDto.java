package at.tu.visjo.api.dto;

import lombok.Data;

@Data
public class ImageDto {

	private long id;
	private long journey;
	private double latitude;
	private double longitude;
	private String timestamp;
}
