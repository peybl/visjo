export interface Image {
    id: number;
    journey: number;
    latitude: number;
    longitude: number;
    timestamp: string;
    name?: string; // Not in ImageDto.java
    imageUrl?: string; // Not in ImageDto.java
}
