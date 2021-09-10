import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ComunicadoModel } from "../../models/comunicado.model";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Comunicado: ComunicadoModel[] = [];

  //  comunicado: ComunicadoModel = new ComunicadoModel;
  catFilter = "General";
  cargando = false;
  durationInSeconds = 2;
  rol: string;

  displayedColumns: string[] = ['comunicado','ids'];
  dataSource: MatTableDataSource<ComunicadoModel>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private Auth: AuthService) {
    Auth.leerToken();
  }

  ngOnInit(): void {

    
    sessionStorage.removeItem('local');
    this.rol = sessionStorage.getItem('rol');
    this.cargando = true;
    this.Auth.getComun("publico")
      .subscribe(resp => {
        this.Comunicado = resp
        this.cargando = false;
        this.dataSource = new MatTableDataSource(this.Comunicado);
        this.paginator._intl.itemsPerPageLabel = "comunicados por página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }//Termina ngOnInit

  onSelect(event) {
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
