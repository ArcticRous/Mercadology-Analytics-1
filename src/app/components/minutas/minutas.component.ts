import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MinutaModel } from 'src/app/models/minuta.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-minutas',
  templateUrl: './minutas.component.html',
  styleUrls: ['./minutas.component.css']
})
export class MinutasComponent implements OnInit {

  minutas: MinutaModel[] = [];
  rol: string;

  booleanHayDatos: boolean = true;

  displayedColumns: string[] = ['#', 'elaboro', 'autorizo', 'cuenta', 'fecha', 'id'];
  dataSource: MatTableDataSource<MinutaModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private auth: AuthService, private router: Router,
    private route: ActivatedRoute) {
    //Para tener acceso a eliminar
    this.rol = sessionStorage.getItem('rol');
  }

  ngOnInit(): void {

    this.auth.obtenerMinutas()
      .subscribe(resp => {
        this.minutas = resp;
        this.dataSource = new MatTableDataSource(this.minutas);
        this.paginator._intl.itemsPerPageLabel = "Elementos por página";
        this.paginator._intl.firstPageLabel = "Primer página";
        this.paginator._intl.lastPageLabel = "Ultima página";
        this.paginator._intl.nextPageLabel = "Página siguiente";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.getRangeLabel = function (page, pageSize, length) {
          if (length === 0 || pageSize === 0) {
            return '0 de ' + length;
          }
          length = Math.max(length, 0);
          const startIndex = page * pageSize;
          // If the start index exceeds the list length, do not try and fix the end index to the end.
          const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
          return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
        };

      }, (err) => {
        this.booleanHayDatos = false;
        console.log(err);
      }
      );

  }

  eliminarMinuta(minuta: MinutaModel, i: number) {
    Swal.fire({
      title: `¿Esta seguro que desea borrar la minuta?`,
      text: `Se eliminara la minuta y todos sus datos`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then(resp => {

      if (resp.value) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...'
        });
        Swal.showLoading();
        this.dataSource.data.splice(this.dataSource.data.indexOf(minuta), 1);

        this.dataSource = new MatTableDataSource(this.minutas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        const token = sessionStorage.getItem('token');

        this.auth.eliminarMinuta(minuta.id, token).subscribe(resp => {
          Swal.close();
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de la minuta',
            icon: 'success',
          });
        }, (err) => {
          this.borrarPorTokenVencido(err, minuta.id, token);
          Swal.close();
        }); //LO COMENTO EN PRUEBAS


      }
    })
  }//Temina eliminar usuarios

  borrarPorTokenVencido(err: any, minuta: string, token: string): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      const refresh = sessionStorage.getItem('refresh_token');
      this.auth.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.auth.eliminarMinuta(minuta, token).subscribe();
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


}
