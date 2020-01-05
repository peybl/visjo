export class Image {
    id: number;
    journey: number;
    latitude: number;
    longitude: number;
    timestamp: string;
    date: Date;
    name?: string; // Not in ImageDto.java
    imageUrl?: string; // Not in ImageDto.java
    file?: File; // Not in ImageDto.java

    constructor(){}
}
