import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { ProductividadModel } from '../../models/productividad.model';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productividad',
  templateUrl: './productividad.component.html',
  styleUrls: ['./productividad.component.css']
})
export class ProductividadComponent implements OnInit {
  temporalPro: Object = {
    'usuario': "",
    'productividad': "",
    'mes': ""

  };
  productividad: ProductividadModel = new ProductividadModel();

  constructor( private AuthService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if ( id !== 'add'){
    this.AuthService.getProID(id)
    .subscribe( (resp: ProductividadModel) =>{

          this.temporalPro['titulo'] = resp.usuario;
          this.temporalPro['descripcion'] = resp.productividad;
          this.temporalPro['fecha'] = resp.mes;
          
      this.productividad = resp;
      this.productividad.id = id;
    })
  }
    
  }
  guardar(form: NgForm){
    
    console.log(form);
    console.log(this.productividad);

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if(this.productividad.id){
      peticion = this.AuthService.updatePro(this.productividad);
    }else{
      peticion = this.AuthService.addPro(this.productividad);
    }

    peticion.subscribe( resp => {
      Swal.fire({
        title: this.productividad.usuario,
        text: 'Se asigno la productividad correctamente',
        icon: 'success'
      });
    })

  }

}
