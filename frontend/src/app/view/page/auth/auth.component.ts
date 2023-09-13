import { Component, OnInit } from '@angular/core';
// import {
//   SocialAuthService,
//   FacebookLoginProvider,
//   SocialUser,
// } from '@abacritt/angularx-social-login';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{
  isConnected:boolean = false;
  user!: SocialUser;
  isLoggedin?: boolean = undefined;
  constructor(
    private authService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.isLoggedin = (user != null);
    });
    // console.log(this.socialUser);
  }
  loginWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log(this.user);
  }
  signOut(): void {
    this.authService.signOut();
  }
}
