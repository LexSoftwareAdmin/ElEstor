import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FuncionesGlobalesService } from 'src/app/services/global/funciones-globales.service';
import { user } from 'src/interfaces/user.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-recoverpassword',
  templateUrl: './recoverpassword.page.html',
  styleUrls: ['./recoverpassword.page.scss'],
})
export class RecoverpasswordPage {

  confirmPassword: string = "";
  usr = new user();

  constructor(private NavCtrl: NavController, private globalFunctions: FuncionesGlobalesService, private userService: UserService) { }

  //cuando se da click en cambiar contraseña
  Change_Password() {
    if (this.usr.contrasena.length < 8 && this.confirmPassword.length < 8) {
      if (this.usr.contrasena == this.confirmPassword) {
        this.userService.resetPassword(this.usr).subscribe((response: any) => {
          if (response.status == "success") {
            this.Clear_Data();
            this.globalFunctions.Show_Ok_Alert('Correcto', 'Su contraseña fue restablecida con exito.');
            this.NavCtrl.navigateForward('session');
          }
          else {
            this.globalFunctions.Show_Ok_Alert('Error', 'Hubo un problema. Por favor intentalo nuevamente.');
          }
        },
          (error) => {
            this.globalFunctions.Show_Ok_Alert('Error', 'Existen problemas con el servidor');
            console.log(error);
          });
      }
      else {
        this.globalFunctions.Show_Ok_Alert('Error', 'Las contraseñas no coinciden');
      }
    }
    else {
      this.globalFunctions.Show_Ok_Alert('Error', 'Las contraseñas no pueden exceder los 8 caracteres');
    }
  }

  Cancel() {
    this.Clear_Data();
    this.NavCtrl.navigateBack('session');
  }

  //checa que la cadena cumpla con la expresion regular , sino, borra el ultimo digito ingresado
  validate_input(target, option) {
    target.value = this.globalFunctions.validate_fields(target.value, option);
  }

  //se deshace de todos los datos
  Clear_Data() {
    this.usr.clear();
    this.confirmPassword = "";
  }

}
