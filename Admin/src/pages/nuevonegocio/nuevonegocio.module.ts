import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NuevonegocioPage } from './nuevonegocio';

@NgModule({
  declarations: [
    NuevonegocioPage,
  ],
  imports: [
    IonicPageModule.forChild(NuevonegocioPage),
  ],
})
export class NuevonegocioPageModule {}
