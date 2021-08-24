import { SolicitudModel } from './../../models/solicitud.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  //Para el control del formulario
  solicitudForm: FormGroup;

  //Modelo de Solicitud
  solicitudModel: SolicitudModel;

  //Lo uso en la parte de renderizacion dl PDF pero no se hace esa parte pero aun asi guarda el archivo
  fileArchivo: any;

  //Guarda todos los archivos
  archivos = [];

  //Guarda las URL de las imagenes una vez que se suben al storage
  imgProporcionadas: any[] = [];

  //Boleanos para ver si proporciona imagenes o archivos
  booleanFile: boolean = false;
  booleanImg: boolean = false;

  //Para abrir y cerrar la sección drop de imagenes
  abrirCerrar: boolean = false;
  //Pone la fecha por defecto
  fechaDefecto: string = "";

  //Guarda los archivos que se suben con dropone
  filesDropZone: File[] = [];
  //Guarda los nombre de los archivos para hacer comparación si los nuevos archivos que se suben son iguales a los existentes
  nomImg: any[] = [];

  constructor(private auth: AuthService, private _snackBar: MatSnackBar, private toastr: ToastrService) {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = (fecha.getMonth() + 1)
    const anio = fecha.getFullYear();

    if (mes < 10) {
      this.fechaDefecto = `${anio}-0${mes}-${dia}`
      if (dia < 10) {
        this.fechaDefecto = `${anio}-0${mes}-0${dia}`
      }
    } else if (dia < 10) {
      this.fechaDefecto = `${anio}-${mes}-0${dia}`
      if (mes < 10) {
        this.fechaDefecto = `${anio}-0${mes}-0${dia}`
      }
    }

    this.solicitudForm = new FormGroup({
      cuenta: new FormControl("Cinthya García", [Validators.required]),
      fecha: new FormControl(this.fechaDefecto, [Validators.required]),
      material: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      email: new FormControl(null, [Validators.required,  Validators.pattern(/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/)]),
      numDisenos: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100)]),
      desDisenos: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      infDisenos: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      imagenes: new FormControl(null),
      existeMaterial: new FormControl(null, [Validators.required]),
      fileMaterial: new FormControl(null)
    })
  }

  ngOnInit(): void { }


  getErrores(campo:string){
    return this.solicitudForm.controls[campo].errors && this.solicitudForm.controls[campo].touched;
  }

  showToastWarning(nombre: string, mensaje: string, titulo: string) {
    this.toastr.warning(`El archivo "${nombre}" ${mensaje}`, `${titulo}`);
  }

  onSelect(event) {
    if (this.filesDropZone.length > 0) {

      for (const elemento of event.addedFiles) {

        if (this.nomImg.includes(elemento.name)) {
          this.showToastWarning(elemento.name, "ya ha sido adjuntado", 'Archivo repetido!');
        } else if (elemento.size > 3145728) {
          this.showToastWarning(elemento.name, "supera el límite permitido de 3MB", 'Archivo muy grande!');
        } else {
          this.filesDropZone.push(elemento);
        }
      }

    } else {
      for (const file of event.addedFiles) {
        if (file.size > 3145728) {
          this.showToastWarning(file.name, "supera el límite permitido de 3MB", 'Archivo muy grande!');
        } else {
          this.filesDropZone.push(file);
        }
      }

    }

    this.nomImg = this.filesDropZone.map(({ name }) => name)
  }

  onRemove(event) {
    this.filesDropZone.splice(this.filesDropZone.indexOf(event), 1);
    this.nomImg = this.filesDropZone.map(({ name }) => name)
  }

  /**Metodo para ver el cambio que existe en el input y el evento ejecutado guarda los datos del archivo **/
  onfileArchivo(event) {

    //Guardamos los datos del archivo
    const file = event.target.files[0];

    if (file.size <= 3145728) {
      /**Vemos que exista algo en el archivo */
      if (event.target.files && event.target.files.length > 0) {
        //Hacemos condiciones para aceptar solo archvios que contengan esas palabras. NOTA: Pueden ser más estrictas las condiciones
        if (file.type.includes("pdf") || file.type.includes("word") || file.type.includes("zip") || file.type.includes('doc') || file.type.includes('docx')) {
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
          this.solicitudForm.value.fileMaterial = null;

          Swal.fire({
            title: "Formato de archivo",
            text: "Solo se aceptan formatos pdf, word o zip",
            icon: "warning"
          })
        }
      } else {
        // console.log('No entro' + event.target.files + event.target.files.lenght);
      }
    } else {
      this.showToastWarning(file.name, "pesa mas de 3MB, adjunte uno de menor peso", 'Archivo muy grande!');
    }
  }

  guardar() {
    if (this.solicitudForm.invalid) {this.solicitudForm.markAllAsTouched(); return; }

    let longitudImgs;

    if (this.solicitudForm.value.existeMaterial == "No") {
      if (this.solicitudForm.value.fileMaterial) {
        this.solicitudForm.value.fileMaterial = null;
      }
      this.booleanFile = false;
    } else if (this.solicitudForm.value.existeMaterial == "Si") {
      if (!this.solicitudForm.value.fileMaterial) {
        // console.log(this.solicitudForm.value.fileMaterial);
        Swal.fire({ title: "Falta material", text: "Debe proporcionar material", icon: "warning" });
        return false;
      }
      this.booleanFile = true;
    }

    this.archivos = this.filesDropZone;

    if (this.archivos.length) {
      this.booleanImg = true;
      this.solicitudForm.value['imagenes'] = this.archivos;
      longitudImgs = this.archivos.length;
      // console.log(this.archivos);
    } else {
      this.booleanImg = false
      this.solicitudForm.value['imagenes'] = "";
      longitudImgs = 0;
    }

    Swal.fire({
      icon: 'question',
      title: `¿Desea enviar la solicitud?`,
      text: `¿Ha proporcionado el material y los datos correctamente?`,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar'
    }).then(resp => {
      if(!resp.value){ return;}
    })

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor, se esta enviando la información, puede demorar unos minutos por el tamaño de las imágenes...'
    });
    Swal.showLoading();

    let fecha = new Date(this.solicitudForm.controls['fecha'].value);
    let cuentaImg = this.solicitudForm.controls['cuenta'].value

    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();

    let rutaFile = `solicitudes%2Farchivos%2F${cuentaImg}%2F${anio}%2F${mes}%2F${dia}`;
    rutaFile = rutaFile.replace(/ /g, "%20")
    let rutaImg = `solicitudes%2Fimagenes%2F${cuentaImg}%2F${anio}%2F${mes}%2F${dia}`;
    //Si la cuenta tiene espacios o la ruta los contiene, lo siguiente lo remplaza
    rutaImg = rutaImg.replace(/ /g, "%20")


    if (this.booleanFile == true || this.booleanImg == true) {
      // console.log("Entro aqui");

      //Array para meter todas las peticiones al forkJoin que se realizaran en authServices
      let arrayPeticion = [];
      // console.log(longitudImgs);
      if (this.booleanImg) {
        for (let archivo of this.archivos) {
          //Recibe todos los archivos de las imagenes
          this.solicitudForm.value['imagenes'] = this.archivos;
          arrayPeticion.push(this.auth.uploadFile(archivo, rutaImg));
        }
      }
      if (this.booleanFile) {
        arrayPeticion.push(this.auth.uploadFile(this.fileArchivo, rutaFile));
      }
      //ForkJoin ejecuta las peticiones que se guardaron en el array de forma paralela
      forkJoin(arrayPeticion).subscribe(next => {

        for (const archivo of next) {

          let archivoMaterial = archivo;
          let urlArchivo = archivoMaterial['name'];
          const url = urlArchivo.replace(/ /g, "%20").replace(/\//g, "%2F")
          let altMediaArchivo = archivoMaterial['downloadTokens'];

          const urlFirebase = this.auth.urlStorage + '/o/' + url + '?alt=media&token=' + altMediaArchivo;
          // console.log(urlFirebase);

          //Si existe un archivo el ultimo 'archivo' será vinculado como File, los anteriores serán imgs
          if (this.booleanFile) {
            if (next[longitudImgs] == archivo) {
              this.solicitudForm.value['fileMaterial'] = urlFirebase;
            } else {
              this.imgProporcionadas.push(urlFirebase);
            }
          } else {
            this.imgProporcionadas.push(urlFirebase);
          }
        }

      }, error => {
        console.log(error);
      }, () => {
        // console.log(this.imgProporcionadas);
        this.solicitudForm.value['imagenes'] = this.imgProporcionadas;
        this.solicitudModel = this.solicitudForm.value;

        this.auth.enviarSolicitud(this.solicitudModel).subscribe(resp => {
          // console.log(resp);
        }, error => {
          console.log(error);
        }, () => {
          Swal.fire({
            title: 'Se envio la solicitud',
            text: `Su solicitud ha sido enviada, Mercadology se pondrá en contacto a la brevedad`,
            icon: 'success'
          })
          this.imgProporcionadas = [];
          this.archivos = [];
          // this.img = [];
          this.nomImg = [];
          this.filesDropZone = [];
          // this.textoLabel = "Seleccionar archivo";
          this.solicitudForm.value['fileMaterial'] = "";
          this.solicitudForm.reset({
            'cuenta': "Cinthya García",
            'fecha': this.fechaDefecto
          });
        })
      })

    } else {
      this.solicitudModel = this.solicitudForm.value;

      this.auth.enviarSolicitud(this.solicitudModel).subscribe(resp => {
        // console.log(resp);
      }, error => {
        console.log(error);
      }, () => {
        Swal.fire({
          title: 'Se envio la solicitud',
          text: `Su solicitud ha sido enviada, Mercadology se pondrá en contacto a la brevedad`,
          icon: 'success'
        })
        this.imgProporcionadas = [];
        this.archivos = [];
        // this.img = [];
        this.nomImg = []
        this.filesDropZone = [];
        // this.textoLabel = "Seleccionar archivo";
        this.solicitudForm.value['fileMaterial'] = "";
        this.solicitudForm.reset({
          'cuenta': "Cinthya García",
          'fecha': this.fechaDefecto
        });
      })
    }
  }

  abrirImagenes() {
    this.abrirCerrar = true;
  }

  cerrarImagenes() {
    this.abrirCerrar = false;
  }

}






  // onfileImagenes(event) {
  //   let archivosTempo = [...event.target.files];
  //   console.log(archivosTempo);
  //   let archivosError = []
  //   for (let i = 0; i < archivosTempo.length; i++) {
  //     if (archivosTempo[i].type.includes("image")) {
  //       let variable = archivosTempo[i].name;
  //       console.log("ess:::  ", archivosTempo[i].type);
  //       if (!this.img.includes(variable)) {
  //         this.archivos.push(archivosTempo[i]);
  //         this.img.push(variable);
  //       }
  //     } else {
  //       archivosError.push(archivosTempo[i].name)
  //     }
  //   }
  //   console.log(archivosError);
  //   for (let i = 0; i < archivosError.length; i++) {
  //     const element = archivosError[i];
  //     console.log(element);
  //   }
  //   if (this.img.length == 0) {
  //     this.textoLabel = `Seleccionar archivo`;
  //   } else if (this.img.length == 1) {
  //     this.textoLabel = `${this.img.length} archivo seleccionado`;
  //   } else {
  //     this.textoLabel = `${this.img.length} archivos seleccionados`;
  //   }

  //   this.solicitudForm.value['fileMaterial'] = "";
  //   this.solicitudForm.value['imagenes'] = null;
  // }

  // eliminarImg(indice: any) {
  //   this.solicitudForm.value['imagenes'] = null;

  //   this.img.splice(indice, 1);
  //   this.archivos.splice(indice, 1);
  //   this.textoLabel = `${this.archivos.length} archivos seleccionados`;

  //   // this.solicitudForm.value['fileMaterial'] = this.archivos;
  //   if (this.img.length == 0) {
  //     this.textoLabel = "Seleccionar archivo";
  //   } else if (this.img.length == 1) {
  //     this.textoLabel = `${this.img.length} archivo seleccionado`;
  //   }

  // }