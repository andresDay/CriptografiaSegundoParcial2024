import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleApiService } from './google-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CriptografiaSegundoParcial';
  userProfile: any;
  private userProfileSubscription = new Subscription();

  constructor(public readonly google: GoogleApiService) {
    this.userProfileSubscription = this.google.userProfileChanged.subscribe(
      (userProfile) => {
        this.userProfile = userProfile;
      }
    );
  }

  ngOnInit() {
    // Verifica la autenticación al iniciar la aplicación
    this.google.checkAuthentication();
  }

  onLogin() {
    this.google.login();
  }

  onLogout() {
    this.google.logout();
  }

  ngOnDestroy(): void {
    this.userProfileSubscription.unsubscribe();
  }
}
