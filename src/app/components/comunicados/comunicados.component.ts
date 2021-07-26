import { ComunicadoModel } from './../../models/comunicado.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-comunicados',
  templateUrl: './comunicados.component.html',
  styleUrls: ['./comunicados.component.css']
})

export class ComunicadosComponent implements OnInit {

  comunicado: ComunicadoModel = new ComunicadoModel;
 
  mostrar: boolean = false;
  copiar: boolean = false;
  agregar: boolean;
  temporalComunicado: Object = {
    'titulo': "",
    'descripcion': "",
    'fecha': "",
    'quien': ""

  };
  mostrarTitulo: boolean = false;
  mostrarDescripcion: boolean = false;
  mostrarFecha: boolean = false;
  mostrarQuien: boolean = false;
  
  constructor(private AuthS: AuthService,
    private route: ActivatedRoute, private clipboard: Clipboard, private router: Router) { }

  ngOnInit() {

    const ids = this.route.snapshot.paramMap.get('ids');

    if (ids !== 'add') {
      this.AuthS.getComunicado(ids)
        .subscribe((resp: ComunicadoModel) => {

          /** Guarda en un objeto temporal para comparar si hubo algun cambio de la contraseña**/
          this.temporalComunicado['titulo'] = resp.titulo;
          this.temporalComunicado['descripcion'] = resp.descripcion;
          this.temporalComunicado['fecha'] = resp.fecha;
          this.temporalComunicado['quien'] = resp.quien;

          this.comunicado = resp;
         this.comunicado.ids = ids;
        });
    }//Acaba if
    else {
      this.agregar = true;

    }
  }
  
  guardar(form: NgForm) {

    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando informacion',
      allowOutsideClick: false
    })
    Swal.showLoading();

    let peticionUpdate: Observable<any>;
    let peticionSave: Observable<any>;

    if (this.comunicado.ids) {

      //Solo para que se regresen a input password las contraseñas
      this.mostrarTitulo = false;
      this.mostrarDescripcion = false;
      this.mostrarFecha = false;
      this.mostrarQuien = false;
      // console.log(this.comunicado.hosven, this.comunicado.venssl, this.comunicado.domven);
      peticionUpdate = this.AuthS.UpdatComunicado(this.comunicado);
      // console.log(peticionUpdate);


      peticionUpdate.subscribe(resp => {
        Swal.close();
        Swal.fire({
          title: 'Actualizado',
          text: 'Se Actualizaron los datos correctamente de ' + this.comunicado.titulo,
          icon: 'success',
        });

      }, (err) => {
        this.modificarPorTokenVencido(err, this.comunicado);
      }, () => {
        Swal.close();
        Swal.fire({
          title: 'Actualizado',
          text: 'Se Actualizaron los datos correctamente de  ' + this.comunicado.titulo,
          icon: 'success',
        });
        this.router.navigateByUrl('/MisComun');
      }

      );

    } else {
      

      //Solo para que se regresen a input password las contraseñas
      this.mostrarTitulo = false;
      this.mostrarDescripcion = false;
      this.mostrarFecha = false;
      this.mostrarQuien = false;
      // console.log(this.comunicado.hosven, this.comunicado.venssl, this.comunicado.domven);
      
      peticionSave = this.AuthS.saveComunicado(this.comunicado);
      // console.log(peticionSave);

      peticionSave.subscribe(resp => {
        Swal.close();
        Swal.fire({
          title: 'Guardado',
          text: 'Se registraron correctamente los datos de: ' + this.comunicado.titulo,
          icon: 'success',
        });

      }, (err) => {
        this.guardarPorTokenVencido(err, this.comunicado);
      }, () => {

        this.router.navigateByUrl('/MisComun');
      }

      );


    }

  }// termina el

  //Guarda en el clipboard el texto del campo
  copyToClipboard(campo: string) {
    this.clipboard.copy(campo);
  }


  modificarPorTokenVencido(err: any, comunicado: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthS.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthS.UpdatComunicado(comunicado).subscribe(resp => {
          // console.log(resp);
        }, (err) => {
          // console.log(err);
        }, () => {
          Swal.close();
          Swal.fire({
            title: 'Guardado',
            text: 'Se guardaron los datos correctamente de ' + this.comunicado.titulo,
            icon: 'success',
          });
          this.router.navigateByUrl('/MisComun');
        });
      });//tERMINA REFRESACAR TOKEN
    }else{//Termina if
      Swal.close();
      Swal.fire({
        title: 'Error',
        text: 'Error al al modificar datos de ' + this.comunicado.titulo + " " + err.error.error,
        icon: 'error',
      });
    }
    
  }



  guardarPorTokenVencido(err: any, comunicado: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthS.refrescarToken(refresh).subscribe(resp => {
        
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthS.saveComunicado(comunicado).subscribe(resp => {
          Swal.close();
          Swal.fire({
            title: 'Guardado',
            text: 'Se registraron correctamente los datos de: ' + this.comunicado.titulo,
            icon: 'success',
          });
          
        }, (err) => {
          // console.log(err);
        }, () => this.router.navigateByUrl('/comunicados'));
      });//tERMINA REFRESACAR TOKEN
    }//Termina if
    
    
  }

}


// comunicados: ComunicadoModel[] = [];

// constructor(private auth: AuthService) { }

// ngOnInit(): void {
//   this.auth.getComunicados().subscribe(next => {
    
//     this.comunicados = next;
//     console.log(this.comunicados);
//     console.log(this.comunicados[0].foto);
    
//   }, error => {
//     console.log(error);
//   })
// }

// borrarComunicado(comunicado:any){
//   console.log(comunicado);
//   console.log(comunicado.id);
//   const token = sessionStorage.getItem('token');

//   this.auth.eliminarComunicado(comunicado.id, token).subscribe(next => {
//     console.log(next);
//     this.auth.getComunicados().subscribe(next => {
//       console.log(next);
//     }, error => {
//       console.log(error);
//     })
//   }, error => {
//     console.log(error);
//   })