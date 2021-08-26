import { MinutaModel } from './../models/minuta.model';
import { SolicitudModel } from './../models/solicitud.model';
import { UsuarioModel } from './../models/usuario.model';
import { RegistroModel } from './../models/registro.model';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, delay } from 'rxjs/operators';
import { ClienteModel } from '../models/cliente.model';
import { AccesosModel } from '../models/accesos.model';
import { ComunicadoModel } from '../models/comunicado.model';
import { CalendarioModel } from '../models/calendario.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Se utiliza como variable local para obtener el rol y usar los guards para el routeo de páginas
  regreso;

  private key: string = `AIzaSyDmvkHWhK6TV-6K3KtF-Zui0D17hCuqzEk`;
  private realDatabase: string = 'https://mercadology-analytics-default-rtdb.firebaseio.com';
  public urlStorage = `https://firebasestorage.googleapis.com/v0/b/mercadology-analytics.appspot.com`;
  // private urlEnviarCorreo: string = `https://mercadologyemail.herokuapp.com`;
  private urlEnviarCorreo: string = `http://localhost:3000`;

  //Inicio Sesion Auth
  private apikey = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.key;
  public userToken;
  public rolUsuario;

  //Se usa el 'refresh_token' para refrescar el token una vez vencido
  public refreshToken = 'https://securetoken.googleapis.com/v1/token?key=' + this.key;

  //Crear usuarios Auth
  private apiKey2 = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=` + this.key;

  //Este no se usa porque el usuario no puede eliminar a otro usuario, solo el mismo, (por ahora)
  //Borrar usuario Auth
  private apiKey3 = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=` + this.key;

  //Tampoco se usa pero puede ser de utilidad
  //Obtener datos de usuario Auth
  private apiKey4 = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=` + this.key;

  //Actualizar usuario Auth
  private apiKey5 = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=` + this.key;

  //Verificar correo (NO SE USA PERO ESTA)
  private apiKey6 = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=` + this.key;

  //Estas dos que siguen son las mismas y hacen lo mismo solo cambio de nombre
  //RealDataBase
  private urlDatos = this.realDatabase;
  private url = this.realDatabase;

  //Descarga los datos de firebase realdatabese
  private export = this.realDatabase + '/.json?format=export';

  //Envia mediante express, nodejs y nodemailer email de vencimiento de cuentas
  private vencimientoCuentas = this.urlEnviarCorreo + "/send-email";
  private vencimientoCuentaCliente = this.urlEnviarCorreo + "/send-clientes";
  private solicitudManager = this.urlEnviarCorreo + "/send-solicitud-manager"
  private solicitudCliente = this.urlEnviarCorreo + "/send-cliente-solicitud";
  private respuestaCliente = this.urlEnviarCorreo + "/send-respuesta-cliente"

  //Envia mediante express, nodejs y nodemailer un email de backup
  private backup = this.urlEnviarCorreo + `/send-backup`;
  // private backup = `/send-backup`;

  //Solo es una sintaxis que se usa cuando se realizan peticiones que necesitan Autenticacion mediante el Token. como son las operaciones de 'Write' en las BDD Firebase
  private auth = '?auth=';

  private EmailOPass = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=` + this.key;

  private correoRestablecimiento = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=` + this.key;

  private verificarCodigo = `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=` + this.key;

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  Logout() {

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('idUsuario');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('propio');
    sessionStorage.removeItem('puesto');
    sessionStorage.removeItem('depto');
  }

  Login(usuario: UsuarioModel) {

    const authData = {
      email: usuario.correo,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.apikey}`,
      authData
    ).pipe(map(resp => {
      // console.log('Entro al mapa RXJS');
      this.guardarToken(resp);
      // this.esAdmin();
      return resp;
    })
    );
  }

  public guardarToken(idToken: object) {

    this.userToken = idToken['idToken'];
    let id = idToken['localId']

    sessionStorage.setItem('token', idToken['idToken']);
    sessionStorage.setItem('refresh_token', idToken['refreshToken']);
    sessionStorage.setItem('email', idToken['email']);
    sessionStorage.setItem('name', idToken['displayName']);
    sessionStorage.setItem('idUsuario', idToken['localId']);
    this.getUsuario(id).subscribe(resp => {
      const rol = resp['rol'];
      sessionStorage.setItem('puesto', resp['puesto']);
      sessionStorage.setItem('depto', resp['depto']);
      this.regreso = rol;
      if (rol == 'Administrador') {
        sessionStorage.setItem('rol', '12345');
      } else if (rol == 'Editor') {
        sessionStorage.setItem('rol', '234567');
      }
    }, (error) => {
      // console.log(error);
    })
  }

  leerToken() {
    if (sessionStorage.getItem('token')) {
      this.userToken = sessionStorage.getItem('token');
      // console.log(this.userToken);
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  refrescarToken(refresh: string) {
    sessionStorage.getItem('refresh_token');

    const data = {
      "grant_type": "refresh_token",
      "refresh_token": refresh
    }
    return this.http.post(this.refreshToken, data);
  }

  estaAutenticado(): boolean {
    return this.userToken.length > 2;
  }

  esAdmin(): string {
    // console.log(this.regreso);
    if (this.regreso == undefined) {
      sessionStorage.getItem('rol');
      // console.log(sessionStorage.getItem('rol'));
      if (sessionStorage.getItem('rol') == "12345") {
        this.regreso = "Administrador";
      } else if (sessionStorage.getItem('rol') == "234567") {
        this.regreso = "Editor";
      } else if (sessionStorage.getItem('rol') == undefined || sessionStorage.getItem('rol') == "") {
        this.regreso = undefined;
        this.Logout();
      }
    }

    return this.regreso;
  }

  /**Registrar al usuario en Auth **/
  registrarUsuario(usuario: RegistroModel) {

    const authData = {
      displayName: usuario.nombre + ' ' + usuario.apellido,
      email: usuario.correo,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.apiKey2}`,
      authData
    ).pipe(
      map((resp: any) => {
        //        console.log(resp);
        return resp;
      })
    );
  };/**Cierra el registro del usuario**/

  /**Registrar al usuario en la base de datos **/
  registrarDatosUsuario(usuario: RegistroModel, idLocal: string) {
    const token = sessionStorage.getItem('token');
    let authData = {
      nombre: `${usuario.nombre}`,
      apellido: `${usuario.apellido}`,
      telefono: ``,
      celular: ``,
      correo: `${usuario.correo}`,
      password: usuario.password,
      puesto: `${usuario.puesto}`,
      rol: `${usuario.rol}`,
      depto: `${usuario.depto}`,
      habilitado: usuario.habilitado
    };


    return this.http.put(
      `${this.urlDatos}/Usuario/${idLocal}.json` + this.auth + token,
      authData
    ).pipe(
      map((resp: any) => {
        // this.guardarToken(resp['idToken']);//vEREMOS PARA QUE SIRVE
        //console.log(resp['idToken']);
        // console.log(usuario);
        return usuario;
      })
    );
  };/**Cierra el Registrar datos usuario**/

  /**Hacer un get de todos los usuarios**/
  getUsuarios() {
    const token = sessionStorage.getItem('token');
    return this.http.get(`${this.urlDatos}/Usuario.json`)
      .pipe(
        map(this.crearArreglo)
      );
  }

  private crearArreglo(usuarioObj: object) {
    const usuarios: RegistroModel[] = [];

    if (usuarioObj === null) { return []; }

    Object.keys(usuarioObj).forEach(key => {
      const usuario = usuarioObj[key];
      usuario.id = key;
      usuarios.push(usuario);
    });
    return usuarios;
  }

  /**Retonar mis usuarios**/
  getUsuario(id: string) {
    return this.http.get(`${this.urlDatos}/Usuario/${id}.json`);
  }


  actualizarUsuario(usuario: RegistroModel) {
    const token = sessionStorage.getItem('token');
    const usuarioTemp = {
      ...usuario
    };
    delete usuarioTemp.id;

    return this.http.put(`${this.urlDatos}/Usuario/${usuario.id}.json` + this.auth + token, usuarioTemp);
  }

  eliminarUsuario(id: string) {
    const token = sessionStorage.getItem('token');
    return this.http.delete(`${this.urlDatos}/Usuario/${id}.json` + this.auth + token);
  }

  //Se usa para eliminar desde un administrador una cuenta especifica
  eliminarUsuarioAuth(id: string) {
    return this.http.post(
      `${this.apiKey3}`,
      { 'idToken': id }
    ).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  //NO SE USA PERO PUEDE SERVIR
  obtenerUsuarioAuth(idToken: string) {

    return this.http.post(
      `${this.apiKey4}`,
      { 'idToken': idToken }
    ).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  //Solo lo modifica el mismo usuario que hizo la petición, otro usuario no lo puede modificar porque no tiene el idToken de él
  modificarUsuarioAuth(idToken: string, usuario: RegistroModel) {
    let nombre = usuario.nombre + ' ' + usuario.apellido;

    return this.http.post(
      `${this.apiKey5}`,
      { 'idToken': idToken, 'displayName': nombre, "photoUrl": usuario.urlPhoto }
    ).pipe(
      map((resp: any) => {
        sessionStorage.setItem('name', nombre);
        return resp;
      })
    );
  }

  //Este es para verificar el correo pero nunca se usa a menos que se deshabilite un boton de 'Perfil'
  verificarCorreoAuth(idToken: string) {
    return this.http.post(
      `${this.apiKey6}`,
      { "requestType": "VERIFY_EMAIL", 'idToken': idToken }
    ).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  getImagen() {
    return this.http.get(`${this.urlDatos}/Usuario.json`);
  }

  //Estos dos metodos pueden unificarse en uno solo
  //Subir imagen al storage
  uploadImage(file: File, id: string, ruta: string) {
    return this.http.post(`${this.urlStorage}/o/${ruta}%2F${id}%2F${file.name}`, file);
  }

  //Sube cualquier archivo al storage
  uploadFile(file: File, ruta: string) {
    return this.http.post(`${this.urlStorage}/o/${ruta}%2F${file.name}`, file);
  }

  // guardar comunicados
  saveComun(comunicado: ComunicadoModel) {
    return this.http.post(`${this.url}/comunicados.json` + this.auth, comunicado)
      .pipe(
        map((resp: any) => {
          comunicado.ids = resp.name;
          return comunicado;
        })
      );
  }


  saveCuenta(cliente: ClienteModel) {
    const token = sessionStorage.getItem('token');
    return this.http.post(`${this.url}/cliente.json` + this.auth + token, cliente)
      .pipe(
        map((resp: any) => {
          cliente.ids = resp.name;
          return cliente;
        })
      );
  }
  saveComunicado(comunicado: ComunicadoModel) {
    const token = sessionStorage.getItem('token');
    return this.http.post(`${this.url}/comunicados.json` + this.auth + token, comunicado)
      .pipe(
        map((resp: any) => {
          comunicado.ids = resp.titulo;
          return comunicado;
        })
      );
  }

  UpdatCliente(cliente: ClienteModel) {
    const token = sessionStorage.getItem('token');
    const ClienteTemp = {
      ...cliente
    };
    delete ClienteTemp.ids;

    return this.http.put(`${this.url}/cliente/${cliente.ids}.json` + this.auth + token, ClienteTemp);
  }

  UpdatComunicado(comunicados: ComunicadoModel) {
    const token = sessionStorage.getItem('token');
    const ComunicadoTemp = {
      ...comunicados
    };
    delete ComunicadoTemp.ids;

    return this.http.put(`${this.url}/comunicados/${comunicados.ids}.json` + this.auth + token, ComunicadoTemp);
  }

  DeleteClient(ids: string) {
    const token = sessionStorage.getItem('token');
    return this.http.delete(`${this.url}/cliente/${ids}.json` + this.auth + token);
  }

  getClient(ids: string) {
    return this.http.get(`${this.url}/cliente/${ids}.json`);
  }
  getComunicado(ids: string) {
    return this.http.get(`${this.url}/comunicados/${ids}.json`);
  }
  
  // getfiltradoCon (filtro:string){
  //   return this.http.get(`${this.url}/comunicados.json`)
  //   .pipe(
  //     map(
  //       this.crearFiltradoCon
  //     )
  //   );
  // }
  // crearFiltradoCon( comunicadoObj: object){
  //   const comunicados: ComunicadoModel[] = [];
  //   console.log(comunicadoObj);
  //   if ( comunicadoObj === null) {return [];}
  //   Object.keys(comunicadoObj).forEach(key => {
  //     const comunicado: ComunicadoModel = comunicadoObj[key];
  //     comunicado.ids = key;
  //     comunicados.push(comunicado);
  //   });
  //   let cat:string [] = ['General'];
  //   return comunicados.filter(cat => 'ss')
  // }

  //Tipo se refiere a si se va a kostrar en comunicados general (donde se visualizan) o si es donde se eliminan, agregan o editan comunicados
  getComun(tipo: string) {

    if (tipo == "privado") {
      return this.http.get(`${this.url}/comunicados.json`)
        .pipe(
          map(this.CrearComunPrivado),
          delay(1500)
        );
    } else {
      return this.http.get(`${this.url}/comunicados.json`)
        .pipe(
          map(this.CrearComun),
          delay(1500)
        );
    }

  }
  DeleteComun(ids: string) {
    const token = sessionStorage.getItem('token');
    return this.http.delete(`${this.url}/comunicados/${ids}.json` + this.auth + token);
  }
  private CrearComun(ComunicadoObj: object) {
    const Comunicado: ComunicadoModel[] = [];
    // console.log(ComunicadoObj);
    if (ComunicadoObj === null) {
      return [];
    }

    Object.keys(ComunicadoObj).forEach(key => {
      const comunicado: ComunicadoModel = ComunicadoObj[key];
      comunicado.ids = key;
      Comunicado.push(comunicado);
    });

    let date = new Date();
    let mes = date.getMonth() + 1;
    let meses;
    if (mes < 10) {
      meses = `0${date.getMonth() + 1}`;
    }
    let hoy = `${date.getFullYear()}-${meses}-${date.getDate()}`;

    return Comunicado.filter((({ fecha }) => fecha <= hoy)).sort((a, b) => {
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });

  }

  private CrearComunPrivado(ComunicadoObj: object) {
    const Comunicado: ComunicadoModel[] = [];
    if (ComunicadoObj === null) {
      return [];
    }

    Object.keys(ComunicadoObj).forEach(key => {
      const comunicado: ComunicadoModel = ComunicadoObj[key];
      comunicado.ids = key;
      Comunicado.push(comunicado);
    });

    return Comunicado;
  }

  getShow(ids: string) {
    return this.http.get(`${this.url}/mostrar/${ids}.json`);
  }

  getCliente() {
    return this.http.get(`${this.url}/cliente.json`)
      .pipe(
        map(this.CrearArre),
        delay(1500)
      );
  }

  private CrearArre(ClienteObj: object) {
    const Cliente: ClienteModel[] = [];
    // console.log(ClienteObj);
    if (ClienteObj === null) {
      return [];
    }

    Object.keys(ClienteObj).forEach(key => {
      const clientes: ClienteModel = ClienteObj[key];
      clientes.ids = key;
      Cliente.push(clientes);
    });

    return Cliente;
  }


  //Enviar correo de las cuentas por vencerce
  sendMessage(body) {
    return this.http.post(this.vencimientoCuentas, body)
  }

  sendMessageCliente(body) {
    return this.http.post(this.vencimientoCuentaCliente, body)
  }

  //Exporta la base de datos
  exportarBase() {
    return this.http.get(this.export);
  }

  //Recibe los datos y los envia al backend para que se envie el backup al correo
  descargarArchivo(datos: any) {
    return this.http.post(this.backup, datos);
  };


  cambiarEmailUsuario(email: string) {
    const token = sessionStorage.getItem('token');

    const body = {
      idToken: token,
      email: email,
      returnSecureToken: true
    }

    return this.http.post(this.EmailOPass, body);
  }

  //Cambia la contrseña un usuario propio
  cambiarContrasenaUsuario(contrasena: string) {
    const token = sessionStorage.getItem('token');

    const body = {
      idToken: token,
      password: contrasena,
      returnSecureToken: true
    }

    return this.http.post(this.EmailOPass, body);
  }

  correoRestablecimientoContrasena(correo: string) {

    const body = {
      "requestType": "PASSWORD_RESET",
      "email": correo
    }

    return this.http.post(this.correoRestablecimiento, body);

  }

  //No funciona, no se usa
  confirmarCodigo(codigo: any) {

    const body = {
      "oobCode": codigo
    }

    return this.http.post(this.verificarCodigo, codigo);
  }

  //Iniciar sesion para eliminar un usuario
  iniciarSesionEliminar(correo: string, password: string) {

    const authData = {
      email: correo,
      password: password,
      returnSecureToken: true
    };

    return this.http.post(`${this.apikey}`, authData).pipe(map(resp => {
      const idToken = resp['idToken'];
      this.eliminarUsuarioAuth(idToken).subscribe(resp => {
        // console.log(resp);
      }, (error) => {
        // console.log(error);
      });
      return resp;
    }));

  }

  //Iniciar sesion con un usuario x mediante el admin
  iniciarSesionCambiarContrasenaOEmail(correo: string, password: string, passwordOEmailNuevo: string, CE: string) {

    const authData = {
      email: correo,
      password: password,
      returnSecureToken: true
    };
    return this.http.post(`${this.apikey}`, authData).pipe(map(resp => {
      const token = resp['idToken'];

      if (CE == "contrasena") {
        this.adminCambiarContrasenaUsuario(token, passwordOEmailNuevo).subscribe(resp => {
          // console.log(resp, "RESPPPP");
        }, (error) => {
          // console.log(error, "error::::");
        });
      } else if (CE == "email") {
        this.adminCambiarEmailUsuario(token, passwordOEmailNuevo).subscribe(resp => {
          // console.log(resp, "RESPPPP");
        }, (error) => {
          // console.log(error, "error::::");
        });
      }
      return resp;
    }, (error) => {
      // console.log(error);
      return error;
    }
    ));

  }

  //Cambia la contrseña un usuario admin a un usuario normal
  adminCambiarContrasenaUsuario(token: string, contrasena: string) {

    const body = {
      idToken: token,
      password: contrasena,
      returnSecureToken: true
    }

    return this.http.post(this.EmailOPass, body);
  }

  //Cambia la contrseña un usuario admin a un usuario normal
  adminCambiarEmailUsuario(token: string, email: string) {

    const body = {
      idToken: token,
      email: email,
      returnSecureToken: true
    }

    return this.http.post(this.EmailOPass, body);
  }


  adminActualizarUsuario(usuario: any, password: string, token: string) {

    const usuarioTemp = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      puesto: usuario.puesto,
      rol: usuario.rol,
      depto: usuario.depto,
      correo: usuario.correo,
      password: usuario.password,
      telefono: usuario.telefono,
      celular: usuario.celular,
      urlPhoto: usuario.urlPhoto,
      habilitado: usuario.habilitado
    };

    return this.http.put(`${this.urlDatos}/Usuario/${usuario.id}.json` + this.auth + token, usuarioTemp);
  }


  /**Agrega a accesos**/
  agregarAccesos(acceso: AccesosModel, token: string) {

    let authData = {
      ...acceso
    };

    return this.http.post(
      `${this.urlDatos}/acceso.json` + this.auth + token,
      authData
    ).pipe(
      map((resp: any) => {
        return acceso;
      })
    );
  };/**Cierra el Registrar datos accesos**/


  /**Hacer un get de todos los usuarios**/
  getAccesos() {
    return this.http.get(`${this.urlDatos}/acceso.json`)
      .pipe(
        map(this.crearArregloAcceso)
      );
  }

  private crearArregloAcceso(accesoObj: object) {
    const accesos: AccesosModel[] = [];

    if (accesoObj === null) { return []; }

    Object.keys(accesoObj).forEach(key => {
      const acceso = accesoObj[key];
      acceso.id = key;
      accesos.push(acceso);
    });
    return accesos;
  }

  modificarAcceso(acceso: AccesosModel, token: string) {

    const AccesoTemp = {
      ...acceso
    };
    delete AccesoTemp.id;

    return this.http.put(`${this.url}/acceso/${acceso.id}.json` + this.auth + token, AccesoTemp);
  }

  eliminarAcceso(id: string, token: string) {
    return this.http.delete(`${this.urlDatos}/acceso/${id}.json` + this.auth + token);
  }


  enviarSolicitud(solicitud: SolicitudModel) {
    let data = {
      ...solicitud
    };

    return this.http.post(
      `${this.urlDatos}/solicitud.json`,
      data
    ).pipe(
      map((resp: any) => {
        //Envia por correo al manager
        this.sendSolicitudManager(solicitud).subscribe(next => {
          console.log(next);

          // Envia al cliente la confirmación de su envio
          this.sendSolicitudConfirmacionCliente(solicitud).subscribe(next => {
            console.log(next);
          }, error => {
            console.log(error);
          })

        }, error => {
          console.log(error);
        });

        return solicitud;

      })
    );
  }

  //Cuando el manager establece una fecha de entrega se guarda la fecha estipulada en la BDD
  editarSolicitud(solicitud: SolicitudModel) {
    console.log(solicitud.id);

    const SolicitudTemp = {
      ...solicitud
    };
    delete SolicitudTemp.id;

    return this.http.put(`${this.url}/solicitud/${solicitud.id}.json`, SolicitudTemp);
  }

  sendSolicitudManager(body: any) {
    return this.http.post(this.solicitudManager, body)
  }

  sendSolicitudConfirmacionCliente(body: any) {
    return this.http.post(this.solicitudCliente, body)
  }

  sendRespuestaCliente(body: any) {
    return this.http.post(this.respuestaCliente, body);
  }

  crearSolicitud(solicitud: SolicitudModel) {
    return this.http.post(`${this.urlDatos}/solicitud.json`, solicitud)
      .pipe(
        map((resp: any) => {
          solicitud.id = resp.name;
        })
      );
  }

  getSolicitud(id: string) {
    return this.http.get(`${this.urlDatos}/solicitud/${id}.json`)
  }

  getSolicitudes() {
    return this.http.get(`${this.urlDatos}/solicitud.json`)
      .pipe(
        map(this.crearArregloSolicitud)
      );
  }

  private crearArregloSolicitud(solicitudesObj: Object) {
    const solicitudes: SolicitudModel[] = [];

    Object.keys(solicitudesObj).forEach(key => {
      const solicitud: SolicitudModel = solicitudesObj[key];
      solicitud.id = key;

      solicitudes.push(solicitud);


    });

    return solicitudes;
  }


  saveCalendario(calendario: CalendarioModel) {
    console.log(calendario);

    return this.http.post(`${this.url}/calendario.json`, calendario)
      .pipe(
        map((resp: any) => {
          console.log(resp);

          return calendario;
        })
      );
  }

  getCalendario() {
    return this.http.get(`${this.url}/calendario.json`)
      .pipe(
        map(this.crearArregloCalendario)
      );
  }

  private crearArregloCalendario(calendarioObj: Object) {
    const calendarios: CalendarioModel[] = [];

    Object.keys(calendarioObj).forEach(key => {
      const calendario: CalendarioModel = calendarioObj[key];
      calendario.id = key;

      calendarios.push(calendario);
    });

    return calendarios;
  }


  //Minuta
  guardarMinuta(minuta: MinutaModel) {
    const token = sessionStorage.getItem('token');
    return this.http.post(`${this.url}/minuta.json` + this.auth + token , minuta)
      .pipe(
        map((resp: any) => {
          console.log(resp);
          return minuta;
        })
      );
  }

  obtenerMinutas() {
    return this.http.get(`${this.url}/minuta.json`)
      .pipe(map(this.crearArregloMinuta))
  }

  crearArregloMinuta(minutaObj: MinutaModel) {
    const minutas: MinutaModel[] = []

    Object.keys(minutaObj).forEach(key => {
      const minuta: MinutaModel = minutaObj[key];
      minuta.id = key;
      
      minutas.push(minuta);
    })

    return minutas;
  }


}/**Cierra el export data**/
