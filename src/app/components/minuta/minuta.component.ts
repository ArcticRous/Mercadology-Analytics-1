import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cell, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
import { MinutaModel } from './../../models/minuta.model';
import { AuthService } from './../../services/auth.service';

type TableRow = [string, string, string]
type TableAsistentes = [string]

@Component({
  selector: 'app-minuta',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.css']
})
export class MinutaComponent implements OnInit {

  minutaModel: MinutaModel = new MinutaModel;

  fechaDefecto: string;
  horaDefecto: string;
  anio: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;

  numReunionDefecto: number = 1001;
  spinner: boolean = true;

  minutaForm: FormGroup;

  nuevoAsistente: FormControl;
  nuevoPendienteForm: FormGroup;

  booleanEditar: boolean = false;
  booleanVer: boolean = false;

  //Boleano para aprecer una alerta si esta mal el campo asistente
  booleanNAsistente: boolean = true;
  booleanNPendiente: boolean = true;
  booleanGenerarPDF: boolean = false
  id: string;

  constructor(private auth: AuthService, private fb: FormBuilder, private route: ActivatedRoute) {

    PdfMakeWrapper.setFonts(pdfFonts);
    this.id = this.route.snapshot.paramMap.get('id');
    let view = '';
    if (this.route.snapshot.url.length > 1) {
      view = this.route.snapshot.url[1].path;
    }

    if (view == 'view' && this.id) {

      this.booleanVer = true;
      this.booleanEditar = false;
      // console.log(this.route.snapshot.url[1].path);
      this.peticionAuthMinuta(this.id);
    } else if (this.id && view != 'view') {
      this.booleanVer = false;
      this.booleanEditar = true;
      this.minutaModel.id = this.id;
      this.peticionAuthMinuta(this.id);
    } else {
      this.booleanVer = false;
      this.booleanEditar = false;
      this.auth.obtenerMinutas().subscribe(resp => {
        this.numReunionDefecto = 1000 + resp.length + 1;
        this.spinner = false;
      }, error => {
        this.spinner = false;
        this.inicializar();
      }, () => {
        this.inicializar();
      })
    }
  }

  ngOnInit(): void { }

  inicializar() {
    var date = new Date();
    this.fechaDefecto = date.toLocaleDateString(undefined, { year: 'numeric' }) + '-' + date.toLocaleDateString(undefined, { month: '2-digit' }) + '-' + date.toLocaleDateString(undefined, { day: '2-digit' })
    this.horaDefecto = date.toLocaleTimeString('it-IT').substring(0,5)

    const proxReunionDefecto = `${this.fechaDefecto}T${this.horaDefecto}`
    console.log(proxReunionDefecto);

    this.minutaForm = this.fb.group({
      fecha: [this.fechaDefecto, [Validators.required]],
      hora: [this.horaDefecto, [Validators.required, Validators.min(9), Validators.max(17)]],
      numReunion: [this.numReunionDefecto, []],
      asistentes: this.fb.array([], [Validators.required]),
      objetivo: [, [Validators.required, Validators.minLength(10)]],
      pendientes: this.fb.array([], [Validators.required]),
      proxReunion: [proxReunionDefecto, [Validators.required]],
      elaboro: [, Validators.required],
      autorizo: [, Validators.required]
    })

    this.nuevoAsistente = this.fb.control("", [Validators.required, Validators.minLength(3)]);

    this.nuevoPendienteForm = this.fb.group({
      hecho: [, [Validators.required, Validators.minLength(10)]],
      responsable: [, [Validators.required, Validators.minLength(3)]],
      estimado: [, Validators.required]
    })
  }



  inicializarEditar(minuta: MinutaModel) {

    this.minutaForm = this.fb.group({
      fecha: [minuta.fecha, [Validators.required]],
      hora: [minuta.hora, [Validators.required]],
      numReunion: [minuta.numReunion, [Validators.required]],
      asistentes: this.fb.array([], [Validators.required]),
      objetivo: [minuta.objetivo, [Validators.required, Validators.minLength(10)]],
      pendientes: this.fb.array([], [Validators.required]),
      proxReunion: [minuta.proxReunion, [Validators.required]],
      elaboro: [minuta.elaboro, Validators.required],
      autorizo: [minuta.autorizo, Validators.required]
    })

    this.mostrarAsistente(minuta.asistentes);
    this.nuevoAsistente = this.fb.control("", [Validators.required, Validators.minLength(3)]);

    this.mostrarPendiente(minuta.pendientes)
    this.nuevoPendienteForm = this.fb.group({
      hecho: [, [Validators.required, Validators.minLength(10)]],
      responsable: [, [Validators.required, Validators.minLength(3)]],
      estimado: [, Validators.required]
    })
  }

  inicializarVer(minuta: MinutaModel) {

    this.minutaForm = this.fb.group({
      fecha: [{ value: minuta.fecha, disabled: true }, [Validators.required]],
      hora: [{ value: minuta.hora, disabled: true }, [Validators.required]],
      numReunion: [{ value: minuta.numReunion, disabled: true }, [Validators.required]],
      asistentes: this.fb.array([], [Validators.required]),
      objetivo: [{ value: minuta.objetivo, disabled: true }, [Validators.required, Validators.minLength(10)]],
      pendientes: this.fb.array([], [Validators.required]),
      proxReunion: [{ value: minuta.proxReunion, disabled: true }, [Validators.required]],
      elaboro: [{ value: minuta.elaboro, disabled: true }, Validators.required],
      autorizo: [{ value: minuta.autorizo, disabled: true }, Validators.required]
    })

    this.mostrarAsistente(minuta.asistentes);
    this.nuevoAsistente = this.fb.control({ value: "", disabled: true }, [Validators.required, Validators.minLength(3)]);

    this.mostrarPendiente(minuta.pendientes)
    this.nuevoPendienteForm = this.fb.group({
      hecho: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]],
      responsable: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      estimado: [{ value: '', disabled: true }, Validators.required, Validators.minLength(3)]
    })
  }

  peticionAuthMinuta(id: string) {
    this.auth.obtenerMinuta(id).subscribe((resp: MinutaModel) => {
      this.minutaModel = resp;
      this.minutaModel.id = id;
      this.spinner = false;
    }, error => {
      console.log(error);
      this.spinner = false;
      // this.inicializarEditar();
    }, () => {
      if (this.booleanEditar) {
        this.inicializarEditar(this.minutaModel);
      } else {
        this.inicializarVer(this.minutaModel);
      }

    })
  }

  getErrores(campo: string) {
    return this.minutaForm.controls[campo].errors && this.minutaForm.controls[campo].touched;
  }

  getErroresPendientes(campo: string){
    return this.nuevoPendienteForm.controls[campo].errors && this.nuevoPendienteForm.controls[campo].touched;
  }

  get asistentesArr() {
    return this.minutaForm.get('asistentes') as FormArray;
  }

  agregarAsistente() {
    if (this.nuevoAsistente.invalid) { this.booleanNAsistente = false; return; }

    this.asistentesArr.push(this.fb.control(this.nuevoAsistente.value, [Validators.required, Validators.minLength(3)]));

    this.nuevoAsistente.reset();
    this.booleanNAsistente = true;
  }

  mostrarAsistente(asistentes: any) {
    for (const asistente of asistentes) {
      this.asistentesArr.push(this.fb.control(asistente, [Validators.required, Validators.minLength(3)]));
    }

    this.booleanNAsistente = true;
  }

  get pendientesArr() {
    return this.minutaForm.get("pendientes") as FormArray;
  }

  agregarPendiente() {
    if (this.nuevoPendienteForm.invalid) {
      this.booleanNPendiente = false; return;
    }

    this.pendientesArr.push(this.fb.group(this.nuevoPendienteForm.value, [Validators.required]))

    this.nuevoPendienteForm.reset()
    this.booleanNPendiente = true;
  }

  mostrarPendiente(pendientes: any) {

    for (const pendiente of pendientes) {
      this.pendientesArr.push(this.fb.group(pendiente, [Validators.required]))
    }
  }

  borrarAsistente(i: number) {
    this.asistentesArr.removeAt(i);
  }

  borrarPendiente(i: number) {
    this.pendientesArr.removeAt(i)
  }

  guardar() {

    if (this.minutaForm.invalid) {
      this.minutaForm.markAllAsTouched(); this.booleanNPendiente = false; return;
    }

    Swal.fire({
      icon: 'question',
      title: "¿Los datos son correctos?",
      text: 'Se guardarán los datos',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...'
        });
        Swal.showLoading();

        this.minutaModel = this.minutaForm.value;
        this.auth.guardarMinuta(this.minutaModel).subscribe(resp => {
          if (this.booleanGenerarPDF) {
            this.crearPDF(this.minutaModel)
            this.booleanGenerarPDF = false;
          }

          Swal.fire({
            title: 'Guardado',
            text: 'Se registraron correctamente los datos',
            icon: 'success'
          })

        }, error => {
          console.log(error);
          this.guardarPorTokenVencido(error, this.minutaModel)
        }, () => {
          this.minutaForm.reset(({
            fecha: this.fechaDefecto,
            hora: this.horaDefecto,
            numReunion: this.numReunionDefecto + 1
          }))
          this.asistentesArr.reset();
          this.pendientesArr.reset();
          this.pendientesArr.clear()
          this.asistentesArr.clear()
        })

      }
    })

  }


  guardarPorTokenVencido(err: any, minuta: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      const refresh = sessionStorage.getItem('refresh_token');
      this.auth.refrescarToken(refresh).subscribe(resp => {

        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.auth.guardarMinuta(minuta).subscribe(resp => {
          if (this.booleanGenerarPDF) {
            this.crearPDF(this.minutaModel)
            this.booleanGenerarPDF = false;
          }
          Swal.fire({
            title: 'Guardado',
            text: 'Se registraron correctamente los datos',
            icon: 'success',
          });

        }, (err) => {
          // console.log(err);
          Swal.fire({
            title: '¡Error!',
            text: 'Se produjo un error para guardar datos, vuelva a iniciar sesión',
            icon: 'error',
          });

        }, () => {
          this.minutaForm.reset(({
            fecha: this.fechaDefecto,
            hora: this.horaDefecto,
            numReunion: this.numReunionDefecto + 1
          }))
          this.asistentesArr.reset();
          this.pendientesArr.reset();
          this.pendientesArr.clear();
          this.asistentesArr.clear();
        })
      });
    } else {//Termina if
      Swal.fire({
        title: '¡Error!',
        text: 'Se produjo un error para guardar datos, vuelva a iniciar sesión',
        icon: 'error',
      });
    }

  }

  editar() {

    if (this.minutaForm.invalid) {
      this.minutaForm.markAllAsTouched(); this.booleanNPendiente = false; return;
    }

    Swal.fire({
      icon: 'question',
      title: "¿Esta seguro que quiere editar la minuta?",
      text: `Se modificaran los datos de la minuta ${this.minutaForm.value.numReunion}`,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      if (resp.value) {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...'
        });
        Swal.showLoading();

        this.minutaModel = this.minutaForm.value;
        this.minutaModel.id = this.id;

        this.auth.editarMinuta(this.minutaModel).subscribe(resp => {
          if (this.booleanGenerarPDF) {
            this.crearPDF(this.minutaModel)
            this.booleanGenerarPDF = false;
          }

          Swal.fire({
            title: 'Editado',
            text: 'Se modificaron correctamente los datos',
            icon: 'success'
          })

        }, error => {
          console.log(error);
          this.editarPorTokenVencido(error, this.minutaModel)
        }, () => {

        })

      }
    })
  }

  editarPorTokenVencido(err: any, minuta: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      const refresh = sessionStorage.getItem('refresh_token');
      this.auth.refrescarToken(refresh).subscribe(resp => {

        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);

        this.auth.editarMinuta(minuta).subscribe(resp => {
          if (this.booleanGenerarPDF) {
            this.crearPDF(this.minutaModel)
            this.booleanGenerarPDF = false;
          }
          Swal.fire({
            title: 'Guardado',
            text: 'Se edtitaron correctamente los datos',
            icon: 'success',
          });

        }, (err) => {
          // console.log(err);
          Swal.fire({
            title: '¡Error!',
            text: 'Se produjo un error para editar los datos, vuelva a iniciar sesión',
            icon: 'error',
          });

        })
      });
    } else {//Termina if
      Swal.fire({
        title: '¡Error!',
        text: 'Se produjo un error para editar los datos, vuelva a iniciar sesión',
        icon: 'error',
      });
    }

  }


  crearPDF(data: any) {
    // console.log(JSON.stringify(data));

    const pdf: PdfMakeWrapper = new PdfMakeWrapper();

    pdf.header(new Txt(`mercadology`).alignment('center').bold().fontSize(35).margin([0, 15, 0, 0]).color('#FCC42C').end);
    pdf.footer(new Txt(`mercadology`).alignment('center').bold().fontSize(35).margin([0, 15, 0, 0]).color('#FCC42C').end);

    pdf.add(new Table([
      [
        new Cell(new Txt('1. DATOS GENERALES').bold().alignment('left').end).colSpan(6).end, '', '', '', '', '',
      ],
      [new Txt(`FECHA: `).bold().end, `${data.fecha}`, new Txt('HORA: ').bold().end, `${data.hora}`, new Txt('N° DE REUNIÓN: ').bold().end, `${data.numReunion}`],

    ]).widths(['*', 'auto', '*', 'auto', '*', 'auto']).alignment('center').
      layout({
        fillColor: (rowIndex: number, node: any, columnIndex: number) => {
          return columnIndex % 2 === 0 ? '#FCC42C' : '';
        }
      }).margin([0, 0, 0, 10]).end)

    pdf.add(new Table([
      [
        new Txt('ASISTENTES').bold().alignment('left').end
      ],
      ...this.extractDataAsistentes(data.asistentes)
    ]).widths(['*']).layout({
      fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return rowIndex === 0 ? '#FCC42C' : '';
      }
    }).margin([0, 0, 0, 10]).end)

    pdf.add(new Table([
      [
        new Txt('2. OBJETIVO DE LA REUNIÓN').bold().alignment('left').end
      ],
      [
        new Txt(data.objetivo).alignment('left').end
      ]
    ]).widths(['*']).heights(row => {
      return row === 1 ? 40 : 0
    }).layout({
      fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return rowIndex === 0 ? '#FCC42C' : '';
      }
    }).margin([0, 0, 0, 10]).end)

    pdf.add(new Table([
      [
        new Cell(new Txt('3. PENDIENTES Y CONCLUSIONES DE LA REUNIÓN').bold().alignment('left').end).colSpan(3).end, '', '',
      ],
      [
        new Txt('¿QUÉ SE DEBE HACER?').bold().alignment('center').end,
        new Txt('RESPONSABLE').bold().alignment('center').end,
        new Txt('TIEMPO ESTIMADO').bold().alignment('center').end
      ],
      ...this.extractData(data.pendientes)
    ]).widths(['*', 'auto', 'auto']).layout({
      fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return rowIndex === 0 ? '#FCC42C' : '';
      }
    }).margin([0, 0, 0, 10]).end)

    pdf.add(new Table([
      [
        new Txt('5. FECHA Y HORA DE PRÓXIMA REUNIÓN').bold().alignment('left').end,
        new Txt(data.proxReunion).bold().alignment('center').end
      ]
    ]).widths(['auto', '*']).layout({
      fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return columnIndex === 0 ? '#FCC42C' : '';
      }
    }).margin([0, 0, 0, 30]).end)

    pdf.add(new Table([
      [
        new Txt(data.elaboro).alignment('center').end, new Txt(data.autorizo).alignment('center').end
      ],
      [
        new Txt('ELABORÓ (NOMBRE Y FIRMA').bold().alignment('center').end, new Txt('AUTORIZÓ (NOMBRE Y FIRMA').bold().alignment('center').end
      ]
    ]).margin([80, 0, 80, 0]).widths(['auto', 'auto']).alignment('center').layout({
      fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return rowIndex === 1 ? '#FCC42C' : '';
      }
    }).end)

    pdf.info({
      title: `Minuta${data.numReunion}-Mercadology`,
      author: `Mercadology ${data.elaboro}`,
      subject: `Minuta de reunión ${data.fecha}`,
      creator: 'Mercadology',
      producer: 'Mercadology APP ECM'
    });

    //aproximadamente cada 1 vale 2.84, es decir si quieres 220 mm es multiplicar 2.84 y te da 624.8 que equivale a 220mm; se redondea para más o menos calcular bien
    pdf.pageSize({
      width: 625,
      height: 795
    });

    pdf.pageMargins([40, 80, 40, 80]);
    pdf.create().open()
  }

  extractData(data: any): TableRow[] {
    return data.map(row => [row.hecho, row.responsable, row.estimado])
  }

  extractDataAsistentes(data: any): TableAsistentes[] {
    return data.map(row => [row])
  }




}
