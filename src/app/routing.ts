import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IntroComponent } from './intro/intro.component';
import { TermsComponent } from './terms/terms.component';
// import { DebugComponent } from './debug/debug.component';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';
import { OnboardComponent } from './onboard/onboard.component';

const appRoutes : Routes = [
    { path: 'welcome', component: IntroComponent },
    { path: 'dashboard', component: HomeComponent },
    { path: 'callback', component: CallbackComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'onboard', component: OnboardComponent },
    { path: '**', component: IntroComponent }
];

export const routing = RouterModule.forRoot(appRoutes);