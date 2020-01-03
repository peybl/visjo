import { Image } from './Image';

export interface Journey {
    id?: number, // not needed for creating journey
    name: string,
    description?: string, // Not in JourneyDto.java
    images?: Image[], // Not in JourneyDto.java
}