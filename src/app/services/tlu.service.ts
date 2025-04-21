import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface UserInfo {
  id: number;
  username: string;
  email: string;
  displayName: string;
  active: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}


@Injectable({
  providedIn: 'root'
})
export class TLUService {

  private _http = inject(HttpClient);
  private _url = 'https://localhost:7199/api/'; // Base URL for TLU API
  constructor() { }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { 
      UserName: email,
      Password: password,
     };
    return this._http.post<LoginResponse>(`${this._url}tlu/login`, {
      ...body
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getUserInfo(): Observable<UserInfo> {
    const access_token = localStorage.getItem('access_token');
    return this._http.get<UserInfo>(`${this._url}tlu/get-user-infor`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  }
}
