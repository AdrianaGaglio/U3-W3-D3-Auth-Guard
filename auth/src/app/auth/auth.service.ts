import { iAuthdata } from './../interfaces/iauthdata';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { iUser } from '../interfaces/iuser';
import { iLoginrequest } from '../interfaces/iloginrequest';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    this.restoreAuthData();
  }

  jwtHelper: JwtHelperService = new JwtHelperService();
  authData$ = new BehaviorSubject<iAuthdata | null>(null);
  user$ = this.authData$.asObservable().pipe(map((authData) => authData?.user));

  registerUrl = 'http://localhost:3000/register/';
  loginUrl = 'http://localhost:3000/login/';

  isLoggedIn$ = this.authData$.pipe(map((accessData) => !!accessData));

  register(user: Partial<iUser>): Observable<iAuthdata> {
    return this.http.post<iAuthdata>(this.registerUrl, user).pipe(
      tap((authData: iAuthdata) => {
        this.authData$.next(authData);
        localStorage.setItem('authData', JSON.stringify(authData));
      })
    );
  }

  login(login: iLoginrequest): Observable<iAuthdata> {
    // faccio la richiesta di login
    return this.http.post<iAuthdata>(this.loginUrl, login).pipe(
      // dalla richiesta, intercetto la risposta e la passo al behaviorSubject e al localstorage
      tap((authData: iAuthdata) => {
        this.authData$.next(authData);
        localStorage.setItem('authData', JSON.stringify(authData));
        this.router.navigate(['/profile']);
      })
    );
  }

  logout() {
    // pulisco i dati dal behavior subject e dal localstorage
    this.authData$.next(null);
    localStorage.removeItem('authData');
    // reindirizzo alla pagina login
    this.router.navigate(['/auth/login']);
  }

  restoreAuthData() {
    // verifico se ci sono dati di accesso nel localstorage
    let authJSON = localStorage.getItem('authData');
    if (!authJSON) return;
    // se ci sono, li passo al behavior subject
    let accessData: iAuthdata = JSON.parse(authJSON);
    this.authData$.next(accessData);
  }
}
