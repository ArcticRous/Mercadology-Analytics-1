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

  mesProductividad: any = this.dateProductividad.getMonth() - 1;
  anioProductividad: any = this.dateProductividad.getFullYear()
  productividadGeneral: ProductividadModel[] = [];

  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  displayedColumns: string[] = ['usuario', 'productividad', 'mes', 'id'];
  dataSource: MatTableDataSource<ProductividadModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private AuthService: AuthService) {

    this.AuthService.getPro()
      .subscribe(data => {
        // console.log(data);
        // console.log(this.productividad);
        this.productividadGeneral = data

        let productividad = []
        let obj = {
          id: '',
          usuario: '',
          productividad: '',
          mes: ''
        }

        data.map(datos => {
          obj = {
            id: datos['id'],
            usuario: datos[this.anioProductividad].usuario,
            productividad: datos[this.anioProductividad].productividad[this.mesProductividad],
            mes: this.meses[this.mesProductividad]
          }
          productividad.push(obj)
        })

        this.productividad = productividad

      }, error => {
        console.log(error);
      }, () => {
        this.recargarTabla()
        this.cargando = false
      });
  }

  ngOnInit(): void { }

  aplicarFiltroMes(data: any, anio: number, event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.anioProductividad = anio
    this.mesProductividad = this.dataSource.filter

    let productividad = []
    let obj = {
      id: '',
      usuario: '',
      productividad: '',
      mes: ''
    }

    data.filter(data => data[this.anioProductividad] != undefined).map(datos => {
      obj = {
        id: datos['id'],
        usuario: datos[this.anioProductividad].usuario,
        productividad: datos[this.anioProductividad].productividad[this.mesProductividad],
        mes: this.meses[this.mesProductividad]
      }
      
      productividad.push(obj)
    })

    this.productividad = productividad
    this.recargarTabla()
  }


  aplicarFiltroAnio(data: any, mes: number, event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.anioProductividad = this.dataSource.filter
    this.mesProductividad = mes

    let productividad = []
    let obj = {
      id: '',
      usuario: '',
      productividad: '',
      mes: ''
    }

    data.filter(data => data[this.anioProductividad] != undefined).map(datos => {

      obj = {
        id: datos['id'],
        usuario: datos[this.anioProductividad].usuario,
        productividad: datos[this.anioProductividad].productividad[this.mesProductividad],
        mes: this.meses[this.mesProductividad]
      }
      productividad.push(obj)
    })

    this.productividad = productividad
    this.recargarTabla()
  }


  recargarTabla() {
    this.dataSource = new MatTableDataSource(this.productividad);
    this.paginator._intl.itemsPerPageLabel = "Elementos por página";
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

}
