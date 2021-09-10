import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { BonoModel } from '../../models/bono.model';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { RouterLinkActive, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bono',
  templateUrl: './bono.component.html',
  styleUrls: ['./bono.component.css']
})
export class BonoComponent implements OnInit {
  bono: BonoModel = new BonoModel();
  // temporalPro: Object = {
  //   'BTeam': "",
  //   'BMO': "",
  // };
  constructor( private AuthService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  if ( id !== 'add'){
    this.AuthService.getBonoID(id)
    .subscribe( (resp: BonoModel) =>{
          // this.temporalPro['BTeam'] = resp.BTeam;
          // this.temporalPro['BMO'] = resp.BMO;   
      this.bono = resp;
      console.log(this.bono);
      
      this.bono.id = id;
    })
  }
  }
  

  guardar(form: NgForm){
    console.log(form);
    console.log(this.bono);

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if(this.bono.id){
      peticion = this.AuthService.updateBono(this.bono);
    }else{
      peticion = this.AuthService.addBono(this.bono);
    }

    peticion.subscribe( resp => {
      Swal.fire({
        title: 'Bonos asignados',
        text: 'Se han definido tus bonos',
        icon: 'success'
      });
    })
  }
}
