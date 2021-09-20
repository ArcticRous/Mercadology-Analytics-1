import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComunicadoModel } from '../../models/comunicado.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { forkJoin, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comunicado-individual',
  templateUrl: './comunicado-individual.component.html',
  styleUrls: ['./comunicado-individual.component.css']
})
export class ComunicadoIndividualComponent implements OnInit {

  comunicado: ComunicadoModel;

  agregar: boolean = true;

  comunicadoForm: FormGroup;

  spinner: boolean = true;

  booleanFile: boolean = false;

  booleanTieneFile: boolean = false;

  ids;
  fechaDefecto: string;
  abrirCerrar: boolean = false;
  filesDropZone: File[] = [];
  nomImg: any[] = [];
  tamanoTotal: number = 0;
  tamanoArchivo: number = 0
  imgProporcionadas: any[] = [];

  botonEliminar: boolean = false;

  constructor(private AuthS: AuthService,
    private route: ActivatedRoute, private clipboard: Clipboard, private router: Router,
    private toastr: ToastrService, private fb: FormBuilder) {
    this.ids = this.route.snapshot.paramMap.get('ids');

    if (this.ids !== 'add') {
      this.peticionAuth(this.ids)
    }//Acaba if
    else {
      this.agregar = true;
      this.spinner = false;
      this.inicializar()

    }

  }

  ngOnInit() { }

  eliminarImgGuardada(i: any) {
    console.log(i);
    this.comunicado.imagenes.splice(i, 1)
    console.log(this.comunicado);
  }

  getErrores(campo: string) {
    return this.comunicadoForm.controls[campo].errors && this.comunicadoForm.controls[campo].touched;
  }

  inicializar() {
    var date = new Date();
    this.fechaDefecto = date.toLocaleDateString(undefined, { year: 'numeric' }) + '-' + date.toLocaleDateString(undefined, { month: '2-digit' }) + '-' + date.toLocaleDateString(undefined, { day: '2-digit' })

    this.comunicadoForm = this.fb.group({
      titulo: [, [Validators.required, Validators.min(3)]],
      fecha: [this.fechaDefecto, [Validators.required]],
      descripcion: [, [Validators.required, Validators.min(10)]],
      quien: ["General", [Validators.required]],
      imagenes: [,],
      archivo: [,]
    })
  }

  inicializarEditar(comunicado: ComunicadoModel) {
    console.log(comunicado);

    this.comunicadoForm = this.fb.group({
      titulo: [comunicado.titulo, [Validators.required, Validators.min(3)]],
      fecha: [comunicado.fecha, [Validators.required]],
      descripcion: [comunicado.descripcion, [Validators.required, Validators.min(10)]],
      quien: [comunicado.quien, [Validators.required]],
      imagenes: [,],
      archivo: [,],
      // archivoAuxiliar: []
    })
    if (comunicado.archivo) {
      this.booleanTieneFile = true
      this.comunicadoForm.controls['archivo'].disable()
      this.comunicadoForm.get('archivo').setValue(comunicado.archivo)
    }
  }

  borrarArchivo() {
    this.booleanTieneFile = false;
    this.comunicadoForm.controls['archivo'].enable()
    this.comunicadoForm.get('archivo').setValue("")
    // this.comunicadoForm.get('archivoAuxiliar').setValue("")
    console.log(this.comunicadoForm);

  }

  peticionAuth(id: string) {
    this.AuthS.getComunicado(id)
      .subscribe((resp: ComunicadoModel) => {
        console.log(id);

        this.comunicado = resp;
        this.comunicado.ids = id;
        this.agregar = false;

      }, error => {
        console.log(error);
      }, () => {
        this.spinner = false;
        this.inicializarEditar(this.comunicado)
      });
  }

  onfileArchivo(event) {
    console.log(this.comunicadoForm);

    const file = event.target.files[0];

    if (file.size <= 3000000) {
      if (file.type.includes('pdf') || file.type.includes('doc') || file.type.includes('docx,application/msword') || file.type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        console.log(file);
        this.comunicadoForm.value.archivo = file
        this.booleanFile = true;
        console.log(this.comunicadoForm.value.archivo);

      } else {
        this.resetCampoArchivo();
        this.toastError(`Solo se aceptan formatos PDF y WORD, "${file.name}" no puede cargarse`, "Error de archivo")
      }
    } else {
      this.resetCampoArchivo();
      this.showToastWarning(`El archivo "${file.name}" es muy grande, cargue uno de menor peso, máximo 3MB`, "Archivo supera el límite")
    }

  }

  resetCampoArchivo() {
    this.comunicadoForm.reset({
      titulo: this.comunicadoForm.value.titulo,
      fecha: this.comunicadoForm.value.fecha,
      quien: this.comunicadoForm.value.quien,
      descripcion: this.comunicadoForm.value.descripcion
    })
  }


  get avisoTamano() {
    return this.toastr.info(`Tamaño de archivos: ${((this.tamanoArchivo + this.tamanoTotal) / 1000000).toFixed(2)} MB`, `Tamaño actual`);
  }

  toastErrorTamanoMaximo(mensaje: string) {
    this.toastr.error(`${mensaje}`, "Supero el máximo permitido");
  }

  showToastWarningImg(nombre: string, mensaje: string, titulo: string) {
    this.toastr.warning(`El archivo "${nombre}" ${mensaje}`, `${titulo}`);
  }

  showToastErrorImg(nombre: string, mensaje: string, titulo: string) {
    this.toastr.error(`El archivo '${nombre}' ${mensaje}`, `${titulo}`)
  }

  onSelect(event) {
    console.log(event);
    console.log(event.source._previewChildren);

    if (this.tamanoTotal + this.tamanoArchivo < 10000000) {
      if (this.filesDropZone.length > 0) {

        for (const elemento of event.addedFiles) {

          if (this.nomImg.includes(elemento.name)) {
            this.showToastWarningImg(elemento.name, "ya ha sido adjuntado", 'Archivo repetido!');
          } else if (elemento.size > 1000000) {
            this.showToastWarningImg(elemento.name, "supera el límite permitido de 1MB", 'Archivo muy grande!');
          } else if (elemento.size + this.tamanoTotal > 10000000) {
            this.toastErrorTamanoMaximo(`No se puede cargar '${elemento.name}', supero el máximo de 10MB`);
          } else {
            this.tamanoTotal += elemento.size;
            this.filesDropZone.push(elemento);
          }
        }
      } else {
        for (const file of event.addedFiles) {
          if (file.size > 1000000) {
            this.showToastWarningImg(file.name, "supera el límite permitido de 1MB", 'Archivo muy grande!');
          } else {
            this.tamanoTotal += file.size;
            this.filesDropZone.push(file);
          }
        }
      }
    } else {
      this.toastr.warning("Borre algunas imagenes u optimice su tamaño, máximo 10MB", "Supero el máximo");
    }
    this.nomImg = this.filesDropZone.map(({ name }) => name)

    for (const rechazado of event.rejectedFiles) {
      this.showToastErrorImg(rechazado.name, "no puede se adjuntado", "Solo se permiten imagenes")
    }
  }

  onRemove(event) {
    console.log(event);

    this.tamanoTotal -= event.size;
    this.filesDropZone.splice(this.filesDropZone.indexOf(event), 1);
    this.nomImg = this.filesDropZone.map(({ name }) => name)
    this.avisoTamano;
  }


  guardar() {

    if (this.comunicadoForm.invalid) {
      this.comunicadoForm.markAllAsTouched()
      return;
    }
    
    let longitudImgs = 0;

    Swal.fire({
      title: `Guardar datos`,
      text: `¿Desea guardar los cambios? Revise que los datos sean correctos`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(resp => {

      if (resp.value) {

        Swal.fire({
          title: 'Espere',
          text: 'Guardando informacion',
          allowOutsideClick: false
        })
        Swal.showLoading();

        let peticionUpdate: Observable<any>;
        let peticionSave: Observable<any>;

        let fecha = new Date(this.comunicadoForm.controls['fecha'].value);

        let dia = fecha.getDate();
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();

        let rutaFile = `comunicados%2Farchivos%2F${anio}%2F${mes}%2F${dia}`;
        let rutaImg = `comunicados%2Fimagenes%2F${anio}%2F${mes}%2F${dia}`;
        let arrayPeticion = [];

        if (this.filesDropZone.length > 0) {
          for (let archivo of this.filesDropZone) {
            //Recibe todos los archivos de las imagenes
            // this.comunicadoForm.value['imagenes'] = this.archivos;
            arrayPeticion.push(this.AuthS.uploadFile(archivo, rutaImg));
          }
          longitudImgs = this.filesDropZone.length;
          console.log(longitudImgs);
          // this.comunicadoForm.value['imagenes'] = this.filesDropZone;
          this.comunicadoForm.value['imagenes'] = []
        }

        console.log(this.comunicadoForm);
        if (this.booleanFile) {
          arrayPeticion.push(this.AuthS.uploadFile(this.comunicadoForm.value.archivo, rutaFile));
        }

        if (!this.agregar) {

          if (this.booleanFile || this.filesDropZone.length > 0) {


            forkJoin(arrayPeticion).subscribe(next => {

              for (const archivo of next) {

                let archivoMaterial = archivo;
                let urlArchivo = archivoMaterial['name'];
                const url = urlArchivo.replace(/ /g, "%20").replace(/\//g, "%2F")
                let altMediaArchivo = archivoMaterial['downloadTokens'];

                const urlFirebase = this.AuthS.urlStorage + '/o/' + url + '?alt=media&token=' + altMediaArchivo;
                console.log(urlFirebase);
                
                //Si existe un archivo el ultimo 'archivo' será vinculado como File, los anteriores serán imgs
                if (this.booleanFile) {
                  if (next[longitudImgs] == archivo) {
                    this.comunicadoForm.value['archivo'] = urlFirebase;
                    console.log(this.comunicadoForm);

                  } else {
                    console.log(urlFirebase.indexOf('?alt='));

                    if(this.comunicado.imagenes){
                      this.comunicadoForm.value['imagenes'] = this.comunicado.imagenes
                    }
                    this.comunicadoForm.value['imagenes'].push(urlFirebase)
                    // this.comunicado.imagenes.push(urlFirebase);
                  }
                } else {
                  if(this.comunicado.imagenes){
                    this.comunicadoForm.value['imagenes'] = this.comunicado.imagenes
                  }
                  this.comunicadoForm.value['imagenes'].push(urlFirebase)
                  // this.comunicado.imagenes.push(urlFirebase);
                }
              }

            }, error => {
              console.log(error);
              Swal.fire({
                title: 'Error en enviar la solicitud',
                text: "Exceso del tamaño de archivos, por favor intentelo de nuevo con archivos menos pesados",
                icon: "error"
              })
            }, () => {

              // this.comunicadoForm.value['imagenes'] = this.comunicado.imagenes
              this.comunicado = this.comunicadoForm.value;
              this.comunicado.ids = this.ids;
              console.log(this.comunicado);

              peticionUpdate = this.AuthS.UpdatComunicado(this.comunicado);

              peticionUpdate.subscribe(resp => {
                console.log(resp);
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
            })

          } else {

            this.comunicadoForm.value['imagenes'] = this.comunicado.imagenes;
            this.comunicado = this.comunicadoForm.getRawValue();
            this.comunicado.imagenes = this.comunicadoForm.value['imagenes']
            this.comunicado.ids = this.ids;
            console.log(this.comunicado);

            peticionUpdate = this.AuthS.UpdatComunicado(this.comunicado);

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
            });

          }


        } else {

          if (this.booleanFile || this.filesDropZone.length > 0) {

            forkJoin(arrayPeticion).subscribe(next => {

              for (const archivo of next) {

                let archivoMaterial = archivo;
                let urlArchivo = archivoMaterial['name'];
                const url = urlArchivo.replace(/ /g, "%20").replace(/\//g, "%2F")
                let altMediaArchivo = archivoMaterial['downloadTokens'];

                const urlFirebase = this.AuthS.urlStorage + '/o/' + url + '?alt=media&token=' + altMediaArchivo;

                //Si existe un archivo el ultimo 'archivo' será vinculado como File, los anteriores serán imgs
                if (this.booleanFile) {
                  if (next[longitudImgs] == archivo) {
                    this.comunicadoForm.value['archivo'] = urlFirebase;
                    console.log(this.comunicadoForm);

                  } else {
                    this.imgProporcionadas.push(urlFirebase);
                  }
                } else {
                  this.imgProporcionadas.push(urlFirebase);
                }
              }

            }, error => {
              console.log(error);
              Swal.fire({
                title: 'Error en enviar la solicitud',
                text: "Exceso del tamaño de archivos, por favor intentelo de nuevo con archivos menos pesados",
                icon: "error"
              })
            }, () => {
              this.comunicadoForm.value['imagenes'] = this.imgProporcionadas;
              // console.log(this.comunicadoForm);
              this.comunicado = this.comunicadoForm.value;
              // this.comunicado.imagenes.push(this.comunicadoForm.value['imagenes'])
              console.log(this.comunicado);

              peticionSave = this.AuthS.saveComunicado(this.comunicado);

              peticionSave.subscribe(resp => {
                Swal.close();
                Swal.fire({
                  title: 'Guardado',
                  text: 'Se registraron correctamente los datos de: ' + this.comunicado.titulo,
                  icon: 'success',
                });
              }, (err) => {
                console.log(err);

                this.guardarPorTokenVencido(err, this.comunicado);
              }, () => {
                this.router.navigateByUrl('/MisComun');
              });

            })//Termina ForkJoin


          } else {

            console.log(this.comunicadoForm);
            this.comunicado = this.comunicadoForm.value;

            peticionSave = this.AuthS.saveComunicado(this.comunicado);

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
            });

          }//Termina else de si hay archivo

        }


      }
    })



  }// termina el

  //Guarda en el clipboard el texto del campo
  copyToClipboard(campo: string) {
    this.clipboard.copy(campo);
  }

  toastError(mensaje: string, titulo: string) {
    this.toastr.error(mensaje, titulo);
  }

  showToastWarning(mensaje: string, titulo: string) {
    this.toastr.warning(mensaje, titulo);
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
    } else {//Termina if
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


  abrirImagenes() {
    this.abrirCerrar = true;
  }

  cerrarImagenes() {
    this.abrirCerrar = false;
  }

}
