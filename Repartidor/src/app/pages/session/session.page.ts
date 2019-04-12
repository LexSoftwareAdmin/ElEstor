import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage {

  constructor(private NavCtrl:NavController) { }

  Login(){
    this.NavCtrl.navigateForward('login');
  }

  New_User(){
    this.NavCtrl.navigateForward('register');
  }

}
