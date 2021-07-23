import { RegistroModel } from './../../models/registro.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/usuario.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mostrarContrasena: boolean = false;
  restablecerContrasenaForm: FormGroup;
  confirmarCodigoContrasenaForm: FormGroup;
  usuario: UsuarioModel;
  usuario2: RegistroModel;
  constructor(private auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel();

    this.restablecerContrasenaForm = new FormGroup({
      restablecerContrasena: new FormControl(null, [Validators.email, Validators.required])
    })

    this.confirmarCodigoContrasenaForm = new FormGroup({
      confirmarCodigoContrasena: new FormControl(null, [Validators.required])
    })

  }
  Login(form: NgForm) {
    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.Login(this.usuario).subscribe(resp => {

      const id = resp['localId'];
      // console.log(id);
    

      this.auth.getUsuario(id)
        .subscribe((resp: RegistroModel) => {
          // console.log(resp['habilitado']);
          // console.log(resp['correo']);
          // console.log(resp['rol']);

          if (!resp['habilitado']) {

            Swal.fire({
              icon: 'error',
              title: 'Usuario inhabilitado',
              text: 'El usuario ha sido deshabilitado'
            });
            this.router.navigateByUrl('/login');
            this.auth.Logout();
            // return;
          } else {
            Swal.close();
            // console.log("Entro esta hailitado");
            this.router.navigateByUrl('/home');
          }
        }, (error) => {
          // console.log(error);
        }, () => {
          // Swal.close();
        })

    }, (err) => {
      // console.log(err.error.error.message);
      // console.log(err);
      const error = err.error.error.message;

      Swal.close();

      switch (error) {
        case 'EMAIL_NOT_FOUND':
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: 'El usuario no existe'
          });
          break;

        case 'INVALID_PASSWORD':
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: 'Contraseña incorrecta'
          });
          break;

        case 'USER_DISABLED':
          Swal.fire({
            icon: 'error',
            title: 'Usuario inhabilitado',
            text: 'La cuenta ha sido deshabilitada'
          });
          break;

        case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
        Swal.fire({
          icon: 'warning',
          title: 'Cuenta dehabilitada temporalmente',
          text: 'Realizo demasiados intentos fallidos de inicio de sesión, restablezca su contraseña o intentenlo nuevamente más tarde'
        });
        break;

        default:
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: error
          });
          break;
      }
    })

  }


  restablecerContrasena() {

    if (this.restablecerContrasenaForm.valid) {

      const correo = this.restablecerContrasenaForm.value.restablecerContrasena;

      Swal.fire({
        icon: 'question',
        title: `¿Seguro que quiere restablecer su contraseña?`,
        text: `Se enviara un enlace para restablecer contraseña al correo ${correo}`,
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
          this.auth.correoRestablecimientoContrasena(correo).subscribe(resp => {

            Swal.fire({
              icon: 'success',
              title: 'Se ha enviado el email',
              text: `Revise su correo y haga clic en el enlace para restablecer su contraseña`
            })

          }, (error) => {
            
            Swal.fire({
              icon: 'error',
              title: 'Email no existe',
              text: `El correo ingresado no existe`
            })
            document.getElementById('restablecerContrasena').click();

          }, () => {
            // console.log("Se completo el restablecimiento de contraseña");
            document.getElementById('restablecerContrasena').click();
          })
        }//Termina if de respuesta de sweet alert 'ok'

      })

    }
    //  else { //if - Else de formulario valido o no valido
    //   // console.log(this.restablecerContrasenaForm);
    // }
  }



}
