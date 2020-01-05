import { Image } from './Image';

export class Journey {
    id?: number; // not needed for creating journey
    name: string;
    description?: string; // Not in JourneyDto.java
    images?: Image[]; // Not in JourneyDto.java
    titleImage?: Image; // Not in JourneyDto.java

    constructor() {};
}
