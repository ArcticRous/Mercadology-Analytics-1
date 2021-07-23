import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ClienteModel } from "../../models/cliente.model";
import Swal from 'sweetalert2';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit, AfterViewInit {

  Cliente: ClienteModel[] = [];
  // Cliente2: ClienteModel[] = [{ids:"21" ,nomcli: "erick", domcli:"ero", dirip:"skks", estado:false}]
  cargando = false;
  durationInSeconds = 2;
  rol: string;

  displayedColumns: string[] = ['#', 'nomcli', 'domcli', 'dirip', 'estado', 'ids'];
  dataSource: MatTableDataSource<ClienteModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private AuthService: AuthService) {
    AuthService.leerToken();
  }

  ngOnInit(): void {
    sessionStorage.removeItem('local');
    this.rol = sessionStorage.getItem('rol');
    this.cargando = true;
    this.AuthService.getCliente()
      .subscribe(resp => {
        this.Cliente = resp;
        this.cargando = false;
        this.dataSource = new MatTableDataSource(this.Cliente);
        this.paginator._intl.itemsPerPageLabel="Elementos por página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

  }//Termina ngOnInit

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }


  borrarClient(cliente: ClienteModel, i: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${cliente.nomcli}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {

      if (resp.value) {
        // this.Cliente.splice(i, 1);
        this.AuthService.DeleteClient(cliente.ids).subscribe(resp => {
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de: ' + cliente.nomcli,
            icon: 'success',
          });
        // console.log(resp);
        }, (err)=>{
          this.borrarPorTokenVencido(err, cliente.ids);
        } ); //LO COMENTO EN PRUEBAS

        // console.log(this.dataSource.data.indexOf(cliente));

        this.dataSource.data.splice(this.dataSource.data.indexOf(cliente, i), 1);
        // console.log(this.dataSource);

        this.dataSource = new MatTableDataSource(this.Cliente);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    });

  }//Termina borrar cliente

  borrarPorTokenVencido(err: any, usuario: any): any{
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthService.refrescarToken(refresh).subscribe(resp => {
        // console.log(resp);
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthService.DeleteClient(usuario).subscribe( resp => {
          // console.log(resp);
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de: ' + usuario.nomcli,
            icon: 'success',
          });
          
        } );
      });//tERMINA REFRESACAR TOKEN
    }//Termina if
    
    // console.log(err);
  }


}