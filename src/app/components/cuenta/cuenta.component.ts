import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClienteModel } from '../../models/cliente.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})

export class CuentaComponent implements OnInit {

  cliente: ClienteModel = new ClienteModel;
  mostrar: boolean = false;
  copiar: boolean = false;
  agregar: boolean;
  temporalCliente: Object = {
    'cuepas': "",
    'dompas': "",
    'dbpas': "",
    'ftppas': "",
    'hospas': ""
  };
  mostrarCorreo: boolean = false;
  mostrarDominio: boolean = false;
  mostrarBd: boolean = false;
  mostrarFtp: boolean = false;
  mostrarHosting: boolean = false;

  constructor(private AuthService: AuthService,
    private route: ActivatedRoute, private clipboard: Clipboard, private router: Router) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('ids');

    if (id !== 'add') {
      this.AuthService.getClient(id)
        .subscribe((resp: ClienteModel) => {

          /** Guarda en un objeto temporal para comparar si hubo algun cambio de la contraseña**/
          this.temporalCliente['cuepas'] = resp.cuepas;
          this.temporalCliente['dompas'] = resp.dompas;
          this.temporalCliente['dbpas'] = resp.dbpas;
          this.temporalCliente['ftppas'] = resp.ftppas;
          this.temporalCliente['hospas'] = resp.hospas;

          this.cliente = resp;
          // this.cliente.dbpas = CryptoJS.AES.decrypt(this.cliente.dbpas,  this.cliente.dbnam).toString(CryptoJS.enc.Utf8);
          // this.cliente.ftppas = CryptoJS.AES.decrypt(this.cliente.ftppas,  this.cliente.ftpuse).toString(CryptoJS.enc.Utf8);
          // this.cliente.hospas = CryptoJS.AES.decrypt(this.cliente.hospas,  this.cliente.hosuse).toString(CryptoJS.enc.Utf8);
          // this.cliente.dompas = CryptoJS.AES.decrypt(this.cliente.dompas,  this.cliente.domuse).toString(CryptoJS.enc.Utf8);
          // this.cliente.cuepas = CryptoJS.AES.decrypt(this.cliente.cuepas,  this.cliente.cuecor).toString(CryptoJS.enc.Utf8);
          this.cliente.ids = id;
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

    if (this.cliente.ids) {

      if (this.cliente.cuepas === '') {
        // console.log("Entro a cuepas vacio");
      } else if (this.cliente.cuepas !== this.temporalCliente['cuepas']) {
        // console.log("Entro a ELSE cuepas");
        this.cliente.cuepas = CryptoJS.AES.encrypt(this.cliente.cuepas.trim(), this.cliente.cuecor.trim()).toString();
      }

      if (this.cliente.dompas === '') {
        // console.log("Entro a dompas vacio");
      } else if (this.cliente.dompas !== this.temporalCliente['dompas']) {
        // console.log("Entro a ELSE dompas");
        this.cliente.dompas = CryptoJS.AES.encrypt(this.cliente.dompas.trim(), this.cliente.domuse.trim()).toString();
      }

      if (this.cliente.dbpas === '') {
        // console.log("Entro a dbpas vacio");
      } else if (this.cliente.dbpas !== this.temporalCliente['dbpas']) {
        // console.log("Entro a ELSE dbpas");
        this.cliente.dbpas = CryptoJS.AES.encrypt(this.cliente.dbpas.trim(), this.cliente.dbuse.trim()).toString();
      }

      if (this.cliente.ftppas === '') {
        // console.log("Entro a ftppas vacio");
      } else if (this.cliente.ftppas !== this.temporalCliente['ftppas']) {
        // console.log("Entro a ELSE ftppas");
        this.cliente.ftppas = CryptoJS.AES.encrypt(this.cliente.ftppas.trim(), this.cliente.ftpuse.trim()).toString();
      }

      if (this.cliente.hospas === '') {
        // console.log("Entro a hospas vacio");
      } else if (this.cliente.hospas !== this.temporalCliente['hospas']) {
        // console.log("Entro a ELSE hospas");
        this.cliente.hospas = CryptoJS.AES.encrypt(this.cliente.hospas.trim(), this.cliente.hosuse.trim()).toString();
      }

      //Solo para que se regresen a input password las contraseñas
      this.mostrarBd = false;
      this.mostrarCorreo = false;
      this.mostrarDominio = false;
      this.mostrarFtp = false;
      this.mostrarHosting = false;
      // console.log(this.cliente.hosven, this.cliente.venssl, this.cliente.domven);
      peticionUpdate = this.AuthService.UpdatCliente(this.cliente);
      // console.log(peticionUpdate);


      peticionUpdate.subscribe(resp => {
        Swal.close();
        Swal.fire({
          title: 'Guardado',
          text: 'Se guardaron los datos correctamente de ' + this.cliente.nomcli,
          icon: 'success',
        });

      }, (err) => {
        this.modificarPorTokenVencido(err, this.cliente);
      }, () => {
        Swal.close();
        Swal.fire({
          title: 'Guardado',
          text: 'Se guardaron los datos correctamente de ' + this.cliente.nomcli,
          icon: 'success',
        });
        this.router.navigateByUrl('/cuentas');
      }

      );

    } else {
      if (this.cliente.dbpas !== undefined) {
        this.cliente.dbpas = CryptoJS.AES.encrypt(this.cliente.dbpas.trim(), this.cliente.dbuse.trim()).toString();
      } else {
        this.cliente.dbpas = "";
      }
      if (this.cliente.ftppas !== undefined) {
        this.cliente.ftppas = CryptoJS.AES.encrypt(this.cliente.ftppas.trim(), this.cliente.ftpuse.trim()).toString();
      } else {
        this.cliente.ftppas = "";
      }
      if (this.cliente.hospas !== undefined) {
        this.cliente.hospas = CryptoJS.AES.encrypt(this.cliente.hospas.trim(), this.cliente.hosuse.trim()).toString();
      } else {
        this.cliente.hospas = "";
      }
      if (this.cliente.dompas !== undefined) {
        this.cliente.dompas = CryptoJS.AES.encrypt(this.cliente.dompas.trim(), this.cliente.domuse.trim()).toString();
      } else {
        this.cliente.dompas = "";
      }
      if (this.cliente.cuepas !== undefined) {
        this.cliente.cuepas = CryptoJS.AES.encrypt(this.cliente.cuepas.trim(), this.cliente.cuecor.trim()).toString();
      } else {
        this.cliente.cuepas = "";
      }

      //Solo para que se regresen a input password las contraseñas
      this.mostrarBd = false;
      this.mostrarCorreo = false;
      this.mostrarDominio = false;
      this.mostrarFtp = false;
      this.mostrarHosting = false;
      // console.log(this.cliente.hosven, this.cliente.venssl, this.cliente.domven);
      
      peticionSave = this.AuthService.saveCuenta(this.cliente);
      // console.log(peticionSave);

      peticionSave.subscribe(resp => {
        Swal.close();
        Swal.fire({
          title: 'Guardado',
          text: 'Se registraron correctamente los datos de: ' + this.cliente.nomcli,
          icon: 'success',
        });

      }, (err) => {
        this.guardarPorTokenVencido(err, this.cliente);
      }, () => {

        this.router.navigateByUrl('/cuentas');
      }

      );


    }

  }// termina el

  //Guarda en el clipboard el texto del campo
  copyToClipboard(campo: string) {
    this.clipboard.copy(campo);
  }


  modificarPorTokenVencido(err: any, cliente: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthService.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthService.UpdatCliente(cliente).subscribe(resp => {
          // console.log(resp);
        }, (err) => {
          // console.log(err);
        }, () => {
          Swal.close();
          Swal.fire({
            title: 'Guardado',
            text: 'Se guardaron los datos correctamente de ' + this.cliente.nomcli,
            icon: 'success',
          });
          this.router.navigateByUrl('/cuentas');
        });
      });//tERMINA REFRESACAR TOKEN
    }else{//Termina if
      Swal.close();
      Swal.fire({
        title: 'Error',
        text: 'Error al al modificar datos de ' + this.cliente.nomcli + " " + err.error.error,
        icon: 'error',
      });
    }
    
  }



  guardarPorTokenVencido(err: any, cliente: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthService.refrescarToken(refresh).subscribe(resp => {
        
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.AuthService.saveCuenta(cliente).subscribe(resp => {
          Swal.close();
          Swal.fire({
            title: 'Guardado',
            text: 'Se registraron correctamente los datos de: ' + this.cliente.nomcli,
            icon: 'success',
          });
          
        }, (err) => {
          // console.log(err);
        }, () => this.router.navigateByUrl('/cuentas'));
      });//tERMINA REFRESACAR TOKEN
    }//Termina if
    
    
  }

}