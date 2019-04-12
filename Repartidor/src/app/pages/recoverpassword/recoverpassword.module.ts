import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecoverpasswordPage } from './recoverpassword.page';

const routes: Routes = [
  {
    path: '',
    component: RecoverpasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RecoverpasswordPage]
})
export class RecoverpasswordPageModule {}
