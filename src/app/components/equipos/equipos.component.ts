import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { EquipoModel } from '../../models/equipos.model';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  equipo: EquipoModel[] = [];
  usuario:any;

  id: string;
  local: string;
  rol: string;
  puesto: string;
  depto: string;
  
  constructor( private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.getEquipo().subscribe( resp =>{
      console.log(resp);
      this.equipo = resp;
    })

    this.auth.getUsuarios().subscribe( resp =>{
      console.log(resp);
      this.usuario = resp;
    })
    this.id = sessionStorage.getItem('idUsuario');    
    this.local = sessionStorage.getItem('local');
    this.rol = sessionStorage.getItem('rol');
    this.puesto = sessionStorage.getItem('puesto');
    this.depto = sessionStorage.getItem('depto');
  }

}
