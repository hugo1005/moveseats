import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { ArrayDisplayComponent } from './array-display/array-display.component';
import { SeatSelectComponent } from './seat-select/seat-select.component';
import { LoginComponent } from './login/login.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { UserRequestsComponent } from './user-requests/user-requests.component';
import { UserRequestItemComponent } from './user-request-item/user-request-item.component';
import { HomeComponent } from './home/home.component';
import { SeatFormComponent } from './seat-form/seat-form.component';
import { RadioComponent } from './radio/radio.component';
import { PopupPanelComponent } from './popup-panel/popup-panel.component';
import { SeatPrefFormComponent } from './seat-pref-form/seat-pref-form.component';
import { DebugComponent } from './debug/debug.component';
import { AppStateComponent } from './app-state/app-state.component';
import { DropoutComponent } from './dropout/dropout.component';
import { DropoutItemComponent } from './dropout-item/dropout-item.component';
import { DropoutItemToggleDirective } from './dropout-item-toggle.directive';
import { SeatPipe } from './seat.pipe';
import { DayPipe } from './day.pipe';
import { CallbackComponent } from './callback/callback.component';
import { DateDayPipe } from './date-day.pipe';
import { IntroComponent } from './intro/intro.component';
import { NotificationComponent } from './notification/notification.component';

//Service
import { UserService } from './user.service';
import { ActionsService } from './actions.service';
import { AsyncService } from './async.service';
import { AuthService } from './auth.service';
import { SubscriptionService } from './subscription.service';

//Routing
import { routing } from './routing';
import { CardComponent } from './card/card.component';
import { PaymentsComponent } from './payments/payments.component';
import { FlightInfoComponent } from './flight-info/flight-info.component';
import { TermsComponent } from './terms/terms.component';
import { ProfileComponent } from './profile/profile.component';
import { KeyTabsComponent } from './key-tabs/key-tabs.component';
import { ProfileToggleComponent } from './profile-toggle/profile-toggle.component';
import { HelpComponent } from './help/help.component';
import { DisplayErrorsComponent } from './display-errors/display-errors.component';
import { InputComponent } from './input/input.component';
import { StatComponent } from './stat/stat.component';
import { OnboardComponent } from './onboard/onboard.component';
import { MediaProfileComponent } from './media-profile/media-profile.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { LatestFlightsComponent } from './latest-flights/latest-flights.component';




@NgModule({
  declarations: [
    AppComponent,
    ArrayDisplayComponent,
    SeatSelectComponent,
    LoginComponent,
    UserPanelComponent,
    UserRequestsComponent,
    UserRequestItemComponent,
    HomeComponent,
    SeatFormComponent,
    RadioComponent,
    PopupPanelComponent,
    SeatPrefFormComponent,
    DebugComponent,
    AppStateComponent,
    DropoutComponent,
    DropoutItemComponent,
    DropoutItemToggleDirective,
    SeatPipe,
    DayPipe,
    CallbackComponent,
    DateDayPipe,
    IntroComponent,
    NotificationComponent,
    CardComponent,
    PaymentsComponent,
    FlightInfoComponent,
    TermsComponent,
    ProfileComponent,
    KeyTabsComponent,
    ProfileToggleComponent,
    HelpComponent,
    DisplayErrorsComponent,
    InputComponent,
    StatComponent,
    OnboardComponent,
    MediaProfileComponent,
    FlightSearchComponent,
    LatestFlightsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    routing
  ],
  providers: [
    UserService, 
    ActionsService, 
    AsyncService, 
    AuthService,
    SubscriptionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
