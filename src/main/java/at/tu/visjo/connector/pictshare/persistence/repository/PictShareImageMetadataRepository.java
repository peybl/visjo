package at.tu.visjo.connector.pictshare.persistence.repository;

import at.tu.visjo.connector.pictshare.persistence.model.PictShareImageMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PictShareImageMetadataRepository extends JpaRepository<PictShareImageMetadata, Long> {

	@Query("SELECT m FROM PictShareImageMetadata m WHERE m.image.id = :imageId")
	Optional<PictShareImageMetadata> findByImageId(long imageId);
}
