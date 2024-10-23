import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  changePassword(user: iUser) {
    return this.http.put(`http://localhost:3000/users/${user.id}`, user);
  }
}
