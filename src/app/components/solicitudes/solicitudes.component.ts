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

  fileArchivo: any;
  altMediaArchivo: any;
  // existeMaterial: boolean;

  fileMaterial: any;

  constructor(private auth: AuthService) {
    this.solicitudForm = new FormGroup({
      cuenta: new FormControl("Dos Arroyos", [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      material: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
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

  /**Metodo para ver el cambio que existe en el input y el evento ejecutado guarda los datos del archivo **/
  onfileArchivo(event) {
    //Guardamos los datos del archivo
    const file = event.target.files[0];

    if (file.size <= 3145728) {
      /**Vemos que exista algo en el archivo */
      if (event.target.files && event.target.files.length > 0) {
        //Hacemos condiciones para aceptar solo archvios que contengan esas palabras. NOTA: Pueden ser más estrictas las condiciones
        if (file.type.includes("pdf") || file.type.includes("word") || file.type.includes("zip") || file.type.includes("image")) {
          //Leer fichero
          const reader = new FileReader();
          reader.readAsDataURL(file);

          //Asigna el resultado de la funcon a reader onload
          reader.onload = function load() {
            this.fileMaterial = reader.result;
          }.bind(this);

          //Asignar datos de mi archivo a mi variable
          this.fileArchivo = file;
        } else {
          console.log('Hay un error');
          Swal.fire({
            title: "Formato de archivo",
            text: "Solo se aceptan formatos pdf, word, zip o una imagen png, jpeg, jpg",
            icon: "warning"
          })
        }
      } else {
        console.log('No entro' + event.target.files + event.target.files.lenght);
      }
    } else {
      Swal.fire({
        title: "Archivo demasiado grande",
        text: "Cargue un archivo menor a 3MB",
        icon: "warning"
      })
    }

  }


  guardar() {
    if (this.solicitudForm.invalid) { return false }

    if (this.solicitudForm.value.existeMaterial == "No") {
      if (this.solicitudForm.value.fileMaterial) {
        this.solicitudForm.value.fileMaterial = null;
      }
    } else if (this.solicitudForm.value.existeMaterial == "Si") {
      if (!this.solicitudForm.value.fileMaterial) {
        Swal.fire({ title: "Falta material", text: "Debe proporcionar material", icon: "warning" });
        return false;
      }
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    let archivoMaterial;
    let fecha = new Date(this.solicitudForm.controls['fecha'].value);  
    let ruta = 'solicitudes%2Farchivos';    
  
    //Si se adjunta material se sube primero el material, si no solo se suben los datos
    if (this.solicitudForm.value['fileMaterial'] != null) {
      this.auth.uploadFile(this.fileArchivo, fecha.getFullYear(), (fecha.getMonth() + 1), ruta).subscribe(next => {
        // console.log(next); 
        archivoMaterial = next;
        let urlArchivo = archivoMaterial.contentDisposition;
        const url = urlArchivo.slice(25, urlArchivo.lenght);
        this.altMediaArchivo = archivoMaterial.downloadTokens;

        const urlFirebase = this.auth.urlStorage + '/o/' + ruta + '%2F' + fecha.getFullYear() + '%2F' + (fecha.getMonth() + 1) + '%2F' + url + '?alt=media&token=' + this.altMediaArchivo;
        this.solicitudForm.value['fileMaterial'] = urlFirebase;

        this.auth.enviarSolicitud(this.solicitudForm.value).subscribe(next => {
          this.solicitudForm.reset({
            'cuenta': "Dos Arroyos"
          });
          Swal.fire(
            'Solicitud enviada',
            'Mercadology enviará una respuesta lo más pronto posible',
            'success'
          )
        }, error => {
          console.log(error);
        })

      }, error => {
        console.log(error);
      })
    } else {
      this.auth.enviarSolicitud(this.solicitudForm.value).subscribe(next => {
        this.solicitudForm.reset({
          'cuenta': "Dos Arroyos"
        });
        Swal.fire(
          'Solicitud enviada',
          'Mercadology enviará una respuesta lo más pronto posible',
          'success'
        )
      }, error => {
        console.log(error);
      })
    }

  }

}
