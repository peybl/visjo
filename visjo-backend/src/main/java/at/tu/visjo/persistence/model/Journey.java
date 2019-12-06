package at.tu.visjo.persistence.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Journey implements Model {

	@Id
	@GeneratedValue
	private long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_account_id", nullable = false)
	private User user;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "journey")
	private List<Image> images = new ArrayList<>();

	@NotNull
	private String name;

	@NotNull
	private LocalDateTime createdTimestamp;

	public Journey(@NonNull User user, @NonNull String name) {
		this.user = user;
		this.name = name;
	}

	@PrePersist
	public void setCreationDateTime() {
		this.createdTimestamp = LocalDateTime.now();
	}

	@Override
	public String toString() {
		return "Journey (id=" + id + ", user=" + user.getId() + ", createdTimestamp=" + createdTimestamp + ")";
	}
}
