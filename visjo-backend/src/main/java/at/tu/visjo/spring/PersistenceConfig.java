package at.tu.visjo.spring;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = { "at.tu.visjo.persistence", "at.tu.visjo.connector.pictshare.persistence.repository" })
public class PersistenceConfig {}
