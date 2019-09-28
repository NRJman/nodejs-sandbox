import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UnsubscriberService } from 'src/app/shared/services/unsubscriber.service';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent extends UnsubscriberService implements OnInit, OnDestroy {
  public signUpForm: FormGroup;

  constructor(private authService: AuthService) {
    super();
  }

  public handleSignUpFormSubmission(): void {
    this.authService.createUserOnServer(this.signUpForm.value)
      .pipe(
        takeUntil(this.subscriptionController$$),
        catchError(error => {
          return of(error);
        })
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
