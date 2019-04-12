import { RecuperarcuentaPage } from './../recuperarcuenta/recuperarcuenta';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms'
import { InicioPage } from './../inicio/inicio';
import { User } from '../../models/model';
import { ElstorapiProvider } from '../../providers/elstorapi/elstorapi';
import { timeInterval } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userModel: User = new User();
  formGroup: FormGroup;
  email:AbstractControl;
  password:AbstractControl;

  imgSource:any  = '/assets/imgs/user.png';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public api: ElstorapiProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastController: ToastController) {

                this.formGroup = formBuilder.group({
                  email: ['',[Validators.required, Validators.email]],
                password:['', [Validators.required, Validators.minLength(8)]]
                });

                this.email = this.formGroup.controls['email'];
                this.password = this.formGroup.controls['password'];
  }


  ionViewDidLoad() {}
  ionViewWillEnter(){

  }
  ionViewWillLeave(){}
  ionViewWillUnload(){}

  iniciarSesion($event, usr)
  {
    let title = '';
    let subTitle = '';
    this.userModel = usr;

    let loader = this.loadingCtrl.create({
      content: 'Iniciando sesion...'
    });

    loader.present().then(() => {

      this.api.inicarSesion(usr).subscribe(
        (data: User) => {

          title = data !== null && data[0] !== undefined ? 'Bienvenido':
                    data === null || data[0] === undefined ? 'Ocurrio un error':
                    'Usuario/password incorrecto';
          subTitle = data !== null && data[0] !== undefined ? 'Bienvenido ' + data[0].nombreUsuario:
                      data === null || data[0] === undefined ? 'Ocurrio un error al tratar de iniciar sesion':
                      'Usuario/password incorrecto';

          let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: [{
              text: 'Ok',
            handler: () => {
                if(data !== null && data[0] !== undefined)
                {
                  let loader = this.loadingCtrl.create({
                    content: 'Iniciando sesion...'
                  });
                  loader.present().then(() => {
                    this.navCtrl.push(InicioPage, {item:data[0]});
                    loader.dismiss();
                  });
                }
            }
          }]
          });

            alert.present().then(() => {

            });
        },
         (error: any) => {
          <any>error
          }
          );
         loader.dismiss();
    });
        // loader.dismiss();
        // toast.dismiss();
  }

  recuperarCuenta()
  {
    this.navCtrl.push(RecuperarcuentaPage)
  }


}
