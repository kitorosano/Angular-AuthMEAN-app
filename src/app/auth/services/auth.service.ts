import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const url = `${this.baseUrl}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap(resp => this.saveUsuario(resp)),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  register(name: string, email: string, password: string) {
    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap(resp => this.saveUsuario(resp)),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  validarToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http
      .get<AuthResponse>(url, {
        headers,
      })
      .pipe(
        map(resp => this.saveUsuario(resp)),
        catchError((err) => of(false))
      );
  }

  saveUsuario(resp: AuthResponse) {
    localStorage.setItem('token', resp.token!);
    this._usuario = {
      uid: resp.uid!,
      name: resp.name!,
      email: resp.email!,
    };
    return resp.ok;
  }

  logout() {
    localStorage.clear();
  }
}
