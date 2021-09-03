import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
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
   cargando = false;
   durationInSeconds = 2;
   rol: string;
 
   displayedColumns: string[] = ['usuario','productividad','fecha','id'];
   dataSource: MatTableDataSource<ProductividadModel>;
 
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;
  

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] = ['Jesus', 'Omar', 'Erick', 'Alan'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81], label: 'Mayo', }
  ];


  constructor( private AuthService:AuthService) { }

  ngOnInit(): void {
    this.AuthService.getPro()
      .subscribe( data => {
        console.log(data);
        this.productividad = data;
        this.dataSource = new MatTableDataSource(this.productividad);
         this.paginator._intl.itemsPerPageLabel="Elementos por página";
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
    });
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40 ];
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }
  }
  onSelect(event){
    const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
 
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
       
     }
    
   }

   eliminarPro(productividad: ProductividadModel, i: number) {
    Swal.fire({
      title: `¿Esta seguro que desea borrar la productividad?`,
      text: `Se eliminara la productividad y todos sus datos`,
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
          Swal.close();
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de la productividad',
            icon: 'success',
          });
        }, (err) => {
          this.borrarPorTokenVencido(err, productividad.id, token);
          Swal.close();
        }); //LO COMENTO EN PRUEBAS


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

        this.AuthService.eliminarMinuta(minuta, token).subscribe();
      });//tERMINA REFRESACAR TOKEN
    }//Termina if
  }


}
