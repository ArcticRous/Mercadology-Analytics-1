import { Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { CalendarOptions, Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from '../../services/event-utils';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CalendarioModel } from '../../models/calendario.model';
declare let $: any;
let show = false;
let tite;

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})


export class CalendarioComponent implements OnInit {
  calendarVisible = true;
  calendarOptions: CalendarOptions;
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  calendario: CalendarioModel;
  mostrarCalendario: CalendarioModel[] = [];
  addEventForm: FormGroup;
  submitted = false;
  eventdate: string;
  get f() { return this.addEventForm.controls; }
  hola: CalendarioModel[] = []


  constructor(public AuthS: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    // need for load calendar bundle first
    this.calendario = new CalendarioModel();

    forwardRef(() => Calendar);

    this.AuthS.getCalendario().subscribe(next => {

      this.mostrarCalendario = next;

      console.log(this.mostrarCalendario);

    }, error => {
      console.log(error);
      this.cargarCalendario();
    }, () => {
      this.cargarCalendario();
    })
      

  }//Termina el oninit

  onSubmit() {
    if (this.addEventForm.invalid) {
      return;
    }
    this.calendario.title = this.addEventForm.value.title;

    this.AuthS.saveCalendario(this.calendario).subscribe(resp => {
      console.log(resp);
      Swal.fire({
        title: 'Se ha guardado el comunicado',
        text: `Mensaje para mercadology`,
        icon: 'success'
      })
      console.log("pasa hasta aqui");
      this.cargarCalendario();

    }, error => {
      Swal.fire({
        title: 'No se pudo Guardar el',
        text: `Mensaje para mercadology`,
        icon: 'error'
      })
      console.log(error);

    }, () => {
      Swal.fire({
        title: 'Se ha guardado el comunicado',
        text: `Mensaje para mercadology`,
        icon: 'success'
      })
      $("#myModal").modal("hide");
    })


  }

  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    console.log("soy handleCalendarToggle");

    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    console.log("Soy handleWeekendsToggle");

    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log("Soy handleDateSelect");


    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log("soy hideEvnetClick");
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    console.log(events);

  }

  handleDateClick(arg) {
    console.log(arg);

    $("#myModal").modal("show");
    // $(".modal-title, .eventStartDate").text("");
    $(".modal-title").text("Add Event at : " + arg.dateStr);
    $(".eventStartDate").val(arg.dateStr);
    console.log($(".eventStartDate"));

    this.calendario.start = arg.dateStr;
  }

  //Hide Modal PopUp and clear the form validations
  hideForm() {
    console.log("soy hideForm");

    $("#myModal").modal("hide");
    this.addEventForm.patchValue({ title: "" });
    this.addEventForm.get('title').clearValidators();
    this.addEventForm.get('title').updateValueAndValidity();
  }

  cargarCalendario(){
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
      eventsSet: this.handleEvents.bind(this),
      events: this.mostrarCalendario
    };
  
  this.addEventForm = this.formBuilder.group({
    title: ['', [Validators.required]]
  });
  }

}