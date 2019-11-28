package at.tu.visjo.persistence.model;

import at.tu.visjo.util.Utils;
import lombok.Data;
import lombok.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user_account")
@Data
public class User implements Model {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(unique = true, nullable = false)
	@Size(min = 4, max = 30)
	private String username;

	@Column(unique = true, nullable = false)
	private String password;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id",
			nullable = false), inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id", nullable =
			false))
	private List<Role> roles = new ArrayList<>();

	@Temporal(TemporalType.TIMESTAMP)
	@NotNull
	private Date timestamp;

	public User() {
		this.timestamp = new Date();
	}

	public User(@NonNull String username, @NonNull String password, @NonNull List<Role> roles) {
		this.username = username;
		this.password = password;
		this.roles = roles;
		this.timestamp = new Date();
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("User (id=")
			   .append(id)
			   .append(", username=")
			   .append(username)
			   .append(", password=CONFIDENTIAL")
			   .append(", roles=[")
			   .append(Utils.modelsToString(roles))
			   .append("], timestamp=")
			   .append(timestamp)
			   .append(")");
		return builder.toString();
	}
}
