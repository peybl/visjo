import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as EXIF from '../exported-libraries/exif-js/exif';
import {isArray} from 'util';
import {Journey} from '../dtos/Journey';
import {Image} from '../dtos/Image';
import * as $ from 'jquery';
import { JourneyService } from '../services/Journey/journey.service';
import { ImagesService } from '../services/Images/images.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent {
    public journeyForm: FormGroup;
    public journey: Journey;

    public images: Image[] = [];
    public newFiles: File[] = [];
    public lastAddedJourney;

    constructor(private formBuilder: FormBuilder,
            private journeyService: JourneyService,
            private imageService: ImagesService) {
        this.journeyForm = this.formBuilder.group({
            title: [],
            images: this.formBuilder.array([])
        });
        this.journey = new Journey();
    }

    getEXIFData(file) {
        return new Promise(function(resolve) {
            EXIF.getData(file, function() {
                EXIF.pretty(this);

                let latitude = this.exifdata.GPSLatitude;
                let longitude = this.exifdata.GPSLongitude;

                if (!latitude || !longitude) {
                    return { lat: 0, long: 0 };
                }
                if (isArray(latitude)) {
                    latitude = this.getDecimalFromGps(latitude);
                }
                if (isArray(longitude)) {
                    longitude = this.getDecimalFromGps(longitude);
                }
                resolve([ latitude || 0, longitude || 0 ]);
            });
        });
    }

    private getDecimalFromGps(gps: number[]) : number {
        // If you want to convert to a single decimal number:
        // = Degrees + Minutes/60 + Seconds/3600
        // see: https://gis.stackexchange.com/questions/136925
        if (gps.length !== 3)
            return 0;
        let decimal = 0;
        decimal += gps[0];
        decimal += gps[1] / 60;
        decimal += gps[2] / 3600;
        return decimal;
    }

    getFileLink(file) : Promise<string> {
        return new Promise(function(resolve) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    updateForm() {
        const formdata = this.journeyForm.getRawValue();
        this.journey.name = formdata.title;

        const myArray = $('.image');

        for (let i = 0; i < myArray.length; i++) {
            this.images[i].name = $('#title-' + i).val();
            this.images[i].longitude = $('#long-' + i).val();
            this.images[i].latitude = $('#lat-' + i).val();
            this.images[i].date = new Date($('#date-' + i).val());
        }
        this.journey.images = this.images;
        // debugger;
    }

    async onFileChanged(event) {
        for (let file of event.target.files) {
            if (!file || !file.name) {
                return;
            }
            file = file as File;
            this.newFiles.push(file);
            const image = new Image();
            image.name = file.name;
            image.date = new Date(file.lastModified);
            // let result = await this.getEXIFData(file); // TODO add back when EXIF works
            let result = [this.getDecimalFromGps([65, 1, 12.0703]), this.getDecimalFromGps([25, 28, 2.8445])];
            if (!result) {
                result = [0, 0];
            }
            image.latitude = result[0];
            image.longitude = result[1];
            const uri = await this.getFileLink(file);
            if (typeof uri === 'string') {
                image.imageUrl = uri;
            }
            image.file = file;
            this.images.push(image);
        }
    }

    preUpload(journey: Journey) : Promise<Journey> {
        const service = this.journeyService;
        return new Promise(function(resolve) {
            service.postNewJourney(journey).subscribe(
                response => resolve(response)
            );
        });
    }

    async onUpload() {
        this.updateForm();
        const journey = await this.preUpload(this.journey);
        console.debug("new Journey: " + journey.id + " - " + journey.name);
        if (!journey /*&& !journey.id*/) {
            return;
        }
        for (const image of this.images) {
            // const data = new FormData();
            // data.append('journeyId', journey.id + "");
            // data.append('latitude', image.latitude + '');
            // data.append('longitude', image.longitude + '');
            // data.append('timestamp', this.getUtcString());
            // data.append('file', this.newFiles[1], image.name);
            // debugger;

            // $.ajax({
            //     url: '/image',
            //     method: 'POST',
            //     enctype: 'multipart/form-data',
            //     processData: false,
            //     contentType: false,
            //     cache: false,
            //     data
            // }).done((image) => {
            //     console.log("uploaded image: " + image);
            // }).fail((err) => {
            //     console.error('Error uploading file "' + image.name + '"', err.responseText);
            // });

            image.journey = journey.id; // TODO find better way
            image.timestamp = this.getUtcString();
            this.imageService.postNewImage(image)
                .subscribe(image => console.log("uploaded image: " + image));
        }
    }

    getUtcString() : string {
        const now = new Date();
        const utc = [];
        utc.push(now.getFullYear());
        utc.push('-');
        utc.push(('0' + (now.getMonth() + 1)).slice(-2));
        utc.push('-');
        utc.push(('0' + now.getDate()).slice(-2));
        utc.push('T');
        utc.push(('0' + now.getHours()).slice(-2));
        utc.push(':');
        utc.push(('0' + now.getMinutes()).slice(-2));
        utc.push(':');
        utc.push(('0' + now.getSeconds()).slice(-2));
        utc.push('+');
        utc.push(('0' + now.getTimezoneOffset() / -60).slice(-2));
        return utc.join('');
    }

    submit() {
        console.log(this.journeyForm.value);
    }
}
