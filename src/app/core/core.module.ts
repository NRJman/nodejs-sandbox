import { NgModule } from '@angular/core';
import { MaterialModule } from './../material/material.module';
import { AppRoutingModule } from './../app-routing.module';
import { POSTS_API_SERVER_URL_TOKEN, POSTS_API_SERVER_URL } from '../app.config';
import { PostsListLengthResolver } from '../shared/services/posts-list-length-resolver.service';
import { PostsListPaginationService } from '../posts/post-list/posts-list-pagination.service';

@NgModule({
    providers: [
        PostsListPaginationService,
        PostsListLengthResolver,
        { provide: POSTS_API_SERVER_URL_TOKEN, useValue: POSTS_API_SERVER_URL }
    ],
    exports: [
        MaterialModule,
        AppRoutingModule
    ]
})
export class CoreModule { }
