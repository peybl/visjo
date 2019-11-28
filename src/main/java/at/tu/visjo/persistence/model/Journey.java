package at.tu.visjo.persistence.model;

import lombok.Data;
import lombok.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
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

	@Temporal(TemporalType.TIMESTAMP)
	@NotNull
	private Date timestamp;

	public Journey() {
		this.timestamp = new Date();
	}

	public Journey(@NonNull User user, @NonNull String name) {
		this.user = user;
		this.name = name;
		this.timestamp = new Date();
	}

	@Override
	public String toString() {
		return "Journey (id=" + id + ", user=" + user.getId() + ")";
	}
}
