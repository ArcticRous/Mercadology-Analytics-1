import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { RegistroModel } from 'src/app/models/registro.model';
import { ActivatedRoute, Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  oportunidades: any = 0;
  usuarios: RegistroModel[] = [];
  rol: string;

  displayedColumns: string[] = ['#', 'nombre', 'apellido', 'rol', 'habilitado', 'id'];
  dataSource: MatTableDataSource<RegistroModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usuarioService: AuthService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    sessionStorage.removeItem('local');
    this.rol = sessionStorage.getItem('rol');
    this.usuarioService.getUsuarios()
      .subscribe(resp => {        
        this.usuarios = resp;
        
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.paginator._intl.itemsPerPageLabel = "Elementos por página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }, (err) => {
        // console.log(err);
      }
      );

  }

  eliminarUsuario(usuario: RegistroModel, i: number) {
    Swal.fire({
      title: `¿Esta seguro que desea borrar a ${usuario.nombre}?`,
      text: `Antes de eliminar al usuario, se recomienda que lo inhabilite.`,
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
        this.dataSource.data.splice(this.dataSource.data.indexOf(usuario), 1);
      
        usuario.password = CryptoJS.AES.decrypt(usuario.password, 'Administrador').toString(CryptoJS.enc.Utf8);
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.usuarioService.iniciarSesionEliminar(usuario.correo, usuario.password).subscribe(resp => {
          // console.log(resp);
          
          this.usuarioService.eliminarUsuario(usuario.id).subscribe(resp => {
            // console.log(resp);
            Swal.close();
            Swal.fire({
              title: 'Eliminado',
              text: 'Se eliminaron correctamente los datos de: ' + usuario.nombre,
              icon: 'success',
            });
          }, (err)=>{
            this.borrarPorTokenVencido(err, usuario.id);
            Swal.close();
          } ); //LO COMENTO EN PRUEBAS

        }, (error) => {
          // console.log(error);
          
        }, () => {
          // console.log("se compelto la eliminariconnnn");
        });

      }
    })
  }//Temina eliminar usuarios

  borrarPorTokenVencido(err: any, usuario: any): any{
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.usuarioService.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.usuarioService.eliminarUsuario(usuario).subscribe();
      });//tERMINA REFRESACAR TOKEN
    }//Termina if
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();

    }
  }//Termina el filtro

  guardarLocal(local: string):void{
    sessionStorage.setItem('local',local);
  }

}