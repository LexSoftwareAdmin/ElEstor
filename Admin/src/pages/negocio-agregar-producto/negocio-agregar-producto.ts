import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Negocio } from '../../models/model';

@IonicPage()
@Component({
  selector: 'page-negocio-agregar-producto',
  templateUrl: 'negocio-agregar-producto.html',
})
export class NegocioAgregarProductoPage {

  public negocioModel: Negocio = new Negocio();

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {

      this.negocioModel =  navParams.get('item');
  }

  ionViewDidLoad() {}
  ionViewWillEnter(){

  }
  ionViewWillLeave(){}
  ionViewWillUnload(){}

}
