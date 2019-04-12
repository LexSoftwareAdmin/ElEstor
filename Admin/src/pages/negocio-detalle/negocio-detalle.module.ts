import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NegocioDetallePage } from './negocio-detalle';

@NgModule({
  declarations: [
    NegocioDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(NegocioDetallePage),
  ],
})
export class NegocioDetallePageModule {}
