import { ComunicadoModel } from './../../models/comunicado.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comunicados',
  templateUrl: './comunicados.component.html',
  styleUrls: ['./comunicados.component.css']
})
export class ComunicadosComponent implements OnInit {

  comunicados: ComunicadoModel[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.getComunicados().subscribe(next => {
      
      this.comunicados = next;
      console.log(this.comunicados);
      console.log(this.comunicados[0].foto);
      
    }, error => {
      console.log(error);
    })
  }

  borrarComunicado(comunicado:any){
    console.log(comunicado);
    console.log(comunicado.id);
    const token = sessionStorage.getItem('token');
  
    this.auth.eliminarComunicado(comunicado.id, token).subscribe(next => {
      console.log(next);
      this.auth.getComunicados().subscribe(next => {
        console.log(next);
      }, error => {
        console.log(error);
      })
    }, error => {
      console.log(error);
    })

  }

}
