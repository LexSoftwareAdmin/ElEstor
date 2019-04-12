import { Injectable, ViewChild } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { user } from 'src/interfaces/user.interface';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(private http: HttpClient) { }

  //observables 
  public dataChange: Subject<user[]> = new Subject<user[]>();
  public ordersDataChange: Subject<object[]> = new Subject<object[]>();
  public DeliverResponseDataChange: Subject<user[]> = new Subject<user[]>();
  public FollowDeliverDataChange: Subject<user[]> = new Subject<user[]>();
  public deliversDataChange: Subject<user[]> = new Subject<user[]>();

  //url de la webapi
  URL: string = "https://localhost:5001/api/";

  private hubConnection: signalR.HubConnection;
  private hubConnection2: signalR.HubConnection;
  private hubConnection3: signalR.HubConnection;
  private hubConnection4: signalR.HubConnection;
  private hubConnection5: signalR.HubConnection;

  //inicia conexion para escuchar cambios de posición en los repartidores disponibles (estatus 3)
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/map/getDeliversPosition')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  //se suscribe a esa url y cada 5 segundos trae datos que se almacenan en this.dataChange
  getDeliversPosition() {
    this.hubConnection.on('getDeliversPosition', (data) => {
      this.dataChange.next(data.result);
    });
  }

  //se llama a la url para suscribirse
  getDeliversLocation() {
    return this.http.get(this.URL + 'map/getDeliversPosition');
  }

  //se detiene conexion, creo que esto no funcionaba correctamente
  stopConnectionDelivers() {
    this.hubConnection.stop();
    this.hubConnection = null;
  }





  //guarda la posicion actual en la BD
  setCurrentPosition(data: any) {
    let params = JSON.stringify(data);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.URL + 'map/saveDeliverPosition', params, { headers: headers });
  }

  //obtiene los establecimientos guardados en la base de datos
  getEstablishments() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.URL + 'map/getEstablishments', { headers: headers });
  }




//inicia conexion para obtener pedidos no asignados (yo asumí que eran los de estaus 2)
  startConnection2() {
    this.hubConnection2 = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/orders/getNotAsignedOrders')
      .build();

    this.hubConnection2
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  getNotAsignedOrders() {
    this.hubConnection2.on('getNotAsignedOrders', (data) => {
      this.ordersDataChange.next(data.result);
    });
  }

  getUnasignedOrders() {
    return this.http.get(this.URL + 'orders/getNotAsignedOrders');
  }

  //se detiene conexion, creo que esto no funcionaba correctamente
  stopConnectionOrders() {
    this.hubConnection2.stop();
    this.hubConnection2 = null;
  }




  // inia conexion para saber cuando un repartidor acepto alerta
  startConnectionDeliverAlert() {
    this.hubConnection3 = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/user/getDeliverResponse')
      .build();

    this.hubConnection3
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  getDeliverResponse() {
    this.hubConnection3.on('getDeliverResponse', (data) => {
      this.DeliverResponseDataChange.next(data.result);
    });
  }

  getDeliverResponseSubscribe(_id: number) {
    let params = new HttpParams().set('id_repartidor', _id.toString());
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.URL + 'user/getDeliverResponse', { headers: headers, params: params });
  }

  //se detiene conexion, creo que esto no funcionaba correctamente
  stopConnectionAlertAcepted() {
    this.hubConnection3.stop();
    this.hubConnection3 = null;
  }




  //inicia conexión para seguir posición del repartidor que atendió alerta
  startConnectionFollowDeliver() {
    this.hubConnection4 = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/map/FollowDeliverPosition')
      .build();

    this.hubConnection4
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  FollowDeliver() {
    this.hubConnection4.on('FollowDeliverPosition', (data) => {
      this.FollowDeliverDataChange.next(data.result);
    });
  }

  FollowDeliverResponseSubscribe(_id: number) {
    let params = new HttpParams().set('id_repartidor', _id.toString());
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.URL + 'map/FollowDeliverPosition', { headers: headers, params: params });
  }

  //se detiene conexion, creo que esto no funcionaba correctamente
  stopConnectionFollowDeliver() {
    this.hubConnection4.stop();
    this.hubConnection4 = null;
  }


  //inicia conexión para saber cuando alguien solicitó ayuda
  startConnectionListeningForAlert() {
    this.hubConnection5 = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/map/listenForAlert')
      .build();

    this.hubConnection5
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  listeningForAlert() {
    this.hubConnection5.on('listenForAlert', (data) => {
      this.deliversDataChange.next(data.result);
    });
  }

  listenForAlert() {
    return this.http.get(this.URL + 'map/listenForAlert');
  }

  //se detiene conexion, creo que esto no funcionaba correctamente
  stopConnectionListenDelivers() {
    //this.hubConnection5.off('listenForAlert');
    this.hubConnection5.stop();
    this.hubConnection5 = null;
  }


}
