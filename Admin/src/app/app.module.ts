import { MapPage } from './../pages/map/map';
import { NegocioAgregarProductoPage } from './../pages/negocio-agregar-producto/negocio-agregar-producto';
import { NegocioDetallePage } from './../pages/negocio-detalle/negocio-detalle';
import { NuevonegocioPage } from './../pages/nuevonegocio/nuevonegocio';
import { NegociosPage } from './../pages/negocios/negocios';
import { InicioPage } from './../pages/inicio/inicio';
import {  HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {AgmCoreModule} from '@agm/core';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RecuperarcuentaPage } from '../pages/recuperarcuenta/recuperarcuenta';
import { ElstorapiProvider } from '../providers/elstorapi/elstorapi';
import { ConfirmEqualValidatorDirective } from '../shared/password-validator';
import { PerfilPage } from '../pages/perfil/perfil';
import { PedidosPage } from '../pages/pedidos/pedidos';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    RecuperarcuentaPage,
    ConfirmEqualValidatorDirective,
    InicioPage,
    NegociosPage,
    PerfilPage,
    PedidosPage,
    NuevonegocioPage,
    NegocioDetallePage,
    NegocioAgregarProductoPage,
    MapPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({apiKey : ''})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    RecuperarcuentaPage,
    InicioPage,
    NegociosPage,
    PerfilPage,
    PedidosPage,
    NuevonegocioPage,
    NegocioDetallePage,
    NegocioAgregarProductoPage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ElstorapiProvider,
    Geolocation,
    Camera
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
