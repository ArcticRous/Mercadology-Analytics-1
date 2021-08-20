import { FormGroup, FormControl, Validators, NgForm, FormBuilder } from '@angular/forms';
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

  contAsistente = 1;

  constructor( private fb: FormBuilder) {


    let date = new Date();
    this.anio = date.getFullYear()
    this.mes = (date.getMonth() + 1)
    this.dia = date.getDate();

    this.hora = date.getHours();
    this.minuto = date.getMinutes();
    this.horaDefecto = `${this.hora}:${this.minuto}`
    this.fechaDefecto = `${this.anio}-${this.mes}-${this.dia}`

    if (this.hora < 10) {
      this.horaDefecto = `0${this.hora}:${this.minuto}`
      if (this.minuto < 10) {
        this.horaDefecto = `0${this.hora}:0${this.minuto}`
      }
    } else if (this.minuto < 10) {
      this.horaDefecto = `${this.hora}:0${this.minuto}`
      if (this.hora < 10) {
        this.horaDefecto = `0${this.hora}:0${this.minuto}`
      }
    }

    if (this.mes < 10) {
      this.fechaDefecto = `${this.anio}-0${this.mes}-${this.dia}`
      if (this.dia < 10) {
        this.fechaDefecto = `${this.anio}-0${this.mes}-0${this.dia}`
      }
    } else if (this.dia < 10) {
      this.fechaDefecto = `${this.anio}-${this.mes}-0${this.dia}`
      if (this.mes < 10) {
        this.fechaDefecto = `${this.anio}-0${this.mes}-0${this.dia}`
      }
    }

    console.log(this.horaDefecto);
    console.log(this.fechaDefecto);


    this.minutaForm = new FormGroup({
      fecha: new FormControl(this.fechaDefecto, [Validators.required]),
      hora: new FormControl(this.horaDefecto, [Validators.required]),
      noReunion: new FormControl(null, [Validators.required]),
      objetivo: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      asistente: new FormControl(null, [Validators.required])
    })
  }

  ngOnInit(): void { }

  guardar() {
    console.log(this.minutaForm);
  }

  contador(){
    console.log(this.contAsistente);
    let div = document.createElement('div')
    div.className ="input-group mb-3";
    let span = document.createElement('span')
    span.className = "input-group-text";


    span.textContent = `N°${this.contAsistente + 1}`
    div.appendChild(span);
    let inputText = document.createElement('input')
    inputText.type="text"
    inputText.className = "form-control"
    inputText.name = `asistente${this.contAsistente}`
    div.appendChild(inputText)
    let inputAsistente = document.getElementById('inputAsistente')
    inputAsistente.appendChild(div)
    this.contAsistente++;
    console.log(inputAsistente);
  }

}
