import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user/user.service';
import { SignalRService } from 'src/app/services/signalr/signal-r.service';

declare var google;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(public alertController: AlertController,
    private http: HttpClient,
    public userService: UserService,
    public signalRService: SignalRService) { }


  
//aqui iba a meter funcionalidades del home.ts para que no estuviera tan cargado pero ya no lo hicé :v



}
