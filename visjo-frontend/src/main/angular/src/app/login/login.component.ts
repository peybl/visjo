import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  credentials = {username: '', password: ''};
  error = false;

  constructor(private auth: AuthService, private router: Router) {
  }

  login(): void {
    this.auth.login(this.credentials, () => {
      this.router.navigateByUrl('home');
    });
  }

  // login(): void {
  //   console.warn(this.credentials);
  //   const formData = new FormData();
  //   formData.append('username', this.credentials.username);
  //   formData.append('password', this.credentials.password);
  //
  //   this.http.post<any>('http://localhost:8080/login', formData).subscribe(
  //     (res) => console.log(res),
  //     (err) => console.error(err)
  //   );
  // }
}
