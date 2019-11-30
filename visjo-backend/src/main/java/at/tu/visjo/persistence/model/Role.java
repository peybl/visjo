package at.tu.visjo.persistence.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Role implements Model {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(unique = true, nullable = false)
	private String name;

	@ManyToMany(mappedBy = "roles")
	private List<User> users;

	public Role(@NonNull String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Role (id=" + id + ", name=" + name + ")";
	}
}
