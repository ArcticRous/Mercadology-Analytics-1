import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ClienteModel } from './models/cliente.model';
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mercadology';

  Cliente: ClienteModel[] = [];
  checar: ClienteModel;
  enviarMsj: ClienteModel[] = [];
  dominio: Boolean = false;
  hosting: Boolean = false;
  ssl: Boolean = false;

  constructor(public auth: AuthService) { }

  ngOnInit() {

    setInterval(() => {
      let tiempo = new Date();

      let mes = tiempo.getMonth() + 1;
      let dia = tiempo.getDate();
      let hora = tiempo.getHours();
      let minuto = tiempo.getMinutes();

      //Mensaje de vencimiento a cuenta de Mercadology
      if (hora == 9 && minuto == 0) {
        this.mensajeVencimiento(false);
      //Mensaje de vencimiento de cuenta a clientes
      } if (hora == 11 && minuto == 0) {
        this.mensajeVencimiento(true);
      }

      if (mes !== 2) {

        if (dia === 15 || dia === 30) {

          if (hora === 10 && minuto === 0) {
            this.backup();
          } 
        }

      } else {

        if (dia === 15 || dia === 28) {

          if (hora === 9 && minuto === 0) {
            this.backup();
          }
        }
      }

    }, 60000);

    //1,296,000,000 ms son 15 dìas
    //86,400,000 ms Un dia
    //3,600,000 ms es una hora
    //60,000 ms un minuto

  }

  mensajeVencimiento(cliente: boolean): void {

    let fechaHosVen;
    let fechaSslVen;
    let fechaDomVen;

    this.auth.getCliente().subscribe(resp => {
      let msjVenDom;
      let msjVenHos;
      let msjVenSsl;

      resp.forEach(element => {

        fechaDomVen = dayjs(element.domven).format('DD/MM/YYYY');
        fechaHosVen = dayjs(element.hosven).format('DD/MM/YYYY');
        fechaSslVen = dayjs(element.venssl).format('DD/MM/YYYY');

        //Vencimiento dominio
        if (dayjs().add(10, 'day').format('DD/MM/YYYY') == fechaDomVen) {

          this.dominio = true;
          msjVenHos = "El Dominio vencerá en 10 días";

        } else if (dayjs().add(5, 'day').format('DD/MM/YYYY') == fechaDomVen) {

          this.dominio = true;
          msjVenDom = "El Dominio vencerá en 5 días";

        } else if (dayjs().add(1, 'day').format('DD/MM/YYYY') == fechaDomVen) {
          
          this.dominio = true;
          msjVenDom = "El Dominio vencerá en un día";

        }

        //Vencimiento hosting
        if (dayjs().add(10, 'day').format('DD/MM/YYYY') == fechaHosVen) {

          this.hosting = true;
          msjVenHos = "El Hosting vencerá en 10 días";

        } else if (dayjs().add(5, 'day').format('DD/MM/YYYY') == fechaHosVen) {
          
          this.hosting = true;
          msjVenHos = "El Hosting vencerá en 5 días";

        } else if (dayjs().add(1, 'day').format('DD/MM/YYYY') == fechaHosVen) {
          
          this.hosting = true;
          msjVenHos = "El Hosting vencerá en un día";

        }

        //Vencimiento SSL
        if (dayjs().add(10, 'day').format('DD/MM/YYYY') == fechaSslVen) {
          
          this.ssl = true;
          msjVenSsl = "El SSL vencerá en 10 días";

        } else if (dayjs().add(5, 'day').format('DD/MM/YYYY') == fechaSslVen) {
          
          this.ssl = true;
          msjVenSsl = "El SSL vencerá en 5 días";

        } else if (dayjs().add(1, 'day').format('DD/MM/YYYY') == fechaSslVen) {
          
          this.ssl = true;
          msjVenSsl = "El SSL vencerá en un día";

        }

        if (this.dominio && this.hosting && this.ssl) {
          element.msj = msjVenDom + ", " + msjVenHos + " y " + msjVenSsl;
          this.enviarMsj.push(element);
          this.dominio = false;
          this.hosting = false;
          this.ssl = false;
        } else if (this.dominio && this.hosting) {
          element.msj = msjVenDom + " y " + msjVenHos;
          this.enviarMsj.push(element);
          this.dominio = false;
          this.hosting = false;
        } else if (this.dominio && this.ssl) {
          element.msj = msjVenDom + " y " + msjVenSsl;
          this.enviarMsj.push(element);
          this.dominio = false;
          this.ssl = false;
        } else if (this.hosting && this.ssl) {
          element.msj = msjVenHos + " y " + msjVenSsl;
          this.enviarMsj.push(element);
          this.hosting = false;
          this.ssl = false;
        } else if (this.dominio) {
          element.msj = msjVenDom;
          this.enviarMsj.push(element);
          this.dominio = false;
        } else if (this.hosting) {
          element.msj = msjVenHos;
          this.enviarMsj.push(element);
          this.hosting = false;
        } else if (this.ssl) {
          element.msj = msjVenSsl;
          this.enviarMsj.push(element);
          this.ssl = false;
        }

      });

      if (this.enviarMsj.length == 0) {
        return false;
      }
      // console.log(this.enviarMsj);

      if (cliente == false) {
        this.auth.sendMessage(this.enviarMsj).subscribe(res => {
          // console.log(res);
        });
      } else {
        this.auth.sendMessageCliente(this.enviarMsj).subscribe(res => {
          // console.log(res);
        });
      }

    })//Termina la peticion a auth

    this.enviarMsj.length = 0;

  }//Termina mensaje de vencimiento

  public backup() {

    this.auth.exportarBase().subscribe(resp => {

      this.auth.descargarArchivo(resp).subscribe(resp => {
        // console.log(resp);
      });
    });
    return true;
  }

  
}