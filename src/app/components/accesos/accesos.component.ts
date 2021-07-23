import { AuthService } from './../../services/auth.service';
import { AccesosModel } from './../../models/accesos.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.component.html',
  styleUrls: ['./accesos.component.css']
})
export class AccesosComponent implements OnInit {

  agregarForm: FormGroup;
  agregarModel: AccesosModel;
  obtenerModel: AccesosModel[] = [];
  // modificarModel: AccesosModel;
  modificarModel: any = {
    id: "",
    proveedor: "",
    usuario: "",
    contrasena: "",
    comentario: ""
  };
  verModel: any = {
    id: "",
    proveedor: "",
    usuario: "",
    contrasena: "",
    comentario: ""
  };

  token: string = sessionStorage.getItem('token');
  rol: string;

  displayedColumns: string[] = ['#', 'proveedor', 'usuario', 'contrasena', 'id'];
  dataSource: MatTableDataSource<AccesosModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private auth: AuthService, private router: Router) {
    this.agregarForm = new FormGroup({
      proveedor: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      usuario: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      contrasena: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      comentario: new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');
    this.auth.getAccesos()
      .subscribe(resp => {
        this.obtenerModel = resp;

        this.dataSource = new MatTableDataSource(this.obtenerModel);
        this.paginator._intl.itemsPerPageLabel = "Elementos por página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }, (err) => {
        console.log(err);
      }
      );

  }

  agregarSubmit() {
    if (this.agregarForm.invalid) {
      // console.log(this.agregarForm);
      return false;
    }
    // console.log(this.agregarForm);
    // console.log(this.agregarForm.value);
    if (this.agregarForm.value.comentario == null) {
      this.agregarForm.value.comentario = "";
    }

    this.agregarModel = this.agregarForm.value;
    // console.log(this.agregarModel);
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.agregarAccesos(this.agregarModel, this.token).subscribe(resp => {
      // console.log(resp);
      this.auth.getAccesos()
      .subscribe(resp => {
        this.obtenerModel = resp;
        this.dataSource = new MatTableDataSource(this.obtenerModel);
      })
      
      Swal.fire({
        icon: 'success',
        title: 'Datos registrados',
        text: 'Se agregaron correctamente los datos'
      })
    }, (error) => {
      // console.log(error);
      this.metodoPorTokenVencido(error, this.agregarModel, "insert");
    }, () => {
      document.getElementById('agregarModal').click();
    })


  }

  eliminarAcceso(acceso: AccesosModel, i: number) {
    Swal.fire({
      title: `¿Esta seguro que desea borrar el acceso ${acceso.proveedor}?`,
      text: `Se borrará definitivamente el acceso`,
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
        this.dataSource.data.splice(this.dataSource.data.indexOf(acceso), 1);

        this.dataSource = new MatTableDataSource(this.obtenerModel);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.auth.eliminarAcceso(acceso.id, this.token).subscribe(resp => {
          Swal.fire({
            icon: 'success',
            title: 'Datos eliminados',
            text: 'Se eliminaron correctamente los datos'
          })
        }, (error) => {
          // console.log(error);
          this.metodoPorTokenVencido(error, acceso.id, "delete");
          Swal.close();
        }, () => {
          // console.log("se compelto la eliminariconnnn");
        });

      }
    })
  }//Temina eliminar accesos


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();

    }
  }//Termina el filtro


  modificarSubmit(form: NgForm) {

    if (form.invalid) {
      // console.log(form);
      return;
    }

    // console.log(form);
    // console.log(this.modificarModel);
    // console.log(this.modificarModel.id);

    Swal.fire({
      title: `¿Esta seguro que desea modificar el acceso ${this.modificarModel.proveedor}?`,
      text: `Se modificaran los datos actuales`,
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
        const token = sessionStorage.getItem('token');

        this.auth.modificarAcceso(this.modificarModel, token).subscribe(resp => {
          Swal.fire({
            title: 'Actualizado',
            text: 'Se actualizaron correctamente los datos',
            icon: 'success'
          })
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error,
            icon: 'error'
          })
          this.metodoPorTokenVencido(error, this.modificarModel, "update");
        }, () => {
          document.getElementById('modificarModal').click();
        })


      }

    })


  }

  modificarModalMetodo(item: any) {
    this.modificarModel = item;
  }

  verModalMetodo(item: any) {
    // console.log(item);
    this.verModel = item;
  }


  metodoPorTokenVencido(err: any, acceso: any, tipo: string): any {
    const tokenVencido = err.error.error;


    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.auth.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        if (tipo === 'delete') {
          this.auth.eliminarAcceso(acceso, sessionStorage.getItem('token')).subscribe(resp => {
            Swal.fire({
              icon: 'success',
              title: 'Datos eliminados',
              text: 'Se eliminaron correctamente los datos'
            })
          });
        } else if (tipo === 'update') {
          this.auth.modificarAcceso(acceso, sessionStorage.getItem('token')).subscribe(resp => {
            // console.log(resp);
            Swal.fire({
              title: 'Actualizado',
              text: 'Se actualizaron correctamente los datos',
              icon: 'success'
            })
          })
        } else if (tipo === 'insert') {
          this.auth.agregarAccesos(acceso, sessionStorage.getItem('token')).subscribe(resp => {
            
            Swal.fire({
              icon: 'success',
              title: 'Datos registrados',
              text: 'Se agregaron correctamente los datos'
            })
          })
        }

      });//tERMINA REFRESACAR TOKEN
    }//Termina if
  }

}
