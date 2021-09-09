import { AuthService } from './../../services/auth.service';
import { Component, HostListener, OnInit } from '@angular/core';
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
  screenHeight:any;
  screenWidth:any;

  constructor(private auth: AuthService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.getScreenSize();
    
    this.auth.getComunicado(this.id)
      .subscribe((resp: ComunicadoModel) => {
        this.comunicado = resp;
        this.comunicado.ids = this.id;
        console.log(resp);
        // this.spinner = false;
      }, error => {
        console.log(error);
      }, () => {
        
        console.log(this.spinner);
        this.spinner = false;
        this.inicializar(this.comunicado)
      });
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        // console.log(this.screenHeight, this.screenWidth);
  }


  inicializar(comunicado: ComunicadoModel) {
    console.log(comunicado);

    this.comunicadoForm = this.fb.group({
      titulo: [{ value: comunicado.titulo, disabled: true }],
      fecha: [{ value: comunicado.fecha, disabled: true }],
      descripcion: [{ value: comunicado.descripcion, disabled: true }],
      quien: [{ value: comunicado.quien, disabled: true }],
      imagenes: [,],
      archivo: [comunicado.archivo,],
    })
    this.spinner = false;
    if (comunicado.archivo) {
      this.booleanTieneFile = true
    }

  }

}
