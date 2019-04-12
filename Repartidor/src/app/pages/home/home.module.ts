import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AlertaPage } from '../alerta/alerta.page';
import { AlertaPageModule } from '../alerta/alerta.module';

@NgModule({
  entryComponents: [
    AlertaPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    AlertaPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}