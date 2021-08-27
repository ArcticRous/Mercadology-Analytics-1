import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { ComunicadoModel } from '../../models/comunicado.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comunicado-individual',
  templateUrl: './comunicado-individual.component.html',
  styleUrls: ['./comunicado-individual.component.css']
})
export class ComunicadoIndividualComponent implements OnInit {

  comunicado: ComunicadoModel = new ComunicadoModel;

  fileArchivo: any;
  solicitudForm: FormGroup;
  filesDropZone: File[] = [];
  nomImg: any[] = [];
 
  mostrar: boolean = false;
  copiar: boolean = false;
  agregar: boolean;
  temporalComunicado: Object = {
    'titulo': "",
    'descripcion': "",
    'fecha': "",
    'quien': ""

  };
  mostrarTitulo: boolean = false;
  mostrarDescripcion: boolean = false;
  mostrarFecha: boolean = false;
  mostrarQuien: boolean = false;
  
  constructor(private AuthS: AuthService,
    private route: ActivatedRoute, private clipboard: Clipboard, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {

    const ids = this.route.snapshot.paramMap.get('ids');

    if (ids !== 'add') {
      this.AuthS.getComunicado(ids)
        .subscribe((resp: ComunicadoModel) => {

          /** Guarda en un objeto temporal para comparar si hubo algun cambio de la contraseña**/
          this.temporalComunicado['titulo'] = resp.titulo;
          this.temporalComunicado['descripcion'] = resp.descripcion;
          this.temporalComunicado['fecha'] = resp.fecha;
          this.temporalComunicado['quien'] = resp.quien;

          this.comunicado = resp;
         this.comunicado.ids = ids;
        });
    }//Acaba if
    else {
      this.agregar = true;

    }
  }
  
  guardar(form: NgForm) {

    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando informacion',
      allowOutsideClick: false
    })
    Swal.showLoading();

    let peticionUpdate: Observable<any>;
    let peticionSave: Observable<any>;

    if (this.comunicado.ids) {

      //Solo para que se regresen a input password las contraseñas
      this.mostrarTitulo = false;
      this.mostrarDescripcion = false;
      this.mostrarFecha = false;
      this.mostrarQuien = false;
      // console.log(this.comunicado.hosven, this.comunicado.venssl, this.comunicado.domven);
      peticionUpdate = this.AuthS.UpdatComunicado(this.comunicado);
      // console.log(peticionUpdate);


      peticionUpdate.subscribe(resp => {
        Swal.close();
        Swal.fire({
          title: 'Actualizado',
          text: 'Se Actualizaron los datos correctamente de ' + this.comunicado.titulo,
          icon: 'success',
        });

      }, (err) => {
        this.modificarPorTokenVencido(err, this.comunicado);
      }, () => {
        Swal.close();
        Swal.fire({
          title: 'Actualizado',
          text: 'Se Actualizaron los datos correctamente de  ' + this.comunicado.titulo,
          icon: 'success',
        });
        this.router.navigateByUrl('/MisComun');
      }

      );

    } else {
      

      //Solo para que se regresen a input password las contraseñas
      this.mostrarTitulo = false;
      this.mostrarDescripcion = false;
      this.mostrarFecha = false;
      this.mostrarQuien = false;
      // console.log(this.comunicado.hosven, this.comunicado.venssl, this.comunicado.domven);
      
      peticionSave = this.AuthS.saveComunicado(this.comunicado);
      // console.log(peticionSave);

      peticionSave.subscribe(resp => {
        Swal.close();
        Swal.fire({
          title: 'Guardado',
          text: 'Se registraron correctamente los datos de: ' + this.comunicado.titulo,
          icon: 'success',
        });

      }, (err) => {
        this.guardarPorTokenVencido(err, this.comunicado);
      }, () => {

        this.router.navigateByUrl('/MisComun');
      }

      );


    }

  }// termina el

  //Guarda en el clipboard el texto del campo
  copyToClipboard(campo: string) {
    this.clipboard.copy(campo);
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


  modificarPorTokenVencido(err: any, comunicado: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthS.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthS.UpdatComunicado(comunicado).subscribe(resp => {
          // console.log(resp);
        }, (err) => {
          // console.log(err);
        }, () => {
          Swal.close();
          Swal.fire({
            title: 'Guardado',
            text: 'Se guardaron los datos correctamente de ' + this.comunicado.titulo,
            icon: 'success',
          });
          this.router.navigateByUrl('/MisComun');
        });
      });//tERMINA REFRESACAR TOKEN
    }else{//Termina if
      Swal.close();
      Swal.fire({
        title: 'Error',
        text: 'Error al al modificar datos de ' + this.comunicado.titulo + " " + err.error.error,
        icon: 'error',
      });
    }
    
  }



  guardarPorTokenVencido(err: any, comunicado: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthS.refrescarToken(refresh).subscribe(resp => {
        
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthS.saveComunicado(comunicado).subscribe(resp => {
          Swal.close();
          Swal.fire({
            title: 'Guardado',
            text: 'Se registraron correctamente los datos de: ' + this.comunicado.titulo,
            icon: 'success',
          });
          
        }, (err) => {
          // console.log(err);
        }, () => this.router.navigateByUrl('/comunicados'));
      });//tERMINA REFRESACAR TOKEN
    }//Termina if
    
    
  }

}
