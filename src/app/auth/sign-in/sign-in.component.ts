import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UnsubscriberService } from 'src/app/shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent extends UnsubscriberService implements OnInit, OnDestroy {
  public signInForm: FormGroup;

  constructor(private authService: AuthService) {
    super();
  }

  public handleSignInFormSubmission(): void {
    this.authService.fetchJsonWebToken(this.signInForm.value)
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((response: unknown) => {
        this.authService.jsonWebToken = (response as { token: string }).token;
      });
  }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
