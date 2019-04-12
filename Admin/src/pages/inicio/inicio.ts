import { User } from './../../models/model';
import { NegociosPage } from './../negocios/negocios';
import { PedidosPage } from './../pedidos/pedidos';
import { PerfilPage } from './../perfil/perfil';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {
  public userModel: User = new User();
  imgSource:any  = '/assets/imgs/user.png';

  constructor(public navCtrl: NavController,
    public navParams: NavParams)
  {
      this.userModel = navParams.get('item');
  }


  ionViewDidLoad() {}
  ionViewWillEnter(){

  }
  ionViewWillLeave(){}
  ionViewWillUnload(){}

  verPerfil($event)
  {
      this.navCtrl.push(PerfilPage,{item:this.userModel});
  }

  verPedidos($event)
  {
    this.navCtrl.push(PedidosPage,{item:this.userModel});
  }

  verNegocios($event)
  {
    this.navCtrl.push(NegociosPage,{item:this.userModel});
  }
}
