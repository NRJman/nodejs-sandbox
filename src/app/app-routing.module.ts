import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

const routes: Route[] = [
    { path: '', component: PostListComponent },
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
