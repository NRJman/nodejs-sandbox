import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

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
    ]
})
export class AuthModule { }
