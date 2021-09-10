import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { BonoModel } from '../../models/bono.model';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { RouterLinkActive, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bono',
  templateUrl: './bono.component.html',
  styleUrls: ['./bono.component.css']
})
export class BonoComponent implements OnInit {
  bono: BonoModel = new BonoModel();
  cargando: boolean = true;
  porcentajes: string[] = ["86-90", "91-95", "96-100"];
  departamentos: string[] = ["Marketing", "Sistemas", "Diseño", "RRHH", "Operaciones"]
  constructor(private AuthService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'add') {
      this.AuthService.getBonoID(id)
        .subscribe((resp: BonoModel) => {
          this.bono = resp;
          console.log(this.bono);

          this.bono.id = id;
        }, error => {

        }, () => {
          this.cargando = false;
        })
    }

    
  }

  guardar(form: NgForm) {
    console.log(form);
    console.log(this.bono);
    if (form.invalid) { return }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if (this.bono.id) {
      peticion = this.AuthService.updateBono(this.bono);
    } else {
      peticion = this.AuthService.addBono(this.bono);
    }

    peticion.subscribe(resp => {
      Swal.fire({
        title: 'Bonos asignados',
        text: 'Se han definido tus bonos',
        icon: 'success'
      });
    })
  }
}
