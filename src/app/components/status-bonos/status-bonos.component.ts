import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StatusBonoModel } from '../../models/statusBono.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BonoModel } from 'src/app/models/bono.model';

@Component({
  selector: 'app-status-bonos',
  templateUrl: './status-bonos.component.html',
  styleUrls: ['./status-bonos.component.css']
})
export class StatusBonosComponent implements OnInit, AfterViewInit {
  statusBono: StatusBonoModel [] = [];
  bonos: BonoModel[] = [];
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  rol: string;
  cargando = false;

  displayedColumns: string[] = ['nombre', 'bono', 'mes', 'entregado'];
  dataSource: MatTableDataSource<StatusBonoModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private auth: AuthService, private router: Router,
    private route: ActivatedRoute) { 
      this.rol = sessionStorage.getItem('rol');
     }

  ngOnInit(): void {
    this.auth.getStatusBono()
      .subscribe( resp => {
        console.log(resp);
        this.statusBono = resp
         this.cargando = false;
         this.dataSource = new MatTableDataSource(this.statusBono);
         this.paginator._intl.itemsPerPageLabel="Elementos por página";
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
      })

      this.auth.getBono()
      .subscribe( data => {
        console.log(data);
        this.bonos = data;
    });
  }

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
 

}
