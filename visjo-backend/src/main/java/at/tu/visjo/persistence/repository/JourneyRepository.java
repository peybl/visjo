package at.tu.visjo.persistence.repository;

import at.tu.visjo.persistence.model.Journey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JourneyRepository extends JpaRepository<Journey, Long> {

	@Query("SELECT j FROM Journey j WHERE j.id = :journeyId AND j.user.id = :userId")
	Optional<Journey> findByIdAndUserId(long journeyId, long userId);

	@Query("SELECT j FROM Journey j WHERE j.user.id = :userId")
	List<Journey> findAllByUserId(long userId);
}
