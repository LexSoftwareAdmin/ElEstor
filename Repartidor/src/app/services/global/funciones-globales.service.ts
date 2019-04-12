import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FuncionesGlobalesService {

  constructor(public alertController: AlertController, private camera: Camera, private imagePicker: ImagePicker) { }

  //valida que una cadena cumpla con la expresion regular dada, de acuerdo a si es una cadena de tipo contraseña o texto normal,
  //email deshabilitado porque nunca se especificó 
  validate_fields(chain, option) {
    chain = chain.replace('`', '').replace('´', '').replace('^', '').replace('¨', '').trimStart();
    switch (option) {
      case 'text':
        if (!chain.match(/^[a-zA-Z\s]+$/))
          chain = chain.substring(0, chain.length - 1);
        break;
      case 'password':
        if (!chain.match(/^([a-zA-Z0-9]{1,8})$/))
          chain = chain.substring(0, chain.length - 1);
        break;
      /*case 'email':
        if (!chain.match(/^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$/))
          chain = chain.substring(0, chain.length - 1);
        break;*/
    }
    return chain;
  }

  //tipico alert con boton ok global donde mandas el mensage y titulo a mostrar
  async Show_Ok_Alert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  //funcionalidad de tomar foto en la selección de foto de perfil
  async Use_Camera() {
    var res = '';
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    await this.camera.getPicture(options).then((imageData) => {
      res = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log('error' + JSON.stringify(err));
    });
    return res;
  }

  //funcionalidad de galeria en la selección de foto
  async Upload_Picture() {
    var res = '';
    let options: ImagePickerOptions = {
      quality: 100,
      outputType: 1,
      maximumImagesCount: 1
    };
    await this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        res = 'data:image/jpeg;base64,' + results[i];
      }
    }, (err) => {
      console.log("ERROR", JSON.stringify(err));
    });
    return res;
  }

  //devuelve una cadena obtenida de blob de la bd en formato base 64
  convertToBase64(text) {
    var res = "data:image/png;base64," + window.atob(text);
    return res;
  }

}
