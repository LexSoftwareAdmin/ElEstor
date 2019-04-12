import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, MenuController, NavController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './services/user/user.service';
import { FuncionesGlobalesService } from './services/global/funciones-globales.service';
import { user } from 'src/interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  userData: user = new user();
  notifications: number = 1;
  cash: number = 1540.32;
  foto: string;
  option: string = "menu";

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private storage: Storage,
    private navCtrl: NavController,
    private userService: UserService,
    private globalFunctions: FuncionesGlobalesService,
    public events: Events
  ) {
    this.initializeApp();
    //deshabilita menú lateral
    this.menu.enable(false, 'menu');
    //checa si habian datos de inicio de session al iniciar la app para redirigir al home
    this.comprobarLogin();
    // escucha cambios en los datos de usuario generados en la pantalla update profile
    this.events.subscribe('emitUserData', (user) => {
      this.userData = user;
      this.foto = this.globalFunctions.convertToBase64(user.fotografia);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  //aquí iba a poner el badge de notificaciones, el cual ya existe pero funciona con numeros fijos
  getNotifications() {

  }

  //chaca datos de inicio de sesión anteriores y si hay redirige a home(mapa) 
  comprobarLogin() {
    this.storage.get('user_Data').then((val) => {
      if (val != undefined) {
        this.userData = val;
        this.navCtrl.navigateForward('home');
      }
    });
  }

  //esconde y muestra menú lateral
  toggleSideMenu() {
    this.menu.toggle('menu');
  }

  // cuando se hace click en ver perfil en menú lateral se redirige y se cierra el menu y se deshabilita
  verPerfil() {
    this.navCtrl.navigateForward('updateprofile');
    this.menu.close('menu');
    this.menu.enable(false, 'menu');
  }

  // habilita una variable que muestra u oculta cierto html
  pedidosEnEspera() {
    //llamar a bd para traer pedidos en espera
    this.option = "pedidosEnEspera";
  }

}
