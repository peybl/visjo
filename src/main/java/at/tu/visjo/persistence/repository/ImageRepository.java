package at.tu.visjo.persistence.repository;

import at.tu.visjo.persistence.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

	@Query("SELECT i FROM Image i WHERE i.id = :imageId AND i.user.id = :userId")
	Optional<Image> findByIdAndUserId(long imageId, long userId);

	@Query("SELECT i FROM Image i WHERE i.user.id = :userId AND i.journey.id = :journeyId")
	List<Image> findAllByUserIdAndJourneyId(long userId, long journeyId);
}
