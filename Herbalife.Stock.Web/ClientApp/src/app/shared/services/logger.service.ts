import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

    printSuccessMessage(message: string) {
        console.log(message);
    }

    printErrorMessage(message: string) {
        console.error(message);
    }
}
