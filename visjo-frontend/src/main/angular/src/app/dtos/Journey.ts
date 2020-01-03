import { Image } from './Image';

export class Journey {
    public id: number;
    public name: string;
    public description?: string;
    public images?: Image[];
}