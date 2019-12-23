import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated = false;
  username = '';

  constructor(private http: HttpClient) {
  }

  login(credentials, callback): void {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    this.http.post('http://localhost:8080/login', formData).subscribe(
      () => {
        this.authenticated = true;
        return callback && callback();
      },
      err => console.error('Could not log in', err)
    );
  }

  // There is a bug in the backend that's why the logout is seen as an error but its actually working!
  logout(callback): void {
    this.http.post('http://localhost:8080/logout', {}).pipe().subscribe(
      () => {
        this.authenticated = false;
        return callback && callback();
      },
      err => console.error('Could not log out', err)
    );
  }

  fetchUsername(): string {
    if (this.username) {
      this.http.get('http://localhost:8080/user', {}).pipe().subscribe(
        response => {
          this.username = response['name'];
          this.authenticated = true;
        },
        err => console.error('Could not get username', err)
      );
      return this.username;
    }
  }
}
