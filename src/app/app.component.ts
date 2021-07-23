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

      let anio = tiempo.getFullYear();
      let mes = tiempo.getMonth() + 1;
      let dia = tiempo.getDate();
      let hora = tiempo.getHours();
      let minuto = tiempo.getMinutes();
      let segundo = tiempo.getSeconds();


      if (hora == 9 && minuto == 0) {
        this.mensajeVencimiento(false);
      } if (hora == 11 && minuto == 0) {
        this.mensajeVencimiento(true);
      }

      if (mes !== 2) {

        if (dia === 15 || dia === 30) {

          if (hora === 10 && minuto === 0) {
            // console.log("SE ENVIARA LA PETICION PROGRAMADA A LA HORA DEL BACKUP");
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
        // console.log(fechaDomVen);

        fechaHosVen = dayjs(element.hosven).format('DD/MM/YYYY');
        // console.log(fechaHosVen);

        fechaSslVen = dayjs(element.venssl).format('DD/MM/YYYY');
        // console.log(fechaSslVen);

        if (dayjs().add(10, 'day').format('DD/MM/YYYY') == fechaDomVen) {

          this.dominio = true;
          msjVenHos = "En 10 días el Dominio vencerá";
          //            this.enviarMsj.push(element);
        } else if (dayjs().add(5, 'day').format('DD/MM/YYYY') == fechaDomVen) {
          //          console.log("El vencimiento será en 5 días de: ", element.nomcli, "fecha de vencimiento hosting: ", element.hosven);
          //            this.enviarMsj.push(element);
          this.dominio = true;
          msjVenDom = "En 5 días el Dominio vencerá";
        } else if (dayjs().add(1, 'day').format('DD/MM/YYYY') == fechaDomVen) {
          //          console.log("El vencimiento será en 1 día de: ", element.nomcli, "fecha de vencimiento hosting: ", element.hosven);            
          //            this.enviarMsj.push(element);
          this.dominio = true;
          msjVenDom = "En un día el Dominio vencerá";
        }

        if (dayjs().add(10, 'day').format('DD/MM/YYYY') == fechaHosVen) {
          //          console.log("El vencimiento será en 10 días de: ", element.nomcli, "fecha de vencimiento hosting: ", element.hosven);
          this.hosting = true;
          msjVenHos = "En 10 días el Hosting vencerá";
          //            this.enviarMsj.push(element);
        } else if (dayjs().add(5, 'day').format('DD/MM/YYYY') == fechaHosVen) {
          //          console.log("El vencimiento será en 5 días de: ", element.nomcli, "fecha de vencimiento hosting: ", element.hosven);
          //            this.enviarMsj.push(element);
          this.hosting = true;
          msjVenHos = "En 5 días el Hosting vencerá";
        } else if (dayjs().add(1, 'day').format('DD/MM/YYYY') == fechaHosVen) {
          //          console.log("El vencimiento será en 1 día de: ", element.nomcli, "fecha de vencimiento hosting: ", element.hosven);            
          //            this.enviarMsj.push(element);
          this.hosting = true;
          msjVenHos = "En un día el Hosting vencerá";
        }

        if (dayjs().add(10, 'day').format('DD/MM/YYYY') == fechaSslVen) {
          //          console.log("El vencimiento será en 10 días de: ", element.nomcli, "fecha de vencimiento SSL: ", element.hosven);
          //            this.enviarMsj.push(element);
          this.ssl = true;
          msjVenSsl = "En 10 días el SSL vencerá";
        } else if (dayjs().add(5, 'day').format('DD/MM/YYYY') == fechaSslVen) {
          //          console.log("El vencimiento será en 5 días de: ", element.nomcli, "fecha de vencimiento SSL: ", element.hosven);            
          //            this.enviarMsj.push(element);
          this.ssl = true;
          msjVenSsl = "En 5 días el SSL vencerá";
        } else if (dayjs().add(1, 'day').format('DD/MM/YYYY') == fechaSslVen) {
          //          console.log("El vencimiento será en 1 día de: ", element.nomcli, "fecha de vencimiento SSL: ", element.hosven);
          //            this.enviarMsj.push(element);
          this.ssl = true;
          msjVenSsl = "En un día el SSL vencerá";
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
        // console.log("Enviar mensaje vacioooo, NO ENVIAR");
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

      // console.log(this.enviarMsj, "Termina todooooooo");

    })//Termina la peticion a auth

    this.enviarMsj.length = 0;

  }//Termina mensaje de vencimiento

  public backup() {

    this.auth.exportarBase().subscribe(resp => {

      this.auth.descargarArchivo(resp).subscribe(resp => {
        
      });
      // console.log("Se envio el backup---");
    });
    // console.log("se envia el backup");
    return true;
  }



}