import { Component, OnInit, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { CalendarOptions, Calendar, EventClickArg } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CalendarioModel } from '../../models/calendario.model';
import { ActivatedRoute, Router } from '@angular/router';


import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


declare let $: any;
let show = false;
let tite;
let datte;


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})


export class CalendarioComponent implements OnInit, AfterViewInit {
  CalendarioTemp: Object = {
    'title': "",
    'start': ""

  };

  calendarVisible = true;
  calendarOptions: CalendarOptions;
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  calendario: CalendarioModel[] = [];
  calendarios: CalendarioModel;
  addEventForm: FormGroup;

  EditEventForm: FormGroup;

  submitted = false;
  id: string; // del calendario 


  cargando = false;
  durationInSeconds = 2;
  rol: string;
  displayedColumns: string[] = ['#', 'title', 'date', 'ids'];
  dataSource: MatTableDataSource<CalendarioModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  eventdate: string;
  get f() { return this.addEventForm.controls; }

  constructor(public AuthS: AuthService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    AuthS.leerToken();
    sessionStorage.removeItem('local');
    this.rol = sessionStorage.getItem('rol');
    const id = this.route.snapshot.paramMap.get('id');
    this.EditEventForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      start: new FormControl(null, [Validators.required])
    })

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    sessionStorage.removeItem('local');
    this.cargando = true;
    this.calendarios = new CalendarioModel();
    forwardRef(() => Calendar);
    this.AuthS.getCalendario()
      .subscribe(resp => {
        console.log(resp);

        this.calendario = resp
        this.cargando = false;
        this.dataSource = new MatTableDataSource(this.calendario);
        this.paginator._intl.itemsPerPageLabel = "Elementos por página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => {
        console.log(error);
        this.cargarCalendario()
      }, () => {
        this.cargarCalendario();
      });

    this.addEventForm = this.formBuilder.group({
      title: ['', [Validators.required]]
    });

  }

  cargarCalendario() {
    this.calendarOptions = {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialView: 'dayGridMonth',
      // initialEvents: this.hola, // alternatively, use the `events` setting to fetch from a feed
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      // eventsSet: this.handleEvents.bind(this),
      events: this.calendario,
      locale: esLocale
    };
  }

  onSubmit() {
    this.calendarios = new CalendarioModel();
    this.submitted = true;
    // stop here if form is invalid and reset the validations
    this.addEventForm.get('title').setValidators([Validators.required]);
    this.addEventForm.get('title').updateValueAndValidity();
    if (this.addEventForm.invalid) {
      return;
    }
    if (this.submitted) {
      // Initialize Params Object
      this.calendarios.title = this.addEventForm.value.title;
      this.calendarios.start = datte;
      const token = sessionStorage.getItem('token')

      // Begin assig

      this.AuthS.saveCalendario(this.calendarios, token).subscribe(resp => {
        // Swal.fire(
        //   'Guardado',
        //   'Fecha guardada correctamente',
        //   'success'
        // )
        // console.log("pasa hasta aqui");


        this.router.navigateByUrl('/calendario');
        $("#myModal").modal("hide");

      }, (error) => {
        // Swal.fire({
        //   title: 'No se pudo Guardar el',
        //   text: `Mensaje para mercadology`,
        //   icon: 'error'
        // })
        console.log(error);
        this.guardarPorTokenVencido(error, this.calendario)

      }, () => {

        this.router.navigateByUrl('/calendario');
        window.location.reload();
        $("#myModal").modal("hide");

        Swal.fire(
          'Guardado',
          'Fecha guardada correctamente',
          'success'
        )
      })
    }

  }


  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  /*
    handleDateSelect() {
    
    }*/
  clickFunction() {

    const id = this.route.snapshot.paramMap.get('id');
    $("#myModalEdit").modal("show");



    console.log(id);
    this.AuthS.getCalendarioid(id)
      .subscribe((resp: CalendarioModel) => {
        this.calendarios = resp;
        // console.log(resp);
        this.calendarios.id = id;

        console.log("entró");

      })

    console.log("pasó afuera");

  }

  handleEventClick(clickInfo: EventClickArg) {
console.log(clickInfo);

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${clickInfo.event.title}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar"
    }).then(resp => {

      if (resp.value) {
        // this.Cliente.splice(i, 1);
        const token = sessionStorage.getItem('token')
        this.AuthS.DeleteCalen(clickInfo.event.id, token).subscribe(resp => {
          clickInfo.event.remove();
          console.log(resp);
          this.cargarCalendario()

          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de: ' + clickInfo.event.title,
            icon: 'success',
          });

        }, (err) => {
          console.log(err);
          this.borrarPorTokenVencido(err, clickInfo.event.id)
          
        }); //LO COMENTO EN

      }
    });

  }
  /*
    handleEvents() {
    }*/

  handleDateClick(arg) {
    $("#myModal").modal("show");
    $(".modal-title, .eventstarttitle").text("");
    $(".modal-title").text("Agregar Evento el: " + arg.dateStr);
    $(".eventstarttitle").text(arg.dateStr);
    datte = arg.dateStr;
  }



  //Hide Modal PopUp and clear the form validations
  hideForm() {
    $("#myModal").modal("hide");
    $("#myModalEdit").modal("hide");

    this.addEventForm.patchValue({ title: "" });
    this.addEventForm.get('title').clearValidators();
    this.addEventForm.get('title').updateValueAndValidity();

  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();

    }
  }

  borrarCaledario(calendario: CalendarioModel, i: number) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${calendario.title}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar"
    }).then(resp => {

      if (resp.value) {
        // this.Cliente.splice(i, 1);
        const token = sessionStorage.getItem('token')
        this.AuthS.DeleteCalen(calendario.id, token).subscribe(resp => {

          this.cargarCalendario()
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de: ' + calendario.title,
            icon: 'success',
          });

        }, (err) => {
          console.log(err);
          this.borrarPorTokenVencido(err, calendario.id)
        }); //LO COMENTO EN PRUEBAS

        // console.log(this.dataSource.data.indexOf(cliente));

        this.dataSource.data.splice(this.dataSource.data.indexOf(calendario, i), 1);
        // console.log(this.dataSource);

        this.dataSource = new MatTableDataSource(this.calendario);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    });

  }//Termina borrar cliente

  actualizar(form: NgForm) {

    if (form.invalid) { return; }
console.log(form);

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    const token = sessionStorage.getItem('token')
    this.AuthS.UpdatCalendario(this.calendarios, token).subscribe(resp => {
      console.log(resp);
      
      Swal.fire(
        'Actualizado!',
        'Datos correctamente actualizados!',
        'success'
      )
      $("#myModalEdit").modal("hide");

      this.router.navigateByUrl('/calendario');


    }, error => {
      Swal.close()
      this.editarPorTokenVencido(error, this.calendarios)
      console.log(error);

    })
    

  }


  guardarPorTokenVencido(err: any, calendario: any): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthS.refrescarToken(refresh).subscribe(resp => {

        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);
        const token = resp['id_token']

        this.AuthS.saveCalendario(calendario, token).subscribe(resp => {
          Swal.fire({
            title: 'Guardado',
            text: 'Se registraron correctamente los datos',
            icon: 'success',
          });

        }, (err) => {
          console.log(err);
          Swal.fire({
            title: '¡Error!',
            text: 'Se produjo un error para guardar datos, vuelva a iniciar sesión',
            icon: 'error',
          });

        }, () => {
          this.router.navigateByUrl('/calendario');
          window.location.reload();
          $("#myModal").modal("hide");
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


  borrarPorTokenVencido(err: any, calendario: string): any {
    const tokenVencido = err.error.error;

    if (tokenVencido === "Auth token is expired") {
      // console.log("Entro a la comparativa de permiso denegado");
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthS.refrescarToken(refresh).subscribe(resp => {
        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);
        const token = resp['id_token']
        this.AuthS.DeleteCalen(calendario, token).subscribe(resp => {
          this.cargarCalendario()
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos',
            icon: 'success',
          });
        }, error => {
          console.log("error");
          
        }, () => {

        });
      });//tERMINA REFRESACAR TOKEN
    }//Termina if
  }


  editarPorTokenVencido(err: any, calendario: any): any {
    const tokenVencido = err.error.error;
    console.log(tokenVencido);
    

    if (tokenVencido === "Auth token is expired") {
      const refresh = sessionStorage.getItem('refresh_token');
      this.AuthS.refrescarToken(refresh).subscribe(resp => {

        sessionStorage.setItem('token', resp['id_token']);
        sessionStorage.setItem('refresh_token', resp['refresh_token']);
        const token = resp['id_token'];

        this.AuthS.UpdatCalendario(calendario, token).subscribe(resp => {
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


}
