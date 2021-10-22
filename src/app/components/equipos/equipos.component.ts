import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { delay, map } from 'rxjs/operators';
import { EquipoModel } from '../../models/equipos.model';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  cuentas = ['Cinthya García', 'Dos Arroyos',
                  'Endocéntrica',
                  'Empleos Qro',
                  'Euroventyc',
                  'Global Staffing',
                  'KOM',
                  'Namaco',
                  'Nomenex',
                  'Noticias Querétaro',
                  'Marmo',
                  'Odontología Proactiva',
                  'Olivera Logistics',
                  'Palconsulting',
                  'Paola Soto',
                  'PureWater',
                  'Proactiva',
                  'Rohe',
                  'Viva Casas'];
                  
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


  eliminarEquipo(equipo:EquipoModel){
    console.log(equipo);
      
      Swal.fire({
        title: '¿Está seguro?',
        text: `Está seguro que desea borrar a ${equipo.cuenta}`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then(resp => {
  
        if (resp.value) {
          this.auth.deleteEquipo(equipo.id).subscribe(next => {
            console.log(next);
            Swal.fire({
              title: 'Se elimino bono',
              text: `Se elimino correctamente el bono ${equipo.cuenta}`,
              icon: 'success'
            }),window.location.reload() , delay(5000);
          }, error => {
            console.log(error);
          })
        }
      })
  }
  
}
