import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ProductividadModel } from '../../models/productividad.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productividades',
  templateUrl: './productividades.component.html',
  styleUrls: ['./productividades.component.css']
})
export class ProductividadesComponent implements OnInit {

  productividad: ProductividadModel[] = [];

  catFilter = "General";
  cargando = true;
  rol: string;

  dateProductividad = new Date()

  mesProductividad: any = this.dateProductividad.getMonth()-1;
  anioProductividad: any = '2021'

  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  displayedColumns: string[] = ['usuario', 'productividad', 'fecha', 'id'];
  dataSource: MatTableDataSource<ProductividadModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private AuthService: AuthService) {
    
    this.AuthService.getPro()
      .subscribe(data => {
        console.log(data);
         console.log(this.productividad);

         let productividad = []
         let obj = {
           id: '',
           usuario: '',
           productividad: '',
           mes: ''
         }

         data.map(datos => {
           console.log(datos);
           console.log(datos[this.anioProductividad]);
          obj = {
            id: datos['id'],
            usuario: datos[this.anioProductividad].usuario, 
            productividad: datos[this.anioProductividad].productividad[this.mesProductividad],
            mes: this.meses[this.mesProductividad]
          }
          console.log(this.meses[this.mesProductividad]);
          
          productividad.push(obj)
          console.log(productividad);
         })

         this.productividad = productividad
         console.log(this.productividad);

      }, error => {
        console.log(error);
      }, () => {

        this.dataSource = new MatTableDataSource(this.productividad);
        this.paginator._intl.itemsPerPageLabel = "Elementos por página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cargando = false
      });
  }

  ngOnInit(): void { }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();

    }
  }
  onSelect(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    // console.log(this.meses[filterValue]);
    // this.dataSource.filter = this.meses[filterValue]

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  eliminarPro(productividad: ProductividadModel, i: number) {
    console.log(productividad);
    
    Swal.fire({
      title: `¿Esta seguro que desea borrar la productividad?`,
      text: `Se eliminara la productividad y todos su historial de datos`,
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
        this.dataSource.data.splice(this.dataSource.data.indexOf(productividad), 1);

        this.dataSource = new MatTableDataSource(this.productividad);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        const token = sessionStorage.getItem('token');

        this.AuthService.deletePro(productividad.id).subscribe(resp => {
          // console.log(resp);
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de la productividad',
            icon: 'success',
          });
        }, (err) => {
          this.borrarPorTokenVencido(err, productividad.id, token);
          Swal.close();
        });

      }
    })
  }//Temina eliminar usuarios

  borrarPorTokenVencido(err: any, minuta: string, token: string): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthService.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthService.eliminarMinuta(minuta, token).subscribe(next => {
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de la productividad',
            icon: 'success',
          });
        }, error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al intentar eliminar, intentelo nuevamente o inicie sesión de nuevo',
            icon: 'error',
          });
        });
      });//tERMINA REFRESACAR TOKEN
    }//Termina if
  }


}
