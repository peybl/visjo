package at.tu.visjo.connector.pictshare.persistence.model;

import at.tu.visjo.persistence.model.Image;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.persistence.*;

@Entity
@Table(name = "pictshare_image_metadata")
@Data
@NoArgsConstructor
public class PictShareImageMetadata {

	@Id
	@GeneratedValue
	private long id;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "image_id", nullable = false)
	private Image image;

	@Column(name = "delete_url", nullable = false)
	private String deleteUrl;

	public PictShareImageMetadata(@NonNull Image image, @NonNull String deleteUrl) {
		this.image = image;
		this.deleteUrl = deleteUrl;
	}
}
