import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RegistroModel } from 'src/app/models/registro.model';
import {MatDatepickerModule} from '@angular/material/datepicker';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  
  mostrarContrasena: boolean = false;
  registroForm: FormGroup;
  registro: RegistroModel; //Registrar
  paso = false;
  idLocal;
  idTok

  constructor(private authS: AuthService,
    private route: ActivatedRoute,
    private router: Router) { 
       this.registroForm = new FormGroup({
         nombre: new FormControl(null, [Validators.required, Validators.minLength(2)]),
         apellido: new FormControl(null, [Validators.required, Validators.minLength(2)]),
         correo: new FormControl(null, [Validators.required, Validators.email]),
         password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
         rol: new FormControl('Administrador', [Validators.required]),
         puesto: new FormControl(null, [Validators.required, Validators.minLength(3)]),
         depto: new FormControl(null, [Validators.required, Validators.minLength(4)])
       })
    }

  ngOnInit(): void {
    this.registro = new RegistroModel();
  }

  registrarSubmit() {

    if(this.registroForm.invalid) { return; }

    const admin = 'Administrador';
    this.registro.nombre = this.registroForm.value.nombre;
    this.registro.apellido = this.registroForm.value.apellido;
    this.registro.correo = this.registroForm.value.correo;
    this.registro.password = this.registroForm.value.password;
    // console.log(this.registro.password); 
    this.registro.rol = this.registroForm.value.rol;
    this.registro.puesto = this.registroForm.value.puesto;
    this.registro.depto = this.registroForm.value.depto;
    
    this.paso = true;
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.authS.registrarUsuario(this.registro).subscribe(resp => {

      this.idLocal = resp['localId'];
      this.idTok = resp['idToken'];

      if (this.paso == true) {
        this.registro.password= CryptoJS.AES.encrypt(this.registroForm.value.password.trim(), admin.trim()).toString();
        this.authS.registrarDatosUsuario(this.registro, this.idLocal).subscribe(resp => {

          Swal.fire(
            'Registrado!',
            'Bienvenido a Mercadology!',
            'success'
          )
          this.paso = false;
          this.router.navigateByUrl('/usuarios');

        }, (err) => {

          // console.log(err.error.error.message);
          const tokenVencido = err.error.error;

          if (tokenVencido === "Auth token is expired") {
            // console.log("Entro a la comparativa de permiso denegado");
            const refresh = sessionStorage.getItem('refresh_token');
            this.authS.refrescarToken(refresh).subscribe(resp => {
              sessionStorage.setItem('token', resp['id_token']);
              sessionStorage.setItem('refresh_token', resp['refresh_token']);

              this.authS.registrarDatosUsuario(this.registro, this.idLocal).subscribe(resp => {
                // console.log("AHORA SI SE REGISTRO DESPUES DE VENCER EL TOKEN");
                Swal.fire(
                  'Registrado!',
                  'Bienvenido a Mercadology!',
                  'success'
                )
                this.router.navigateByUrl('/usuarios');
              });//TERMINA EL NUEVO REGISTRO DESPUES DE VENCER EL TOKEN
            });//tERMINA REFRESACAR TOKEN
          } else {//Termina if


            Swal.fire({
              icon: 'error',
              title: 'Error al registrarse',
              text: err.error.error.message
            });

          }
        }
        );

      }

    }, (err) => {

      Swal.fire({
        icon: 'error',
        title: 'Error al registrarse',
        text: err.error.error.message

      });

    }
    );

  }

}