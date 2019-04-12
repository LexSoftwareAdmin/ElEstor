import { Component, OnInit, destroyPlatform } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MenuController, NavController, Events, AlertController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { FuncionesGlobalesService } from 'src/app/services/global/funciones-globales.service';
import { HomeService } from 'src/app/services/homeService/home.service';
import { interval, Subject } from 'rxjs';
import { SignalRService } from 'src/app/services/signalr/signal-r.service';
import { user } from 'src/interfaces/user.interface';
import { async } from 'q';
import { validateConfig } from '@angular/router/src/config';
import { userInfo } from 'os';
import { order } from 'src/interfaces/order.interface';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertaPage } from '../alerta/alerta.page';


declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mapa: any = null;
  id: number;
  myMarker: any;
  notifications: number = 0;
  deliverMarkers = [];
  delivers = [];
  alertOfProblem: any;
  HelpMarker: any;
  currentPosition = { lat: 0, lng: 0 };
  currentPosition2: Subject<object> = new Subject<object>();
  rechazoAlerta = false;
  helpDisabled: boolean = false;

  constructor(private storage: Storage,
    private afdb: AngularFireDatabase,
    private homeSevice: HomeService,
    private globalFunctions: FuncionesGlobalesService,
    public signalRService: SignalRService,
    private geolocation: Geolocation,
    private menu: MenuController,
    private userService: UserService,
    public events: Events,
    public alertController: AlertController,
    private modalCtrl: ModalController) {
    this.menu.enable(true, 'menu');
    this.afdb.list("pedidos").snapshotChanges().subscribe(data=>{
      data.map(data=>{
        console.log(data.payload.val());
      });
    });
  }

  //evento que ocurre cuando se hace click en boton ayuda
  Help() {
    this.Show_Help_Alert();
  }

  async newPedido(){
    const modal =  await this.modalCtrl.create({
      component: AlertaPage,
      cssClass: "alertaModal"
    });

    modal.present();

    
  }

  //alert que se muestra al usuario que dió click en ayuda para confirmar que realmente la necesite
  async Show_Help_Alert() {
    const alert = await this.alertController.create({
      header: "¿Tienes algun Problema?",
      backdropDismiss: false,
      message: "Si deseas enviar tú ubicación para recibir ayuda de otro repartidor haz clic en continuar.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Continuar',
          cssClass: 'primary',
          handler: () => {
            this.waitDeliverResponse();
            //para que no puda hacer click de nuevo en ayuda
            this.helpDisabled = true;
          }
        }
      ]
    });
    await alert.present();
  }

  //establece que necesita ayuda en la BD y muestra alert de que espere por alguien que confirme que atenderá su alerta
  // y se suscribe a la espera de que alguien confirme
  //cuando alguien confirma cierra el ultimo alert de espera, detiene conexiones, muestra alert de que tal usuario atendió
  //su alerta y traza ruta entre el y el repartidor que lo atendió y se suscribe a cambios de posicion del repartidor que atenió
  //cuando el repartidor esta a menos de 30 mts de llegar entonces manda alerta de que ya anda por ahí :v 
  async waitDeliverResponse() {
    this.userService.setAlert(this.id, 1).subscribe(async (response: any) => {
      if (response.status == "success") {
        this.Show_Wait_Alert();
        this.signalRService.startConnectionDeliverAlert();
        this.signalRService.getDeliverResponse();
        this.signalRService.getDeliverResponseSubscribe(this.id).subscribe(async (resp: any) => {
          if (resp.message == "Request Completed") {
            this.signalRService.DeliverResponseDataChange.subscribe(async (value: any) => {
              if (value.length > 0) {
                this.alertOfProblem.dismiss();
                this.signalRService.stopConnectionDelivers();
                //this.signalRService.stopConnectionOrders();
                this.signalRService.stopConnectionAlertAcepted();
                this.deleteDelivers();
                this.Show_Confirm_Alert(value[0].nombre + ' ' + value[0].apellidoPaterno + ' se dirige a tu ubicación.');
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                directionsDisplay.setMap(this.mapa);
                directionsDisplay.setOptions({ suppressMarkers: true, preserveViewport: true });
                var cont = 0;
                this.signalRService.startConnectionFollowDeliver();
                this.signalRService.FollowDeliver();
                this.signalRService.FollowDeliverResponseSubscribe(value[0].id_repartidor).subscribe((res: any) => {
                  this.signalRService.FollowDeliverDataChange.subscribe(async (val: any) => {
                    this.establecerRuta({ lat: val[0].latitud, lng: val[0].longitud }, this.currentPosition, directionsService, directionsDisplay);
                    this.HelpMarker = this.setMarker(val[0].latitud, val[0].longitud, this.HelpMarker);
                    if (cont == 0) {
                      this.mapa.setCenter({ lat: val[0].latitud, lng: val[0].longitud });
                      this.mapa.setZoom(16);
                    }
                    cont++;
                    var service = new google.maps.DistanceMatrixService;
                    var distance = await this.getDistance(service, { lat: val[0].latitud, lng: val[0].longitud }, this.currentPosition);
                    if (distance < 30) {
                      //this.signalRService.FollowDeliverDataChange.unsubscribe();
                      this.signalRService.stopConnectionFollowDeliver();
                      this.Show_New_Deliver_Arrived(value[0], directionsDisplay);
                    }
                  });
                });

              }
            });
          }
        });
      }
    });
  }

  //elimina los repartidores disponibles (estatus 3) que estaban como marcadores en el mapa
  deleteDelivers() {
    //eliminar marcadores de repartidores disponibles
    for (var i in this.deliverMarkers) {
      this.deliverMarkers[i].setMap(null);
    }
    this.deliverMarkers = [];
  }

  //muestra alert de espera...
  async Show_Wait_Alert() {
    this.alertOfProblem = await this.alertController.create({
      backdropDismiss: false,
      message: '<h5>Esepere en lo que un repartidor acepta su llamado.</h5><br/><ion-progress-bar type="indeterminate" reversed="true"></ion-progress-bar><br/>'
    });
    await this.alertOfProblem.present();
  }

  //muestra alert de quien fue quien acepto la alerta
  async Show_Confirm_Alert(message: string) {
    this.alertOfProblem = await this.alertController.create({
      backdropDismiss: false,
      header: 'Un repartidor atendio a tu llamado',
      message: message,
      buttons: ['OK']
    });
    await this.alertOfProblem.present();
  }

  //alert que se muestra cuando ya casi llega el repartidor que atendio alerta (30mts o menos) y se vuelve a suscribir a conexiones
  // y regresa a la normalidad
  async Show_New_Deliver_Arrived(repartidor, directionsDisplay) {
    let alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Repartidor llegando...',
      message: repartidor.nombre + ' ' + repartidor.apellidoPaterno + ' está por llegar a tu ubicación. Por favor presiona el boton de confirmar cuando el repartidor haya llegado.',
      buttons: [
        {
          text: 'Confirmar',
          cssClass: 'primary',
          handler: () => {
            this.userService.setAlert(this.id, 0).subscribe((respon: any) => { });
            this.userService.setDeliverAtAlert(repartidor.id_repartidor, 0).subscribe((respon: any) => { });
            directionsDisplay.setMap(null);
            this.HelpMarker.setMap(null);
            this.HelpMarker = undefined;
            this.getDeliversPosition();
            this.helpDisabled = false;
            this.mapa.setCenter(this.currentPosition);
            this.mapa.setZoom(14);
          }
        }
      ]
    });
    await alert.present();
  }






  //se suscribe a la espera de que alguien mande una alerta y si esa alerta no tiene asociado un repartidor que la atienda
  //y el usuario actual no la rechazo anteriormente entonces manda alerta
  hearForAlert() {
    this.signalRService.startConnectionListeningForAlert();
    this.signalRService.listeningForAlert();
    this.signalRService.listenForAlert().subscribe((response: any) => {
      this.signalRService.deliversDataChange.subscribe((value: any) => {

        if (value != null) {
          for (var i = 0; i < value.length; i++) {
            if (value[i].alerta && value[i].fk_Rep_At_Alerta == null && !this.rechazoAlerta) {
              this.signalRService.stopConnectionListenDelivers();
              this.existeAlerta(value, value[i]);
            }
          }
        }

      });
    });
  }

  //itera cada usuario que este diaponible y le manda la alerta de que alguien necesita ayuda en caso de existir este.
  async existeAlerta(arr, alerta) {
    var service = new google.maps.DistanceMatrixService;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].estatus == 3) {
        arr[i].distance = await this.getDistance(service, this.currentPosition, { lat: arr[i].latitud, lng: arr[i].longitud });
      }
    }
    arr = this.menorDistancia(arr);
    for (var h = 0; h < arr.length; h++) {
      if (h < 5 && arr[h].estatus == 3 && this.id != alerta.id_repartidor && this.id == arr[h].id_repartidor) {
        this.showEmergencyAlert(alerta.nombre + ' ' + alerta.apellidoPaterno, alerta);
      }
    }
  }

  //recive un origen y un destino y dos objetos de google donde traza la ruta sobre el mapa de acuerdo a ese origen y fin 
  establecerRuta(origen, destino, directionsService, directionsDisplay) {
    directionsService.route({
      origin: origen,
      destination: destino,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status == 'OK') {
        //trazar ruta
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });

  }

  //Alert que se muestra a los usuarios si alguien tuvo un problema, si acepta se establece al usuario que acepto en la base de datos
  //deja de escuchar posicion de repartidores, deja de escuchar alertas, quita repartidores del mapa
  //traza ruta entre el y el usuario destino y cuando está a menos de 30 metros manda alerta y se suscribe de nuevo a esperar alertas y a ver 
  //posicion de repartidores
  async showEmergencyAlert(name, userAlert) {
    const al = await this.alertController.create({
      header: "ALERTA",
      backdropDismiss: false,
      message: "El repartidor " + name + " tuvo un problema, ¿Deseas ayudarlo?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.rechazoAlerta = true;
            this.hearForAlert();
          }
        },
        {
          text: 'Ayudar',
          cssClass: 'primary',
          handler: () => {
            this.userService.setDeliverAtAlert(userAlert.id_repartidor, this.id).subscribe((response: any) => {
              if (response.status = "success") {
                this.helpDisabled = true;
                this.signalRService.stopConnectionDelivers();
                this.deleteDelivers();
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                directionsDisplay.setMap(this.mapa);
                directionsDisplay.setOptions({ suppressMarkers: true, preserveViewport: true });
                let cont = 0;
                this.establecerRuta(this.currentPosition, { lat: userAlert.latitud, lng: userAlert.longitud }, directionsService, directionsDisplay);
                this.HelpMarker = this.setMarker(userAlert.latitud, userAlert.longitud, this.HelpMarker);
                this.mapa.setZoom(16);
                this.mapa.setCenter(this.currentPosition);
                this.currentPosition2.subscribe(async (data) => {
                  this.establecerRuta(this.currentPosition, { lat: userAlert.latitud, lng: userAlert.longitud }, directionsService, directionsDisplay);
                  var service = new google.maps.DistanceMatrixService;
                  var distance = await this.getDistance(service, this.currentPosition, { lat: userAlert.latitud, lng: userAlert.longitud });
                  if (distance < 30) {
                    //this.currentPosition2.unsubscribe();
                    directionsDisplay.setMap(null);
                    this.HelpMarker.setMap(null);
                    this.helpDisabled = false;
                    this.HelpMarker = undefined;
                    this.mapa.setCenter(this.currentPosition);
                    this.mapa.setZoom(14);
                    if (userAlert.estatus > 3) {
                      this.globalFunctions.Show_Ok_Alert('Has llegado', 'El repartidor al que has ayudado tenía pedidos pendientes, ahora es tu turno continuar con ellos.');
                    }
                    else {
                      this.getDeliversPosition();
                      this.globalFunctions.Show_Ok_Alert('Has llegado', 'Sabemos que has llegado con el repartidor que solicitó ayuda.');
                    }
                  }
                });
              }
              else {
                this.globalFunctions.Show_Ok_Alert('Hubo un problema', 'Lo sentimos. alguien más ha aceptado acudir a la ayuda antes que tu');
                this.hearForAlert();
              }
            });
          }
        }
      ]
    });
    await al.present();
  }

  //burbuja pa' ordenar de menor distancia a mayor 
  menorDistancia(arr) {
    for (var i = 1; i < arr.length; i++) {
      for (var j = 0; j < (arr.length - i); j++) {
        if (arr[j].distance > arr[j + 1].distance) {
          let aux = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = aux;
        }
      }
    }
    return arr;
  }

  //recive un objeto service de google, un origen y un destino(podria recivir array pero no lo hice así :v ) y
  //devuelve la distancia en base a esas coordenadas en mts
  async getDistance(service, origin, destination) {
    return new Promise(resolve => {
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (response, status) => {
        if (status == 'OK') {
          if (response.rows[0].elements[0].status != 'ZERO_RESULTS') {
            resolve(response.rows[0].elements[0].distance.value);
          }
        }
      });
    });
  };













  //recive a repartidores disponibles (estatus 3) y los coloca en el mapa y los guarda en un array para su posterior control 
  placeDeliversMarkers(delivers: any) {
    var icon = {
      url: "assets/marker.png",
      scaledSize: new google.maps.Size(30, 50)
    };
    if (delivers.length != this.deliverMarkers.length) {
      //remove markers from map
      for (var i in this.deliverMarkers) {
        this.deliverMarkers[i].setMap(null);
      }
      this.deliverMarkers = [];
      //setMarkersinMap
      for (var i in delivers) {
        if (delivers[i].id_repartidor != this.id) {
          let marker = new google.maps.Marker({
            position: { lat: delivers[i].latitud, lng: delivers[i].longitud },
            map: this.mapa,
            icon: icon
          });
          this.deliverMarkers.push(marker);
        }
      }
    }
    else {
      for (var i in this.deliverMarkers) {
        if (delivers[i].id_repartidor != this.id) {
          this.deliverMarkers[i].setPosition({ lat: delivers[i].latitud, lng: delivers[i].longitud });
        }
      }
    }
  }

  //obtiene una unica vez los establecimientos registrados en la base de datos, obtiene las coordenadas de cada uno de ellos
  // y los establece en el mapa
  getEstablishments() {
    var icon = {
      url: "assets/markerStore.png",
      scaledSize: new google.maps.Size(30, 50)
    };
    this.signalRService.getEstablishments().subscribe(async (response: any) => {
      if (response.status = "success") {
        var geocoder = new google.maps.Geocoder();
        for (var i in response.establishments) {
          var address = response.establishments[i].calle + ' ' + response.establishments[i].numeroExt + ' ' + response.establishments[i].colonia + ' ' + response.establishments[i].ciudad + ' ' + response.establishments[i].estado;
          var coords = await this.geocodeAddress(geocoder, address);
          let marker = new google.maps.Marker({
            position: coords,
            map: this.mapa,
            icon: icon
          });
        }
      }
    });
  }

  //recive como parametro un objeto geocoder de google y una dirección en formato de texto ejemplo:"las carmelitas #39" y retorna 
  // esa misma ubicación en coordenadas
  async geocodeAddress(geocoder, address) {
    return new Promise(resolve => {
      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
          resolve(results[0].geometry.location);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }

  //obtiene cada 5 segundos (creo) los repartidores de estatus 3 (en linea y disponibles) y sus posiciones y los manda a otra función
  getDeliversPosition() {
    this.signalRService.startConnection();
    this.signalRService.getDeliversPosition();
    this.signalRService.getDeliversLocation().subscribe((response: any) => {
      if (response.message == "Request Completed") {
        this.signalRService.dataChange.subscribe((value) => {
          if (value != null) {
            this.placeDeliversMarkers(value);
            this.delivers = value;
          }
        });
      }
      console.log(response);
    });
  }

  //cuando inicia esta pantalla obtiene datos del storage provenientes del login, carga el mapa, se suscribe a la espera de pedidos
  //y se suscribe a la espera de alertas de algun repartidor
  ngOnInit() {
    this.storage.get('user_Data').then((val) => {
      // this.events.publish('emitUserData', val);
      this.id = val.id_repartidor;
      this.loadMap();
      // this.hearForAlert();
    });
  }

  //crea el mapa y una vez cargado, pone los controles, obtiene los establecimientos y los repartidores con estatus 3 (en linea)
  //y se suscribe a un evento que cada que el usuario cambia de posicion cambia el marcador también y guarda su posicion en la BD
  async loadMap() {
    let position = await this.getCurrentPosition();
    console.log(position);
    //crear mapa
    this.mapa = new google.maps.Map(document.getElementById('map'), {
      center: position,
      zoom: 14,
      disableDefaultUI: true,
      minZoom: 4,
    });

    this.setMapControls();
    this.getEstablishments();
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log(data);
      this.mapa.panTo({
        lat: data.coords.latitude,
        lng: data.coords.longitude
      });
      this.myMarker = this.setMarker(data.coords.latitude, data.coords.longitude, this.myMarker);
      this.currentPosition = { lat: data.coords.latitude, lng: data.coords.longitude };
      // this.currentPosition2.next({ lat: data.coords.latitude, lng: data.coords.longitude });
      // this.signalRService.setCurrentPosition({ latitud: data.coords.latitude, longitud: data.coords.longitude, id_repartidor: this.id }).subscribe((response: any) => { console.log(response.status) });
    });
    // google.maps.event.addListenerOnce(this.mapa, 'idle', () => {
    //   debugger;
    //   this.setMapControls();
    //   this.getEstablishments();
    //   let watch = this.geolocation.watchPosition();
    //   watch.subscribe((data) => {
    //     this.myMarker = this.setMarker(data.coords.latitude, data.coords.longitude, this.myMarker);
    //     this.currentPosition = { lat: data.coords.latitude, lng: data.coords.longitude };
    //     // this.currentPosition2.next({ lat: data.coords.latitude, lng: data.coords.longitude });
    //     // this.signalRService.setCurrentPosition({ latitud: data.coords.latitude, longitud: data.coords.longitude, id_repartidor: this.id }).subscribe((response: any) => { console.log(response.status) });
    //   });
    // });
  }

  //establece imagenes y botones sobre el mapa de google
  setMapControls() {
    this.mapa.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('logo'));
    this.mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('icon'));
    this.mapa.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('btnGroup'));
  }

  //Obtiene y devuelve la posicion actual
  async getCurrentPosition() {
    let position = await this.geolocation.getCurrentPosition();
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }

  //funcionalidad de ocultar y mostrar menú lateral
  toggleSideMenu() {
    this.menu.toggle('menu');
  }

  //pone un marcador en el mapa, recibe el objeto marker y las posiciones 
  setMarker(lat: number, lng: number, marker) {
    if (marker != undefined) {
      marker.setPosition({ lat: lat, lng: lng });
    }
    else {
      marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: this.mapa
      });
    }
    return marker;
  }



  //se suscribe a la espera de pedidos y si exise alguno entonces detiene la obtencion de ordenes y manda la orden a otra función
  getPedidos() {
    this.signalRService.startConnection2();
    this.signalRService.getNotAsignedOrders();
    this.signalRService.getUnasignedOrders().subscribe((response: any) => {
      if (response.message == "Request Completed") {
        this.signalRService.ordersDataChange.subscribe((value) => {
          if (value != null && value.length > 0) {
            if (this.delivers.length > 0) {
              this.signalRService.stopConnectionOrders();
              this.asignDeliverToOrder(value, this.delivers);
            }
          }
        });
      }
      console.log(response);
    });
  }

  //recive orden u ordenes y a los repartidores disponibles (estatus 3), obtiene coordenadas del restaurante y obtiene la distancia 
  //entre este y cada uno de los repartidores disponibles y la asigna al más cercano (aún no funciona chido)
  async asignDeliverToOrder(orders, delivers) {
    ////////obtener lat y lng de cada restaurante
    var geocoder = new google.maps.Geocoder();
    var service = new google.maps.DistanceMatrixService;
    if (orders.length > 0) {
      for (var i in orders) {
        var add = orders[i].calle + ' ' + orders[i].numeroExt + ' ' + orders[i].colonia + ' ' + orders[i].municipio + ' ' + orders[i].estado;
        orders[i].coords = await this.geocodeAddress(geocoder, add);
      }
      if (orders.length == 1) {
        //cambiar condicion de este if, si el numero de pedido solo tiene un negocio entonces...
        for (var i in delivers) {
          delivers[i].distance = await this.getDistance(service, { lat: delivers[i].latitud, lng: delivers[i].longitud }, orders[0].coords);
        }
        delivers = this.menorDistancia(delivers);
        if (this.id == delivers[0].id_repartidor) {
          this.Show_New_Order(orders[0]);
        }
      }
      else {
        //si el pedido es a más de un negocio entonces...
        //ordenar por subcategorias
        //comida preparada al final

      }
    }




    ///////calcular distancia minima entre repartidores con estatus 3 y jalar al menor
    ///////si existe y la distancia es menor a 1km, se asigna al repartidor con estatatus 3
    ///////si existe y la distancia es mayor a 1km, entra
    ///////////obtener repartidor con estatus 5 donde la suma de la distancia desde su ubicacion al destino que se dirige
    ///////////más la distancia de su detino al restaurante a recoger es por al menos 1 km menor a la distancia del menor repartidor con estatus 3
    ///////////si existe este caso, se asigna a cola
    ///////////si no existe este caso, se asigna a 3
    ///////si no existe 3
    ///////////obtener repartidor con estatus 5 donde la suma de la distancia desde su ubicacion al 
    ///////////destino que se dirige, más la distancia de su detino al restaurante a recoger es la menor

    ///////Asignar repartidor a cada orden
    //
    //cambiar estatus e id_repartidor en cada pedido y estatus de repartidor 
  }

  //alert de que existe nueva orden y tu eres el más cercano donde puedes aceptar o rechazar (falta esa funcionalidad)
  async Show_New_Order(orden) {
    const alert = await this.alertController.create({
      header: "Nueva Orden",
      backdropDismiss: false,
      message: "¿Deseas aceptar la solicitud de orden?",
      buttons: [
        {
          text: 'Rechazar',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            //this.getPedidos();
            //buscar siguiente más cercano
          }
        },
        {
          text: 'Aceptar',
          cssClass: 'primary',
          handler: () => {
            console.log(orden);
          }
        }
      ]
    });
    await alert.present();
  }


}
