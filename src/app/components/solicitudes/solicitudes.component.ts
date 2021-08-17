import { SolicitudModel } from './../../models/solicitud.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

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

  //Solo lo uso para guardar el reader onload supuesta del PDF pero no lo renderiza
  fileMaterial: any;
  //Lo uso en la parte de renderizacion dl PDF pero no se hace esa parte
  fileArchivo: any;

  //Guarda todos los archivos
  archivos = [];
  //Guarda los nombres de las imagenes para mostrarlas
  img = [];
  //Solo par mostrar un texto fijo en los archivos subidos
  textoLabel: string = "Seleccionar archivo";
  //Guarda las url de las imagenes
  imgProporcionadas: any[] = [];

  //Boleanos para ver si proporciona imagenes o archivos
  booleanFile: boolean = false;
  booleanImg: boolean = false;

  constructor(private auth: AuthService) {

    this.solicitudForm = new FormGroup({
      cuenta: new FormControl("Dos Arroyos", [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
      material: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      numDisenos: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100)]),
      desDisenos: new FormControl(null, [Validators.required]),
      infDisenos: new FormControl(null, [Validators.required]),
      imagenes: new FormControl(null),
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
          console.log(file);

          console.log(typeof this.fileArchivo);

          console.log(this.fileArchivo);

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

  onfileImagenes(event) {
    let archivosTempo = [...event.target.files];

    for (let i = 0; i < archivosTempo.length; i++) {
      let variable = archivosTempo[i].name;

      if (!this.img.includes(variable)) {
        this.archivos.push(archivosTempo[i]);
        this.img.push(variable);
      }
    }

    this.solicitudForm.value['fileMaterial'] = this.archivos;
    this.textoLabel = `${this.img.length} archivos seleccionados`;
  }

  eliminarImg(indice: any) {
    this.img.splice(indice, 1)
    this.textoLabel = `${this.img.length} archivos seleccionados`;
    this.archivos.splice(indice, 1);
    this.solicitudForm.value['fileMaterial'] = this.archivos;
  }

  guardar() {
    if (this.solicitudForm.invalid) { return false }

    let longitudImgs;

    if (this.solicitudForm.value.existeMaterial == "No") {
      if (this.solicitudForm.value.fileMaterial) {
        this.solicitudForm.value.fileMaterial = null;
      }
      this.booleanFile = false;
    } else if (this.solicitudForm.value.existeMaterial == "Si") {
      if (!this.solicitudForm.value.fileMaterial) {
        Swal.fire({ title: "Falta material", text: "Debe proporcionar material", icon: "warning" });
        return false;
      }
      this.booleanFile = true;
    }

    if (this.archivos.length) {
      this.booleanImg = true;
      this.solicitudForm.value['imagenes'] = this.archivos;
      longitudImgs = this.archivos.length;
      console.log(this.archivos);
    } else {
      this.booleanImg = false
      this.solicitudForm.value['imagenes'] = "";
      longitudImgs = 0;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor, se estan subiendo los archivos...'
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
console.log("Entro aqui");

      //Array para meter todas las peticiones al forkJoin que se realizaran en authServices
      let arrayPeticion = [];
      console.log(longitudImgs);
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
          console.log(urlFirebase);

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
        console.log(this.imgProporcionadas);
        this.solicitudForm.value['imagenes'] = this.imgProporcionadas;
        this.solicitudModel = this.solicitudForm.value;

        this.auth.enviarSolicitud(this.solicitudModel).subscribe(resp => {
          console.log(resp);
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
          this.img = [];
          this.textoLabel = "Seleccionar archivo";
          this.solicitudForm.value['fileMaterial'] = "";
          this.solicitudForm.reset({
            'cuenta': "Dos Arroyos"
          });
        })
      })

    } else {
console.log("Entro en el else");

      this.solicitudModel = this.solicitudForm.value;

      this.auth.enviarSolicitud(this.solicitudModel).subscribe(resp => {
        console.log(resp);
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
        this.img = [];
        this.textoLabel = "Seleccionar archivo";
        this.solicitudForm.value['fileMaterial'] = "";
        this.solicitudForm.reset({
          'cuenta': "Dos Arroyos"
        });
      })
    }
  }


}