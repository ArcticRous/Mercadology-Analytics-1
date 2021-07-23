import { ClienteModel } from './../../models/cliente.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import * as CryptoJS from 'crypto-js'
import { Clipboard } from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})
export class MostrarComponent implements OnInit {

  rol: string;
  cliente: ClienteModel = new ClienteModel;
  temporalCliente: Object = {
    'cuepas': "",
    'dompas': "",
    'dbpas': "",
    'ftppas': "",
    'hospas': ""
  };
  mostrarCorreo: boolean = false;
  mostrarDominio: boolean = false;
  mostrarBd: boolean = false;
  mostrarFtp: boolean = false;
  mostrarHosting: boolean = false;

  copiar: boolean = false;

  constructor(private AuthService: AuthService,
    private route: ActivatedRoute, private clipboard: Clipboard, private _snackBar: MatSnackBar) { }
  cargando = false;

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');
    this.cargando = true;

    const id = this.route.snapshot.paramMap.get('ids');

    if (id == id) {

      this.AuthService.getClient(id)
        .subscribe((resp: ClienteModel) => {
          this.cliente = resp;
          this.cliente.ids = id;
          this.cargando = false;
        });
    }

  }

  copyToClipboard(campo: string): void {
    this.clipboard.copy(campo);
  }

  //Desencripta las contraseñas, el booleano lo uso para controlar cuando esta desencriptado o encriptadp
  desencriptar(contrasena: string, usuario: string, cadena: string) {

    const id = this.route.snapshot.paramMap.get('ids');

    switch (cadena) {
      case 'correo': {
        if (this.mostrarCorreo) {
          this.temporalCliente['cuepas'] = this.cliente.cuepas;//cuepas;
          if (this.temporalCliente['cuepas'] !== "") {
            this.cliente.cuepas = CryptoJS.AES.decrypt(contrasena, usuario).toString(CryptoJS.enc.Utf8);
          }
          break;
        } else {
          this.cliente.cuepas = this.temporalCliente['cuepas'];
          break;
        }
      }
      case 'dominio': {
        if (this.mostrarDominio) {
          this.temporalCliente['dompas'] = this.cliente.dompas;
          if (this.temporalCliente['dompas'] !== "") {
            this.cliente.dompas = CryptoJS.AES.decrypt(contrasena, usuario).toString(CryptoJS.enc.Utf8);
          }
          break;
        }
        this.cliente.dompas = this.temporalCliente['dompas'];
        break;
      }
      case 'bdd': {
        if (this.mostrarBd) {
          //const dbpas = this.cliente.dbpas;
          this.temporalCliente['dbpas'] = this.cliente.dbpas;
          if (this.temporalCliente['dbpas'] !== "") {
            this.cliente.dbpas = CryptoJS.AES.decrypt(contrasena, usuario).toString(CryptoJS.enc.Utf8);
          }
          break;
        }
        this.cliente.dbpas = this.temporalCliente['dbpas'];
        break;
      }
      case 'ftp': {
        if (this.mostrarFtp) {
          this.temporalCliente['ftppas'] = this.cliente.ftppas;
          if (this.temporalCliente['ftppas'] !== "") {
            this.cliente.ftppas = CryptoJS.AES.decrypt(contrasena, usuario).toString(CryptoJS.enc.Utf8);
          }
          break;
        }
        this.cliente.ftppas = this.temporalCliente['ftppas'];
        break;
      }
      case 'hosting': {
        if (this.mostrarHosting) {
          const hospas = this.cliente.hospas;
          this.temporalCliente['hospas'] = this.cliente.hospas;//hospas;
          if (this.temporalCliente['hospas'] !== "") {
            this.cliente.hospas = CryptoJS.AES.decrypt(contrasena, usuario).toString(CryptoJS.enc.Utf8);
          }
          break;
        }
        this.cliente.hospas = this.temporalCliente['hospas'];
        break;
      }
      default: {
        console.log("Soy el default", usuario, contrasena);
        break;
      }
    }//Acaba el switch
  }//Acaba desencriptar

  openSnackBar():void {
    this._snackBar.open("Texto copiado", "Hecho", {
      duration: 3000,
    });
  }



}