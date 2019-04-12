import { InicioPage } from './../inicio/inicio';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Toast, ToastController, LoadingController } from 'ionic-angular';
import { User } from '../../models/model';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { ElstorapiProvider } from '../../providers/elstorapi/elstorapi';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  userModel: User = new User();
  formGroup: FormGroup;
  email:AbstractControl;
  password:AbstractControl;
  nombre: AbstractControl;
  apellidoPaterno: AbstractControl
  apellidoMaterno: AbstractControl;
  nombreUsuario:AbstractControl;
  confirmPassword:AbstractControl;
  numeroTelefonico:AbstractControl;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public api: ElstorapiProvider,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public loadingCtrl: LoadingController)
    {
      this.formGroup = formBuilder.group({
        email: ['',[Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(8)]],
      nombre:['', [Validators.required]],
      apellidoPaterno:['', [Validators.required]],
      apellidoMaterno:['', [Validators.required]],
      nombreUsuario:['', [Validators.required]],
      confirmPassword:['', [Validators.required]],
      numeroTelefonico:['', [Validators.required]]
      });

      this.email = this.formGroup.controls['email'];
      this.password = this.formGroup.controls['password'];
      this.nombre = this.formGroup.controls['nombre'];
      this.apellidoPaterno = this.formGroup.controls['apellidoPaterno'];
      this.apellidoMaterno = this.formGroup.controls['apellidoMaterno'];
      this.nombreUsuario = this.formGroup.controls['nombreUsuario'];
      this.confirmPassword = this.formGroup.controls['confirmPassword'];
      this.numeroTelefonico = this.formGroup.controls['numeroTelefonico'];
  }


  ionViewDidLoad() {}
  ionViewWillEnter(){

  }
  ionViewWillLeave(){}
  ionViewWillUnload(){}

  crearCuenta($event, usr)
  {
    let title = '';
    let subTitle = '';
    this.userModel = usr;

    this.api.registrarUsuario(usr).subscribe(
      (data: User) => {
        title = data !== null? 'Usuario Creado':
                data === null? 'El correo ya esta registrado':
                                          'Ocurrio un error';

        subTitle = data !== null? 'Usuario registrado correctamente!':
                  data === null? 'Ya existe una cuenta asociada al correo electrònico ' + this.userModel.email :
                                            data.toString();

        let alert = this.alertCtrl.create({
          title: title,
          subTitle: subTitle,
          buttons: [{
              text: 'Ok',
            handler: () => {
                if(data !== null)
                {
                  let loader = this.loadingCtrl.create({
                    content: 'Iniciando sesion...'
                  });
                  loader.present().then(() => {
                    this.navCtrl.push(InicioPage, {item:this.userModel});
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
  }

  cancelar()
  {
    this.navCtrl.pop();
  }
}
