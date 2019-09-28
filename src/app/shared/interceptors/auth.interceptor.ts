import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler) {
        const SECURED_METHODS = ['POST', 'DELETE', 'PATCH'];
        const jwt: string = this.authService.jsonWebToken;

        if (SECURED_METHODS.includes(req.method) && req.url.includes('/api/posts/') && jwt) {
            const clonedReq: HttpRequest<any> = req.clone({
                setHeaders: {
                    'Authorization': `Bearer: ${jwt}`
                }
            });

            return next.handle(clonedReq);
        }

        return next.handle(req);
    }
}
