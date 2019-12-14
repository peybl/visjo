import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {ErrorPageComponent} from './error-page/error-page.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { JourneyViewComponent } from './journey-view/journey-view.component';
import { JourneyOverviewComponent } from './home/journey-overview/journey-overview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageviewComponent } from './messageview/messageview.component';
import { JourneyService } from './services/Journey/journey.service';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ErrorPageComponent,
    CreateComponent,
    EditComponent,
    JourneyViewComponent,
    JourneyOverviewComponent,
    MessageviewComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [JourneyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
