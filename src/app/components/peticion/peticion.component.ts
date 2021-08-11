import { Component, OnInit } from '@angular/core';
import { SolicitudModel } from '../../models/solicitud.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-peticion',
  templateUrl: './peticion.component.html',
  styleUrls: ['./peticion.component.css']
})
export class PeticionComponent implements OnInit {
  peticiones: SolicitudModel = new SolicitudModel();


  mostrar: boolean = false;
  copiar: boolean = false;
  agregar: boolean;
  temporalPeticion: Object = {
    'cuenta': "",
    'desDisenos': "",
    'existeMaterial': "",
    'fecha': "",
    'infDisenos': "",
    'material': "",
    'numDisenos': "",
    'urgencia': ""

  };
  

  constructor( private AuthService: AuthService,
                private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

      this.AuthService.getSolicitud( id ).subscribe((resp:SolicitudModel) => {

        this.temporalPeticion['cuenta'] = resp.cuenta;
        this.temporalPeticion['desDisenos'] = resp.desDisenos;
        this.temporalPeticion['existeMaterial'] = resp.existeMaterial;
        this.temporalPeticion['fecha'] = resp.fecha;
        this.temporalPeticion['infDisenos'] = resp.infDisenos;
        this.temporalPeticion['material'] = resp.material;
        this.temporalPeticion['numDisenos'] = resp.numDisenos;
        this.temporalPeticion['urgencia'] = resp.urgencia;

      console.log(resp);
      this.peticiones = resp;
      this.peticiones.id = id;
    });
  }

}
