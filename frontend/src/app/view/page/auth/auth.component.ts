import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { AccountService } from 'src/app/_services/account.service';
import { Store } from '@ngrx/store';
import { selectLogin,selectAccount,selectLoginData,selectPageList} from '../../../store/user.selectors'; // Import your selectors
import * as UserActions from '../../../store/user.actions';
import { take } from 'rxjs';
import { Router } from '@angular/router';
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
    private authService: SocialAuthService,
    private accountService: AccountService,
    private store: Store,
    private router: Router
  ) { }
    login$ = this.store.select(selectLogin);
    account$ = this.store.select(selectAccount);
    pageList$ = this.store.select(selectPageList);
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.isLoggedin = (user != null);
    });
    // console.log(this.socialUser);
  }
  loginWithFacebook(): void {
    console.log('loginWithFacebook');

    this.accountService.login();

  }
  signOut(): void {
    this.accountService.logout();
  }
  redirectToPortal(item){
    this.router.navigate(['/dashboard/portal',item]);
  }
}
