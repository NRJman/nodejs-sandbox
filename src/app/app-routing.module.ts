import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostsListLengthResolver } from './shared/services/posts-list-length-resolver.service';

const routes: Route[] = [
    { path: '', component: PostListComponent, resolve: { postsListLength: PostsListLengthResolver } },
    { path: 'create-post', component: PostCreateComponent },
    { path: 'edit-post/:id', component: PostCreateComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
