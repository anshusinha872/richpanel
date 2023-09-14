import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of, EMPTY } from 'rxjs';
import { map, concatMap, finalize } from 'rxjs/operators';
import { FacebookService } from '../service/facebook/facebook.service';
import { environment } from '../environments/environment';
import { Account } from '../_models';
import { Store } from '@ngrx/store';
import * as UserActions from '../store/user.actions';
import { selectLogin,selectAccount,selectLoginData,selectPageList} from '../store/user.selectors'; // Import your selectors
const baseUrl = `${environment.apiUrl}/accounts`;

declare const FB: any;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private facebookService: FacebookService,
        private store: Store
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }
    loginData$ = this.store.select(selectLoginData);
    public get accountValue(): Account {
        return this.accountSubject.value;
    }
    changeAccount(account: Account) {
      this.store.dispatch(UserActions.changeAccount({ account }));
    }
    changeLoginData(loginData: any) {
      this.store.dispatch(UserActions.changeLoginData({ loginData }));
    }
    changeLogin(login: boolean) {
      this.store.dispatch(UserActions.changeLogin({ login }));
    }
    changePageList(pageList: any) {
      this.store.dispatch(UserActions.changePageList({ pageList }));
    }
    login() {
        // login with facebook then authenticate with the API to get a JWT auth token
        this.facebookLogin()
            .pipe(concatMap(authResponse => this.apiAuthenticate(authResponse)))

            .subscribe(() => {

              // console.log('this.accountValue',this.accountValue);
              // this.changeAccount(this.accountValue);
              // this.router.navigate(['/dashboard/portal']);

            });
    }

    facebookLogin() {
      const permissions = [ 'pages_manage_posts','pages_manage_metadata','pages_read_engagement','pages_messaging'];
      const scope = permissions.join(',');
        // login with facebook and return observable with fb access token on success
        return from(new Promise<any>(resolve => FB.login(resolve,{scope})))
            .pipe(concatMap(({ authResponse }) => {
                if (!authResponse) return EMPTY;
                this.changeLoginData(authResponse);
                console.log(authResponse);
                this.changeLogin(true);
                // return of(authResponse.accessToken);
                return of(authResponse)
            }));
    }

    apiAuthenticate(authResponse: string) {
      console.log('apiAuthenticate function called')
        // authenticate with the api using a facebook access token,
        // on success the api returns an account object with a JWT auth token

        // this.facebookService.authenticate(this.loginData$);
        return this.facebookService.authenticate({ authResponse })
            .pipe(map(data => {
              console.log('apiAuthenticate function called',data)
                // this.accountSubject.next(data.user);
                // this.startAuthenticateTimer();
                console.log('data',data.data);
                this.changeAccount(data.data.user);
                console.log('data.data.user',data.data.pages);
                this.changePageList(data.data.pages);
                return data;
            }));
    }

    logout() {
        // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
        FB.api('/me/permissions', 'delete', null, () => FB.logout());
        this.stopAuthenticateTimer();
        this.accountSubject.next(null);
        this.changeLogin(false);
        this.changeAccount(null);
        this.changeLoginData(null);
        this.router.navigate(['/dashboard/auth']);
    }

    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }

    getById(id) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }

    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.accountValue.id) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }

    // helper methods

    private authenticateTimeout;

    private startAuthenticateTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accountValue.token.split('.')[1]));

        // set a timeout to re-authenticate with the api one minute before the token expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        const { accessToken } = FB.getAuthResponse();
        this.authenticateTimeout = setTimeout(() => {
            this.apiAuthenticate(accessToken).subscribe();
        }, timeout);
    }

    private stopAuthenticateTimer() {
        // cancel timer for re-authenticating with the api
        clearTimeout(this.authenticateTimeout);
    }
}
