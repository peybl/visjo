package at.tu.visjo.persistence.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class SharedJourney {

	public static final String SHARED_JOURNEY_URL_PREFIX = "/s/";

	@Id
	@GeneratedValue
	private long id;

	@OneToOne(fetch = FetchType.LAZY)
	private Journey journey;

	@NotNull
	private String uuid;

	@NotNull
	private LocalDateTime createdTimestamp;

	public SharedJourney(@NonNull Journey journey, @NonNull String uuid) {
		this.journey = journey;
		this.uuid = uuid;
	}

	@PrePersist
	public void setCreationDateTime() {
		this.createdTimestamp = LocalDateTime.now();
	}

	@Override
	public String toString() {
		return "Journey (id=" + id + ", journey=" + journey.getId() + ", uuid=" + uuid + ", createdTimestamp="
				+ createdTimestamp + ")";
	}

	public String getSharedUrl() {
		return SHARED_JOURNEY_URL_PREFIX + uuid;
	}
}
