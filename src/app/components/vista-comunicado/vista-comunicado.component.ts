import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComunicadoModel } from 'src/app/models/comunicado.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vista-comunicado',
  templateUrl: './vista-comunicado.component.html',
  styleUrls: ['./vista-comunicado.component.css']
})
export class VistaComunicadoComponent implements OnInit {

  comunicado: ComunicadoModel;
  comunicadoForm: FormGroup;
  spinner: boolean = true;
  booleanTieneFile: boolean = false;
  id: any;

  constructor(private auth: AuthService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.auth.getComunicado(this.id)
      .subscribe((resp: ComunicadoModel) => {
        this.comunicado = resp;
        this.comunicado.ids = this.id;
      }, error => {
        console.log(error);
      }, () => {
        this.spinner = false;
        this.inicializar(this.comunicado)
      });
  }

  ngOnInit(): void {
  }


  inicializar(comunicado: ComunicadoModel) {
    console.log(comunicado);

    this.comunicadoForm = this.fb.group({
      titulo: [{ value: comunicado.titulo, disabled: true }],
      fecha: [{ value: comunicado.fecha, disabled: true }],
      descripcion: [{ value: comunicado.descripcion, disabled: true }],
      quien: [{ value: comunicado.quien, disabled: true }],
      imagenes: [,],
      archivo: [{value: comunicado.archivo, disabled: true}],
    })

    if (comunicado.archivo) {
      this.booleanTieneFile = true
    }

  }

}
