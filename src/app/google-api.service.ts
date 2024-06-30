import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '682533934194-fgf1vvle90bghjiiviv16i0g0s6mdhif.apps.googleusercontent.com',
  scope: 'openid profile email https://www.googleapis.com/auth/drive  https://www.googleapis.com/auth/drive.file',
  // 'https://www.googleapis.com/auth/drive.readonly'
  requireHttps: true // HTTPS obligatorio para producción
};

const key = 'AIzaSyBoySyFCT6UkbEdXckdmQELHUHEEfMqgwo'; 

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  userProfileChanged = new Subject<any>();
  isLogged = false;
  userProfile: any;

  constructor(private readonly oAuthService: OAuthService, private http: HttpClient) {
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.logoutUrl = 'https://www.google.com/accounts/Logout';
    this.checkAuthentication();
  }

  login() {
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          // Realiza las acciones aquí antes de redirigir a Google
          console.log('Acciones antes de redirigir a Google');
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then((userProfile) => {
            console.log(JSON.stringify(userProfile));
            this.isLogged = true;
            this.userProfile = userProfile;
            this.userProfileChanged.next(userProfile);
          });
        }
      });
    });
  }

  logout() {
    this.oAuthService.logOut();
  }

  public checkAuthentication() {
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.loadUserProfile().then((userProfile) => {
            console.log('Después del init login flow', userProfile);
            this.isLogged = true;
            this.userProfile = userProfile;
            this.userProfileChanged.next(userProfile);
          });
        }
      });
    });
  }

  public getFilesFromServer() {
    const url = 'https://www.googleapis.com/drive/v3/files';
    const headers = {
      'Authorization': `Bearer ${this.oAuthService.getAccessToken()}`
    };
      //  return this.http.get(url, { headers });
       return this.http.get<{ files: {  name: string }[] }>(url, { headers })
      
       .pipe(
           map(response => response.files
             .map(file => file.name))
         );
     }
  }
