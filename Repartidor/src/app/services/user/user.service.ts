import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { user } from 'src/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  URL: string = "https://localhost:5001/api/";

  constructor(private http: HttpClient) { }

  //comprueba el login 
  getLoginResponse(user: user) {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.URL + 'user/login', params, { headers: headers });
  }

  //crea nuevo usuario
  createNewUser(user: user) {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.URL + 'user/register', params, { headers: headers });
  }

  //reestablece contraseña (ojo, no hay seguridad aquí, solo si el correo existe en la BD se va a cambiar la contraseña)
  resetPassword(user: user) {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.URL + 'user/change_password', params, { headers: headers });
  }

  //obtiene información de un usuario por su id (nunca la usé)
  getUserData(id: number) {
    let params = new HttpParams().set('id_repartidor', id.toString());
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.URL + 'user/getUserData', { headers: headers, params: params });
  }

  //comprueba que el password en la BD coincida con el ingresado para actualizar posteriormente la info de usuario
  checkUserPassword(user: user) {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.URL + 'user/checkUserPassword', params, { headers: headers });
  }

  //actualiza datos de usuario (solo nombre, foto y apellidos)
  updateUserData(user: user) {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.URL + 'user/changeUserData', params, { headers: headers });
  }

  //establece un valor en la BD que indica si solicitó o no una alerta
  setAlert(id: any, alert: number) {
    let params = JSON.stringify({ id_repartidor: id, alerta: alert });
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.URL + 'user/sendAlert', params, { headers: headers });
  }

  //establece un id de usuario del repartidor que atiende alerta, al repartidor que la solicito
  setDeliverAtAlert(id_ref: number, id_aten: number) {
    let params = JSON.stringify({ id_repartidor: id_ref, fk_Rep_At_Alerta: id_aten });
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.URL + 'user/setDeliverAlert', params, { headers: headers });
  }

}
