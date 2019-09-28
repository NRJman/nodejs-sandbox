import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { USERS_API_SERVER_URL_TOKEN, USERS_API_SERVER_URL } from '../app.config';
import { AuthService } from './auth.service';

@NgModule({
    declarations: [
        SignUpComponent,
        SignInComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        AuthRoutingModule,
    ],
    providers: [
        AuthService,
        { provide: USERS_API_SERVER_URL_TOKEN, useValue: USERS_API_SERVER_URL }
    ]
})
export class AuthModule { }
