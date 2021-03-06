import { NgModule } from '@angular/core';
import { MaterialModule } from './../material/material.module';
import { AppRoutingModule } from './../app-routing.module';
import { POSTS_API_SERVER_URL_TOKEN, POSTS_API_SERVER_URL } from '../app.config';
import { PostsListLengthResolver } from '../shared/services/posts-list-length-resolver.service';
import { PostsListPaginationService } from '../posts/post-list/posts-list-pagination.service';
import { AuthModule } from '../auth/auth.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../shared/interceptors/auth.interceptor';

@NgModule({
    providers: [
        PostsListPaginationService,
        PostsListLengthResolver,
        { provide: POSTS_API_SERVER_URL_TOKEN, useValue: POSTS_API_SERVER_URL },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    exports: [
        MaterialModule,
        AuthModule,
        AppRoutingModule
    ]
})
export class CoreModule { }
