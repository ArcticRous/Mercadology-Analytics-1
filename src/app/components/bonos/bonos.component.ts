import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BonoModel } from '../../models/bono.model';
import { StatusBonoModel } from 'src/app/models/statusBono.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-bonos',
  templateUrl: './bonos.component.html',
  styleUrls: ['./bonos.component.css']
})
export class BonosComponent implements OnInit {
  bonos: BonoModel[] = [];
  bonoStatus: StatusBonoModel[] = [];

  constructor( private AuthService:AuthService) { }

  ngOnInit(): void {
    this.AuthService.getBono()
      .subscribe( data => {
        console.log(data);
        this.bonos = data;
    });

    this.AuthService.getStatusBono()
      .subscribe( resp => {
        console.log(resp);
        this.bonoStatus = resp;
        
      }) 
  }

  eliminarBono(bono: any){
    console.log(bono);
    
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${bono.nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {

      if (resp.value) {
        this.AuthService.deleteBono(bono.id).subscribe(next => {
          console.log(next);
          Swal.fire({
            title: 'Se elimino bono',
            text: `Se elimino correctamente el bono ${bono.nombre}`,
            icon: 'success'
          }),window.location.reload() , delay(5000);
        }, error => {
          console.log(error);
        })
      }
    })

  }

  eliminarStatusBono(bono: StatusBonoModel, i:number){
    console.log(bono);
    
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar el bono asignado de ${bono.nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {

      if (resp.value) {
        this.bonoStatus.splice(i,1);
        this.AuthService.deleteStatusBono(bono.id).subscribe(next => {
          console.log(next);
          Swal.fire({
            title: 'Se elimino el bono asignado',
            text: `Se elimino correctamente el bono de ${bono.nombre}`,
            icon: 'success'
          }),window.location.reload() , delay(5000);
        }, error => {
          console.log(error);
        })
      }
      
    })
  }

}
