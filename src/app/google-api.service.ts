import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '682533934194-fgf1vvle90bghjiiviv16i0g0s6mdhif.apps.googleusercontent.com',
  scope: 'openid profile email',

}

@Injectable({
  providedIn: 'root'
})

export class GoogleApiService {

  userProfile: any;
  isLogged = false;

  constructor(private readonly oAuthService: OAuthService) {

  }

  login() {

    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout'
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then((userProfile) => {
            console.log(JSON.stringify(userProfile));
            this.isLogged = true;
            this.userProfile = userProfile;
          });

        }

      })
    });
  }

  logout() {
    this.oAuthService.logOut();
  }

}