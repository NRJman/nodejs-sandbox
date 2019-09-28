import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Route[] = [
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AuthRoutingModule { }
