import { NgModule,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './view/layout/dashboard/dashboard.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { SubdashboardComponent } from './view/layout/subdashboard/subdashboard.component';
import { AuthComponent } from './view/page/auth/auth.component';
import { PortalComponent } from './view/page/portal/portal.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  FacebookLoginProvider
} from 'angularx-social-login';
import { ErrorInterceptor, JwtInterceptor, appInitializer, fakeBackendProvider } from './_helper';
import { AccountService } from './_services/account.service';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage'; // Import localStorageSync
import {userReducer } from './store/user.reducer'
const localStorageSyncReducer = (reducer: any) =>
  localStorageSync({ keys: ['user'], rehydrate: true })(reducer);
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SubdashboardComponent,
    AuthComponent,
    PortalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    HotToastModule.forRoot(),
    StoreModule.forRoot(
      { user: localStorageSyncReducer(userReducer) }, // Use localStorageSync
      { metaReducers: [localStorageSyncReducer] } // Add it to metaReducers as well
    ),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1526072548139602')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
