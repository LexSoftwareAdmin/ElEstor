import { NuevonegocioPage } from './../nuevonegocio/nuevonegocio';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { User, Negocio } from '../../models/model';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ElstorapiProvider } from '../../providers/elstorapi/elstorapi';
import { t } from '@angular/core/src/render3';
import { NegocioDetallePage } from '../negocio-detalle/negocio-detalle';

@IonicPage()
@Component({
  selector: 'page-negocios',
  templateUrl: 'negocios.html',
})
export class NegociosPage {

  userModel: User = new User();
  negocioModel: Negocio[];
  mostrarDiv: boolean = false;
  clientid: string = '';
  message:string = "Obteniendo listado de negocios..";

  imgSource:any  = '/assets/imgs/user.png';

  tcontroller: ToastController;

  constructor(public navCtrl: NavController,
            public navParams: NavParams,
            public api: ElstorapiProvider,
            public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastController: ToastController)
  {
    this.userModel =  navParams.get('item');
    this.clientid = this.userModel.clientid;
  }

  ionViewDidLoad() {}
  ionViewWillEnter(){
    this.getNegocios();
  }
  ionViewWillLeave(){}
  ionViewWillUnload(){}

  agregarNegocio($event)
  {
      this.navCtrl.push(NuevonegocioPage, {item:this.userModel});
  }

  negocioDetalle(biz)
  {
      this.navCtrl.push(NegocioDetallePage, {item:biz})
  }

  getNegocios()
  {
    let loader = this.loadingCtrl.create({
      content: this.message
    });
    const toast = this.toastController.create({
      message: 'Connection error...',
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Done'
    });

    loader.present().then(() => {
      this.api.obtenerNegocio(this.clientid).subscribe(
        (data: Negocio[]) => {
          if(data !== null)
          {
              this.negocioModel = data;
              this.mostrarDiv = false;
          }
          else
          {
              toast.present().then(() => {
                toast.dismiss();
              });
          }
        },
         (error: any) =>  {
           console.log(error)
          });
         loader.dismiss();
    });
  }
}
