import { Image } from './Image';

export class Journey {
    public id: string;
    public name: string;
    public description?: string;
    public images: Image[];
}