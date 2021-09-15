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
  cargando = true;
  durationInSeconds = 2;
  rol: string;

  dateProductividad = new Date()

  mesProductividad: any = this.dateProductividad.getMonth()-1;
  anioProductividad: any = '2021'

  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  displayedColumns: string[] = ['usuario', 'productividad', 'fecha', 'id'];
  dataSource: MatTableDataSource<ProductividadModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    // scales: { xAxes: [{}], yAxes: [{}] },
    // plugins: {
    //   datalabels: {
    //     anchor: 'end',
    //     align: 'end',
    //   }
    // }
  };

  public barChartLabels: Label[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [];

  arrayMes: string[] = [];
  arrayNombre: string[] = [];
  arrayProductividad: any[] = [];

  ejemplo = {
    2021: {
      id: {
        nombre: 'Erick',
        mes: {
          6: {
            productividad: 90,
            estatus: 'pendiente'
          },
          5: {
            productividad: 95,
            estatus: 'pendiente'
          }
        }
      },
      id2: {
        nombre: 'Erick2',
        mes: {
          enero: {
            productividad: 80,
            estatus: 'pendiente'
          },
          febrero: {
            productividad: 96,
            estatus: 'pendiente'
          },
          mayo: {
            productividad: 93,
            estatus: 'pendiente'
          },
          junio: {
            productividad: 91,
            estatus: 'pendiente'
          },
          julio: {
            productividad: 92,
            estatus: 'pendiente'
          },
          agosto: {
            productividad: 90,
            estatus: 'pendiente'
          },
          septiembre: {
            productividad: 90,
            estatus: 'pendiente'
          },
          octubre: {
            productividad: 100,
            estatus: 'pendiente'
          },
          noviembre: {
            productividad: 100,
            estatus: 'pendiente'
          },
          diciembre: {
            productividad: 97,
            estatus: 'pendiente'
          }
        }
      }
    }
  }


  constructor(private AuthService: AuthService) {

    console.log(this.ejemplo);
    console.log(Object.keys(this.ejemplo[2021].id.mes));
    console.log(Object.values(this.ejemplo[2021].id.mes));
    let nuevo=[]
    let c = 0
    for (const iterator of Object.values(this.ejemplo[2021].id.mes)) {
      
      let hola = Object.keys(this.ejemplo[2021].id.mes)
      console.log(hola[c]);

      console.log(iterator.productividad);
      nuevo[Number(hola[c])] = iterator.productividad
      c++
    }

    // array.map(({productividad}) => {
    //   console.log(productividad);
    // })

    
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
         
         
        // data.map((usuario) => {
        //   console.log(usuario.mes);

        //   if(Object.keys(meses).includes(usuario.mes)){
        //     console.log(Object.values(meses));
        //     console.log(usuario.mes);            
        //     usuario.mes = meses[usuario.mes][usuario.mes]
        //     // console.log(mes);
        //   }
          
        //   // if (Object.values(meses).includes(mes)) {
        //   //   console.log(Object.keys(mes));
        //   //   keyMes = Object.keys(mes)[0]
        //   // }
        // });
        // let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let arr = []
        arr[4] = 90
        arr[2] = 80
        arr.forEach(element => {
          console.log(element);
        });
        console.log(arr);
        

        data.map((datos, index) => {
          // this.barChartData.push({ data: [datos.productividad], label: datos.usuario })
        })
        this.barChartData.push({data: arr, label: 'Erick'})
        this.barChartData.push({data: nuevo, label: 'ECM'})

        console.log(this.barChartData);

        

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

  ngOnInit(): void {

    // this.randomize()

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
    this.barChartData[3].data = [
      Math.round(Math.random() * 100),
      40,
      80,
      (Math.random() * 100),
      60,
      (Math.random() * 100),
      50
    ];
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
