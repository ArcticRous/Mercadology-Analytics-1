import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ComunicadoModel } from "../../models/comunicado.model";

declare let $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Comunicado: ComunicadoModel[] = [];
  cargando = true;
  rol: string;

  constructor(private Auth: AuthService) {
    Auth.leerToken();
  }

  ngOnInit(): void {
    sessionStorage.removeItem('local');
    this.rol = sessionStorage.getItem('rol');

    this.Auth.getComun("publico")
      .subscribe((resp) => {
        this.Comunicado = resp
        this.Comunicado = this.Comunicado.slice(0,5)
        // let result =  Object.keys(resp).slice(0,4).map(key => ({[key]:resp[key]}));
      }, error => {
        console.log(error);
      }, () => {
        this.cargando = false;
      });
  }

}