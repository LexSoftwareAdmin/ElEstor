import { MapPage } from './../map/map';
import { Negocio } from './../../models/model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NegocioAgregarProductoPage } from '../negocio-agregar-producto/negocio-agregar-producto';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-negocio-detalle',
  templateUrl: 'negocio-detalle.html',
})
export class NegocioDetallePage {

  negocioModel: Negocio;
  imgSource:any  = '/assets/imgs/user.png';
  mostrarDiv: boolean = false;
  //producto model


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation) {

      this.negocioModel =  navParams.get('item');
  }


  ionViewDidLoad() {}
  ionViewWillEnter(){

  }
  ionViewWillLeave(){}
  ionViewWillUnload(){}

  agregarProducto(biz)
  {
    this.navCtrl.push(NegocioAgregarProductoPage, {item:biz});
  }

  verMapa(biz)
  {
    this.navCtrl.push(MapPage, {item:biz});
  }
}
