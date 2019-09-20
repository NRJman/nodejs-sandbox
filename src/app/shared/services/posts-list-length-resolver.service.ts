import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { PostsResponse } from '../models/posts.response.model';
import { POSTS_API_SERVER_URL_TOKEN } from 'src/app/app.config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class PostsListLengthResolver implements Resolve<number> {
    constructor(
        private http: HttpClient,
        @Inject(POSTS_API_SERVER_URL_TOKEN) private postsAPIServerURL: string
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> {
        return this.http.get<PostsResponse>((this.postsAPIServerURL + '/count'))
            .pipe(
                map(response => response.postsListLength)
            );
    }
}
