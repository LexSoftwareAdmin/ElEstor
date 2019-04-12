import { Negocio } from './../../models/model';
import { ElstorapiProvider } from './../../providers/elstorapi/elstorapi';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  public map : any = {};
  public negocioModel: Negocio = new Negocio();

  constructor(private api: ElstorapiProvider
    , public navParams: NavParams) {

    this.negocioModel =  navParams.get('item');

    this.map =
    {
      lat: this.negocioModel.latitud,
      lng: this.negocioModel.longitud,
      zoom:12,
      markeLabel: this.negocioModel.callenumero
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

}
