import { SolicitudModel } from './../../models/solicitud.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  solicitudForm: FormGroup;

  solicitudModel: SolicitudModel;

  constructor( private auth: AuthService ) { 
    this.solicitudForm = new FormGroup({
      cuenta: new FormControl("Dos Arroyos", [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      material: new FormControl(null, [Validators.required]),
      numDisenos: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100)]),
      desDisenos: new FormControl(null, [Validators.required]),
      infDisenos: new FormControl(null, [Validators.required]),
      urgencia: new FormControl(null, [Validators.required]),
      existeMaterial: new FormControl(null, [Validators.required]),
      fileMaterial: new FormControl(null)
    })
  }

  ngOnInit(): void {
  }

  guardar(){
    if(this.solicitudForm.invalid) { return false}
    // const nombreArchivo = this.solicitudForm.controls['fileMaterial'].value;
    // const archivo = nombreArchivo.slice(12, nombreArchivo.lenght);


    console.log(this.solicitudForm);
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.enviarSolicitud(this.solicitudForm.value).subscribe( next => {
      console.log(next);
      Swal.fire(
        'Solicitud enviada',
        'Mercadology enviará una respuesta lo más pronto posible',
        'success'
      )
    }, error => {
      console.log(error);
    }, () => {

    } )
  
  }

}
