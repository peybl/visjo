import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as EXIF from 'exif-js/exif';
import {isArray} from 'util';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent {
    public journeyForm: FormGroup;
    public files: File[] = [];

    public images: string[] = [];

    public arrayImages: {
        title: string;
        lat: number;
        long: number;
        date: string;
        file: File;
    }[] = [];

    constructor(private formBuilder: FormBuilder) {
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

    addFileToBeDisplayed(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof reader.result === 'string') {
                this.images.push(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }

    async onFileChanged(event) {
        for (let file of event.target.files) {
            if (!file || !file.name) {
                return;
            }
            file = file as File;
            this.files.push(file);
            const title = file.name;
            const date = new Date(file.lastModified).toISOString();
            let result = await this.getEXIFData(file);
            this.addFileToBeDisplayed(file);
            if (!result) {
                result = [0, 0];
            }
            const lat = result[0];
            const long = result[1];
            this.arrayImages.push({
                title,
                lat,
                long,
                date,
                file
            });
        }
    }

    onUpload() {
        // upload code goes here
    }

    submit() {
        console.log(this.journeyForm.value);
    }
}
