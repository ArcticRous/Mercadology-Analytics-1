import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroModel } from 'src/app/models/registro.model';
import { FormControl, FormGroup, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  mostrarContrasena: boolean = false;
  idToken: string = sessionStorage.getItem('token');
  id: any;
  local: string; //Esta variable es para controlar la vista del menu , para que no se vea cuando se ve un perfil especifio desde le meenu de usuarios y asi en todas
  rol: string;
  idUsuario: string;

  imageForm: FormGroup;
  cambiarEmailForm: FormGroup;
  cambiarContrasenaForm: FormGroup;

  file: any;

  nombreImg: any;
  altMediaImg: any;
  constructor(public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  usuario: RegistroModel = {
    id: '',
    nombre: '',
    apellido: '',
    correo: '',
    urlPhoto: "../../../assets/imagenes/imagenPerfil/avatar.jpg",
    habilitado: true
  }

  // nuevoEmail: string;
  registro: RegistroModel;

  ngOnInit(): void {
    this.local = sessionStorage.getItem('local');
    this.idUsuario = sessionStorage.getItem('idUsuario');
    this.rol = sessionStorage.getItem('rol');
    this.id = this.route.snapshot.paramMap.get('id');

    this.imageForm = new FormGroup({
      file: new FormControl(null, Validators.required)
    })

    this.cambiarEmailForm = new FormGroup({
      nuevoEmail: new FormControl(null, [Validators.email, Validators.required])
    })

    this.cambiarContrasenaForm = new FormGroup({
      nuevaContrasena: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.authService.getUsuario(this.id)
      .subscribe((resp: RegistroModel) => {
        this.registro = resp;
        this.registro.id = this.id;
        if (resp.urlPhoto) {
          this.usuario.urlPhoto = resp.urlPhoto;
        }
        // console.log(this.usuario.urlPhoto);
      });

    this.usuario.nombre = sessionStorage.getItem('name');
    //    this.usuarioA.correo = sessionStorage.getItem('email');
    this.usuario.id = sessionStorage.getItem('idUsuario');
  }

  verificarCorreo(): void {
    this.authService.verificarCorreoAuth(this.idToken).subscribe();
  }

  onfileChange(event) {
    // console.log('img: ', event);

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.includes("image")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function load() {
          this.usuario.urlPhoto = reader.result;
        }.bind(this);

        this.file = file;

      } else {
        // console.log('Hay un error');
      }
    } else {
      // console.log('No entro' + event.target.files + event.target.files.lenght);
    }
  }


  onSubmit() {
    let imagenNueva;
    const form = this.imageForm;
    if (form.valid) {
      this.authService.uploadImage(this.file, this.usuario.id)
        .subscribe(data => {
          imagenNueva = data;
          this.imageForm = new FormGroup({
            file: new FormControl(null),
          })
          // console.log(imagenNueva);
          let urlImagen = imagenNueva.contentDisposition;
          let longitudUrl = urlImagen.length;

          const url = urlImagen.slice(25, longitudUrl);

          this.nombreImg = url;

          this.altMediaImg = imagenNueva.downloadTokens;

          const urlFirebase = this.authService.urlStorage + '/o/photosProfile%2F' + this.usuario.id + '%2F' + this.nombreImg + '?alt=media&token=' + this.altMediaImg;
          // console.log(urlFirebase);

          this.registro.urlPhoto = urlFirebase;
          this.authService.actualizarUsuario(this.registro).subscribe();
        })
    }
  }

  actualizarSubmit(form: NgForm) {

    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    //Este se modifica su displayName el primero porque tiene el idToken de el mismo
    this.authService.modificarUsuarioAuth(this.idToken, this.registro).subscribe();
    this.authService.actualizarUsuario(this.registro).subscribe(resp => {

      Swal.close();
      Swal.fire(
        'Actualizado!',
        'Datos correctamente actualizados!',
        'success'
      )
      this.router.navigateByUrl('/home');
    }, (err) => {

      const tokenVencido = err.error.error;

      if (tokenVencido === "Auth token is expired") {
        // console.log("Entro a la comparativa de permiso denegado");
        const refresh = sessionStorage.getItem('refresh_token');
        this.authService.refrescarToken(refresh).subscribe(resp => {
          sessionStorage.setItem('token', resp['id_token']);
          sessionStorage.setItem('refresh_token', resp['refresh_token']);

          this.authService.actualizarUsuario(this.registro).subscribe(resp => {
            // console.log("AHORA SI SE ACTUALIZO DESPUES DE VENCER EL TOKEN");
            Swal.fire(
              'Actualizado!',
              'Datos correctamente actualizados!',
              'success'
            )
          }, (err) => {
            console.log(err);
          }, () => {
            this.router.navigateByUrl('/home');
          }

          );//TERMINA EL NUEVO REGISTRO DESPUES DE VENCER EL TOKEN
        });//tERMINA REFRESACAR TOKEN
      } else {//Termina if

        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar datos',
          text: err.error.error.message
        });
      }
    }
    );
  }//Termina el submit*/

  /**Cambiar email, no se usa, pero si se requiere, se activa**/
  cambiarEmail() {
    // console.log(this.cambiarEmailForm);

    if (this.cambiarEmailForm.valid) {

      const email = this.cambiarEmailForm.value.nuevoEmail;
      // console.log(this.cambiarEmailForm.value.nuevoEmail);

      Swal.fire({
        title: '¿Esta seguro?',
        text: `Una vez que cambie su correo ya no podra accesar con ${this.registro.correo}`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then(resp => {
        if (resp.value) {

          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            text: 'Espere por favor...'
          });
          Swal.showLoading();

          // console.log("Correo cambiado");
          this.authService.cambiarEmailUsuario(email).subscribe(resp => {
            // console.log(resp['refreshToken']);

            sessionStorage.setItem('token', resp['idToken']);
            sessionStorage.setItem('refresh_token', resp['refreshToken']);

            this.registro.correo = email;

            this.authService.actualizarUsuario(this.registro).subscribe(resp => {
              // console.log(resp);
            }, (err) => {
              console.log(err);
            }, () => {
              Swal.fire({
                icon: 'success',
                title: 'Se guardo el nuevo correo',
                text: "Su nuevo correo es: " + email
              });
            }
            )

          }, (err) => {

            const tokenVencido = err.error.error.message;

            if (tokenVencido === "Auth token is expired" || tokenVencido === "TOKEN_EXPIRED") {
              
              // console.log("Entro a la comparativa de permiso denegado");
              const refresh = sessionStorage.getItem('refresh_token');
              this.authService.refrescarToken(refresh).subscribe(resp => {
                sessionStorage.setItem('token', resp['id_token']);
                sessionStorage.setItem('refresh_token', resp['refresh_token']);

                this.authService.cambiarEmailUsuario(email).subscribe(resp => {
                  // console.log("AHORA SI SE ACTUALIZO DESPUES DE VENCER EL TOKEN");
                  this.registro.correo = email;
                  this.authService.actualizarUsuario(this.registro).subscribe(resp => {
                    // console.log(resp);
                  }, (err) => {
                    console.log(err);
                  }, () => {
                    // console.log("Se actualizo el usuario normal de realdatabase")
                  }

                  )
                  Swal.fire({
                    icon: 'success',
                    title: 'Se guardo el nuevo correo',
                    text: "Su nuevo correo es: " + email
                  });

                }, (err) => {
                  if (err.error.error.message === 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN' || tokenVencido === 'INVALID_ID_TOKEN') {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Su sesión inicial ha caducado',
                      text: 'Inicie sesión nuevamente para poder cambiar su email'
                    })
                  }
                  console.log(err);
                }, () => {
                  // Swal.close();
                  // console.log("Refrescando token");
                  document.getElementById('cambiarEmail').click();
                }

                );//TERMINA EL NUEVO REGISTRO DESPUES DE VENCER EL TOKEN
              });//tERMINA REFRESACAR TOKEN
            } else {//Termina if

              if (tokenVencido === 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN' || tokenVencido === 'INVALID_ID_TOKEN') {

                Swal.close();
                Swal.fire({
                  icon: 'warning',
                  title: 'Su sesión inicial ha caducado',
                  text: 'Inicie sesión nuevamente para poder cambiar su email'
                })
              } else {

                Swal.fire({
                  icon: 'error',
                  title: 'Error al actualizar el email',
                  text: err.error.error.message
                });
              }
            }

          }, () => { //Termina el error del primer intento
            document.getElementById('cambiarEmail').click();
          });

        }
        //Cerrar modal una vez que se valido el formulario 
        document.getElementById('cambiarEmail').click();

      })

    } else {
      // console.log("No es valido");
    }
  }





  cambiarContrasena(): void {

    if (this.cambiarContrasenaForm.valid) {

      const contrasena = this.cambiarContrasenaForm.value.nuevaContrasena;

      Swal.fire({
        title: '¿Esta seguro?',
        text: `Una vez que cambie su correo ya no podra accesar con ${this.registro.correo}`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then(resp => {
        if (resp.value) {

          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            text: 'Espere por favor...'
          });
          Swal.showLoading();


          this.authService.cambiarContrasenaUsuario(contrasena).subscribe(resp => {
            // console.log(resp['refreshToken']);

            sessionStorage.setItem('token', resp['idToken']);
            sessionStorage.setItem('refresh_token', resp['refreshToken']);

            const admin = "Administrador";
            const contrasenaNueva = CryptoJS.AES.encrypt(contrasena, admin.trim()).toString();
            this.registro.password = contrasenaNueva;

            this.authService.actualizarUsuario(this.registro).subscribe(resp => {

              // Swal.close();
              Swal.fire({
                icon: 'success',
                title: 'Se cambio su contraseña',
                text: 'La próxima vez que inicie sesión hagalo con su nueva contraseña'
              })
            }, (error) => {
              // console.log(error);
            })

          }, (err) => {

            const tokenVencido = err.error.error.message;

            if (tokenVencido === 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN' || tokenVencido === 'INVALID_ID_TOKEN') {
              // Swal.close();
              Swal.fire({
                icon: 'warning',
                title: 'Su sesión inicial ha caducado',
                text: 'Inicie sesión nuevamente para poder cambiar contraseña'
              })
            } else {
              // Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'No se puede actualizar contraseña',
                text: tokenVencido
              })
            }

          }, () => {
            // console.log("Se termino la peticion de contraseña oauth");
            document.getElementById('cambiarContrasena').click();
          })

        } else {
          //Cierra el modal
          document.getElementById('cambiarContrasena').click();
        }

      })

    }
  }



}
