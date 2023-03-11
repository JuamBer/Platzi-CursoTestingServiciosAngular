import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { Auth } from '../models/auth.model';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tests for login', () => {
    it('should return token', (doneFn) => {
      const mock: Auth = { access_token: '121212' };
      const email = 'juamber@gmail.com';
      const password = 'ASD23WFC';
      spyOn(tokenService, 'saveToken').and.callThrough();

      service.login(email, password).subscribe((data) => {
        expect(data).toEqual(mock);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledWith(data.access_token);
        doneFn();
      });

      const req = httpController.expectOne(
        `${environment.API_URL}/api/v1/auth/login`
      );
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`);
      req.flush(mock);
    });
  });
});
