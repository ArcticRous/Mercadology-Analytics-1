import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { ProductividadModel } from '../../models/productividad.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productividad-usuario',
  templateUrl: './productividad-usuario.component.html',
  styleUrls: ['./productividad-usuario.component.css']
})
export class ProductividadUsuarioComponent implements OnInit {

  productividad: ProductividadModel[] = [];

  cargando = true;

  dateProductividad = new Date()

  mesProductividad: any = this.dateProductividad.getMonth()-1;
  anioProductividad: any = '2021'

  nombreUsuario:string = ''
  hayDatos: boolean = false;

  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: Label[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];

  constructor(private auth: AuthService, private route: ActivatedRoute) {

    const id = this.route.snapshot.paramMap.get('id');

    this.auth.getProID(id).subscribe(next => {
      console.log(next[this.anioProductividad]);
      this.nombreUsuario = next[this.anioProductividad].usuario
      this.barChartData.push({ data: next[this.anioProductividad].productividad, label: next[this.anioProductividad].usuario })
      this.hayDatos = true;
    }, error => {
      console.log(error);

    }, () => {
      this.cargando = false;
    })

  
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





}
