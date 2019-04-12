import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'session', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'session', loadChildren: './pages/session/session.module#SessionPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'recoverpassword', loadChildren: './pages/recoverpassword/recoverpassword.module#RecoverpasswordPageModule' },
  { path: 'updateprofile', loadChildren: './pages/updateprofile/updateprofile.module#UpdateprofilePageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }