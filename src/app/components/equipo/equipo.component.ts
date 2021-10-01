import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EquipoModel } from '../../models/equipos.model';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { RouterLinkActive, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {
equipo: EquipoModel = new EquipoModel();
cargando: boolean = true;
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

  constructor( private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'add') {
      this.auth.getEquipoID(id)
        .subscribe((resp: EquipoModel) => {
          this.equipo = resp;
          console.log(this.equipo);

          this.equipo.id = id;
        }, error => {

        }, () => {
          this.cargando = false;
        })
    }
  }

  guardar(form: NgForm) {
    console.log(form);
    console.log(this.equipo);
    if (form.invalid) { return }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if (this.equipo.id) {
      peticion = this.auth.updateEquipo(this.equipo);
    } else {
      peticion = this.auth.addEquipo(this.equipo);
    }

    peticion.subscribe(resp => {
      Swal.fire({
        title: 'Equipo asignado',
        text: 'Se han definido el equipo',
        icon: 'success'
      });
    })
  }

}
