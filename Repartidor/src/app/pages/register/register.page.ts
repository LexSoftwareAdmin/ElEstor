import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { FuncionesGlobalesService } from 'src/app/services/global/funciones-globales.service';
import { user } from 'src/interfaces/user.interface';
import { UserService } from 'src/app/services/user/user.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  usr = new user();
  confirmPassword: string = "";

  constructor(private NavCtrl: NavController,
    private ASController: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private globalFunctions: FuncionesGlobalesService,
    private userService: UserService,
    private storage: Storage) {
    this.usr.foto = "assets/user.png";
  }
  //cuando se da click en registrar obtiene la foto y datos y los manda 
  Create_Account() {
    if (this.usr.nombre != "" && this.usr.apellidoPaterno != "" && this.usr.apellidoMaterno != "" && this.usr.email != "" && this.usr.contrasena != "" && this.confirmPassword != "") {
      if (this.usr.foto != "assets/user.png") {
        if (this.usr.contrasena == this.confirmPassword) {
          this.usr.foto = this.usr.foto.substring(this.usr.foto.indexOf(",") + 1, this.usr.foto.length - 1);
          this.userService.createNewUser(this.usr).subscribe((response: any) => {
            if (response.status == "success") {
              this.Clear_Data();
              this.globalFunctions.Show_Ok_Alert('Exito!', 'Se ha registrado con exito, Por favor incie sesi&oacute;n para continuar.');
              this.NavCtrl.navigateForward('session');
            }
            else {
              this.globalFunctions.Show_Ok_Alert('Error', 'Hubo un problema. Por favor intentalo nuevamente.');
            }
          },
            (error) => {
              this.globalFunctions.Show_Ok_Alert('Hubo problemas', 'problema del server');
              console.log(error);
            });
        }
        else
          this.globalFunctions.Show_Ok_Alert('Error', 'Las contraseñas no coinciden');
      }
      else
        this.globalFunctions.Show_Ok_Alert('Error', 'La foto de perfil es un dato obligatorio');
    }
    else
      this.globalFunctions.Show_Ok_Alert('Error', 'Los datos ingresados no son correctos. Intentalo nuevamente.');
  }

  //limpia los datos y regresa a pantalla inicial
  Cancel() {
    this.Clear_Data();
    this.NavCtrl.navigateBack('session');
  }

  //se deshace de todos los datos
  Clear_Data() {
    this.usr.clear();
    this.confirmPassword = "";
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
            this.usr.foto = value;
          });
        }
      }, {
        text: 'Usar camara',
        icon: 'camera',
        handler: () => {
          this.globalFunctions.Use_Camera().then((value) => {
            this.usr.foto = value;
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
