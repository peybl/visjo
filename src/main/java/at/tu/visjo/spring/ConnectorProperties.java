package at.tu.visjo.spring;

import lombok.Getter;
import lombok.ToString;
import lombok.experimental.Accessors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:connector.properties")
@Getter
@Accessors(fluent = true)
@ToString
public class ConnectorProperties {

	@Autowired
	private PictShare pictShare;

	@Component
	@Getter
	@Accessors(fluent = true)
	@ToString
	public static class PictShare {

		@Value("${pictshare.url}")
		private String url;
	}
}
