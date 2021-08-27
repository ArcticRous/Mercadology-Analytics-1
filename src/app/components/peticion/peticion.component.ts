import { Component, OnInit } from '@angular/core';
import { SolicitudModel } from '../../models/solicitud.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-peticion',
  templateUrl: './peticion.component.html',
  styleUrls: ['./peticion.component.css']
})
export class PeticionComponent implements OnInit {
  peticiones: SolicitudModel = new SolicitudModel();

  imagenes: [] = [];

  constructor(private AuthService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.AuthService.getSolicitud(id).subscribe((resp: SolicitudModel) => {
      console.log(resp);
      this.peticiones = resp;
      console.log(this.peticiones);
      this.imagenes = this.peticiones.imagenes;
      // console.log(this.imagenes);
      for (const img of this.imagenes) {
        console.log(img);

      }


      this.peticiones.id = id;
    });
  }

  guardar(form: NgForm) {
    console.log(this.peticiones);

    if (form.invalid) {
      console.log("Error");
      return false
    }

    console.log(form);
    Swal.fire({
      title: `¿Esta seguro?`,
      text: `Se enviará la fecha: ${this.peticiones.fechaEntrega} como fecha estimada de entrega`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar'
    }).then(resp => {
      if (resp.value) {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...'
        });
        Swal.showLoading();

        this.AuthService.sendRespuestaCliente(this.peticiones).subscribe(next => {
          console.log(next);

          this.AuthService.editarSolicitud(this.peticiones).subscribe(next => {
            console.log(next);
            Swal.fire({
              title: 'Respuesta enviada',
              text: `Se envio el correo a la cuenta de ${this.peticiones.cuenta} correctamente`,
              icon: 'success'
            })
          }, error => {
            console.log(error);
          })

        }, error => {
          console.log(error);
          this.AuthService.sendRespuestaCliente2(this.peticiones).subscribe(next => {
            console.log(next);
            this.AuthService.editarSolicitud(this.peticiones).subscribe(next => {
              console.log(next);
              Swal.fire({
                title: 'Respuesta enviada',
                text: `Se envio el correo a la cuenta de ${this.peticiones.cuenta} correctamente`,
                icon: 'success'
              })
            }, error => {
              console.log(error);
            })

          }, error => {
            console.log(error);
          })
        })

      }

    })

  }


}
