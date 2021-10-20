import { AuthService } from './../../services/auth.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComunicadoModel } from 'src/app/models/comunicado.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
  // screenHeight: any;
  // screenWidth: any;
  booleanEsPdf: boolean = false;
  textoArchivo: string = '';
  listaVisto: string;

  vistoUsuario: { id: string; nombre: string; }[];
  enviarVisto: Observable<any>;

  constructor(private auth: AuthService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.id = this.route.snapshot.paramMap.get('id');
    // this.getScreenSize();

    this.vistoUsuario = [
      {
        id: sessionStorage.getItem('idUsuario'),
        nombre: sessionStorage.getItem('name')
      }
    ]

    this.auth.getComunicado(this.id)
      .subscribe((resp: ComunicadoModel) => {
        this.spinner = false;
        this.comunicado = resp;
        this.comunicado.ids = this.id;

        //Si el comunicado contiene datos en visto entra, si no se ejecuta automaticamente la inserción del primer objeto en visto
        if (this.comunicado.visto) {
          //Si no se encuentra el id del usuario en el array de objetos de visto, se ejectua la petición para modificar los datos de visto
          if (!this.comunicado.visto.find(element => element.id === this.vistoUsuario[0].id)) {
            //Guarda los datos que tenia y el nuevo usuario
            this.comunicado.visto = [...this.comunicado.visto, ...this.vistoUsuario]
            //Guarda la eticion para insertar al usuario en enviarVisto, ya con los datos del usuario que vio el comunicado
            this.enviarVisto = this.auth.UpdatComunicado(this.comunicado)
          }
          //Agrega a la lista de visto que se mostrara en el tooltip el nombre del usuario
          this.listaVisto = this.comunicado.visto.map(({ nombre }) => ' ' + nombre)

        } else {
          //Guarda los datos del usuario en el comunicado visto
          this.comunicado.visto = [...this.vistoUsuario]
          //ejecuta la peticion para agregar al usuario en el array de obj de visto
          this.enviarVisto = this.auth.UpdatComunicado(this.comunicado)
          //Agrega a la lista de visto que se mostrara en el tooltip el nombre del usuario
          this.listaVisto = this.comunicado.visto.map(({ nombre }) => nombre)
        }

        //Revisa si el comunicado contiene un archivo
        if (this.comunicado.archivo) {
          //Si el archvio es PDF en el templete mostrara un svg de pdf, si no uno de Word
          this.booleanEsPdf = this.comunicado.archivo.includes('pdf')
          this.booleanTieneFile = true;
          //Busca la posici'on que contenga %2F
          let pos = this.comunicado.archivo.lastIndexOf('%2F')
          //Muestra los 15 primeros caracteres del nombre del archivo, remplaza los %20 por espacios normales
          this.textoArchivo = this.comunicado.archivo.substring(pos + 3, pos + 18).replace('%20', ' ')
        }

      }, error => {
        console.log(error);
      }, () => {

        //Envia el visto, si no esta valido el token lo envia a modificar por token vencido
        if (this.enviarVisto) {
          this.enviarVisto.subscribe(next => {

          }, error => {
            this.modificarPorTokenVencido(error, this.comunicado)
          })
        }

      });
  }

  ngOnInit(): void {
  }

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?) {
  //   this.screenHeight = window.innerHeight;
  //   this.screenWidth = window.innerWidth;
  // }


  modificarPorTokenVencido(err: any, comunicado: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.auth.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.auth.UpdatComunicado(comunicado).subscribe(resp => {
          return;
        }, (err) => {
          return;
        });
      });//TERMINA REFRESACAR TOKEN
    } else {
      return;
    }

  }






}
