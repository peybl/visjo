package at.tu.visjo.persistence.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Data
public class Image implements Model {

	@Id
	@GeneratedValue
	private long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_account_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "journey_id", nullable = false)
	private Journey journey;

	@NotNull
	private String url;

	@Min(-90)
	@Max(90)
	private double latitude;

	@Min(-180)
	@Max(180)
	private double longitude;

	@Temporal(TemporalType.TIMESTAMP)
	@NotNull
	private Date timestamp;

	public Image() {
		this.timestamp = new Date();
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Image (id=")
			   .append(id)
			   .append(", user=")
			   .append(user.getId())
			   .append(", journey=")
			   .append(journey.getId())
			   .append(", url=")
			   .append(url)
			   .append(", latitude=")
			   .append(latitude)
			   .append(", longitude=")
			   .append(longitude)
			   .append(", timestamp=")
			   .append(timestamp)
			   .append(")");
		return builder.toString();
	}
}
