package at.tu.visjo.persistence.repository;

import at.tu.visjo.persistence.model.SharedJourney;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SharedJourneyRepository extends JpaRepository<SharedJourney, Long> {

	@Query("SELECT s FROM SharedJourney s WHERE s.uuid = :uuid")
	Optional<SharedJourney> findByUuid(String uuid);

	@Query("SELECT s FROM SharedJourney s WHERE s.journey.id = :journeyId")
	Optional<SharedJourney> findByJourneyId(long journeyId);
}
