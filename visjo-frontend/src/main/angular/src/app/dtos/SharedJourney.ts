export class SharedJourney {
    id: number;
    url: string;

    get uuid() {
        return this.url.replace("/s/", "");
    }

    set uuid(value: string) {
        if (value.includes("/s/"))
            this.url = value;
        else
            this.url = "/s/" +  value;
    }

    constructor() {}
}