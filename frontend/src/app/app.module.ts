import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
    HotToastModule.forRoot()
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
