import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NegocioAgregarProductoPage } from './negocio-agregar-producto';

@NgModule({
  declarations: [
    NegocioAgregarProductoPage,
  ],
  imports: [
    IonicPageModule.forChild(NegocioAgregarProductoPage),
  ],
})
export class NegocioAgregarProductoPageModule {}
