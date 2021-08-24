import { MinutaModel } from './../../models/minuta.model';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormControl, Validators, NgForm, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-minuta',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.css']
})
export class MinutaComponent implements OnInit {

  minutaModel: MinutaModel;

  fechaDefecto: string;
  horaDefecto: string;
  anio: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;

  numReunionDefecto: number = 1001;
  spinner: boolean = true;

  minutaForm: FormGroup;

  nuevoAsistente: FormControl;
  nuevoPendienteForm: FormGroup;

  //Boleano para aprecer una alerta si esta mal el campo asistente
  booleanNAsistente: boolean = true;
  booleanNPendiente: boolean = true;

  constructor(private auth: AuthService, private fb: FormBuilder) {

    this.auth.obtenerMinutas().subscribe(resp => {
      this.numReunionDefecto = 1000 + resp.length + 1;
      this.spinner = false;
    }, error => {
      console.log(error);
      this.spinner = false;
      this.inicializar();
    }, () => {
      this.inicializar();
    })

  }

  ngOnInit(): void { }

  getErrores(campo: string) {
    return this.minutaForm.controls[campo].errors && this.minutaForm.controls[campo].touched;
  }

  getErroresPendientes() {
    // return this.nuevoPendienteForm.invalid && this.nuevoPendienteForm.touched;
    // this.booleanNPendiente = true;
  }

  get asistentesArr() {
    return this.minutaForm.get('asistentes') as FormArray;
  }

  agregarAsistente() {
    if (this.nuevoAsistente.invalid) { this.booleanNAsistente = false; return; }
    console.log(this.asistentesArr);

    this.asistentesArr.push(this.fb.control(this.nuevoAsistente.value, [Validators.required, Validators.minLength(3)]));

    this.nuevoAsistente.reset();
    this.booleanNAsistente = true;
  }

  get pendientesArr() {
    return this.minutaForm.get("pendientes") as FormArray;
  }

  agregarPendiente() {
    if (this.nuevoPendienteForm.invalid) {
      console.log("hollllllllll");
      this.booleanNPendiente = false; return;
    }

    this.pendientesArr.push(this.fb.group(this.nuevoPendienteForm.value, [Validators.required]))

    this.nuevoPendienteForm.reset()
    this.booleanNPendiente = true;
  }

  borrarAsistente(i: number) {
    this.asistentesArr.removeAt(i);
  }

  borrarPendiente(i: number) {
    this.pendientesArr.removeAt(i)
  }

  guardar() {

    if (this.minutaForm.invalid) { this.minutaForm.markAllAsTouched(); this.booleanNPendiente = false; return; }

    Swal.fire({
      icon: 'success',
      title: "¿Los datos son correctos?",
      text: 'Se guardarán los datos',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
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

        console.log(this.minutaForm);


        this.minutaModel = this.minutaForm.value;
        this.auth.guardarMinuta(this.minutaModel).subscribe(resp => {
          console.log(resp);
          Swal.fire({
            title: 'Guardado',
            text: 'Se registraron correctamente los datos',
            icon: 'success'
          })

        }, error => {
          console.log(error);
          this.guardarPorTokenVencido(error, this.minutaModel)
        }, () => {
          this.minutaForm.reset(({
            fecha: this.fechaDefecto,
            hora: this.horaDefecto,
            numReunion: this.numReunionDefecto + 1
          }))
          this.asistentesArr.reset();
          this.pendientesArr.reset();
          this.pendientesArr.clear()
          this.asistentesArr.clear()
        })

      }
    })

  }


  guardarPorTokenVencido(err: any, minuta: any): any {
    const tokenVencido = err.error.error;
console.log(tokenVencido);

    if (tokenVencido === "Auth token is expired") {
      const refresh = sessionStorage.getItem('refresh_token');
      this.auth.refrescarToken(refresh).subscribe(resp => {

        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.auth.guardarMinuta(minuta).subscribe(resp => {
          Swal.fire({
            title: 'Guardado',
            text: 'Se registraron correctamente los datos',
            icon: 'success',
          });

        }, (err) => {
          // console.log(err);
          Swal.fire({
            title: '¡Error!',
            text: 'Se produjo un error para guardar datos, vuelva a iniciar sesión',
            icon: 'error',
          });

        }, () => {
          this.minutaForm.reset(({
            fecha: this.fechaDefecto,
            hora: this.horaDefecto,
            numReunion: this.numReunionDefecto + 1
          }))
          this.asistentesArr.reset();
          this.pendientesArr.reset();
          this.pendientesArr.clear();
          this.asistentesArr.clear();
        })
      });
    } else {//Termina if
      Swal.fire({
        title: '¡Error!',
        text: 'Se produjo un error para guardar datos, vuelva a iniciar sesión',
        icon: 'error',
      });
    }

  }

  inicializar(){
    let date = new Date();
    this.anio = date.getFullYear()
    this.mes = (date.getMonth() + 1)
    this.dia = date.getDate();

    this.hora = date.getHours();
    this.minuto = date.getMinutes();
    this.horaDefecto = `${this.hora}:${this.minuto}`
    this.fechaDefecto = `${this.anio}-${this.mes}-${this.dia}`

    if (this.hora < 10) {
      this.horaDefecto = `0${this.hora}:${this.minuto}`
      if (this.minuto < 10) {
        this.horaDefecto = `0${this.hora}:0${this.minuto}`
      }
    } else if (this.minuto < 10) {
      this.horaDefecto = `${this.hora}:0${this.minuto}`
      if (this.hora < 10) {
        this.horaDefecto = `0${this.hora}:0${this.minuto}`
      }
    }

    if (this.mes < 10) {
      this.fechaDefecto = `${this.anio}-0${this.mes}-${this.dia}`
      if (this.dia < 10) {
        this.fechaDefecto = `${this.anio}-0${this.mes}-0${this.dia}`
      }
    } else if (this.dia < 10) {
      this.fechaDefecto = `${this.anio}-${this.mes}-0${this.dia}`
      if (this.mes < 10) {
        this.fechaDefecto = `${this.anio}-0${this.mes}-0${this.dia}`
      }
    }
    console.log(this.numReunionDefecto);
    

    this.minutaForm = this.fb.group({
      fecha: [this.fechaDefecto, [Validators.required]],
      hora: [this.horaDefecto, [Validators.required]],
      numReunion: [this.numReunionDefecto, []],
      asistentes: this.fb.array([], [Validators.required]),
      objetivo: [, [Validators.required, Validators.minLength(10)]],
      pendientes: this.fb.array([], [Validators.required]),
      proxReunion: [, [Validators.required]],
      elaboro: [, Validators.required],
      autorizo: [, Validators.required]
    })

    this.nuevoAsistente = this.fb.control("", [Validators.required, Validators.minLength(3)]);

    this.nuevoPendienteForm = this.fb.group({
      hecho: [, [Validators.required, Validators.minLength(10)]],
      responsable: [, [Validators.required, Validators.minLength(3)]],
      estimado: [, Validators.required]
    })
  }

}
