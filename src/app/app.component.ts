import { Component } from '@angular/core';
import { GoogleApiService } from './google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CriptografiaSegundoParcial';

  constructor(public readonly google: GoogleApiService){

  }

  userLogged= true;
  // user = 'juancito';
  // email = 'juancito@gmail.com'

  onLogin(){
    this.google.login();
  }

  onLogout(){
    this.google.logout();
  }
}
