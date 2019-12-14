import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) {
    this.auth.fetchUsername();
  }

  authenticated() {
    return this.auth.authenticated;
  }

  logout() {
    this.auth.logout(() => {
      this.auth.authenticated = false;
      this.router.navigateByUrl('/login');
    });
  }

  ngOnInit() {
  }

}
