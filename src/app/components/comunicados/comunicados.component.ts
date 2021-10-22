import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ComunicadoModel } from "../../models/comunicado.model";
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-comunicados',
  templateUrl: './comunicados.component.html',
  styleUrls: ['./comunicados.component.css']
})

export class ComunicadosComponent implements OnInit, AfterViewInit {
 
  Comunicado: ComunicadoModel[] = [];
  
 //  comunicado: ComunicadoModel = new ComunicadoModel;
   catFilter = "General";
   cargando = false;
   durationInSeconds = 2;
   rol: string;
 
   displayedColumns: string[] = ['titulo','fecha','categoria', 'ids'];
   dataSource: MatTableDataSource<ComunicadoModel>;
 
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;
  


 
   constructor(private Auth: AuthService) {
     Auth.leerToken();
     
   }
 
   ngOnInit(): void {
     sessionStorage.removeItem('local');
     this.rol = sessionStorage.getItem('rol');
     this.cargando = true;
     this.Auth.getComun("")
       .subscribe(resp => {
         this.Comunicado = resp
         this.cargando = false;
         this.dataSource = new MatTableDataSource(this.Comunicado);
         this.paginator._intl.itemsPerPageLabel="Elementos por página";
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
       });
       
 
   }//Termina ngOnInit
   
   ngAfterViewInit() {
 
   }
   onSelect(event){
    const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
 
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage(); 
     }
   }
 
   applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
 
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
       
     }
   }
 
 
   borrarComunicado(comunicado: ComunicadoModel, i: number) {
     Swal.fire({
       title: '¿Está seguro?',
       text: `Está seguro que desea borrar a ${comunicado.titulo}`,
       icon: 'question',
       showConfirmButton: true,
       showCancelButton: true
     }).then(resp => {
 
       if (resp.value) {
         this.Auth.DeleteComun(comunicado.ids).subscribe(resp => {
           Swal.fire({
             title: 'Eliminado',
             text: 'Se eliminaron correctamente los datos de: ' + comunicado.titulo,
             icon: 'success',
           });
         }, (err)=>{
            this.borrarPorTokenVencido(err, comunicado.ids);
         } ); //LO COMENTO EN PRUEBAS
 
         this.dataSource.data.splice(this.dataSource.data.indexOf(comunicado, i), 1);
         this.dataSource = new MatTableDataSource(this.Comunicado);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
 
       }
     });
 
   }//Termina borrar cliente
 
   borrarPorTokenVencido(err: any, usuario: any): any{
     const tokenVencido = err.error.error;
 
     if (tokenVencido === "Auth token is expired") {
       const refresh = sessionStorage.getItem('refresh_token');
       this.Auth.refrescarToken(refresh).subscribe(resp => {
         sessionStorage.setItem('token', resp['id_token']);
         sessionStorage.setItem('refresh_token', resp['refresh_token']);
 
         this.Auth.DeleteComun(usuario).subscribe( resp => {
           Swal.fire({
             title: 'Eliminado', 
             text: 'Se eliminaron correctamente los datos de: ' + usuario.titulo,
             icon: 'success',
           });  
           
         } );
       });//TERMINA REFRESACAR TOKEN
     }//Termina if
     
   }
 
 
 }