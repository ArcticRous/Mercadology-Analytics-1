import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-minuta',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.css']
})
export class MinutaComponent implements OnInit {

  fechaDefecto: string;
  horaDefecto: string;
  anio: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;

  minutaForm: FormGroup;

  constructor() { 

    
    let date = new Date();
    this.anio = date.getFullYear()
    this.mes = (date.getMonth() + 1)
    this.dia = date.getDate();

    this.hora = date.getHours();
    this.minuto = date.getMinutes();
    this.horaDefecto = `${this.hora}:${this.minuto}`
    console.log(this.horaDefecto);
    
    if (this.hora < 10) {
      this.horaDefecto = `0${this.hora}:${this.minuto}`
    }
    console.log(this.horaDefecto);

    if (this.mes < 10) {
      this.fechaDefecto = `${this.anio}-0${this.mes}-${this.dia}`
    } else {
      this.fechaDefecto = `${this.anio}-${this.mes}-${this.dia}`
    }

    this.minutaForm = new FormGroup({
      fecha: new FormControl(this.fechaDefecto, [Validators.required]),
      hora: new FormControl(this.horaDefecto, [Validators.required]),
      noReunion: new FormControl(null, [Validators.required])
    })
   }

  ngOnInit(): void { }

  guardar(){
    console.log(this.minutaForm);
    
  }

}
