import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroModel } from 'src/app/models/registro.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']
})
export class ModificarComponent implements OnInit {

  registro: RegistroModel; //Este es para modificar cuando ya tengo los usuarios
  idToken: string;
  admin: string;

  mostrarContrasena: boolean = false;
  cambiarContrasenaForm: FormGroup;
  cambiarEmailForm: FormGroup;

  constructor(private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router) {
    this.idToken = sessionStorage.getItem('token');
    this.admin = sessionStorage.getItem('rol');
    // console.log(this.idToken);
  }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.cambiarContrasenaForm = new FormGroup({
      nuevaContrasena: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.cambiarEmailForm = new FormGroup({
      nuevoEmail: new FormControl(null, [Validators.email, Validators.required])
    })

    this.auth.getUsuario(id)
      .subscribe((resp: RegistroModel) => {
        this.registro = resp;
        // console.log(resp);

        this.registro.id = id;
      })

  }

  modificarSubmit(form: NgForm) {

    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    //No se puede actualizar el nombre de usuario en el Auth porque necesto el idToken del usuario y no se tiene el idToken desde otro usuario
    //this.auth.modificarUsuarioAuth(this.idToken, this.registro).subscribe();
    this.auth.actualizarUsuario(this.registro).subscribe(resp => {


      Swal.fire(
        'Actualizado!',
        'Datos correctamente actualizados!',
        'success'
      )
      this.router.navigateByUrl('/usuarios');
    }, (err) => {
      // console.log(err.error.error.message);

      const tokenVencido = err.error.error;
      // console.log(err);

      if (tokenVencido === "Auth token is expired") {
        // console.log("Entro a la comparativa de permiso denegado");
        const refresh = sessionStorage.getItem('refresh_token');
        this.auth.refrescarToken(refresh).subscribe(resp => {
          // console.log(resp);
          sessionStorage.setItem('token', resp['id_token']);
          sessionStorage.setItem('refresh_token', resp['refresh_token']);

          this.auth.actualizarUsuario(this.registro).subscribe(resp => {
            // console.log("AHORA SI SE ACTUALIZO USUARIO DESPUES DE VENCER EL TOKEN");
            Swal.fire(
              'Actualizado!',
              'Datos correctamente actualizados!',
              'success'
            )
            this.router.navigateByUrl('/usuarios');
          }, (err) => {
            // console.log(err);
          }, () => {
            Swal.close();
            Swal.fire(
              'Actualizado!',
              'Datos correctamente actualizados!',
              'success'
            )
            this.router.navigateByUrl('/usuarios');
          });//TERMINA EL NUEVO REGISTRO DESPUES DE VENCER EL TOKEN
        });//tERMINA REFRESACAR TOKEN
      } else { //Termina if
        // console.log(err.error.error.message);

        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar datos',
          text: 'No esta autorizado para realizas cambios: ' + err.error.error
        });
      }

    }, () => {
      Swal.close();
      Swal.fire(
        'Actualizado!',
        'Datos correctamente actualizados!',
        'success'
      )
      this.router.navigateByUrl('/usuarios');
    }
    );
  }//Termina el submit  


  cambiarEmail() {
    // console.log(this.registro);

    if (this.cambiarEmailForm.valid) {
      const correo = this.cambiarEmailForm.value.nuevoEmail;
      const password = this.registro.password;
      // console.log(password);
      // console.log(correo);

      Swal.fire({
        title: `¿Esta seguro de cambiar el email de ${this.registro.nombre} ${this.registro.apellido}?`,
        text: `Una vez que cambie el correo, el usuario ${this.registro.nombre} ya no podra accesar con ${this.registro.correo}`,
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

          const admin = 'Administrador';
          // console.log(this.registro.password);

          //Tengo que desencriptarlas para usuarios con encriptaciones
          const passwordDesencriptada = CryptoJS.AES.decrypt(this.registro.password, admin).toString(CryptoJS.enc.Utf8);
          // console.log(password);
          // console.log(passwordDesencriptada);

          this.auth.iniciarSesionCambiarContrasenaOEmail(this.registro.correo, passwordDesencriptada, correo, "email").subscribe(resp => {
            const token = resp['idToken'];
            const id = resp['localid'];

            // console.log(this.registro);
            this.registro.correo = correo;
            // console.log(this.registro);

            this.auth.adminActualizarUsuario(this.registro, correo, token).subscribe(resp => {
              // console.log(resp);
              Swal.fire({
                icon: 'success',
                title: 'Se cambio el email',
                text: `La próxima vez que ${this.registro.nombre} inicie sesión, deberá hacerlo con su nuevo email: ${correo}`
              })

            }, (error) => {
              // console.log(error);
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'No se puede actualizar su email',
                text: error
              })

            })

          }, (error) => {
            // console.log(error);

          }, () => document.getElementById('emailModal').click());

        } else {
          document.getElementById('emailModal').click();
        }
      })

    }



  }


  cambiarContrasena() {

    // console.log(this.registro);

    if (this.cambiarContrasenaForm.valid) {

      // console.log(this.cambiarContrasenaForm);
      const password = this.cambiarContrasenaForm.value.nuevaContrasena;
      const correo = this.registro.correo;
      // console.log(password);
      // console.log(correo);

      Swal.fire({
        title: '¿Esta seguro?',
        text: `Una vez que cambie su contraseña el usuario ${this.registro.correo} ya no podrá accesar con su antigua contraseña`,
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

          const admin = 'Administrador';
          // console.log(this.registro.password);

          //Tengo que desencriptarlas para usuarios con encriptaciones
          const passwordDesencriptada = CryptoJS.AES.decrypt(this.registro.password, admin).toString(CryptoJS.enc.Utf8);
          // console.log(password);
          // console.log(passwordDesencriptada);


          this.auth.iniciarSesionCambiarContrasenaOEmail(correo, passwordDesencriptada, password, "contrasena").subscribe(resp => {
            // console.log(resp);
            const token = resp['idToken'];
            const id = resp['localid'];

            const passwordNuevaEncriptada = CryptoJS.AES.encrypt(password.trim(), admin.trim()).toString();
            // console.log(passwordNuevaEncriptada);

            // console.log(this.registro);
            this.registro.password = passwordNuevaEncriptada;
            // console.log(this.registro);

            this.auth.adminActualizarUsuario(this.registro, passwordNuevaEncriptada, token).subscribe(resp => {
              // console.log(resp);
              Swal.fire({
                icon: 'success',
                title: 'Se cambio la contraseña',
                text: `La próxima vez que ${this.registro.correo} inicie sesión, deberá hacerlo con su nueva contraseña`
              })

            }, (error) => {
              // console.log(error);
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'No se puede actualizar contraseña',
                text: error
              })

            })

          }, (error) => {
            // console.log(error);

          }, () => document.getElementById('contrasenaModal').click());
        } else {
          //Cierra el modal
          document.getElementById('contrasenaModal').click();
        }
      })
    }
  }


}
