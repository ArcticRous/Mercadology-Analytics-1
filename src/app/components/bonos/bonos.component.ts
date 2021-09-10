import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BonoModel } from '../../models/bono.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bonos',
  templateUrl: './bonos.component.html',
  styleUrls: ['./bonos.component.css']
})
export class BonosComponent implements OnInit {
  bonos: BonoModel[] = [];

  constructor( private AuthService:AuthService) { }

  ngOnInit(): void {
    this.AuthService.getBono()
      .subscribe( data => {
        console.log(data);
        this.bonos = data;
    });
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
          })
        }, error => {
          console.log(error);
        })
      }
    })

  }

}
