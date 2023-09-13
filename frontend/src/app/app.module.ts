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
    HotToastModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
