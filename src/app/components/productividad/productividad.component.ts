import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductividadModel } from '../../models/productividad.model';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productividad',
  templateUrl: './productividad.component.html',
  styleUrls: ['./productividad.component.css']
})
export class ProductividadComponent implements OnInit {
  cargando: boolean = true
  selectOptions: any;

  productividad: ProductividadModel = new ProductividadModel;
  productividadForm: FormGroup;

  date = new Date();
  anio = 0

  constructor(private AuthService: AuthService,
    private route: ActivatedRoute, private fb: FormBuilder) {
    // if (this.date.getMonth() == 0) {
    //   this.anioArray.push(this.date.getFullYear() - 1);
    //   this.anioArray.push(this.date.getFullYear());
    // }
    this.anio = this.date.getFullYear();
  }

  ngOnInit(): void {
    const queryParams = this.route.queryParams['_value'];

    this.AuthService.getUsuarios().subscribe(next => {
      this.selectOptions = next
    }, error => {
      console.log(error);
    }, () => {
      if (queryParams.id) {
        this.inicializarEditar(queryParams)
      } else {
        this.inicializar()
      }
    })

  }

  inicializar() {
    this.productividadForm = this.fb.group({
      usuario: [this.selectOptions[0].id, [Validators.required]],
      productividad: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      mes: ["0", [Validators.required]],
      anio: [this.anio, [Validators.required]]
    });
    this.cargando = false;
  }

  inicializarEditar(data: Object) {
    this.productividadForm = this.fb.group({
      usuario: [data['id'], [Validators.required]],
      productividad: [data['productividad'], [Validators.required, Validators.min(0), Validators.max(100)]],
      mes: [data['mes'], [Validators.required]],
      anio: [data['anio'], [Validators.required]]
    });
    this.cargando = false;
  }

  guardar() {

    if (this.productividadForm.invalid) { return }

    Swal.fire({
      title: `¿Desea agregar productividad?`,
      text: `Se agregará la productividad al usuario`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then(resp => {
      if (resp.value) {

        Swal.fire({
          title: 'Espere',
          text: 'Guardando información',
          allowOutsideClick: false
        });
        Swal.showLoading();

        const ruta = `${this.productividadForm.value.usuario}/${this.productividadForm.value.anio}`
        var posicion = parseInt(this.productividadForm.value.mes);
        const found = this.selectOptions.find(element => element.id === this.productividadForm.value.usuario)
        this.productividad.usuario = found.nombre + ' ' + found.apellido

        this.AuthService.getProID(ruta).subscribe((next: ProductividadModel) => {

          if (next != null) {
            this.productividad = next
            this.productividad.productividad.splice(posicion, 1, this.productividadForm.value.productividad)
          } else {
            let array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            array.splice(posicion, 1, this.productividadForm.value.productividad)
            this.productividad.productividad = [...array]
          }
        }, error => {
          console.log(error);
        }, () => {
          this.AuthService.agregarProductividad(this.productividad, ruta).subscribe(next => {
            Swal.fire({
              title: `Productividad agregada`,
              text: `Se le agrego a ${this.productividad.usuario} la productividad`,
              icon: 'success'
            })
          }, error => {
            this.guardarPorTokenVencido(error, this.productividad, ruta)
          })
        })

      }
    })
  }

  guardarPorTokenVencido(err: any, productividad: any, ruta: string): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthService.refrescarToken(refresh).subscribe(resp => {

        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthService.agregarProductividad(productividad, ruta).subscribe(next => {
          Swal.fire({
            title: `Productividad agregada`,
            text: `Se le agrego a ${productividad.usuario} la productividad`,
            icon: 'success'
          })
        }, (err) => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al intentar agregar la productividad, intentelo nuevamente o inicie sesión de nuevo',
            icon: 'error',
          });
        }
        );//TERMINA REFRESACAR TOKEN
      })//Termina if
    }
  }

}
