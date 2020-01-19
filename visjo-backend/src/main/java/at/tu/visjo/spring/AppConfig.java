package at.tu.visjo.spring;

import at.tu.visjo.api.dto.ImageDto;
import at.tu.visjo.api.dto.SharedJourneyDto;
import at.tu.visjo.persistence.model.Image;
import at.tu.visjo.persistence.model.SharedJourney;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

	@Bean
	public ModelMapper modelMapper() {
		ModelMapper modelMapper = new ModelMapper();

		// Configure ModelMapper
		PropertyMap<ImageDto, Image> imageDtoMapping = new PropertyMap<>() {

			protected void configure() {
				map().getJourney()
					 .setId(source.getJourney());
			}
		};
		PropertyMap<Image, ImageDto> imageDtoFieldMapping = new PropertyMap<>() {

			protected void configure() {
				map().setJourney(source.getJourney()
									   .getId());
			}
		};

		PropertyMap<SharedJourneyDto, SharedJourney> sharedJourneyDtoMapping = new PropertyMap<>() {

			protected void configure() {
				map().getJourney()
					 .setId(source.getJourney());
			}
		};
		PropertyMap<SharedJourney, SharedJourneyDto> sharedJourneyDtoFieldMapping = new PropertyMap<>() {

			protected void configure() {
				map().setJourney(source.getJourney()
									   .getId());
				map().setUrl(source.getSharedUrl());
			}
		};

		modelMapper.addMappings(imageDtoMapping);
		modelMapper.addMappings(imageDtoFieldMapping);
		modelMapper.addMappings(sharedJourneyDtoMapping);
		modelMapper.addMappings(sharedJourneyDtoFieldMapping);

		return modelMapper;
	}
}
