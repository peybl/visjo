import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as EXIF from 'exif-js/exif';
import {isArray} from 'util';
import {Journey} from '../dtos/Journey';
import {Image} from '../dtos/Image';
import * as $ from 'jquery';
import { JourneyService } from '../services/Journey/journey.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent {
    public journeyForm: FormGroup;
    public journey: Journey = new Journey();

    public images: Image[] = [];
    public newFiles: File[] = [];
    public lastAddedJourney;

    constructor(private formBuilder: FormBuilder, private journeyService: JourneyService) {
        this.journeyForm = this.formBuilder.group({
            title: [],
            images: this.formBuilder.array([])
        });
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
                    latitude = latitude[latitude.length - 1];
                }
                if (isArray(longitude)) {
                    longitude = longitude[longitude.length - 1];
                }
                resolve([ latitude || 0, longitude || 0 ]);
            });
        });
    }

    getFileLink(file) {
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
        debugger;
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
            let result = await this.getEXIFData(file);
            if (!result) {
                result = [0, 0];
            }
            image.latitude = result[0];
            image.longitude = result[1];
            const uri = await this.getFileLink(file);
            if (typeof uri === 'string') {
                image.source = uri;
            }
            this.images.push(image);
        }
    }

    preUpload(journey) {
        return new Promise(function(resolve) {
            $.post('/journey', journey)
                .done((result) => {
                    console.log(result);
                    resolve({success: true, result});
                })
                .fail((err) => {
                    console.error('Error creating journey with name "' + $(this).name.value + '"', err);
                    resolve({success: false});
                });
        });
    }

    async onUpload() {
        this.updateForm();
        let journey = await this.preUpload(this.journey);
        for (const image of this.images) {
            const data = new FormData();
            data.append('file', this.newFiles[1], image.name);
            data.append('journeyId', this.journey.id);
            data.append('latitude', image.latitude + '');
            data.append('longitude', image.longitude + '');
            data.append('timestamp', this.getUtcString());
            debugger;

            $.ajax({
                url: '/image',
                method: 'POST',
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                cache: false,
                data
            }).done((image) => {
                console.log(image);
            }).fail((err) => {
                console.error('Error uploading file "' + image.name + '"', err.responseText);
            });
        }
    }

    getUtcString() {
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
