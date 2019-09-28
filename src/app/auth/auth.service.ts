import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../shared/models/user-data.model';
import { Observable } from 'rxjs';
import { USERS_API_SERVER_URL_TOKEN } from '../app.config';

@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient,
        @Inject(USERS_API_SERVER_URL_TOKEN) private usersAPIServerUrl: string
    ) { }

    createUserOnServer(user: UserData): Observable<object> {
        return this.http.post(this.usersAPIServerUrl, user);
    }
}
