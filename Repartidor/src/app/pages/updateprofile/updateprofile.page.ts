import { Component } from '@angular/core';
import { NavController, ActionSheetController, MenuController, Events } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { Storage } from '@ionic/storage';
import { FuncionesGlobalesService } from 'src/app/services/global/funciones-globales.service';
import { user } from 'src/interfaces/user.interface';
import { async } from '@angular/core/testing';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
})
export class UpdateprofilePage {

  confirmPassword: string = "";
  userData: user = new user();
  foto: string;

  constructor(private NavCtrl: NavController,
    private ASController: ActionSheetController,
    private globalFunctions: FuncionesGlobalesService,
    private menu: MenuController,
    private userService: UserService,
    private storage: Storage,
    public events: Events) {
    this.storage.get('user_Data').then((val) => {
      this.userData = val;
      this.foto = this.globalFunctions.convertToBase64(val.fotografia);
    });
  }

  //cuando hace click en aceptar se actualizan datos y se mandan a menú lateral para que actualicé cambios, remueve los anteriores
  //del storage y pone los nuevos
  Update_Account() {
    if (this.userData.contrasena == this.confirmPassword) {
      this.userService.checkUserPassword(this.userData).subscribe((response: any) => {
        if (response.status == "success") {
          this.userData.foto = this.foto.substring(this.foto.indexOf(",") + 1, this.foto.length - 1);
          this.userService.updateUserData(this.userData).subscribe((resp: any) => {
            if (response.status == "success") {
              this.userData.clear();
              this.confirmPassword = "";
              this.globalFunctions.Show_Ok_Alert('Exito', 'Sus datos fueron guardados con exito.');
              this.events.publish('emitUserData', resp.user[0]);
              this.storage.remove('user_Data').then(() => {
                this.storage.set('user_Data', resp.user[0]);
                this.Cancel();
              });
            }
            else
              this.globalFunctions.Show_Ok_Alert('Error inesperado', 'Sus datos no pudieron ser modificados. Por favor intentelo nuevamente.' + response.message);
          });
        }
        else
          this.globalFunctions.Show_Ok_Alert('Error', 'Sus datos no pudieron ser modificados. Por favor intentelo nuevamente.');
      });
    }
    else
      this.globalFunctions.Show_Ok_Alert('Error', 'Sus contraseñas no coinciden. Por favor intentelo nuevamente.');
  }

  //regresa al menú lateral cuando se hace click en cancelar
  Cancel() {
    this.menu.enable(true, 'menu');
    this.menu.open('menu');
    this.NavCtrl.navigateBack('home');
  }

  //checa que la cadena cumpla con la expresion regular , sino, borra el ultimo digito ingresado 
  validate_inputs(target, option) {
    target.value = this.globalFunctions.validate_fields(target.value, option);
  }

  //muestra action sheet para que seleccione camara o galeria y devuelve la imagen en base 64
  async Show_Action_Sheet() {
    const actionSheet = await this.ASController.create({
      header: 'Foto del perfil',
      buttons: [{
        text: 'Seleccionar foto',
        icon: 'image',
        handler: () => {
          this.globalFunctions.Upload_Picture().then((value) => {
            this.foto = value;
          });
        }
      }, {
        text: 'Usar camara',
        icon: 'camera',
        handler: () => {
          this.globalFunctions.Use_Camera().then((value) => {
            this.foto = value;
          });
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

}
