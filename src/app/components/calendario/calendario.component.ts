import { Component, OnInit, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { CalendarOptions, Calendar, EventClickArg  } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators,FormControl, NgForm  } from '@angular/forms';
import Swal from 'sweetalert2';
import { CalendarioModel } from '../../models/calendario.model';
import { ActivatedRoute,  Router} from '@angular/router';


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
  calendario: CalendarioModel[]=[];
  calendarios: CalendarioModel;
  addEventForm: FormGroup;

  EditEventForm: FormGroup;
  
  submitted = false;
  id: string; // del calendario 

  
  cargando = false;
  durationInSeconds = 2;
  rol: string;
  displayedColumns: string[] = ['#', 'title', 'date','ids'];
  dataSource: MatTableDataSource<CalendarioModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 


  eventdate:string;
  get f() { return this.addEventForm.controls; }
  
  constructor(public AuthS: AuthService,private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute) {
      const id = this.route.snapshot.paramMap.get('id');
    this.EditEventForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      start: new FormControl(null, [Validators.required])
      
     })
  
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
    if(this.submitted)
  {
    // Initialize Params Object
    this.calendarios.title = this.addEventForm.value.title;    
      this.calendarios.start = datte;   
 
      
 // Begin assig

    this.AuthS.saveCalendario(this.calendarios).subscribe(resp => {
      Swal.fire(
        'Guardado',
        'Fecha guardada correctamente',
        'success'
      )
      console.log("pasa hasta aqui");
      
      
      this.router.navigateByUrl('/calendario');
      $("#myModal").modal("hide");
    
    }, (error) => {
      Swal.fire({
        title: 'No se pudo Guardar el',
        text: `Mensaje para mercadology`,
        icon: 'error'
      })
      console.log(error);
      
    }, () => {
      Swal.fire(
        'Guardado',
        'Fecha guardada correctamente',
        'success'
      )
      console.log("pasa hasta aqui");
      
      
      this.router.navigateByUrl('/calendario');
      window.location.reload();
      $("#myModal").modal("hide");
    })
  }
       
  }
  ngOnInit(): void {
  
      sessionStorage.removeItem('local');
    this.cargando = true;
      this.AuthS.getCalendario()
        .subscribe(resp => {
          this.calendario = resp
          this.cargando = false;
          
          this.dataSource = new MatTableDataSource(this.calendario);
          this.paginator._intl.itemsPerPageLabel="Elementos por página";
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        
      // need for load calendar bundle first
      this.calendarios = new CalendarioModel();
      forwardRef(() => Calendar);
      this.AuthS.getCalendario().subscribe(next => {
        this.calendario = next;
        console.log(this.calendario);
      }, error => {
        console.log(error);
      }, () => {
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
          events: this.calendario,
          locale: esLocale
           

        };
      })




      
      this.addEventForm = this.formBuilder.group({
        title: ['', [Validators.required]]
      });
      
    
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
    $("#myModalEdit").modal("show");

    const id = this.route.snapshot.paramMap.get('id');
      
    console.log(id);
    this.AuthS.getCalendarioid(id)
      .subscribe((resp: CalendarioModel) => {
        this.calendarios = resp;
        // console.log(resp);
        this.calendarios.id  = id;
        
       console.log("entró");

      })
 
       console.log("pasó afuera");
          
  }
  
  handleEventClick(clickInfo: EventClickArg) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${clickInfo.event.title}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {

      if (resp.value) {
        // this.Cliente.splice(i, 1);
        this.AuthS.DeleteCalen(clickInfo.event.id).subscribe(resp => {
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de: ' + clickInfo.event.title,
            icon: 'success',
          });
          clickInfo.event.remove();
        console.log(resp);
        this.router.navigateByUrl('/calendario');
        window.location.reload();
        }, (err)=>{
       console.log(err);
        } ); //LO COMENTO EN

      }
    });

  }
/*
  handleEvents() {
  }*/
  
  handleDateClick(arg) {
    $("#myModal").modal("show");
    $(".modal-title, .eventstarttitle").text("");
    $(".modal-title").text("Add Event at : "+arg.dateStr);
    $(".eventstarttitle").text(arg.dateStr);
     datte =   arg.dateStr;
  }

  
  
  //Hide Modal PopUp and clear the form validations
  hideForm(){
    $("#myModal").modal("hide");
    $("#myModalEdit").modal("hide");

    this.addEventForm.patchValue({ title : ""});
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
      showCancelButton: true
    }).then(resp => {

      if (resp.value) {
        // this.Cliente.splice(i, 1);
        this.AuthS.DeleteCalen(calendario.id).subscribe(resp => {
          Swal.fire({
            title: 'Eliminado',
            text: 'Se eliminaron correctamente los datos de: ' + calendario.title,
            icon: 'success',
          });
        console.log(resp);
        this.router.navigateByUrl('/calendario');
        window.location.reload();
        }, (err)=>{
       console.log(err);
        } ); //LO COMENTO EN PRUEBAS

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

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
   this.AuthS.UpdatCalendario(this.calendarios).subscribe(resp => {
      Swal.fire(
        'Actualizado!',
        'Datos correctamente actualizados!',
        'success'
      )
    $("#myModalEdit").modal("hide");

       this.router.navigateByUrl('/calendario');
       

    })
   
  }

 }
