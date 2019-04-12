import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/model';
import { ElstorapiProvider } from '../../providers/elstorapi/elstorapi';
import { urlToNavGroupStrings } from 'ionic-angular/umd/navigation/url-serializer';

@IonicPage()
@Component({
  selector: 'page-recuperarcuenta',
  templateUrl: 'recuperarcuenta.html',
})
export class RecuperarcuentaPage {
  userModel: User = new User();
  formGroup: FormGroup;
  email:AbstractControl;
  password:AbstractControl;
  confirmPassword:AbstractControl;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public api: ElstorapiProvider,
    public alertCtrl: AlertController,
    public toastController: ToastController) {

      this.formGroup = formBuilder.group({
        email: ['',[Validators.required, Validators.email]],
        password:['', [Validators.required, Validators.minLength(8)]],
        confirmPassword:['', [Validators.required, Validators.minLength(8)]]
        });

        this.email = this.formGroup.controls['email'];
        this.password = this.formGroup.controls['password'];
        this.confirmPassword = this.formGroup.controls['confirmPassword'];
  }


  ionViewDidLoad() {}
  ionViewWillEnter(){

  }
  ionViewWillLeave(){}
  ionViewWillUnload(){}

  guardaContrasena($event, usr)
  {
    let title = '';
    let subTitle = '';
    this.userModel = usr;

    this.api.recuperarCuenta(usr).subscribe(
      (data: User) => {
        title = data.toString() === '1'? 'Cuenta Recuperada' :
                data.toString() === '0'? 'El correo no existe':
                                          'Ocurrio un error';

        subTitle = data.toString() === '1'? 'Se recupero correctamente su cuenta!':
                  data.toString() ===  '0'? 'El correo '+ this.userModel.email + ' no existe':
                                            data.toString();

        let alert = this.alertCtrl.create({
          title: title,
          subTitle: subTitle,
          buttons: ['Ok']
        });

        alert.present().then(() => {

        });
      },
       (error: any) => {
         <any>error
        }
       );
  }
  cancelar()
  {
    this.navCtrl.pop();
  }
}
