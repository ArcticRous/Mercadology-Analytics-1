import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudModel } from 'src/app/models/solicitud.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent implements OnInit, AfterViewInit {
  
  solicitud: SolicitudModel[] = [];
  // Cliente2: ClienteModel[] = [{ids:"21" ,nomcli: "erick", domcli:"ero", dirip:"skks", estado:false}]
  cargando = false;
  durationInSeconds = 2;
  rol: string;

  displayedColumns: string[] = ['#', 'cuenta', 'material','id'];
  dataSource: MatTableDataSource<SolicitudModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private AuthService: AuthService) {
    AuthService.leerToken();
   } 

  ngOnInit(): void{
   
    // this.AuthService.getSolicitudes()
    //   .subscribe( resp => this.solicitud = resp);
    sessionStorage.removeItem('local');
    this.rol = sessionStorage.getItem('rol');
    this.AuthService.getSolicitudes()
      .subscribe(resp => {
        this.solicitud = resp;
        this.cargando = false;
        this.dataSource = new MatTableDataSource(this.solicitud);
        this.paginator._intl.itemsPerPageLabel="Elementos por página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cargando = true;
      }, error => {
        console.log(error);
        this.cargando = false;
      });
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }


  // borrarClient(solicitud: SolicitudModel, i: number) {
  //   Swal.fire({
  //     title: '¿Está seguro?',
  //     text: `Está seguro que desea borrar a ${solicitud.cuenta} con 
  //     fecha del ${solicitud.fecha}`,
  //     icon: 'question',
  //     showConfirmButton: true,
  //     showCancelButton: true
  //   }).then(resp => {

  //     if (resp.value) {
  //       // this.Cliente.splice(i, 1);
  //       this.AuthService.DeleteClient(solicitud.id).subscribe(resp => {
  //         Swal.fire({
  //           title: 'Eliminado',
  //           text: 'Se eliminaron correctamente los datos de: ' + solicitud.cuenta,
  //           icon: 'success',
  //         });
  //       // console.log(resp);
  //       }, (err)=>{
  //         this.borrarPorTokenVencido(err, solicitud.id);
  //       } ); //LO COMENTO EN PRUEBAS

  //       // console.log(this.dataSource.data.indexOf(cliente));

  //       this.dataSource.data.splice(this.dataSource.data.indexOf(solicitud, i), 1);
  //       // console.log(this.dataSource);

  //       this.dataSource = new MatTableDataSource(this.solicitud);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;

  //     }
  //   });

  // }//Termina borrar cliente

  // borrarPorTokenVencido(err: any, usuario: any): any{
  //   const tokenVencido = err.error.error;

  //   if (tokenVencido === "Auth token is expired") {
  //     // console.log("Entro a la comparativa de permiso denegado");
  //     const refresh = sessionStorage.getItem('refresh_token');
  //     this.AuthService.refrescarToken(refresh).subscribe(resp => {
  //       // console.log(resp);
  //       sessionStorage.setItem('token', resp['id_token']);
  //       sessionStorage.setItem('refresh_token', resp['refresh_token']);

  //       this.AuthService.DeleteClient(usuario).subscribe( resp => {
  //         // console.log(resp);
  //         Swal.fire({
  //           title: 'Eliminado',
  //           text: 'Se eliminaron correctamente los datos de: ' + usuario.nomcli,
  //           icon: 'success',
  //         });
          
  //       } );
  //     });//tERMINA REFRESACAR TOKEN
  //   }//Termina if
    
  //   // console.log(err);
  // }

}
