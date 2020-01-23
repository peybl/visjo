export class SharedJourney {
    id: number;
    private _uuid: string;

    get uuid(): string {
        return this._uuid;
    }
    set uuid(value: string) {
        if (value.includes("/s/"))
            this._uuid = value.substring(value.indexOf("/s/")+3);
        else
            this._uuid = value;
    }



    constructor() {}
}