import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.page.html',
  styleUrls: ['./alerta.page.scss'],
})
export class AlertaPage implements OnInit {

  contador = 60;
  intervalo:any;

  constructor(public modalController: ModalController) { }

  ngOnInit() {

    this.intervalo = setInterval(()=>{
      this.contador = this.contador - 1;
      if(this.contador <= 0){
        clearInterval(this.intervalo);
        this.modalController.dismiss();      
      }
    },1000);
          
  }

  rechazar(){
    this.modalController.dismiss();
  }

}
