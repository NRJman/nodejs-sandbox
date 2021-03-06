import { Observable, of, Observer } from 'rxjs';
import { ValidationErrors, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ValidatorsService {
    constructor(private http: HttpClient) { }

    public fileTypedAsImage(control: FormControl): Observable<ValidationErrors> {
        const validatorsService = this;
        const controlValue: File | string = control.value;
        const validator$: Observable<ValidationErrors> = Observable.create((observer: Observer<ValidationErrors>) => {
            const fileReader: FileReader = new FileReader();

            fileReader.onloadend = () => {
                const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
                let imageHeader = '';

                for (let i = 0, len = arr.length; i < len; i++) {
                    imageHeader += arr[i].toString(16);
                }

                switch (imageHeader) {
                    case '89504e47': // image/png:
                        observer.next(null);
                        break;
                    case '47494638': // image/gif:
                        observer.next(null);
                        break;
                    case 'ffd8ffe0': // image/jpeg:
                    case 'ffd8ffe1':
                    case 'ffd8ffe2':
                    case 'ffd8ffe3':
                    case 'ffd8ffe8':
                        observer.next(null);
                        break;
                    default: // not a typical image type
                        observer.next({
                            fileIsNotImage: true
                        });
                }

                observer.complete();
            };

            if (controlValue instanceof File) {
                fileReader.readAsArrayBuffer(controlValue);

                return;
            }

            validatorsService.getFileObject(controlValue)
                .subscribe((file: File) => {
                    fileReader.readAsArrayBuffer(file);
                });
        });

        return validator$;
    }

    private getFileObject(url: string): Observable<Blob> {
        return this.http.get(url, {responseType: 'blob'});
    }
}
