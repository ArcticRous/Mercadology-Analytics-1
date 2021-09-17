import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { StatusBonoModel } from '../../models/statusBono.model';

@Component({
  selector: 'app-status-bono',
  templateUrl: './status-bono.component.html',
  styleUrls: ['./status-bono.component.css']
})
export class StatusBonoComponent implements OnInit {
  bono: StatusBonoModel = new StatusBonoModel();
  cargando: boolean = true;
  selectOptions: any;
  TipoBono: any;
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


  constructor(private AuthService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'add') {
      this.AuthService.getStatusBonoID(id)
        .subscribe((resp: StatusBonoModel) => {
          this.bono = resp;
          console.log(this.bono);

          this.bono.id = id;
        }, error => {

        }, () => {
          this.cargando = false;
        })
    }

    this.AuthService.getUsuarios().subscribe(next => {
      this.selectOptions = next
    }, error => {
      console.log(error);
    })


    this.AuthService.getBono().subscribe(resp => {
      this.TipoBono = resp
    }, error => {
      console.log(error);
    })


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
      peticion = this.AuthService.updateStatusBono(this.bono);
    } else {
      peticion = this.AuthService.addStatusBono(this.bono);
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
